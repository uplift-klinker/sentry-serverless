export const EnvironmentVariables = {
    subscriberQueueUrl: 'SUBSCRIBER_QUEUE_URL',
    dataTableName: 'DATA_TABLE_NAME'
}

export function readEnvironmentVariable(key: keyof typeof EnvironmentVariables): string {
    const name = EnvironmentVariables[key];
    const value = process.env[name];
    if (!value) {
        throw new Error(`environment variable for ${key} is missing`);
    }
    return value;
}