<script>
  import { user } from '../../stores.js'
  import { onMount } from 'svelte'
  import axios from '../../axios-global'
  import Icon from 'svelte-awesome'
  import { refresh } from 'svelte-awesome/icons'
  import { add, parseISO, format } from 'date-fns'

  export let currentRoute
  let routeLunchWeekId = currentRoute.namedParams.lunchWeekId
  let lunchWeek = {
    lunchDays: [],
  } // the LunchWeek state variable
  let loading = true
  let saving = false
  let publishing = false

  const seedLunchDays = () => {
    // Convert ISO formatted LunchWeek.weekOf date into a date object
    const weekOfDate = parseISO(lunchWeek.weekOf)
    for (let i = 0; i < 5; i++) {
      const calculatedDay = add(weekOfDate, { days: i })
      const formattedDay = format(calculatedDay, 'yyyy-MM-dd')

      // if LunchWeek.LunchDays list already has that day from the server
      // continue
      if (lunchWeek.lunchDays.some((x) => x.day === formattedDay)) {
        continue
      }
      const lunchDay = {
        day: formattedDay,
        lunchWeekId: lunchWeek.lunchWeekId,
        menuDetails: null,
      }

      lunchWeek.lunchDays.splice(i, 0, lunchDay)
    }
  }

  const save = async () => {
    saving = true // state for buttons
    for (let i = 0; i < lunchWeek.lunchDays.length; i++) {
      const lunchDay = lunchWeek.lunchDays[i]
      // if the item has an id, do a PUT
      if (lunchDay.lunchDayId) {
        await axios.put(
          `${process.env.API_ROOT}/api/lunch-week/${routeLunchWeekId}/lunch-day/${lunchDay.lunchDayId}`,
          lunchDay
        )
      } else {
        // else POST and assign the resulting ID
        const response = await axios.post(
          `${process.env.API_ROOT}/api/lunch-week/${routeLunchWeekId}/lunch-day`,
          lunchDay
        )
        lunchDay.lunchDayId = response.data.lunchDayId
      }
    }
    saving = false
    return
  }

  const togglePublish = async () => {
    publishing = true // state for button
    // stringify and parse to copy the lunchWeek object
    let lunchWeekPayload = JSON.parse(JSON.stringify(lunchWeek))

    // update the isPublished flag
    lunchWeekPayload.isPublished = !lunchWeek.isPublished

    // remove the lunchDays list (this doesn exist in the database lunch_week table)
    delete lunchWeekPayload.lunchDays

    await axios.put(
      `${process.env.API_ROOT}/api/lunch-week/${routeLunchWeekId}`,
      lunchWeekPayload
    )

    // update state after successfully updated backend
    lunchWeek.isPublished = !lunchWeek.isPublished
    publishing = false // state for button
    return
  }

  const getPublicLink = () => {
    const schoolPath = $user.schoolName.toLowerCase().replace(/ /g, '-')
    return `${window.location.origin}/lunch-menu/${schoolPath}/${lunchWeek.weekOf}`
  }

  onMount(async () => {
    try {
      const response = await axios.get(
        `${process.env.API_ROOT}/api/lunch-week/${routeLunchWeekId}`
      )
      lunchWeek = response.data
      seedLunchDays()
      loading = false
    } catch (e) {
      console.error(e)
    }
  })
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

  {#if loading}
    <div class="section">
      <Icon spin data={refresh} scale="3" />
    </div>
  {:else}
    <section>
      <div class="buttons">
        <button
          class={saving
            ? 'button is-link is-small is-loading'
            : 'button is-link is-small'}
          on:click={() => save()}>Save</button
        >
        <button
          class={publishing
            ? 'button is-link is-small is-loading'
            : 'button is-link is-small'}
          on:click={() => togglePublish()}
        >
          {lunchWeek.isPublished ? 'Unpublish' : 'Publish'}
        </button>
        <div class="dropdown is-hoverable">
          <div class="dropdown-trigger">
            <button class="buton is-link is-small">Link</button>
          </div>
          <div class="dropdown-menu" id="link-dropdown-menu">
            <div class="dropdown-content">
              <div class="dropdown-item">
                <p>Public Lunch Menu Link</p>
                <p class="mt-2">
                  <a href={getPublicLink()} target="_blank">{getPublicLink()}</a
                  >
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
    <section class="mt-2">
      <div class="columns">
        {#each lunchWeek.lunchDays as lunchDay}
          <div class="column">
            <div class="field">
              <label for="lunchday" class="label"
                >{format(parseISO(lunchDay.day), 'EEE MM/dd/yyyy')}</label
              >
              <div class="control">
                <textarea
                  bind:value={lunchDay.menuDetails}
                  class="textarea"
                  rows="10"
                />
              </div>
            </div>
          </div>
        {/each}
      </div>
    </section>
  {/if}
</div>
