import { History } from 'history'
import * as React from 'react'
import {
  Button,
  Divider,
  Grid,
  Header,
  Icon,
  Input,
  Image,
  Loader
} from 'semantic-ui-react'

import { createJobGroup, deleteJobGroup, getJobGroups, patchJobGroup } from '../api/job-groups-api'
import Auth from '../auth/Auth'
import { JobGroup } from '../types/JobGroup'

interface JobGroupsProps {
  auth: Auth
  history: History
}

interface JobGroupsState {
  jobGroups: JobGroup[]
  newJobGroupName: string
  newDescription: string
  loadingJobGroups: boolean
}

export class JobGroups extends React.PureComponent<JobGroupsProps, JobGroupsState> {
  state: JobGroupsState = {
    jobGroups: [],
    newJobGroupName: '',
    newDescription: '',
    loadingJobGroups: true
  }

  handleNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ newJobGroupName: event.target.value })
  }

  handleDescriptionChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ newDescription: event.target.value })
  }

  onEditButtonClick = (jobGroupId: string) => {
    this.props.history.push(`/jobGroups/${jobGroupId}/edit`)
  }

  onJobGroupCreate = async () => {
    try {
      const newJobGroup = await createJobGroup(this.props.auth.getIdToken(), {
        name: this.state.newJobGroupName,
        description: this.state.newDescription
      })
      console.log(newJobGroup)
      this.setState({
        jobGroups: [...this.state.jobGroups, newJobGroup],
        newJobGroupName: ''
      })
    } catch {
      alert('JobGroup creation failed')
    }
  }

  onJobGroupDelete = async (jobGroupId: string) => {
    try {
      await deleteJobGroup(this.props.auth.getIdToken(), jobGroupId)
      this.setState({
        jobGroups: this.state.jobGroups.filter(jobGroup => jobGroup.jobGroupId !== jobGroupId)
      })
    } catch {
      alert('JobGroup deletion failed')
    }
  }

  async componentDidMount() {
    try {
      const jobGroups = await getJobGroups(this.props.auth.getIdToken())
      console.log()
      this.setState({
        jobGroups,
        loadingJobGroups: false
      })
    } catch (e) {
      alert(`Failed to fetch jobGroups: ${(e as Error).message}`)
    }
  }

  render() {
    return (
      <div>
        <Header as="h1">JOB GROUPS</Header>

        {this.renderCreateJobGroupInput()}
        {this.renderJobGroups()}
      </div>
    )
  }

  renderCreateJobGroupInput() {
    return (
      <Grid.Row>
        <Grid.Column width={16} style={{ marginBottom: 10 }}>
          <Input
            fluid
            placeholder="Job name"
            onChange={this.handleNameChange}
          />

        </Grid.Column>
        <Grid.Column width={16} style={{ marginBottom: 10 }}>
          <Input
            fluid
            placeholder="Job description"
            onChange={this.handleDescriptionChange}
          />
        </Grid.Column>
        <Grid.Column width={16}>
          <Button color='blue' onClick={() => this.onJobGroupCreate()}>
            CREATE
          </Button>
        </Grid.Column>

        <Grid.Column width={16}>
          <Divider />
        </Grid.Column>
      </Grid.Row>
    )
  }

  renderJobGroups() {
    if (this.state.loadingJobGroups) {
      return this.renderLoading()
    }

    return this.renderJobGroupsList()
  }

  renderLoading() {
    return (
      <Grid.Row>
        <Loader indeterminate active inline="centered">
          Loading JOBGROUP's
        </Loader>
      </Grid.Row>
    )
  }

  renderJobGroupsList() {
    return (
      <Grid padded>
        {this.state.jobGroups.map((jobGroup, pos) => {
          return (
            <Grid.Row key={jobGroup.jobGroupId}>
              <Grid.Column width={3} verticalAlign="top">
                <h5>{jobGroup.name}</h5>
              </Grid.Column>
              <Grid.Column width={3} floated="right">
                {jobGroup.description}
              </Grid.Column>
              <Grid.Column width={4} floated="right">
                {jobGroup.attachmentUrl && (
                  <Image src={jobGroup.attachmentUrl} onError={(event: { target: { style: { display: string } } }) => event.target.style.display = 'none'} alt=" This is job image!" size="small" wrapped />
                )}
              </Grid.Column>
              <Grid.Column width={3} floated="right">
                {jobGroup.createdAt}
              </Grid.Column>
              <Grid.Column width={1} floated="right">
                <Button
                  icon
                  color="blue"
                  onClick={() => this.onEditButtonClick(jobGroup.jobGroupId)}
                >
                  <Icon name="pencil" />
                </Button>
              </Grid.Column>
              <Grid.Column width={1} floated="right">
                <Button
                  icon
                  color="red"
                  onClick={() => this.onJobGroupDelete(jobGroup.jobGroupId)}
                >
                  <Icon name="delete" />
                </Button>
              </Grid.Column>
              <Grid.Column width={16}>
                <Divider />
              </Grid.Column>
            </Grid.Row>
          )
        })}
      </Grid>
    )
  }
}
