import assert from 'assert'
import fetch from 'node-fetch'

const fetchGraphql = async (query) => {
  const response = await fetch('https://api.github.com/graphql', {
    method: 'POST',
    headers: {
      Authorization: `bearer ${process.env.GITHUB_PERSONAL_ACCESS_TOKEN}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ query }),
  })

  return response.json()
}

export const getRepositories = async ({ repositoryNameKeyword }) => {
  let nodes = []

  do {
    var {
      repositoryCount,
      nodes: newNodes,
      pageInfo: { endCursor: after, hasNextPage },
    } = await getSubRepositories({ repositoryNameKeyword, after })

    nodes = [...nodes, ...newNodes]
  } while (hasNextPage)

  assert.strictEqual(nodes.length, repositoryCount)

  return nodes.map((node) => ({
    ...node,
    url: `https://github.com/${node.nameWithOwner}`,
  }))
}

const getSubRepositories = async ({ repositoryNameKeyword, after }) => {
  const keyword = repositoryNameKeyword || ''
  const afterQuery = after ? `, after: "${after}"` : ''
  const query = `
    {
        search(query: "user:titicacadev ${keyword}", type: REPOSITORY, first:100${afterQuery}) {
            repositoryCount
            nodes {
                ... on Repository {
                name
                nameWithOwner
                }
            }
            pageInfo {
                endCursor
                hasNextPage
            }
        }
    }
    `
  const {
    data: { search },
  } = await fetchGraphql(query)
  return search
}
