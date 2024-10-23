const router = require('express').Router()
const ctrls = require('../controllers/booking')
const {verifyToken , isAdmin , isSupervisor} = require('../middlewares/verifyToken')


router.get('/getbooking',[verifyToken , isSupervisor], ctrls.getBookings)  
router.get('/getbooking/:bkid',[verifyToken , isSupervisor], ctrls.getBookingDetail)  
router.post('/createbooking', ctrls.createBooking)
router.put('/updatebooking/:bkid',[verifyToken , isSupervisor],ctrls.updateBooking)
router.get('/getallbooking',[verifyToken , isAdmin], ctrls.getAllBookings) 




module.exports = router