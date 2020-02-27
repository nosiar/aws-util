import { prompt } from 'inquirer'
import { getTaskDefinitionFamilies, getTaskDefinition } from './clients/ecs'

const selectTaskDefinition = async ({ taskDefinitionNameKeyword, region }) => {
  const taskDefinitions = (await getTaskDefinitionFamilies({ region }))
    .filter((name) => name.includes(taskDefinitionNameKeyword))
    .sort()

  if (taskDefinitions.length === 0) {
    throw Error('no task definition found.')
  } else if (taskDefinitions.length === 1) {
    return taskDefinitions[0]
  } else {
    const { taskDefinition } = await prompt({
      type: 'list',
      name: 'taskDefinition',
      message: '작업 정의를 선택하세요.',
      choices: taskDefinitions.map((t) => ({ name: t, value: t })),
    })
    return taskDefinition
  }
}

const selectContainerDefinition = async ({
  taskDefinitionNameKeyword,
  region,
}) => {
  const taskDefinition = await selectTaskDefinition({
    taskDefinitionNameKeyword,
    region,
  })

  const containerDefinitions = (
    await getTaskDefinition({ region, name: taskDefinition })
  ).taskDefinition.containerDefinitions

  if (containerDefinitions.length === 0) {
    throw Error('no container definition found.')
  } else if (containerDefinitions.length === 1) {
    return containerDefinitions[0]
  } else {
    const { containerDefinition } = await prompt({
      type: 'list',
      name: 'containerDefinition',
      message: '컨테이너를 선택하세요.',
      choices: containerDefinitions.map((c) => ({ name: c.name, value: c })),
    })
    return containerDefinition
  }
}

export default selectContainerDefinition
