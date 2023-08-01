import * as AWS from 'aws-sdk'
import * as AWSXRay from 'aws-xray-sdk'
import { DocumentClient } from 'aws-sdk/clients/dynamodb'
import { JobGroupItem } from '../models/JobGroupItem'
import { JobGroupUpdate } from '../models/JobGroupUpdate';

const XAWS = AWSXRay.captureAWS(AWS)

export class JobGroupAccess {

  constructor(
    private readonly docClient: DocumentClient = createDynamoDBClient(),
    private readonly jobIndex = process.env.JOB_GROUP_TABLE_GSI,
    private readonly jobGroupTable = process.env.JOB_GROUP_TABLE) {
  }

  async deleteJobGroupById(jobGroupId: string, userId: string) {
    await this.docClient.delete({
      TableName: this.jobGroupTable,
      Key: {
        'jobGroupId': jobGroupId,
        'userId': userId
      }
    }).promise()
  }

  async updateJobGroup(jobGroupId: string, userId: string, updatedJobGroup: JobGroupUpdate){

    await this.docClient.update({
        TableName: this.jobGroupTable,
        Key: {
            "jobGroupId": jobGroupId,
            "userId": userId
        },
        UpdateExpression: "set #name = :name, description = :description",
        ExpressionAttributeNames: {
            "#name": "name"
        },
        ExpressionAttributeValues: {
            ":name": updatedJobGroup.name,
            ":description": updatedJobGroup.description
        }
    }).promise()
}

  async getJobGroupByUserId(userId: string): Promise<JobGroupItem[]> {
    console.log("Called function get job")
    const result = await this.docClient.query({
      TableName: this.jobGroupTable,
      IndexName: this.jobIndex,
      KeyConditionExpression: 'userId = :userId',
      ExpressionAttributeValues: {
        ':userId': userId
      },
      ScanIndexForward: false
    }).promise()
    const items = result.Items
    return items as JobGroupItem[]
  }

  async createJobGroup(jobGroup: JobGroupItem): Promise<JobGroupItem> {
    await this.docClient.put({
      TableName: this.jobGroupTable,
      Item: jobGroup
    }).promise()

    return jobGroup
  }
}

function createDynamoDBClient() {
  if (process.env.IS_OFFLINE) {
    console.log('Creating a local DynamoDB instance')
    return new XAWS.DynamoDB.DocumentClient({
      region: 'localhost',
      endpoint: 'http://localhost:8000'
    })
  }

  return new XAWS.DynamoDB.DocumentClient()
}
