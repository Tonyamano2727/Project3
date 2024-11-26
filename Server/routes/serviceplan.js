const router = require('express').Router()
const ctrls = require('../controllers/planservice')
const {verifyToken , isAdmin} = require('../middlewares/verifyToken')
const uploader = require('../config/cloudinary.cofig')

router.post('/createserviceplan',[verifyToken, isAdmin],uploader.fields([{name : 'images' , maxCount:10},{name: 'thumb' , maxCount:1}]), ctrls.createserviceplan)
router.delete('/deletedserviceplan/:sid',[verifyToken, isAdmin],ctrls.deleteServiceplan)
router.put('/updateserviceplan/:sid',uploader.fields([{name : 'images' , maxCount:10},{name: 'thumb' , maxCount:1}]),[verifyToken, isAdmin],ctrls.updateServiceplan)
router.get('/',ctrls.getAllServiceplans)
router.get('/:sid',ctrls.getOneServiceplan)

module.exports = router