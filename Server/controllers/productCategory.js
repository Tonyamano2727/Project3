const productCategory = require('../models/productCategory')
const asyncHandler = require('express-async-handler')


const createCategory = asyncHandler(async(req, res)=>{
    const response = await productCategory.create(req.body)
    return res.json({
        success : response ? true : false,
        createCategory: response ? response : 'Cannot create category products'
    })
})

const getallCategory = asyncHandler(async(req, res)=>{
    const response = await productCategory.find().select('title _id brand')
    return res.json({
        success : response ? true : false,
        getallCategory: response ? response : 'Cannot create category products'
    })
})

const updateCategory = asyncHandler(async(req, res)=>{
    const {pcid} = req.params
    const response = await productCategory.findByIdAndUpdate(pcid , req.body, {new:true})
    return res.json({
        success : response ? true : false,
        updateCategory: response ? response : 'Cannot create category products'
    })
})

const deleteCategory = asyncHandler(async(req, res)=>{
    const {pcid} = req.params
    const response = await productCategory.findByIdAndDelete(pcid)
    return res.json({
        success : response ? true : false,
        deleteCategory: response ? response : 'Cannot create category products'
    })
})
module.exports = {
    createCategory,
    getallCategory,
    updateCategory,
    deleteCategory
}