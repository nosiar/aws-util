#!/usr/bin/env node

import inquirer from 'inquirer'
import open from 'open'
import { getServices } from './ecs-client'

const selectService = async (services) => {
  if (services.length == 0) {
    process.exitCode = 1
  } else if (services.length == 1) {
    return services[0]
  } else {
    const { service } = await inquirer.prompt({
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

export const openECSService = async ({ name, region, cluster }) => {
  const services = await getServices({ name, region, cluster })
  const { consoleUrl } = await selectService(services)
  await open(consoleUrl)
}
