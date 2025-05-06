import middy from "@middy/core";
import {flush, getCurrentScope} from '@sentry/aws-serverless'
import {Context as LambdaContext} from 'aws-lambda';
import {Scope} from "@sentry/node";
import {SentryLogger} from "./sentry-logger";

export type ContextWithSentry = LambdaContext & {
    sentry: Scope;
    logger: SentryLogger;
}

export function sentryMiddleware(): middy.MiddlewareObj<unknown, unknown, Error, ContextWithSentry>[] {
    return [
        {
            before: ({context, event}) => {
                context.sentry = getCurrentScope();
                context.sentry.setExtra('aws_request_id', context.awsRequestId);
                context.sentry.setExtra('function_name', context.functionName);
                context.sentry.setExtra('event', event);
                context.logger = new SentryLogger(context);
            },
            after: async () => {
                await flush();
            },
            onError: async ({error, context}) => {
                if (error) {
                    context.sentry.captureException(error);
                }
                await flush();
                throw error;
            }
        }
    ];
}