import { EventBridgeHandler } from 'aws-lambda';
import { ECSClient, UpdateServiceCommand } from '@aws-sdk/client-ecs';

const service = process.env.SERVICE_ARN as string;
const cluster = process.env.CLUSTER_ARN as string;

const ecsClient = new ECSClient({});

export const handler: EventBridgeHandler<string, string, void> = async (event) => {
  console.log(JSON.stringify(event));
  try {
    const updateCommand = new UpdateServiceCommand({ service, cluster, forceNewDeployment: true });
    await ecsClient.send(updateCommand);
    console.log('Completed');
  } catch (e) {
    console.error('ERROR', e);
  }
};
