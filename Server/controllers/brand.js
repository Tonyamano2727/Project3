const Brand = require('../models/brand')
const asyncHandler = require('express-async-handler')


const createnewBrand = asyncHandler(async(req, res)=>{
    const response = await Brand.create(req.body)
    return res.json({
        success : response ? true : false,
        createBrand: response ? response : 'Cannot create Brand products'
    })
})

const getallBrand = asyncHandler(async(req, res)=>{
    const response = await Brand.find()
    return res.json({
        success : response ? true : false,
        getallBrands: response ? response : 'Cannot get all Brand products'
    })
})

const updateBrand = asyncHandler(async(req, res)=>{
    const {bid} = req.params
    const response = await Brand.findByIdAndUpdate(bid , req.body, {new:true})
    return res.json({
        success : response ? true : false,
        updateBrand: response ? response : 'Cannot create BlogCategory products'
    })
})

const deleteBrand = asyncHandler(async(req, res)=>{
    const {bid} = req.params
    const response = await Brand.findByIdAndDelete(bid)
    return res.json({
        success : response ? true : false,
        deleteBrand: response ? response : 'Cannot create BlogCategory products'
    })
})
module.exports = {
    createnewBrand,
    getallBrand,
    updateBrand,
    deleteBrand
}