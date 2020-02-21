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
      }),
    handler: async ({ name, region }) => {
      await openECSService({
        name,
        region,
      })
    },
  })
  .demandCommand()
  .help()
  .wrap(72).argv
