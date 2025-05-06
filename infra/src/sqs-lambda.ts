import {Construct} from "constructs";
import {AwsLambda, AwsLambdaProps} from "./aws-lambda";
import {aws_sqs, aws_lambda_event_sources, Duration, aws_iam} from "aws-cdk-lib";
import {LambdaConfig} from "./lambda-config";

export type SqsLambdaProps = {
    codePath: string;
    config: LambdaConfig;
    maxRetries?: number;
    timeout?: Duration;
}

export class SqsLambda extends Construct {
    readonly subscriber: AwsLambda;
    readonly queue: aws_sqs.IQueue;
    readonly deadletterQueue: aws_sqs.IQueue;

    get subscriberLambda() {
        return this.subscriber.func;
    }

    get queueUrl() {
        return this.queue.queueUrl;
    }

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

        this.subscriber = new AwsLambda(this, 'func', props.config.codePathProps(props.codePath, {
            timeout: timeout,
        }));
        this.subscriber.addEventSource(new aws_lambda_event_sources.SqsEventSource(this.queue, {
            enabled: true,
            reportBatchItemFailures: true
        }))
    }

    grantSendMessages(grantable: aws_iam.IGrantable) {
        this.queue.grantSendMessages(grantable);
    }
}