import React, { useState, useEffect } from "react";
import { apiCreateProduct, apiGetCategories } from "../../apis";
import { Button } from "../../components";

const CreateProducts = () => {
  const [products, setProducts] = useState([
    {
      title: "",
      price: "",
      description: "",
      brand: "",
      quantity: "",
      category: "",
      categoryTitle: "",
      color: "",
      thumb: null,
      images: [],
      thumbPreview: null,
      imagePreviews: [],
    },
  ]);

  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState({});

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await apiGetCategories();
        setCategories(response.getallCategory);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    fetchCategories();
  }, []);

  const handleChange = (index, e) => {
    const { name, value } = e.target;
    const newProducts = [...products];
    newProducts[index][name] = value;

    if (name === "category") {
      const selectedCategory = categories.find((cat) => cat._id === value);
      if (selectedCategory) {
        newProducts[index].brand = "";
        newProducts[index].categoryTitle = selectedCategory.title;
        setBrands((prevBrands) => ({
          ...prevBrands,
          [value]: selectedCategory.brand || [],
        }));
      }
    }

    setProducts(newProducts);
  };

  const handleFileChange = (index, e) => {
    const { name } = e.target;
    const newProducts = [...products];

    if (name === "thumb") {
      const file = e.target.files[0];
      newProducts[index].thumb = file;
      newProducts[index].thumbPreview = URL.createObjectURL(file);
    } else if (name === "images") {
      const files = Array.from(e.target.files);
      newProducts[index].images = files;
      newProducts[index].imagePreviews = files.map((file) =>
        URL.createObjectURL(file)
      );
    }

    setProducts(newProducts);
  };

  const addProduct = () => {
    setProducts([
      ...products,
      {
        title: "",
        price: "",
        description: "",
        brand: "",
        category: "",
        categoryTitle: "",
        color: "",
        quantity: "",
        thumb: null,
        images: [],
        thumbPreview: null,
        imagePreviews: [],
      },
    ]);
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
      formData.append(`products[${index}][category]`, product.categoryTitle);
      formData.append(`products[${index}][color]`, product.color);
      formData.append(`products[${index}][quantity]`, product.quantity);

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
    <div className="w-[85%] border bg-white rounded-2xl p-5 flex flex-col items-center">
      <h1 className="font-bold text-2xl mb-5">Create Products</h1>
      <form onSubmit={handleSubmit} className="w-full space-y-6">
        {products.map((product, index) => (
          <div
            key={index}
            className="w-full flex flex-col items-start p-4 mb-5 shadow-sm">
            <div className="flex w-full justify-between items-center mb-4">
              <h2 className="font-semibold text-lg">Product {index + 1}</h2>
              {products.length > 1 && (
                <button
                  type="button"
                  onClick={() => deleteProduct(index)}
                  className="px-4 py-1 text-white bg-red-600 rounded-full">
                  Delete Product
                </button>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full">
              <input
                className="border p-2 rounded-3xl w-full"
                type="text"
                name="title"
                placeholder="Title"
                value={product.title}
                onChange={(e) => handleChange(index, e)}
                required
              />
              <input
                className="border p-2 rounded-3xl w-full"
                type="number"
                name="price"
                placeholder="Price"
                value={product.price}
                onChange={(e) => handleChange(index, e)}
                required
              />
              <input
                className="border p-2 rounded-3xl w-full"
                type="number"
                name="quantity"
                placeholder="Quantity"
                value={product.quantity}
                onChange={(e) => handleChange(index, e)}
                required
              />
              <input
                className="border p-2 rounded-3xl w-full"
                type="text"
                name="color"
                placeholder="Color"
                value={product.color}
                onChange={(e) => handleChange(index, e)}
                required
              />
              <select
                className="border p-2 rounded-3xl w-full"
                name="category"
                value={product.category}
                onChange={(e) => handleChange(index, e)}
                required>
                <option value="">Select Category</option>
                {categories.map((category) => (
                  <option key={category._id} value={category._id}>
                    {category.title}
                  </option>
                ))}
              </select>
              <select
                className="border p-2  rounded-3xl w-full"
                name="brand"
                value={product.brand}
                onChange={(e) => handleChange(index, e)}
                required>
                <option value="">Select Brand</option>
                {brands[product.category]?.map((brand, i) => (
                  <option key={i} value={brand}>
                    {brand}
                  </option>
                ))}
              </select>
            </div>

            <textarea
              className="border p-2  rounded-3xl w-full mt-4"
              name="description"
              placeholder="Description"
              value={product.description}
              onChange={(e) => handleChange(index, e)}
              required
            />

            <div className="flex justify-around items-center w-full">
              <div className="flex flex-col mt-4">
                <label className="border  rounded-3xl px-4 py-2 cursor-pointer text-center mb-2 sm:mb-0">
                  Thumbnail
                  <input
                    type="file"
                    name="thumb"
                    onChange={(e) => handleFileChange(index, e)}
                    className="hidden"
                    required
                  />
                </label>
                {product.thumbPreview && (
                  <div className="flex flex-col items-center">
                    <img
                      src={product.thumbPreview}
                      alt="Thumbnail Preview"
                      className="w-24 h-24 object-cover rounded"
                    />
                    <button
                      type="button"
                      onClick={() => deleteThumb(index)}
                      className="text-red-600 mt-1">
                      Delete Thumb
                    </button>
                  </div>
                )}
              </div>

              <div className="flex flex-col  mt-4">
                <label className="border rounded-3xl px-4 py-2 cursor-pointer text-center">
                  Additional Images
                  <input
                    type="file"
                    name="images"
                    multiple
                    onChange={(e) => handleFileChange(index, e)}
                    className="hidden"
                    required
                  />
                </label>
                <div className="flex flex-wrap mt-2">
                  {product.imagePreviews.map((preview, i) => (
                    <div key={i} className="relative mr-2 mb-2">
                      <img
                        src={preview}
                        alt={`Image Preview ${i + 1}`}
                        className="w-24 h-24 object-cover rounded"
                      />
                      <button
                        type="button"
                        onClick={() => deleteImage(index, i)}
                        className="absolute top-0 right-0 bg-red-600 text-white rounded-full w-5 h-5 flex items-center justify-center">
                        X
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ))}

        <div className="flex items-center justify-center space-y-4 flex-col">
          <Button
            type="submit"
            fw
            style={
              "w-full p-2 bg-white rounded-2xl bg-gradient-to-r from-[#979db6] to-gray-300"
            }>
            Create Products
          </Button>
          <button
            type="button"
            onClick={addProduct}
            className="w-full p-2 bg-white rounded-2xl bg-gradient-to-r from-[#979db6] to-gray-300">
            Add Another Product
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateProducts;
