const router = require('express').Router()
const ctrls = require('../controllers/salary')
const {verifyToken, isSupervisor} = require('../middlewares/verifyToken')
const uploader = require('../config/cloudinary.cofig')


router.post('/salary/:employeeId',[verifyToken,isSupervisor], ctrls.calculateSalary)
router.get('/', ctrls.getAllSalaries)


module.exports = router

