import open from 'open'
import selectService from './select-service'

export const openECSService = async ({ serviceNameKeyword, region }) => {
  const { consoleUrl } = await selectService({ serviceNameKeyword, region })
  await open(consoleUrl)
}
