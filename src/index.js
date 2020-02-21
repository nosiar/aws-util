#!/usr/bin/env node

import assert from 'assert'
import {
  getTaskDefinitions,
  getTaskDefinitionFamilies,
  getServices,
} from './ecs-client'

// assert(process.argv.length >= 5)
;(async () => {
  // console.log(await getTaskDefinitions({ region: 'ap-northeast-1' }))
  // console.log(await getTaskDefinitionFamilies({ region: 'ap-northeast-1' }))
  console.log(
    await getServices({
      name: 'soto',
      region: 'ap-northeast-1',
      cluster: 'triple',
    }),
  )
})()
