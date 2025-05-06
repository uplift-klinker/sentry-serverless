import middy from "@middy/core";
import {
    ContextWithDynamoDb,
    ContextWithSentry,
    DataInputSchema,
    dynamodbMiddleware,
    parseJsonToSchema,
    saveData, sentrifyHandler,
    sentryMiddleware
} from "@uplift/core";
import sqsPartialBatchFailure from "@middy/sqs-partial-batch-failure";
import {SQSEvent, SQSRecord } from 'aws-lambda';
import {wrapHandler} from '@sentry/aws-serverless';

export type SubscriberContext = ContextWithDynamoDb & ContextWithSentry;

async function handleRecord(record: SQSRecord, context: SubscriberContext) {
    try {
        const data = parseJsonToSchema(record.body, DataInputSchema);
        await saveData(data, context);
    } catch (error) {
        context.logger.error('failed to save data', {error});
    }
}

async function handleEvent(event: SQSEvent, context: SubscriberContext) {
    return await Promise.allSettled(event.Records.map(r => handleRecord(r, context)));
}

export const handler = middy(sentrifyHandler(handleEvent)).use(sentryMiddleware())
    .use(dynamodbMiddleware())
    .use(sqsPartialBatchFailure({
        logger: (reason, record) => {
        }
    }));