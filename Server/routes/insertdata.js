const router = require('express').Router()
const ctrls = require('../controllers/insertdata')

router.post('/',ctrls.insertdataproducts)
router.post('/category',ctrls.insertcategoryproducts)



module.exports = router