<script>
  import dompurify from 'dompurify'
  import { parse } from 'marked'
  //   const { sanitize } = dompurify
  let { data } = $props()

  const {
    error,
    endpoint,
    state: _state,
    title,
    open_issues,
    closed_issues,
    updated_at,
  } = data.milestones
  const { error: e_issues, ...issues } = data.issues
  const { error: r_issues, ...releases } = data.releases

  let last_updated = $state(new Date(updated_at))
  let now = $state(Date.now())
  let timediff = $derived(now - last_updated)
  const min_factor = 1000 * 60
  const h_factor = min_factor * 60
  const d_factor = h_factor * 24
  let min_ago = $derived(Math.floor(timediff / min_factor))
  let hour_ago = $derived(Math.floor(timediff / h_factor))
  let days_ago = $derived(Math.floor(timediff / d_factor))
  let total = $derived(closed_issues + open_issues)
  let percent = $derived(Math.floor((closed_issues / total) * 1000) / 10)
  const release_list = Object.entries(releases)
    .filter(([id, { prerelease }]) => (_state === 'open' ? prerelease : !prerelease))
    .filter((c, i) => i < 3)
    .map(([id, { name, published_at, body }]) => ({ name, published_at, body }))
</script>

{#if !error}
  <h1>When Svelte {title}?</h1>
  <h2>Is svelte {title} done already?</h2>
  <p>{_state === 'open' ? 'not yet' : 'now'}</p>
  <p>
    but kind of soon: {percent}% (open: {open_issues} / closed: {closed_issues})
    <progress max={closed_issues + open_issues} value={closed_issues}>{percent}%</progress>
  </p>
  <h3>3 Latest releases</h3>
  {#if release_list}
    {#each release_list as { name, published_at, body }}
      {@const html = parse(body)}
      <div class="card">
        <b>{name}</b>
        <sub>published: {new Date(published_at).toLocaleDateString()}</sub>
        <div>{@html html}</div>
      </div>
    {/each}
  {/if}
  <!-- <pre>{JSON.stringify(release_list, null, 2)}</pre> -->

  <p>
    and something happened on {last_updated.toLocaleDateString()} ({min_ago}mins / {hour_ago}h / {days_ago
      ? `${days_ago}d ago`
      : 'today'})
  </p>
  <!-- <pre>{JSON.stringify(data.milestones, null, 2)}</pre> -->
{:else}
  An Error happenend while fetching milestones: {JSON.stringify(error)} {endpoint}
{/if}
{#each data.issues.sort(({ comments: a }, { comments: b }) => a < b) as { created_at, updated_at, html_url, comments, number, title, state, user: { login } }}
  <div class="card">
    <a href={html_url}>#{number}</a>
    <sub>{comments} comments,</sub>
    <sub
      >created: {new Date(created_at).toLocaleDateString()}, updated: {new Date(
        updated_at,
      ).toLocaleDateString()}</sub
    >
    <div class="title">{title}</div>
  </div>
  <div></div>
{/each}
<pre>{JSON.stringify(data.issues, null, 2)}</pre>

<style>
  :global(html) {
    font-family: 'Lucida Sans', 'Lucida Sans Regular', 'Lucida Grande', 'Lucida Sans Unicode',
      Geneva, Verdana, sans-serif;
  }
  .card {
    margin: 1em 0em;
    padding: 1em;
    background-color: lightgray;
    border-radius: 0.5em;
  }

  .title {
    padding: 1em;
  }
</style>
