import { CloudWatchLogs } from 'aws-sdk'

const cloudWatchLogsInstances = {}

const getCloudWatchLogsInstances = (region) =>
  cloudWatchLogsInstances[region] ||
  (cloudWatchLogsInstances[region] = new CloudWatchLogs({ region }))

export const startQuery = ({
  messageFilter,
  containerName,
  region,
  logGroup,
  streamPrefix,
  startTime,
  endTime,
}) =>
  new Promise((resolve, reject) => {
    getCloudWatchLogsInstances(region).startQuery(
      {
        startTime,
        endTime,
        logGroupName: logGroup,
        queryString:
          'fields @timestamp, @message ' +
          `| filter @logStream like /^${streamPrefix}\\/${containerName}\\// ` +
          (messageFilter ? `| filter @message like ${messageFilter}` : '') +
          '| sort @timestamp asc ',
        limit: 2000,
      },
      (err, data) => {
        if (err) {
          reject(err)
        } else {
          resolve(data)
        }
      },
    )
  })

export const getQueryResults = ({ region, queryId }) =>
  new Promise((resolve, reject) => {
    getCloudWatchLogsInstances(region).getQueryResults(
      { queryId },
      (err, data) => {
        if (err) {
          reject(err)
        } else {
          resolve(data)
        }
      },
    )
  })

export const describeQueries = ({ region, logGroupName = '/aws/ecs' }) =>
  new Promise((resolve, reject) => {
    getCloudWatchLogsInstances(region).describeQueries(
      { logGroupName },
      (err, data) => {
        if (err) {
          reject(err)
        } else {
          resolve(data.queries)
        }
      },
    )
  })
