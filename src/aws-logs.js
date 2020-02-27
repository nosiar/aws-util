import { homedir } from 'os'
import { writeFileSync } from 'fs'
import colors from 'colors'
import moment from 'moment'
import selectContainerDefinition from './select-container-definition'
import { startQuery, getQueryResults } from './clients/cloud-watch'

export const runInsightQuery = async ({
  messageFilter,
  taskDefinitionNameKeyword,
  region,
  startTime,
  endTime,
  file,
}) => {
  const {
    name: containerName,
    logConfiguration: {
      options: {
        'awslogs-group': logGroup,
        'awslogs-stream-prefix': streamPrefix,
      },
    },
  } = await selectContainerDefinition({
    taskDefinitionNameKeyword,
    region,
  })

  const { queryId } = await startQuery({
    messageFilter,
    containerName,
    region,
    logGroup,
    streamPrefix,
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

  const parsedFile = path(file)

  if (parsedFile) {
    writeFileSync(parsedFile, '')
  }
  for (const { timestamp, message } of result.results.map((r) => ({
    timestamp: r[0].value,
    message: r[1].value,
  }))) {
    if (!parsedFile) {
      console.log(timestamp.yellow, message)
    } else {
      writeFileSync(parsedFile, `${timestamp} ${message}\n`, { flag: 'a' })
    }
  }
}

const path = (file) =>
  file && file[0] === '~' ? homedir() + file.substr(1) : file

const wait = (ms) => new Promise((r) => setTimeout(r, ms))
