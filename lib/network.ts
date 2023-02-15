import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as ec2 from 'aws-cdk-lib/aws-ec2';

export class NetworkStack extends cdk.Stack {
  public readonly vpc: ec2.Vpc;
  constructor(scope: Construct, id: string, props: cdk.StackProps) {
    super(scope, id, props);

    // デフォルト値で構築
    this.vpc = new ec2.Vpc(this, 'SampleVPC', {});

    // NatGWを通らないようにVPC Endpointを設定
    // this.vpc.addInterfaceEndpoint('S3Endpoint', {
    //   service: ec2.InterfaceVpcEndpointAwsService.S3,
    //   privateDnsEnabled: true,
    // });
    this.vpc.addInterfaceEndpoint('ECREndpoint', {
      service: ec2.InterfaceVpcEndpointAwsService.ECR,
    });
    this.vpc.addInterfaceEndpoint('ECRDockerEndpoint', {
      service: ec2.InterfaceVpcEndpointAwsService.ECR_DOCKER,
    });
    this.vpc.addInterfaceEndpoint('LogsEndpoint', {
      service: ec2.InterfaceVpcEndpointAwsService.CLOUDWATCH_LOGS,
    });
  }
}
