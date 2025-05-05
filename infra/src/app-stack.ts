import {Stack, StackProps} from "aws-cdk-lib";
import {Construct} from "constructs";
import {SqsLambda} from "./sqs-lambda";
import * as path from "node:path";

export type AppStackProps = Omit<StackProps, 'stackName'>;

const SUBSCRIBER_CODE_PATH = path.resolve(__dirname, '..', 'lambdas', 'subscriber', 'dist');

export class AppStack extends Stack {
    readonly subscriber: SqsLambda;

    constructor(scope: Construct, props?: AppStackProps) {
        super(scope, 'app', {
            ...props,
            stackName: 'sentry-serverless-logging'
        });

        this.subscriber = new SqsLambda(this, 'subscriber', {
            codePath: SUBSCRIBER_CODE_PATH
        });


    }
}