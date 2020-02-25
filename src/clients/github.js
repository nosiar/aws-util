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

export const getRepositories = async () => {
  let nodes = []

  do {
    var {
      totalCount,
      nodes: newNodes,
      pageInfo: { endCursor: after, hasNextPage },
    } = await getSubRepositories({ after })

    nodes = [...nodes, ...newNodes]
  } while (hasNextPage)

  assert.strictEqual(nodes.length, totalCount)

  return nodes.map((node) => ({
    ...node,
    url: `https://github.com/${node.nameWithOwner}`,
  }))
}

const getSubRepositories = async ({ after }) => {
  const afterQuery = after ? `, after: "${after}"` : ''
  const query = `
    {
      organization(login:"titicacadev"){
        name,
        repositories(orderBy: {field: NAME, direction: ASC}, first: 100${afterQuery}) {
          totalCount
          nodes {
            name
            nameWithOwner
          }
          pageInfo {
            endCursor
            hasNextPage
          }
        }
      }
    }
   `
  const {
    data: {
      organization: { repositories },
    },
  } = await fetchGraphql(query)
  return repositories
}
