var express = require('express')
var router = express.Router()

const lunchWeekList = [
  {
    lunchWeekId: 1,
    weekOf: '2020-10-05',
    isPublished: false,
    lunchDays: [
      {
        lunchDayId: 1,
        lunchWeekId: 1,
        day: '2020-10-05',
        menuDetails:
          'Beef tacos or cheese quesadillas with apple slices, rice and black beans',
      },
      {
        lunchDayId: 2,
        lunchWeekId: 1,
        day: '2020-10-06',
        menuDetails: 'Cheese or pepperoni pizza with grapes and celery sticks',
      },
    ],
  },
  {
    lunchWeekId: 2,
    weekOf: '2020-10-12',
    isPublished: true,
  },
  {
    lunchWeekId: 3,
    weekOf: '2020-10-19',
    isPublished: false,
  },
]

router.get('/', function (req, res) {
  res.send(lunchWeekList)
})

router.get('/:lunchWeekId', function (req, res) {
  const id = parseInt(req.params.lunchWeekId)
  const lunchWeek = lunchWeekList.find((x) => x.lunchWeekId === id)
  if (lunchWeek) {
    res.send(lunchWeek)
  } else {
    res.status(404).send()
  }
})
module.exports = router
