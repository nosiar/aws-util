import { prompt } from 'inquirer'
import { getServices } from '../clients/ecs'

const selectService = async ({ serviceNameKeyword, region }) => {
  const services = [
    ...(await getServices({ region, cluster: 'triple' })),
    ...(await getServices({ region, cluster: 'triple-dev' })),
  ]
    .filter(({ ecsServiceName }) => ecsServiceName.includes(serviceNameKeyword))
    .sort((a, b) => (a.ecsServiceName > b.ecsServiceName ? 1 : -1))

  if (services.length === 0) {
    throw Error('no service found.')
  } else if (services.length === 1) {
    return services[0]
  } else {
    const { service } = await prompt({
      type: 'list',
      name: 'service',
      message: '서비스 이름을 선택하세요.',
      choices: services.map((s) => ({
        name: s.ecsServiceName,
        value: s,
      })),
    })
    return service
  }
}

export default selectService
