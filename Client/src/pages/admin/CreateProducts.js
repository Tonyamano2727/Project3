import React, { useState } from 'react';
import { apiCreateProduct } from "../../apis";

const CreateProducts = () => {
  const [products, setProducts] = useState([
    { title: '', price: '', description: '', brand: '', category: '', color: '', thumb: null, images: [], thumbPreview: null, imagePreviews: [] }
  ]);

  const handleChange = (index, e) => {
    const { name, value } = e.target;
    const newProducts = [...products];
    newProducts[index][name] = value;
    setProducts(newProducts);
  };

  const handleFileChange = (index, e) => {
    const { name } = e.target;
    const newProducts = [...products];

    if (name === 'thumb') {
      const file = e.target.files[0];
      newProducts[index].thumb = file;
      newProducts[index].thumbPreview = URL.createObjectURL(file);
    } else if (name === 'images') {
      const files = Array.from(e.target.files);
      newProducts[index].images = files;
      newProducts[index].imagePreviews = files.map((file) => URL.createObjectURL(file));
    }

    setProducts(newProducts);
  };

  const addProduct = () => {
    setProducts([...products, { title: '', price: '', description: '', brand: '', category: '', color: '', thumb: null, images: [], thumbPreview: null, imagePreviews: [] }]);
  };

  const deleteProduct = (index) => {
    const newProducts = products.filter((_, i) => i !== index);
    setProducts(newProducts);
  };

  const deleteThumb = (index) => {
    const newProducts = [...products];
    newProducts[index].thumb = null;
    newProducts[index].thumbPreview = null;
    setProducts(newProducts);
  };

  const deleteImage = (productIndex, imageIndex) => {
    const newProducts = [...products];
    newProducts[productIndex].images.splice(imageIndex, 1);
    newProducts[productIndex].imagePreviews.splice(imageIndex, 1);
    setProducts(newProducts);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    products.forEach((product, index) => {
      formData.append(`products[${index}][title]`, product.title);
      formData.append(`products[${index}][price]`, product.price);
      formData.append(`products[${index}][description]`, product.description);
      formData.append(`products[${index}][brand]`, product.brand);
      formData.append(`products[${index}][category]`, product.category);
      formData.append(`products[${index}][color]`, product.color);
  
      if (product.thumb) {
        formData.append(`thumb${index}`, product.thumb);
      }
      product.images.forEach((image) => {
        formData.append(`images${index}[]`, image);
      });
    });
  
    try {
      const response = await apiCreateProduct(formData);
      console.log(response.data);
    } catch (error) {
      console.error("Error creating products:", error.response.data);
    }
  };

  return (
    <div>
      <form  onSubmit={handleSubmit}>
        {products.map((product, index) => (
          <div key={index} className="gap-5">
            <h2>Product {index + 1}</h2>
            <input type="text" name="title" placeholder="Title" value={product.title} onChange={(e) => handleChange(index, e)} required />
            <input type="number" name="price" placeholder="Price" value={product.price} onChange={(e) => handleChange(index, e)} required />
            <textarea name="description" placeholder="Description" value={product.description} onChange={(e) => handleChange(index, e)} required />
            <input type="text" name="brand" placeholder="Brand" value={product.brand} onChange={(e) => handleChange(index, e)} required />
            <input type="text" name="category" placeholder="Category" value={product.category} onChange={(e) => handleChange(index, e)} required />
            <input type="text" name="color" placeholder="Color" value={product.color} onChange={(e) => handleChange(index, e)} required />

            <input type="file" name="thumb" onChange={(e) => handleFileChange(index, e)} required />
            {product.thumbPreview && (
              <div>
                <img src={product.thumbPreview} alt="Thumbnail Preview" style={{ width: '100px', height: '100px' }} />
                <button type="button" onClick={() => deleteThumb(index)}>Delete Thumb</button>
              </div>
            )}

            <input type="file" name="images" multiple onChange={(e) => handleFileChange(index, e)} required />
            <div className="image-previews">
              {product.imagePreviews.map((preview, i) => (
                <div key={i} style={{ display: 'inline-block', position: 'relative' }}>
                  <img src={preview} alt={`Image Preview ${i + 1}`} style={{ width: '100px', height: '100px', marginRight: '5px' }} />
                  <button type="button" onClick={() => deleteImage(index, i)} style={{ position: 'absolute', top: 0, right: 0 }}>X</button>
                </div>
              ))}
            </div>

            {products.length > 1 && (
              <button type="button" onClick={() => deleteProduct(index)}>Delete</button>
            )}
          </div>
        ))}
        <button type="button" onClick={addProduct}>Add Another Product</button>
        <button type="submit">Create Products</button>
      </form>
    </div>
  );
};

export default CreateProducts;
