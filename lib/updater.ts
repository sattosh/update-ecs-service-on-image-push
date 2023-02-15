import * as cdk from 'aws-cdk-lib';
import { resolve } from 'path';
import { Construct } from 'constructs';
import * as ecs from 'aws-cdk-lib/aws-ecs';
import * as ecr from 'aws-cdk-lib/aws-ecr';
import * as eventBridge from 'aws-cdk-lib/aws-events';
import * as eventTargets from 'aws-cdk-lib/aws-events-targets';
import * as eventSource from 'aws-cdk-lib/aws-lambda-event-sources';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as sns from 'aws-cdk-lib/aws-sns';
import * as iam from 'aws-cdk-lib/aws-iam';
import { NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs';

export type UpdaterStackProps = cdk.StackProps & {
  service: ecs.FargateService;
  imageRepository: ecr.Repository;
};

export class UpdaterStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props: UpdaterStackProps) {
    super(scope, id, props);
    const { service, imageRepository } = props;

    const snsTopic = new sns.Topic(this, 'SnsTopic', {});

    const eventRule = new eventBridge.Rule(this, 'Event', {
      eventPattern: {
        source: ['aws.ecr'],
        detailType: ['ECR Image Action'],
        detail: {
          'action-type': ['PUSH'],
          'repository-name': [`${imageRepository.repositoryName}`],
          result: ['SUCCESS'],
          'image-tag': ['latest'],
        },
      },
    });
    eventRule.addTarget(new eventTargets.SnsTopic(snsTopic));

    const fn = new NodejsFunction(this, 'UpdaterFunction', {
      entry: resolve(__dirname, '..', '@lambda', 'handler.ts'),
      architecture: lambda.Architecture.ARM_64,
      environment: {
        SERVICE_NAME: service.serviceName,
        SERVICE_ARN: service.serviceArn,
        CLUSTER_NAME: service.cluster.clusterName,
        CLUSTER_ARN: service.cluster.clusterArn,
        TASK_DEFINITION_ARN: service.taskDefinition.taskDefinitionArn,
      },
      events: [new eventSource.SnsEventSource(snsTopic)],
    });
    fn.addToRolePolicy(
      new iam.PolicyStatement({
        effect: iam.Effect.ALLOW,
        actions: ['ecs:*'],
        resources: ['*'],
      })
    );
  }
}
