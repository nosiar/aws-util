import colors from 'colors'
import moment from 'moment'
import selectService from './common/select-service'
import { startQuery, getQueryResults } from './clients/cloud-watch'

export const runInsightQuery = async ({
  messageFilter,
  serviceNameKeyword,
  region,
  startTime,
  endTime,
}) => {
  const { ecsServiceName, cluster } = await selectService({
    serviceNameKeyword,
    region,
  })

  const { queryId } = await startQuery({
    messageFilter,
    ecsServiceName,
    region,
    cluster,
    startTime: moment.utc(startTime).unix(),
    endTime: moment.utc(endTime).unix(),
  })

  let sec = 0
  do {
    process.stdout.clearLine()
    process.stdout.cursorTo(0)
    process.stdout.write(`running... ${sec}s`)

    var result = await getQueryResults({ region, queryId })

    await wait(1000)
    sec++
  } while (result.status === 'Running')
  process.stdout.write('\n')

  for (const { timestamp, message } of result.results.map((r) => ({
    timestamp: r[0].value,
    message: r[1].value,
  }))) {
    console.log(timestamp.yellow, message)
  }
}

const wait = (ms) => new Promise((r) => setTimeout(r, ms))
