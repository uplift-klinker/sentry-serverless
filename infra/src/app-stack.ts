import {Stack, StackProps} from "aws-cdk-lib";
import {Construct} from "constructs";
import {SqsLambda} from "./sqs-lambda";
import * as path from "node:path";
import {AppSyncApi} from "./app-sync-api";
import { DataStorage } from "./data-storage";
import {LambdaConfig} from "./lambda-config";

export type AppStackProps = Omit<StackProps, 'stackName'>;

const REPO_ROOT_PATH = path.join(__dirname, '..', '..');
const SUBSCRIBER_CODE_PATH = path.resolve(REPO_ROOT_PATH, 'lambdas', 'subscriber', 'dist');
const RESOLVER_CODE_PATH = path.resolve(REPO_ROOT_PATH, 'lambdas', 'resolver', 'dist');
const RESOLVER_SCHEMA_PATH = path.resolve(REPO_ROOT_PATH, 'lambdas', 'resolver', 'src', 'schema.graphql');

export class AppStack extends Stack {
    readonly storage: DataStorage;
    readonly config: LambdaConfig;
    readonly subscriber: SqsLambda;
    readonly appSyncApi: AppSyncApi;

    constructor(scope: Construct, props?: AppStackProps) {
        super(scope, 'app', {
            ...props,
            stackName: 'sentry-serverless-logging'
        });

        this.config = new LambdaConfig(this, 'config');
        this.storage = new DataStorage(this, 'data');

        this.subscriber = new SqsLambda(this, 'subscriber', {
            codePath: SUBSCRIBER_CODE_PATH,
            config: this.config,
        });
        this.storage.grantWrite(this.subscriber.subscriberLambda);

        this.appSyncApi = new AppSyncApi(this, 'graphql', {
            codePath: RESOLVER_CODE_PATH,
            schemaFile: RESOLVER_SCHEMA_PATH,
            name: 'Graphql',
            config: this.config,
            subscriberQueueUrl: this.subscriber.queueUrl
        });
        this.subscriber.grantSendMessages(this.appSyncApi.resolverLambda);
        this.storage.grantRead(this.appSyncApi.resolverLambda);
    }
}