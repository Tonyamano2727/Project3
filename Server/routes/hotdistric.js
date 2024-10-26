const router = require('express').Router()
const ctrls = require('../controllers/hotdistric')
const {verifyToken , isAdmin} = require('../middlewares/verifyToken')


router.post('/createhotdistric',[verifyToken, isAdmin], ctrls.createHotDistrict)
router.get('/', ctrls.getAllHotDistricts)
router.delete('/deletedhotdistric/:did',[verifyToken, isAdmin],ctrls.deleteHotDistrict)
router.put('/updatehotdistric/:did',[verifyToken, isAdmin],ctrls.updateHotDistrict)


module.exports = router