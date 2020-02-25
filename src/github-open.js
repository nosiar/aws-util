import open from 'open'
import selectRepository from './select-repository'

export const openGithubRepository = async ({ repositoryNameKeyword }) => {
  const { url } = await selectRepository({ repositoryNameKeyword })
  await open(url)
}
