const productBlogCategory = require('../models/blogCategory')
const asyncHandler = require('express-async-handler')


const createBlogCategory = asyncHandler(async(req, res)=>{
    const response = await productBlogCategory.create(req.body)
    return res.json({
        success : response ? true : false,
        createCategory: response ? response : 'Cannot create BlogCategory products'
    })
})

const getallBlogCategory = asyncHandler(async(req, res)=>{
    const response = await productBlogCategory.find().select('title _id')
    return res.json({
        success : response ? true : false,
        getallBlogCategory: response ? response : 'Cannot create BlogCategory products'
    })
})

const updateBlogCategory = asyncHandler(async(req, res)=>{
    const {bcid} = req.params
    const response = await productBlogCategory.findByIdAndUpdate(bcid , req.body, {new:true})
    return res.json({
        success : response ? true : false,
        updateBlogCategory: response ? response : 'Cannot create BlogCategory products'
    })
})

const deleteBlogCategory = asyncHandler(async(req, res)=>{
    const {bcid} = req.params
    const response = await productBlogCategory.findByIdAndDelete(bcid)
    return res.json({
        success : response ? true : false,
        deleteBlogCategory: response ? response : 'Cannot create BlogCategory products'
    })
})
module.exports = {
    createBlogCategory,
    getallBlogCategory,
    updateBlogCategory,
    deleteBlogCategory
}