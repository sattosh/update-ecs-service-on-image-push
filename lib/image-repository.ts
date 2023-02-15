import * as cdk from 'aws-cdk-lib';
import { resolve } from 'path';
import { Construct } from 'constructs';
import * as ecr from 'aws-cdk-lib/aws-ecr';
import * as ecrAssets from 'aws-cdk-lib/aws-ecr-assets';
import * as ecrDeployment from 'cdk-ecr-deployment';

export class ImageRepositoryStack extends cdk.Stack {
  public readonly imageRepository: ecr.Repository;
  constructor(scope: Construct, id: string, props: cdk.StackProps) {
    super(scope, id, props);

    const removalPolicy = cdk.RemovalPolicy.DESTROY;

    this.imageRepository = new ecr.Repository(this, 'Repository', {
      repositoryName: 'sample-app',
      removalPolicy,
    });

    const image = new ecrAssets.DockerImageAsset(this, 'ImageAsset', {
      directory: resolve(__dirname, '..', '@container'),
    });

    new ecrDeployment.ECRDeployment(this, 'DeployDockerImage', {
      src: new ecrDeployment.DockerImageName(image.imageUri),
      dest: new ecrDeployment.DockerImageName(
        `${cdk.Aws.ACCOUNT_ID}.dkr.ecr.${cdk.Aws.REGION}.amazonaws.com/${this.imageRepository.repositoryName}`
      ),
    });
  }
}
