#!/usr/bin/env node

import assert from 'assert'
import inquirer from 'inquirer'
import open from 'open'
import { openECSService } from './aws-console'

;(async () => {
  // console.log(await getTaskDefinitions({ region: 'ap-northeast-1' }))
  // console.log(await getTaskDefinitionFamilies({ region: 'ap-northeast-1' }))
  await openECSService({
    name: 'city',
    region: 'ap-northeast-1',
    cluster: 'triple',
  })
})()
