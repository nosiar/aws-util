#!/usr/bin/env node

import yargs from 'yargs'
import moment from 'moment'
import { openECSService } from './aws-console'
import { runInsightQuery } from './logs'

yargs
  .command({
    command: 'open service <serviceNameKeyword>',
    aliases: [],
    desc: 'Open aws service console',
    builder: (yargs) =>
      yargs.default({
        region: 'ap-northeast-1',
      }),
    handler: async ({ serviceNameKeyword, region }) => {
      await openECSService({
        serviceNameKeyword,
        region,
      })
    },
  })
  .command({
    command: 'logs <serviceNameKeyword> [messageFilter]',
    aliases: [],
    desc: 'Run cloud watch insights query',
    builder: (yargs) =>
      yargs.default({
        region: 'ap-northeast-1',
        startTime: moment().subtract(1, 'hour'),
        endTime: moment(),
      }),
    handler: async ({
      messageFilter,
      serviceNameKeyword,
      region,
      startTime,
      endTime,
    }) => {
      await runInsightQuery({
        messageFilter,
        serviceNameKeyword,
        region,
        startTime,
        endTime,
      })
    },
  })
  .demandCommand()
  .help()
  .wrap(72).argv
