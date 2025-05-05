import {Construct} from "constructs";
import {aws_lambda} from "aws-cdk-lib";

export function resolveLambdaEnvironment(scope: Construct): aws_lambda.FunctionProps['environment'] {
    return {

    }
}