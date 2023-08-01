import { apiEndpoint } from '../config'
import { JobGroup } from '../types/JobGroup';
import { CreateJobGroupRequest } from '../types/CreateJobGroupRequest';
import Axios from 'axios'
import { UpdateJobGroupRequest } from '../types/UpdateJobGroupRequest';

export async function getJobGroups(idToken: string): Promise<JobGroup[]> {
  console.log('Fetching job groups')

  const response = await Axios.get(`${apiEndpoint}/job-groups`, {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${idToken}`
    },
  })
  console.log('JobGroup:', response.data)
  return response.data.items
}

export async function createJobGroup(
  idToken: string,
  newJobGroup: CreateJobGroupRequest
): Promise<JobGroup> {
  const response = await Axios.post(`${apiEndpoint}/job-groups`,  JSON.stringify(newJobGroup), {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${idToken}`
    }
  })
  return response.data.newItem
}

export async function patchJobGroup(
  idToken: string,
  jobGroupId: string,
  updatedJobGroup: UpdateJobGroupRequest
): Promise<void> {
  await Axios.patch(`${apiEndpoint}/job-groups/${jobGroupId}`, JSON.stringify(updatedJobGroup), {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${idToken}`
    }
  })
}

export async function deleteJobGroup(
  idToken: string,
  jobGroupId: string
): Promise<void> {
  await Axios.delete(`${apiEndpoint}/job-groups/${jobGroupId}`, {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${idToken}`
    }
  })
}

export async function getUploadUrl(
  idToken: string,
  jobGroupId: string
): Promise<string> {
  const response = await Axios.post(`${apiEndpoint}/job-groups/${jobGroupId}/attachment`, '', {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${idToken}`
    }
  })
  return response.data.uploadUrl
}

export async function uploadFile(uploadUrl: string, file: Buffer): Promise<void> {
  await Axios.put(uploadUrl, file)
}
