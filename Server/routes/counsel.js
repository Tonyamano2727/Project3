const router = require('express').Router()
const ctrls = require('../controllers/counsel')
const {verifyToken , isAdmin} = require('../middlewares/verifyToken')

router.post('/createcounsel', ctrls.createCounsel)


module.exports = router