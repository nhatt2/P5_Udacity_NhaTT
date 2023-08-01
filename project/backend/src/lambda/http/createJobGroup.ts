import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import 'source-map-support/register'
import * as middy from 'middy'
import { cors } from 'middy/middlewares'
import { CreateJobGroupRequest } from '../../requests/CreateJobGroupRequest'
import { getUserId } from '../utils';
import { createJobGroup } from '../../businessLogic/jobGroup'

export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    const newJobGroup: CreateJobGroupRequest = JSON.parse(event.body)
    console.log('Processing event: ', event)
    const newItem = await createJobGroup(newJobGroup, getUserId(event))

    return {
      statusCode: 201,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true
      },
      body: JSON.stringify({
        newItem
      })
    }
  }
)


handler.use(
  cors({
    credentials: true
  })
)
