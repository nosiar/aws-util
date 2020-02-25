#!/usr/bin/env node

import yargs from 'yargs'
import moment from 'moment'
import { openECSService } from './aws-open'
import { runInsightQuery } from './aws-logs'
import { openGithubRepository } from './github-open'

yargs
  .command({
    command: 'open',
    desc: 'Open something in web browser',
    builder: (yargs) =>
      yargs
        .command({
          command: 'service <serviceNameKeyword>',
          aliases: ['svc'],
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
          command: 'github <repositoryNameKeyword>',
          aliases: ['gh'],
          desc: 'Open github repository',
          handler: async ({ repositoryNameKeyword }) => {
            await openGithubRepository({
              repositoryNameKeyword,
            })
          },
        }),
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
        file: undefined,
      }),
    handler: async ({
      messageFilter,
      serviceNameKeyword,
      region,
      startTime,
      endTime,
      file,
    }) => {
      await runInsightQuery({
        messageFilter,
        serviceNameKeyword,
        region,
        startTime,
        endTime,
        file,
      })
    },
  })
  .demandCommand()
  .help()
  .wrap(72).argv
