const router = require('express').Router()
const ctrls = require('../controllers/blog')
const {verifyToken , isAdmin} = require('../middlewares/verifyToken')
const uploader = require('../config/cloudinary.cofig')

router.get('/',ctrls.getallBlog)
router.get('/getoneblogs/:bid',ctrls.getBlog)
router.post('/createblog' , [verifyToken, isAdmin],uploader.fields([{name : 'images' , maxCount:10},{name: 'thumb' , maxCount:1}]),ctrls.createNewBlog)

router.post('/createcommentblog/:bid' ,[verifyToken],ctrls.addReview)
// router.put('/image/:bid' , [verifyToken, isAdmin],uploader.single('image'), ctrls.uploadImagesBlog)
router.put('/likes/:bid' , [verifyToken],ctrls.likeBlog)
router.put('/dislikes/:bid' , [verifyToken],ctrls.dislikeBlog)
router.put('/updateblog/:bid' , [verifyToken, isAdmin],uploader.fields([{name : 'images' , maxCount:10},{name: 'thumb' , maxCount:1}]),ctrls.updateBlog)
router.delete('/:bid' , [verifyToken, isAdmin],ctrls.deleteBlog)


module.exports = router
