import {DataInput} from "../models/data";
import {ContextWithDynamoDb} from "../dynamodb-middleware";
import {readEnvironmentVariable} from "../environment-variables";
import {randomUUID} from 'crypto'

export async function saveData(input: DataInput, {document, logger}: ContextWithDynamoDb):  Promise<void> {
    const tableName = readEnvironmentVariable('dataTableName');

    const item = {
        ...input,
        id: randomUUID(),
    }
    logger.info('saving item', {item});
    await document.put({
        TableName: tableName,
        Item: item,
    });
    logger.info('finished saving item', {item});
}