import { JobGroupAccess } from '../dataLayer/jobGroupAcess'
import { AttachmentUtils } from '../fileStorage/attachmentUtils';
import { JobGroupItem } from '../models/JobGroupItem'
import { CreateJobGroupRequest } from '../requests/CreateJobGroupRequest'
import { UpdateJobGroupRequest } from '../requests/UpdateJobGroupRequest'
import * as uuid from 'uuid'

const jobGroupAccess = new JobGroupAccess()
const attachmentUtils = new AttachmentUtils()


export async function getJobGroupByUserId(userId: string): Promise<JobGroupItem[]> {
  return jobGroupAccess.getJobGroupByUserId(userId)
}

export async function deleteJobGroupById(jobGroupId: string, userId: string) {
  jobGroupAccess.deleteJobGroupById(jobGroupId, userId)
}

export async function updateJobGroup(jobGroupId: string, userId: string, updateJobGroup: UpdateJobGroupRequest) {
  jobGroupAccess.updateJobGroup(jobGroupId, userId, updateJobGroup)
}

export async function createJobGroup(
  createJobGroupRequest: CreateJobGroupRequest,
  jwtToken: string
): Promise<JobGroupItem> {

  const itemId = uuid.v4()

  return await jobGroupAccess.createJobGroup({
    jobGroupId: itemId,
    createdAt: new Date().toISOString(),
    name: createJobGroupRequest.name,
    description: createJobGroupRequest.description,
    attachmentUrl: await attachmentUtils.createAttachmentURL(itemId),
    userId: jwtToken
  })
}