import {Construct} from "constructs";
import {AwsLambda, AwsLambdaProps} from "./aws-lambda";
import {aws_sqs, aws_lambda_event_sources, Duration} from "aws-cdk-lib";

export type SqsLambdaProps = AwsLambdaProps & {
    maxRetries?: number;
}

export class SqsLambda extends Construct {
    readonly subscriber: AwsLambda;
    readonly queue: aws_sqs.IQueue;
    readonly deadletterQueue: aws_sqs.IQueue;

    constructor(scope: Construct, id: string, props: SqsLambdaProps) {
        super(scope, id);

        const timeout = props.timeout ?? Duration.seconds(900);
        this.deadletterQueue = new aws_sqs.Queue(this, 'dlq');

        this.queue = new aws_sqs.Queue(this, 'queue', {
            visibilityTimeout: timeout,
            deadLetterQueue: {
                queue: this.deadletterQueue,
                maxReceiveCount: props.maxRetries ?? 5,
            }
        });

        this.subscriber = new AwsLambda(this, 'func', {
            timeout: timeout,
            ...props,
        });
        this.subscriber.addEventSource(new aws_lambda_event_sources.SqsEventSource(this.queue, {
            enabled: true,
            reportBatchItemFailures: true
        }))
    }
}