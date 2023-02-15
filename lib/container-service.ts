import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as ecr from 'aws-cdk-lib/aws-ecr';
import * as ecs from 'aws-cdk-lib/aws-ecs';
import * as ecsPatterns from 'aws-cdk-lib/aws-ecs-patterns';

export type ContainerServiceStackProps = cdk.StackProps & {
  vpc: ec2.Vpc;
  imageRepository: ecr.Repository;
};

export class ContainerServiceStack extends cdk.Stack {
  public readonly service: ecs.FargateService;
  constructor(scope: Construct, id: string, props: ContainerServiceStackProps) {
    super(scope, id, props);
    const { vpc, imageRepository } = props;

    const cluster = new ecs.Cluster(this, 'Cluster', { vpc });
    const app = new ecsPatterns.ApplicationLoadBalancedFargateService(this, 'FargateService', {
      cluster,
      runtimePlatform: {
        operatingSystemFamily: ecs.OperatingSystemFamily.LINUX,
        cpuArchitecture: ecs.CpuArchitecture.ARM64,
      },
      taskImageOptions: {
        image: ecs.ContainerImage.fromEcrRepository(imageRepository, 'latest'),
        containerPort: 8080,
      },
    });

    this.service = app.service;
  }
}
