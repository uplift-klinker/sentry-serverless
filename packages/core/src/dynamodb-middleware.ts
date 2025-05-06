import middy from "@middy/core";
import {DynamoDBDocument} from "@aws-sdk/lib-dynamodb";
import {DynamoDBClient} from "@aws-sdk/client-dynamodb";
import {ContextWithSentry} from "./sentry-middleware";

export type ContextWithDynamoDb = ContextWithSentry & {
    document: DynamoDBDocument;
}

export function dynamodbMiddleware(): middy.MiddlewareObj<unknown, unknown, Error, ContextWithDynamoDb>[] {
    return [
        {
            before: ({context}) => {
                context.document = DynamoDBDocument.from(new DynamoDBClient());
            },
            after: ({context}) => {
                context.document.destroy();
            },
            onError: ({context}) => {
                context.document.destroy();
            }
        }
    ]
}