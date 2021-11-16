const express = require('express')
const router = express.Router()
const { passKnexPublic } = require('../database/dynamic-knex')

let tenantKnex

const getLunchWeek = async (weekOf) => {
  // get the lunchWeek row for the given weekOf where published is true
  let lunchWeek = await tenantKnex
    .select()
    .from('lunch_week')
    .where({ weekOf: weekOf, is_published: true })
    .first() // returns object, not array

  if (lunchWeek) {
    const lunchDays = await tenantKnex
      .select()
      .from('lunch_day')
      .where({ lunch_week_id: lunchWeek.lunchWeekId })
    // Nest lunchDays
    lunchWeek.lunchDays = lunchDays
  }
  return lunchWeek
}

router.get('/:schoolName/:weekOf', passKnexPublic, async function (req, res) {
  try {
    tenantKnex = req.knex
    const weekOf = req.params.weekOf
    const lunchWeek = await getLunchWeek(weekOf)

    if (lunchWeek) {
      res.send(lunchWeek)
    } else {
      res.status(404).send({
        message: `No menu has been published for the week of ${weekOf}`,
      })
    }
  } catch (e) {
    console.log(e)
    res
      .status(500)
      .send({ message: 'Error getting lunch week', error: e.toString() })
  }
})

module.exports = router
