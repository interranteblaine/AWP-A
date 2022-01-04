const router = require('express').Router()
module.exports = router

router.use('/users', require('./users'))
router.use('/symbols', require('./symbols'))
router.use('/portfolio', require('./portfolio'))
router.use('/dates', require('./dates'))

router.use((req, res, next) => {
  const error = new Error('Not Found')
  error.status = 404
  next(error)
})
