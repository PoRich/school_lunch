var express = require('express')
var router = express.Router()
let knex

// Create a helper function to select all the rows from the
// lunch_week table
const createLunchWeek = (lunchWeek) => {
  return knex('lunch_week').insert(lunchWeek).returning('lunch_week_id')
}

const getLunchWeekList = () => {
  return knex.select().from('lunch_week').orderBy('week_of')
}

const getLunchWeekById = (id) => {
  return knex.select().from('lunch_week').where('lunch_week_id', id).first()
}

const updateLunchWeek = (id, lunchWeek) => {
  return knex('lunch_week').where('lunch_week_id', id).update(lunchWeek)
}

const deleteLunchWeek = (lunchWeekId) => {
  return knex('lunch_week').where('lunch_week_id', lunchWeekId).del()
}

// lunch_day table
const createLunchDay = (lunchDay) => {
  return knex('lunch_day').insert(lunchDay).returning('lunch_day_id')
}

const getLunchDayList = (lunchWeekId) => {
  return knex
    .select()
    .from('lunch_day')
    .where('lunch_week_id', lunchWeekId)
    .orderBy('day')
}

const getLunchDayById = (lunchDayid) => {
  return knex
    .select()
    .from('lunch_day')
    .where('lunch_day_id', lunchDayid)
    .first()
}

const updateDay = (id, lunchDay) => {
  return knex('lunch_day').where('lunch_day_id', id).update(lunchDay)
}

const deleteLunchDay = (lunchDayId) => {
  return knex('lunch_day').where('lunch_day_id', lunchDayId).del()
}

// Call the helper function in our endpoint. Knex database queries
// return Promises, so the `await` keyword needs to be used in combination with
// `async function`
router.post('/', async function (req, res) {
  knex = req.knex
  const lunchWeek = req.body
  try {
    const insertResponse = await createLunchWeek(lunchWeek)
    const insertedLunchWeekId = insertResponse[0] // response is an array
    const response = {
      lunchWeekId: insertedLunchWeekId,
    }
    res.send(response)
  } catch (e) {
    const message = `Error creating Lunch Week`
    res.status(500).send({ message: message, error: e.toString() })
  }
})

router.get('/', async function (req, res) {
  knex = req.knex
  try {
    const lunchWeekList = await getLunchWeekList()
    res.send(lunchWeekList)
  } catch (e) {
    res
      .status(500)
      .send({ message: `Error getting Lunch Week List`, error: e.toString() })
  }
})

router.get('/:lunchWeekId', async function (req, res) {
  knex = req.knex
  try {
    const id = parseInt(req.params.lunchWeekId)
    const lunchWeek = await getLunchWeekById(id)
    if (lunchWeek) {
      let lunchDays = await getLunchDayList(id) //fetch the lunch days list
      lunchWeek.lunchDays = lunchDays // set lunchDays as a property on the lunchWeek object
      res.send(lunchWeek)
    } else {
      const message = `Lunch Week Id ${req.params.lunchWeekId} not found`
      res.status(404).send({
        message: message,
      })
    }
  } catch (e) {
    const message = `Error getting Lunch Week Id ${req.params.lunchWeekId}`
    res.status(500).send({
      message: message,
      error: e.toString(),
    })
  }
})

router.put('/:lunchWeekId', async function (req, res) {
  knex = req.knex
  try {
    const id = parseInt(req.params.lunchWeekId)
    const lunchWeek = req.body

    if (id !== lunchWeek.lunchWeekId) {
      const message = `Bad request, IDs do not match`
      res.status(400).send({ message: message })
      // IMPORTANT, we need to explicitly return here, otherwise the rest
      // of the endpoint code will continue to run.
      // In other words, res.send does not return like you might think it would
      return
    }

    await updateLunchWeek(id, lunchWeek)
    res.send()
  } catch (e) {
    const message = `Error updating Lunch Week`
    res.status(500).send({ message: message, error: e.toString() })
  }
})

router.delete('/:lunchWeekId', async function (req, res) {
  knex = req.knex
  try {
    const id = parseInt(req.params.lunchWeekId)
    await deleteLunchWeek(id)
    res.send()
  } catch (e) {
    const message = `Error deleting Lunch Week`
    res.status(500).send({ message: message, error: e.toString() })
  }
})

// Call the helper function in our endpoint. Knex database queries
// return Promises, so the `await` keyword needs to be used in combination with
// `async function`
router.post('/:lunchWeekId/lunch-day', async function (req, res) {
  knex = req.knex
  const lunchDay = req.body
  const lunchWeekId = parseInt(req.params.lunchWeekId)

  if (lunchWeekId !== lunchDay.lunchWeekId) {
    const message = `Bad request, lunchWeekIds do not match`
    res.status(400).send({ message: message })
    return
  }

  try {
    const insertResponse = await createLunchDay(lunchDay)
    const insertedLunchDayId = insertResponse[0] // response is an array
    const response = {
      lunchDayId: insertedLunchDayId,
    }
    res.send(response)
  } catch (e) {
    const message = `Error creating Lunch Day`
    res.status(500).send({ message: message, error: e.toString() })
  }
})

router.get('/:lunchWeekId/lunch-day', async function (req, res) {
  knex = req.knex
  const lunchWeekId = parseInt(req.params.lunchWeekId)
  try {
    const lunchDayList = await getLunchDayList(lunchWeekId)
    res.send(lunchDayList)
    return
  } catch (e) {
    res
      .status(500)
      .send({ message: `Error getting Lunch Day List`, error: e.toString() })
    return
  }
})

router.get('/:lunchWeekId/lunch-day/:lunchDayId', async function (req, res) {
  knex = req.knex
  const lunchDayId = parseInt(req.params.lunchDayId)

  try {
    const lunchDay = await getLunchDayById(lunchDayId)
    res.send(lunchDay)
    return
  } catch (e) {
    res
      .status(500)
      .send({ message: `Error getting Lunch Day`, error: e.toString() })
    return
  }
})

router.put('/:lunchWeekId/lunch-day/:lunchDayId', async function (req, res) {
  knex = req.knex
  try {
    const lunchWeekId = parseInt(req.params.lunchWeekId)
    const lunchDayId = parseInt(req.params.lunchDayId)
    const lunchDay = req.body

    if (lunchWeekId !== lunchDay.lunchWeekId) {
      const message = `Bad request, lunchWeekIds do not match`
      res.status(400).send({ message: message })
      // IMPORTANT, we need to explicitly return here, otherwise the rest
      // of the endpoint code will continue to run.
      // In other words, res.send does not return like you might think it would
      return
    } else if (lunchDayId !== lunchDay.lunchDayId) {
      const message = `Bad request, lunchDayIds do not match`
      res.status(400).send({ message: message })
      // IMPORTANT, we need to explicitly return here, otherwise the rest
      // of the endpoint code will continue to run.
      // In other words, res.send does not return like you might think it would
      return
    }

    await updateDay(lunchDayId, lunchDay)
    res.send()
  } catch (e) {
    const message = `Error updating Lunch Day`
    res.status(500).send({ message: message, error: e.toString() })
  }
})

router.delete('/:lunchWeekId/lunch-day/:lunchDayId', async function (req, res) {
  knex = req.knex
  try {
    const lunchDayId = parseInt(req.params.lunchDayId)
    await deleteLunchDay(lunchDayId)
    res.send()
  } catch (e) {
    const message = `Error deleting Lunch Day`
    res.status(500).send({ message: message, error: e.toString() })
  }
})

module.exports = router
