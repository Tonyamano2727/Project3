const router = require('express').Router()
const ctrls = require('../controllers/hotdistric')
const {verifyToken , isAdmin} = require('../middlewares/verifyToken')


router.post('/createhotdistric',[verifyToken, isAdmin], ctrls.createHotDistrict)
router.delete('/deletedhotdistric/:did',[verifyToken, isAdmin],ctrls.deleteHotDistrict)


module.exports = router