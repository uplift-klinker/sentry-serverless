import {Construct} from "constructs";
import {aws_lambda, aws_logs, Duration} from "aws-cdk-lib";
import {AwsLambdaProps} from "./aws-lambda";
import {EnvironmentVariables} from "@uplift/core";
import {DATA_TABLE_NAME} from "./data-storage";
import {NODEJS_LAYERS_PATH} from "./paths";
import {RetentionDays} from "aws-cdk-lib/aws-logs";

export class LambdaConfig extends Construct {
    private readonly layers: aws_lambda.ILayerVersion[];
    private readonly logGroup: aws_logs.ILogGroup;

    constructor(scope: Construct, id: string) {
        super(scope, id);
        this.layers = [
            new aws_lambda.LayerVersion(this, 'sentry', {
                code: aws_lambda.Code.fromDockerBuild(NODEJS_LAYERS_PATH)
            })
        ]
        this.logGroup = new aws_logs.LogGroup(this, 'log-group', {
            logGroupName: '/cdk/sentry-serverless/logs',
            retention: RetentionDays.ONE_WEEK
        });
    }

    codePathProps(codePath: string, overrides?: Partial<AwsLambdaProps>): AwsLambdaProps {
        if (!process.env.SENTRY_DSN) {
            throw new  Error('SENTRY_DSN environment variable required');
        }
        return {
            codePath,
            layers: this.layers,
            timeout: Duration.seconds(30),
            logGroup: this.logGroup,
            ...overrides,
            environment: {
                SENTRY_DSN: process.env.SENTRY_DSN,
                NODE_OPTIONS: '--enable-source-maps -r /opt/sentry-init.js',
                [EnvironmentVariables.dataTableName]: DATA_TABLE_NAME,
                ...overrides?.environment,
            }
        }
    }
}