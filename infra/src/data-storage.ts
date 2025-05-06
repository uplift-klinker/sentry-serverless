import {Construct} from "constructs";
import {aws_dynamodb, aws_iam} from "aws-cdk-lib";

export const DATA_TABLE_NAME = 'data-table';

export class DataStorage extends Construct {
    readonly table: aws_dynamodb.ITableV2;

    constructor(scope: Construct, id: string) {
        super(scope, id);

        this.table = new aws_dynamodb.TableV2(this, 'table', {
            billing: aws_dynamodb.Billing.onDemand({
                maxReadRequestUnits: 5,
                maxWriteRequestUnits: 5,
            }),
            tableName: DATA_TABLE_NAME,
            partitionKey: {
                name: 'id',
                type: aws_dynamodb.AttributeType.STRING
            },
        })
    }

    grantWrite(grantable: aws_iam.IGrantable) {
        this.table.grantWriteData(grantable);
    }

    grantRead(grantable: aws_iam.IGrantable) {
        this.table.grantReadData(grantable);
    }
}