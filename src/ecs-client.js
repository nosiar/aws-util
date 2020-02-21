import { ECS } from 'aws-sdk'

const ecsInstances = {}

const getECSInstance = (region) =>
  ecsInstances[region] || (ecsInstances[region] = new ECS({ region }))

export const getTaskDefinitionFamilies = ({ region }) => {
  return new Promise((resolve, reject) => {
    getECSInstance(region).listTaskDefinitionFamilies({}, (err, data) => {
      if (err) {
        reject(err)
      } else {
        resolve(data)
      }
    })
  })
}

export const getServices = async ({ name, region, cluster }) => {
  let serviceArns = []

  do {
    var { serviceArns: newServiceArns, nextToken } = await getSubServices({
      region,
      cluster,
      nextToken,
    })
    serviceArns = [...serviceArns, ...newServiceArns]
  } while (nextToken)

  return serviceArns
    .filter((arn) => arn.includes(name))
    .map((arn) => {
      const { resourceId } = parseArn(arn)
      return {
        ecsServiceName: resourceId,
        consoleUrl: `https://${region}.console.aws.amazon.com/ecs/home#/clusters/${cluster}/services/${resourceId}/details`,
      }
    })
}

const getSubServices = ({ region, cluster, nextToken }) =>
  new Promise((resolve, reject) => {
    getECSInstance(region).listServices(
      { cluster, nextToken, maxResults: 100 },
      (err, data) => {
        if (err) {
          reject(err)
        } else {
          resolve(data)
        }
      },
    )
  })

export const getTaskDefinitions = ({ region }) =>
  new Promise((resolve, reject) => {
    getECSInstance(region).listTaskDefinitions({}, (err, data) => {
      if (err) {
        reject(err)
      } else {
        resolve(data)
      }
    })
  })

const parseArn = (arn) => {
  const found = arn.match(/arn:aws:(\w+):([-\w]*):(\d*):([-\w]+)[:\/](.*)/)
  return {
    service: found[1],
    region: found[2],
    accountId: found[3],
    resourceType: found[4],
    resourceId: found[5],
  }
}
