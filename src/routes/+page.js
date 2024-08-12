const mime = { Accept: 'application/vnd.github+json' }
const milestone_id = 9
const endpoint = `https://api.github.com/repos/sveltejs/svelte/milestones/${milestone_id}`
const issues_endpoint = `https://api.github.com/repos/sveltejs/svelte/issues?milestone=${milestone_id}`
const releases_endpoint = `https://api.github.com/repos/sveltejs/svelte/releases`

const handleError = (error) => {
  console.log('what?')
  console.log(error.headers)
  console.error(error.message)
  return error.message
}
const options = {
  headers: {
    ...mime,
  },
}
export const load = async ({ fetch }) => {
  const [milestones, issues, releases] = await Promise.all(
    [endpoint, issues_endpoint, releases_endpoint].map((endpoint) =>
      fetch(endpoint, options)
        .catch(handleError)
        .then((response) => (response.ok ? response.json() : { error: response })),
    ),
  )

  console.log({ milestones, issues, releases })

  return {
    milestones,
    issues,
    releases,
    endpoint,
    issues_endpoint,
  }
}

export const ssr = false
