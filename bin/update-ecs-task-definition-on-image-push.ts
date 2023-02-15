#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import { ContainerServiceStack, ImageRepositoryStack, NetworkStack, UpdaterStack } from '../lib';

const app = new cdk.App();

// Tag付
cdk.Tags.of(app).add('Project', 'update-ecs-task-definition-on-image-push');
cdk.Tags.of(app).add('Administrator', 'hirosh');

const env: cdk.StackProps = {
  env: {
    region: 'ap-northeast-1',
  },
};

const { imageRepository } = new ImageRepositoryStack(app, 'ImageRepositoryStack', env);
const { vpc } = new NetworkStack(app, 'NetworkStack', env);
const { service } = new ContainerServiceStack(app, 'ContainerServiceStack', { ...env, vpc, imageRepository });
new UpdaterStack(app, 'UpdaterStack', { ...env, imageRepository, service });
