import { z } from "zod";

export const DataSchema = z.object({
    id: z.string().uuid(),
    name: z.string()
});
export type Data = z.infer<typeof DataSchema>;

export const DataInputSchema = z.object({
    name: z.string()
});
export type DataInput = z.infer<typeof DataInputSchema>;

export const DataConnectionSchema = z.object({
    nodes: z.array(DataSchema),
    totalCount: z.number().int(),
})
export type DataConnection = z.infer<typeof DataConnectionSchema>;