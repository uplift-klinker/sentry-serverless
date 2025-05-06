import {Construct} from "constructs";
import {aws_lambda, Duration} from "aws-cdk-lib";

export type AwsLambdaProps = {
    codePath: string;
    layers?: aws_lambda.ILayerVersion[];
    timeout?: Duration;
    environment?: Record<string, string>;
}

export class AwsLambda extends Construct {
    readonly func: aws_lambda.IFunction;

    constructor(scope: Construct, id: string, props: AwsLambdaProps) {
        super(scope, id);

        this.func = new aws_lambda.Function(this, 'func', {
            handler: 'index.handler',
            runtime: aws_lambda.Runtime.NODEJS_20_X,
            code: aws_lambda.Code.fromAsset(props.codePath),
            timeout: props.timeout ?? Duration.seconds(30),
            layers: props.layers,
            environment: {
                ...props.environment,
            },
        })
    }

    public addEventSource(source: aws_lambda.IEventSource) {
        this.func.addEventSource(source);
    }
}