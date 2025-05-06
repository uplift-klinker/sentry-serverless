import {Construct} from "constructs";
import {aws_appsync} from "aws-cdk-lib";
import {AwsLambda} from "./aws-lambda";
import { LambdaConfig } from "./lambda-config";
import {EnvironmentVariables} from "@uplift/core";

export type AppSyncApiProps = {
    name: string;
    schemaFile: string;
    codePath: string;
    config: LambdaConfig;
    subscriberQueueUrl: string;
};

export class AppSyncApi extends Construct {
    readonly appSync: aws_appsync.GraphqlApi;
    readonly resolver: AwsLambda;

    get resolverLambda() {
        return this.resolver.func;
    }

    constructor(scope: Construct, id: string, props: AppSyncApiProps) {
        super(scope, id);

        this.appSync = new aws_appsync.GraphqlApi(scope, 'api', {
            definition: aws_appsync.Definition.fromFile(props.schemaFile),
            name: props.name,
            xrayEnabled: true,
        });

        this.resolver = new AwsLambda(this, 'resolver', props.config.codePathProps(props.codePath, {
            environment: {
                [EnvironmentVariables.subscriberQueueUrl]: props.subscriberQueueUrl,
            }
        }));
        this.appSync.addLambdaDataSource('lambda', this.resolver.func, {
            name: 'lambda',
            description: 'Lambda Resolver'
        });
    }
}