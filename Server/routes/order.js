const router = require('express').Router()
const ctrls = require('../controllers/order')
const {verifyToken , isAdmin} = require('../middlewares/verifyToken')

router.post('/', verifyToken , ctrls.createOrder)
router.put('/status/:oid', verifyToken, isAdmin , ctrls.updateStatusorder)
router.get('/',verifyToken, ctrls.getUserOrder)
router.get('/getorderadmin', verifyToken, ctrls.getOrderbyAdmin)
module.exports = router