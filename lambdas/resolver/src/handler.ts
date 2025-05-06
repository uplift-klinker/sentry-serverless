import middy from "@middy/core";
import {
    ContextWithDynamoDb,
    ContextWithSentry,
    ContextWithSqsClient, DataInputSchema,
    dynamodbMiddleware, getDataQuery, sendData,
    sentryMiddleware, sqsMiddleware
} from "@uplift/core";
import {AppSyncResolverEvent} from "aws-lambda";

export type ResolverContext = ContextWithDynamoDb & ContextWithSentry & ContextWithSqsClient;

export type ResolverFn = (event: AppSyncResolverEvent<unknown>, context: ResolverContext) => Promise<unknown>;

const RESOLVER_MAP: Record<string, Record<string, ResolverFn>> = {
    Query: {
        getData: async (_: AppSyncResolverEvent<unknown>, context: ResolverContext) => {
            return await getDataQuery(context);
        }
    },
    mutation: {
        sendData: async (event: AppSyncResolverEvent<unknown>, context: ResolverContext) => {
            const input = event.arguments && typeof event.arguments === 'object' && 'input' in event.arguments
                ? DataInputSchema.parse(event.arguments.input)
                : null;
            if (!input) {
                throw new Error('the provided input is invalid');
            }

            const result = await sendData(input, context);
            if (result.success) {
                return true;
            }
            return result.success;
        }
    }
}


export const handler = middy(async (event: AppSyncResolverEvent<unknown>, context: ResolverContext) => {
    const handlerFunc = RESOLVER_MAP[event.info.parentTypeName][event.info.fieldName];
    if (!handlerFunc) {
        throw new Error(`failed to find resolver for ${event.info.parentTypeName} and ${event.info.fieldName}`);
    }
    return await handlerFunc(event, context);
}).use(sentryMiddleware())
    .use(dynamodbMiddleware())
    .use(sqsMiddleware());