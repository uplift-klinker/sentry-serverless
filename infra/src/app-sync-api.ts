import {Construct} from "constructs";
import {aws_appsync} from "aws-cdk-lib";
import {AwsLambda} from "./aws-lambda";
import {LambdaConfig} from "./lambda-config";
import {EnvironmentVariables} from "@uplift/core";
import {RetentionDays} from "aws-cdk-lib/aws-logs";

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
            logConfig: {
                retention: RetentionDays.ONE_WEEK
            }
        });

        this.resolver = new AwsLambda(this, 'resolver', props.config.codePathProps(props.codePath, {
            environment: {
                [EnvironmentVariables.subscriberQueueUrl]: props.subscriberQueueUrl,
            }
        }));
        const source = this.appSync.addLambdaDataSource('lambda', this.resolver.func, {
            name: 'lambda',
            description: 'Lambda Resolver'
        });
        source.createResolver('Query', {
            typeName: 'Query',
            fieldName: 'getData',
            requestMappingTemplate: aws_appsync.MappingTemplate.lambdaRequest(),
            responseMappingTemplate: aws_appsync.MappingTemplate.lambdaResult(),
        });
        source.createResolver('Mutation', {
            typeName: 'Mutation',
            fieldName: 'sendData',
            requestMappingTemplate: aws_appsync.MappingTemplate.lambdaRequest(),
            responseMappingTemplate: aws_appsync.MappingTemplate.lambdaResult(),
        })
        // source.createResolver('data-connection-total-count', {
        //     typeName: 'DataConnection',
        //     fieldName: 'totalCount',
        //     requestMappingTemplate: aws_appsync.MappingTemplate.lambdaRequest(),
        //     responseMappingTemplate: aws_appsync.MappingTemplate.lambdaResult(),
        // })
        // source.createResolver('data-connection-nodes', {
        //     typeName: 'DataConnection',
        //     fieldName: 'nodes',
        //     requestMappingTemplate: aws_appsync.MappingTemplate.lambdaRequest(),
        //     responseMappingTemplate: aws_appsync.MappingTemplate.lambdaResult(),
        // })
        // source.createResolver('data-id', {
        //     typeName: 'Data',
        //     fieldName: 'id',
        //     requestMappingTemplate: aws_appsync.MappingTemplate.lambdaRequest(),
        //     responseMappingTemplate: aws_appsync.MappingTemplate.lambdaResult(),
        // })
        // source.createResolver('data-name', {
        //     typeName: 'Data',
        //     fieldName: 'name',
        //     requestMappingTemplate: aws_appsync.MappingTemplate.lambdaRequest(),
        //     responseMappingTemplate: aws_appsync.MappingTemplate.lambdaResult(),
        // })
    }
}