<script>
  import { onMount } from 'svelte'
  import axios from '../../axios-global'
  import { user } from '../../stores.js'
  import { navigateTo } from 'svelte-router-spa'
  import Icon from 'svelte-awesome'
  import { refresh, times } from 'svelte-awesome/icons'

  let lunchWeekList = []
  let loading = true
  let showDeleteModal = false
  let weekToDelete = {}
  let showCreateModal = false
  let createWeekOfDate = null

  onMount(async () => {
    try {
      const response = await axios.get(`${process.env.API_ROOT}/api/lunch-week`)
      lunchWeekList = response.data
    } catch (e) {
      console.error(e)
    }
    loading = false
  })

  const openLunchWeekDetails = (lunchWeek) => {
    const route = `/admin/manage-menus/week-details/${lunchWeek.lunchWeekId}`
    navigateTo(route)
  }

  const openDeleteModal = (lunchWeek) => {
    showDeleteModal = true
    weekToDelete = lunchWeek
  }

  const deleteLunchWeek = async (lunchWeek) => {
    const lunchWeekId = lunchWeek.lunchWeekId
    showDeleteModal = false
    try {
      // show the loading spinner and call the delete endpoint
      loading = true
      await axios.delete(
        `${process.env.API_ROOT}/api/lunch-week/${lunchWeekId}`
      )

      // find the index of the passed in lunchWeek and use splice to remove it
      const deletedIndex = lunchWeekList.findIndex(
        (x) => x.lunchWeekId === lunchWeekId
      )
      lunchWeekList.splice(deletedIndex, 1)
      loading = false
    } catch (e) {
      loading = false
      console.log(e)
    }

    return
  }

  const openCreateModal = () => {
    showCreateModal = true
  }

  const createLunchWeek = async () => {
    showCreateModal = false
    let newLunchWeek = {
      weekOf: createWeekOfDate, // createWeekOfDate will contain the input from the user
      isPublished: false,
    }

    try {
      loading = true

      // since this is a POST, we need to send a lunchWeek object as the body of the request
      const response = await axios.post(
        `${process.env.API_ROOT}/api/lunch-week`,
        newLunchWeek
      )
      const lunchWeekId = response.data.lunchWeekId

      // populate the newLunchWeek with the id from the server response
      newLunchWeek.lunchWeekId = lunchWeekId

      // push the result into the lunchWeek list, so Svelte will update the table
      lunchWeekList.push(newLunchWeek)
      loading = false
    } catch (e) {
      loading = false
      console.error(e)
    }
  }
</script>

<div>
  <nav class="breadcrumb" aria-label="breadcrumbs">
    <ul>
      <li>
        <a href="/">Home</a>
      </li>
      <li>
        <a href="/admin/manage-menus">Lunch Menu Administration</a>
      </li>
      <li class="is-active">
        <a href="/#">{$user.schoolName}</a>
      </li>
    </ul>
  </nav>

  <button class="button is-text is-small mb-1" on:click={openCreateModal}
    >Add Lunch Week</button
  >
  {#if loading}
    <div class="section">
      <Icon spin data={refresh} scale="3" />
    </div>
  {:else}
    <table class="table">
      <thead>
        <tr>
          <th>Week Of</th>
          <th>Published</th>
          <th />
        </tr>
      </thead>
      {#each lunchWeekList as lunchWeek}
        <tr>
          <td
            class="has-text-link clickable"
            on:click={openLunchWeekDetails(lunchWeek)}>{lunchWeek.weekOf}</td
          >
          <td>{lunchWeek.isPublished}</td>
          <td
            class="has-text-grey-light clickable"
            on:click={openDeleteModal(lunchWeek)}
          >
            <Icon data={times} style="margin-top: 4px" />
          </td>
        </tr>
      {/each}
    </table>
  {/if}
</div>

<div class={showDeleteModal ? 'modal is-active' : 'modal'}>
  <div class="modal-background" />
  <div class="modal-card">
    <header class="modal-card-head">
      <p class="modal-card-title">Warning</p>
      <button
        class="delete"
        on:click={() => (showDeleteModal = false)}
        aria-label="close"
      />
    </header>
    <section class="modal-card-body">
      Delete Week of {weekToDelete.weekOf}?
    </section>
    <footer class="modal-card-foot">
      <button class="button is-success" on:click={deleteLunchWeek(weekToDelete)}
        >Continue</button
      >
      <button class="button" on:click={() => (showDeleteModal = false)}
        >Cancel</button
      >
    </footer>
  </div>
</div>

<div class={showCreateModal ? 'modal is-active' : 'modal'}>
  <div class="modal-background" />
  <div class="modal-card">
    <header class="modal-card-head">
      <p class="modal-card-title">Create Lunch Week</p>
      <button
        class="delete"
        on:click={() => (showCreateModal = false)}
        aria-label="close"
      />
    </header>
    <section class="modal-card-body">
      <field>
        <label for="week of" class="label">Week Of</label>
        <!-- bind users input for the Week Of Date to the createWeekOfDate state var -->
        <input
          bind:value={createWeekOfDate}
          type="date"
          class="input"
          placeholder="yyyy-mm-dd"
        />
      </field>
    </section>
    <footer class="modal-card-foot">
      <button class="button is-success" on:click={() => createLunchWeek()}
        >Continue</button
      >
      <button class="button" on:click={() => (showCreateModal = false)}
        >Cancel</button
      >
    </footer>
  </div>
</div>

<style>
  .clickable {
    cursor: pointer;
  }
</style>
