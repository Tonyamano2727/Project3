const router = require('express').Router()
const ctrls = require('../controllers/blogCategory')
const {verifyToken , isAdmin} = require('../middlewares/verifyToken')

router.post('/',[verifyToken,isAdmin], ctrls.createBlogCategory)
router.get('/', ctrls.getallBlogCategory)
router.put('/:bcid',[verifyToken,isAdmin], ctrls.updateBlogCategory)
router.delete('/:bcid',[verifyToken,isAdmin], ctrls.deleteBlogCategory)

module.exports = router