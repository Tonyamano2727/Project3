const router = require('express').Router()
const ctrls = require('../controllers/products')
const {verifyToken , isAdmin} = require('../middlewares/verifyToken')
const uploader = require('../config/cloudinary.cofig')

router.post('/',[verifyToken, isAdmin],uploader.fields([{name : 'images' , maxCount:10},{name: 'thumb' , maxCount:1}]), ctrls.createproducts)
router.get('/', ctrls.getallproducts)
router.put('/ratings',[verifyToken], ctrls.ratings)

router.put('/uploadimage/:pid',[verifyToken, isAdmin], uploader.array('images', 10) , ctrls.uploadImagesProduct) 
router.delete('/:pid',[verifyToken, isAdmin], ctrls.deleteProduct)
router.get('/:pid', ctrls.getproduct)
router.put('/:pid',[verifyToken,isAdmin],uploader.fields([{name : 'images' , maxCount:10},{name: 'thumb' , maxCount:1}]), ctrls.updateProduct)
module.exports = router