#!/usr/bin/env node

import yargs from 'yargs'
import { openECSService } from './aws-console'

yargs
  .command({
    command: 'open service <name>',
    aliases: [],
    desc: 'Open aws service console',
    builder: (yargs) =>
      yargs.default({
        region: 'ap-northeast-1',
        cluster: 'triple',
      }),
    handler: async ({ name, region, cluster }) => {
      await openECSService({
        name,
        region,
        cluster,
      })
    },
  })
  .demandCommand()
  .help()
  .wrap(72).argv
