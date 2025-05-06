import {logger} from '@sentry/aws-serverless';
import {Context as LambdaContext} from 'aws-lambda';

export class SentryLogger {
    private get metadata() {
        return {
            aws_request_id: this.context.awsRequestId,
            function_name: this.context.functionName,
            xray_trace_id: process.env['_X_AMZN_TRACE_ID']
        }
    }
    constructor(private readonly context: LambdaContext) {

    }

    info(message: string, args?: Record<string, unknown>) {
        console.info(message, this.mergeMetadata(args));
        logger.info(message, this.mergeMetadata(args));
    }

    error(message: string, args?: Record<string, unknown>) {
        console.error(message, this.mergeMetadata(args));
        logger.error(message, this.mergeMetadata(args));
    }

    warn(message: string, args?: Record<string, unknown>) {
        console.warn(message, this.mergeMetadata(args));
        logger.warn(message, this.mergeMetadata(args));
    }

    private mergeMetadata(extras?:  Record<string, unknown>) {
        return {...this.metadata, ...extras};
    }
}