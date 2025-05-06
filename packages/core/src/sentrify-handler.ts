import {Context as LambdaContext} from "aws-lambda";
import {wrapHandler} from '@sentry/aws-serverless'

type LambdaHandler<TEvent, TResult, TContext> = (event: TEvent, context: TContext) => Promise<TResult>;
export function sentrifyHandler<TEvent, TResult, TContext extends LambdaContext>(handler: LambdaHandler<TEvent, TResult, TContext>) {
    return wrapHandler<TEvent, TResult>((event, context) => {
        return handler(event, context as TContext);
    })
}