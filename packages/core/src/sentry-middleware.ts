import middy from "@middy/core";
import {Context as LambdaContext} from 'aws-lambda';

export function sentryMiddleware(): middy.MiddlewareObj<unknown, unknown, Error, LambdaContext>[] {
    return [
        {
            before: () => {

            },
            after: () => {

            },
            onError: () => {

            }
        }
    ];
}