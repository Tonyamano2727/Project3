const router = require('express').Router()
const ctrls = require('../controllers/counsel')
const {verifyToken , isAdmin} = require('../middlewares/verifyToken')

router.post('/createcounsel', ctrls.createCounsel)
router.get('/getallcounsel', ctrls.getAllCounsels)
router.put('/updatecounsel/:cid', ctrls.updateCounsel)


module.exports = router