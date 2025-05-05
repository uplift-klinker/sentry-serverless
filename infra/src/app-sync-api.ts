import {Construct} from "constructs";
import {aws_appsync, aws_lambda} from "aws-cdk-lib";
import {AwsLambda} from "./aws-lambda";
import * as path from "node:path";

export type AppSyncApiProps = {
    name: string;
    schemaFile: string;
};

const RESOLVER_CODE_PATH = path.resolve(__dirname, '..', 'lambdas', 'resolver', 'dist');

export class AppSyncApi extends Construct {
    readonly appSync: aws_appsync.GraphqlApi;

    constructor(scope: Construct, id: string, props: AppSyncApiProps) {
        super(scope, id);

        this.appSync = new aws_appsync.GraphqlApi(scope, 'api', {
            definition: aws_appsync.Definition.fromFile(props.schemaFile),
            name: props.name,
            xrayEnabled: true,
        });

        const resolver = new AwsLambda(this, 'resolver', {
            codePath: RESOLVER_CODE_PATH,
        });
        this.appSync.addLambdaDataSource('lambda', resolver.func, {
            name: 'lambda',
            description: 'Lambda Resolver'
        })
    }
}