import { SQSClient } from '@aws-sdk/client-sqs';
import middy from "@middy/core";
import {ContextWithSentry} from "./sentry-middleware";

export type ContextWithSqsClient = ContextWithSentry & {
    sqsClient: SQSClient;
}

export function sqsMiddleware(): middy.MiddlewareObj<unknown, unknown, Error, ContextWithSqsClient>[] {
    return [
        {
            before: ({context}) => {
                context.sqsClient = new SQSClient();
            },
            after: ({context}) => {
                context.sqsClient.destroy();
            },
            onError: ({context}) => {
                context.sqsClient.destroy();
            }
        }
    ]
}