import {Schema} from "zod";

export function parseJsonToSchema<T>(json: string, schema: Schema<T>): T {
    const parsed = JSON.parse(json);
    return schema.parse(parsed);
}