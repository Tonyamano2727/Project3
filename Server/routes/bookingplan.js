const router = require('express').Router()
const ctrls = require('../controllers/bookingplan')
const {verifyToken , isAdmin , isSupervisor} = require('../middlewares/verifyToken')


router.get('/getbookingplan',[verifyToken , isSupervisor], ctrls.getBookings)  
router.get('/getbookingplan/:id',[verifyToken , isSupervisor], ctrls.getBookingDetail)  
router.post('/createbookingplan', ctrls.createBookingPlan)
router.put('/updatebookingplan/:id',[verifyToken , isSupervisor],ctrls.updateBooking)
router.get('/getallbookingplan',[verifyToken , isAdmin], ctrls.getAllBookings) 




module.exports = router