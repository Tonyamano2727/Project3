const router = require('express').Router()
const ctrls = require('../controllers/productCategory')
const {verifyToken , isAdmin} = require('../middlewares/verifyToken')

router.post('/',[verifyToken,isAdmin], ctrls.createCategory)
router.get('/', ctrls.getallCategory)
router.put('/:pcid',[verifyToken,isAdmin], ctrls.updateCategory)
router.delete('/:pcid',[verifyToken,isAdmin], ctrls.deleteCategory)

module.exports = router