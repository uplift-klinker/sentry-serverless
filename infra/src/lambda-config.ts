import {Construct} from "constructs";
import {aws_lambda, Duration} from "aws-cdk-lib";
import { AwsLambdaProps} from "./aws-lambda";
import {EnvironmentVariables} from "@uplift/core";
import {DATA_TABLE_NAME} from "./data-storage";
import * as path from "node:path";

const LAYERS_DOCKER_FILE_PATH = path.resolve(__dirname, '..', 'layers', 'nodejs', 'dockerfile');

export class LambdaConfig extends Construct {
    private readonly layers: aws_lambda.ILayerVersion[];

    constructor(scope: Construct, id: string) {
        super(scope, id);
        this.layers = [
            new aws_lambda.LayerVersion(this, 'sentry', {
                code: aws_lambda.Code.fromDockerBuild(LAYERS_DOCKER_FILE_PATH)
            })
        ]
    }

    codePathProps(codePath: string, overrides?: Partial<AwsLambdaProps>): AwsLambdaProps {
        if (!process.env.SENTRY_DSN) {
            throw new  Error('SENTRY_DSN environment variable required');
        }
        return {
            codePath,
            layers: this.layers,
            timeout: Duration.seconds(30),
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