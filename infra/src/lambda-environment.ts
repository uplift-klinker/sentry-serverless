import {Construct} from "constructs";
import {aws_lambda} from "aws-cdk-lib";
import {EnvironmentVariables} from "@uplift/core";
import {DATA_TABLE_NAME} from "./data-storage";

export function resolveLambdaEnvironment(scope: Construct): aws_lambda.FunctionProps['environment'] {
    return {
        SENTRY_DSN: '',
        NODE_OPTIONS: '--enable-source-maps -r /opt/sentry-init.js',
        [EnvironmentVariables.dataTableName]: DATA_TABLE_NAME
    };
}