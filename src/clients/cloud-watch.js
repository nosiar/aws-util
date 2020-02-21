import { CloudWatchLogs } from 'aws-sdk'

const cloudWatchLogsInstances = {}

const getCloudWatchLogsInstances = (region) =>
  cloudWatchLogsInstances[region] ||
  (cloudWatchLogsInstances[region] = new CloudWatchLogs({ region }))

export const startQuery = ({
  messageFilter,
  ecsServiceName,
  region,
  cluster,
  startTime,
  endTime,
  logGroupName = '/aws/ecs',
}) =>
  new Promise((resolve, reject) => {
    getCloudWatchLogsInstances(region).startQuery(
      {
        startTime,
        endTime,
        logGroupName,
        queryString:
          'fields @timestamp, @message ' +
          `| filter @logStream like /^${cluster}\\/${ecsServiceName}\\// ` +
          (messageFilter ? `| filter @message like ${messageFilter}` : '') +
          '| sort @timestamp asc ',
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
//   getCloudWatchLogsInstances(region).getLogRecord(
//     {
//       logRecordPointer:
//         'ClYKGQoVMTA3MjQzNzE0NTg4Oi9hd3MvZWNzEAMSORoYAgXYxyitAAAAADJOXrEABeSyjoAAAADSIAEojPHerIUuMPeq6KyFLjixFUCKhy1IvIIPUM/vDhCaAhgB',
//     },
//     (err, data) => {
//       if (err) console.log(err)
//       else {
//         console.log(data)
//       }
//     },
//   )

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

// https://ap-northeast-1.console.aws.amazon.com/cloudwatch/home?region=ap-northeast-1#logs-insights:queryDetail=~(end~0~start~-3600~timeType~'RELATIVE~unit~'seconds~editorString~'fields*20*40timestamp*2c*20*40message*0a*7c*20filter*20*40message*20like*20*2f*5etriple*5c*2famantani*5c*2f*2f*0a*7c*20sort*20*40timestamp*20desc*0a*7c*20limit*2020*0a*7c*20limit*2020~isLiveTail~false~queryId~'d76df07d-5242-4441-9a8f-62a0adb4df29~source~(~'*2faws*2fecs))
