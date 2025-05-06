import {ContextWithDynamoDb} from "../dynamodb-middleware";
import {Data, DataConnection, DataSchema} from "../models/data";
import {ScanCommandOutput} from "@aws-sdk/lib-dynamodb";
import {readEnvironmentVariable} from "../environment-variables";

export async function getDataQuery(context: ContextWithDynamoDb): Promise<DataConnection> {
    const [nodes, count] = await Promise.all([
        getItems(context),
        getItemCount(context),
    ])
    return {
        nodes: nodes,
        totalCount: count,
    }
}

async function getItems({document, logger}: ContextWithDynamoDb): Promise<Data[]> {
    const tableName = getTableName();
    logger.info('scanning table for items', {tableName});
    let items: Data[] = [];
    let output: ScanCommandOutput;
    let lastKey: Record<string, unknown> | undefined = undefined;
    do {
        output = await document.scan({TableName: tableName, Select: 'COUNT', ExclusiveStartKey: lastKey});
        lastKey = output.LastEvaluatedKey;
        const currentItems = (output.Items ?? []).map(i => DataSchema.parse(i));
        items = [...items, ...currentItems];
    } while(items.length < 25 || !output.Items || output.Items.length === 0);
    logger.info('finished scanning table for items', {tableName, itemCount: items.length});
    return items.slice(0, 25);
}

async function getItemCount({document, logger}: ContextWithDynamoDb): Promise<number> {
    const tableName = getTableName();
    logger.info('scanning table for count', {tableName});

    let count = 0;
    let output: ScanCommandOutput;
    let lastKey: Record<string, unknown> | undefined = undefined;
    do {
        logger.info('scanning table', {lastKey: lastKey});
        output = await document.scan({TableName: tableName, Select: 'COUNT', ExclusiveStartKey: lastKey});
        count = output.Count ?? 0;
        lastKey = output.LastEvaluatedKey;
    } while(lastKey);

    logger.info('finished scanning table for count', {tableName, count});
    return count;
}

function getTableName() {
    return readEnvironmentVariable('dataTableName');
}