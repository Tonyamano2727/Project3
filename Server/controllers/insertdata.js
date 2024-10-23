const asyncHandler = require('express-async-handler')
const data = require('../../data/data2.json')
const slugify = require('slugify')
const Product = require('../models/products')
const categoryData = require('../../data/cate_brand')
const productCategory = require('../models/productCategory')

const fn = async (Products) => {
    await Product.create({
        title : Products?.name,
        slug: slugify(Products?.name) + Math.round(Math.random() * 1000 ) + '',
        description:  Products?.description,
        brand: Products?.brand,
        price: Math.round(Number(Products?.price.match(/\d/g).join(''))/100),
        category: Products?.category[1],
        quantity: Math.round(Math.random() * 1000 ),
        sold: Math.round(Math.random() * 1000 ),
        images: Products?.images,
        color: Products?.variants?.find(el => el.label === 'Color')?.variants[0],
        thumb:Products?.thumb,
        totalRatings : Math.round(Math.random() * 5)
    })
}

const insertdataproducts = asyncHandler(async(req, res)=>{
    const promises = []
    for(let product of data) promises.push(fn(product))
    await Promise.all(promises)
    return res.json('Done')
})

const fn2 = async (cate) => {
    await productCategory.create({
        title: cate?.cate,
        brand: cate?.brand
    })
}

const insertcategoryproducts = asyncHandler(async(req, res)=>{
    const promises = []
    // console.log(Categoryproduct);
    for(let cate of categoryData) promises.push(fn2(cate))
    await Promise.all(promises)
    return res.json('Done')
})

module.exports = {
    insertdataproducts,
    insertcategoryproducts
}
