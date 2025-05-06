import {DataInput} from "../models/data";
import {ContextWithSqsClient} from "../sqs-middleware";
import {SendMessageCommand} from "@aws-sdk/client-sqs";
import {readEnvironmentVariable} from "../environment-variables";

export type SendDataResult = {
    success: true;
} | {
    success: false;
    error: unknown;
}

export async function sendData(input: DataInput, context: ContextWithSqsClient): Promise<SendDataResult> {
    try {
        let queueUrl = readEnvironmentVariable('subscriberQueueUrl');
        context.logger.info('sending data to queue...', {queueUrl});
        await context.sqsClient.send(new SendMessageCommand({
            QueueUrl: queueUrl,
            MessageBody: JSON.stringify(input)
        }));
        context.logger.info('sent 1 message to queue', {queueUrl});
        return {success: true};
    } catch (error) {
        return {success: false, error};
    }
}