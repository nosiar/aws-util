#!/usr/bin/env node

import assert from 'assert'
import inquirer from 'inquirer'
import open from 'open'
import {
  getTaskDefinitions,
  getTaskDefinitionFamilies,
  getServices,
} from './ecs-client'

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

// assert(process.argv.length >= 5)
;(async () => {
  // console.log(await getTaskDefinitions({ region: 'ap-northeast-1' }))
  // console.log(await getTaskDefinitionFamilies({ region: 'ap-northeast-1' }))
  const services = await getServices({
    name: 'triple',
    region: 'ap-northeast-1',
    cluster: 'triple',
  })

  const { consoleUrl } = await selectService(services)
  await open(consoleUrl)
})()
