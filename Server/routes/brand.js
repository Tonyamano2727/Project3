const router = require('express').Router()
const ctrls = require('../controllers/brand')
const {verifyToken , isAdmin} = require('../middlewares/verifyToken')

router.post('/',[verifyToken,isAdmin], ctrls.createnewBrand)
router.get('/', ctrls.getallBrand)
router.put('/:bid',[verifyToken,isAdmin], ctrls.updateBrand)
router.delete('/:bid',[verifyToken,isAdmin], ctrls.deleteBrand)

module.exports = router