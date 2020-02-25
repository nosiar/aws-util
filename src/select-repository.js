import { prompt } from 'inquirer'
import { getRepositories } from './clients/github'

const selectRepository = async ({ repositoryNameKeyword }) => {
  const repositories = await getRepositories({ repositoryNameKeyword })

  if (repositories.length === 0) {
    throw Error('no repository found.')
  } else if (repositories.length === 1) {
    return repositories[0]
  } else {
    const { repository } = await prompt({
      type: 'list',
      name: 'repository',
      message: '저장소를 선택하세요.',
      choices: repositories.map((r) => ({
        name: r.name,
        value: r,
      })),
    })
    return repository
  }
}

export default selectRepository
