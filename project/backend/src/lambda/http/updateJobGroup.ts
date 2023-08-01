import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import * as middy from 'middy'
import { cors, httpErrorHandler } from 'middy/middlewares'
import { getUserId } from '../utils';

import { updateJobGroup } from '../../businessLogic/jobGroup'
import { UpdateJobGroupRequest } from '../../requests/UpdateJobGroupRequest'

export const handler = middy(
    async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
        const jobGroupId = event.pathParameters.jobGroupId
        const updatedJobGroup: UpdateJobGroupRequest = JSON.parse(event.body)
        await updateJobGroup(jobGroupId,getUserId(event), updatedJobGroup)
        return {
            statusCode: 202,
            headers: {
                'Access-Control-Allow-Origin': '*'
            },
            body: JSON.stringify(updatedJobGroup)
        }
    }
)

handler
    .use(httpErrorHandler())
    .use(
        cors({
            credentials: true
        })
    )
