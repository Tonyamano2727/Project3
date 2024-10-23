const router = require('express').Router()
const ctrls = require('../controllers/service')
const {verifyToken , isAdmin} = require('../middlewares/verifyToken')
const uploader = require('../config/cloudinary.cofig')

router.post('/createservice',[verifyToken, isAdmin],uploader.fields([{name : 'images' , maxCount:10},{name: 'thumb' , maxCount:1}]), ctrls.createservice)
router.delete('/deletedservice/:sid',[verifyToken, isAdmin],ctrls.deleteService)
router.put('/updateservice/:sid',uploader.fields([{name : 'images' , maxCount:10},{name: 'thumb' , maxCount:1}]),[verifyToken, isAdmin],ctrls.updateService)
router.get('/',ctrls.getAllServices)
router.get('/:sid',ctrls.getOneService)

module.exports = router