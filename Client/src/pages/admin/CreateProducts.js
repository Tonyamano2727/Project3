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
  const [brands, setBrands] = useState({}); // Stores brands for each category

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await apiGetCategories();
        setCategories(response.getallCategory);
        console.log(response);
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
      const selectedCategory = categories.find(cat => cat._id === value);
      if (selectedCategory) {
        newProducts[index].brand = ""; 
        newProducts[index].categoryTitle = selectedCategory.title; 
        setBrands(prevBrands => ({
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
      newProducts[index].imagePreviews = files.map((file) => URL.createObjectURL(file));
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
      <form onSubmit={handleSubmit} className="w-full">
        {products.map((product, index) => (
          <div
            key={index}
            className="gap-5 flex flex-wrap justify-center items-center mb-5"
          >
            <div className="w-[95%] justify-between flex items-center">
              <h2 className="font-semibold w-full">Product {index + 1}</h2>
              {products.length > 1 && (
                <button
                  type="button"
                  onClick={() => deleteProduct(index)}
                  className="px-4 w-[20%] py-2 text-white bg-gradient-to-r from-[#0f1c92] to-[#0e28d1] rounded-full"
                >
                  Delete Product
                </button>
              )}
            </div>
            <input
              className="border p-1 rounded-full w-[30%]"
              type="number"
              name="quantity"
              placeholder="Quantity"
              value={product.quantity}
              onChange={(e) => handleChange(index, e)}
              required
            />
            <input
              className="border p-1 rounded-full w-[30%]"
              type="text"
              name="title"
              placeholder="Title"
              value={product.title}
              onChange={(e) => handleChange(index, e)}
              required
            />
            <input
              className="border p-1 rounded-full w-[30%]"
              type="number"
              name="price"
              placeholder="Price"
              value={product.price}
              onChange={(e) => handleChange(index, e)}
              required
            />
            <input
              className="border p-1 rounded-full w-[30%]"
              type="text"
              name="color"
              placeholder="Color"
              value={product.color}
              onChange={(e) => handleChange(index, e)}
              required
            />
            <select
              className="border p-2 rounded-full w-[46%]"
              name="category"
              value={product.category}
              onChange={(e) => handleChange(index, e)}
              required
            >
              <option value="">Select Category</option>
              {categories.map((category) => (
                <option key={category._id} value={category._id}>
                  {category.title}
                </option>
              ))}
            </select>
            <select
              className="border p-2 rounded-full w-[46%]"
              name="brand"
              value={product.brand}
              onChange={(e) => handleChange(index, e)}
              required
            >
              <option value="">Select Brand</option>
              {brands[product.category]?.map((brand, i) => (
                <option key={i} value={brand}>
                  {brand}
                </option>
              ))}
            </select>

            <textarea
              className="border p-1 rounded-2xl w-[94%]"
              name="description"
              placeholder="Description"
              value={product.description}
              onChange={(e) => handleChange(index, e)}
              required
            />

            <label className="border rounded-full px-10 py-3 cursor-pointer text-center">
              Thumb
              <input
                type="file"
                name="thumb"
                onChange={(e) => handleFileChange(index, e)}
                className="hidden"
                required
              />
            </label>
            {product.thumbPreview && (
              <div>
                <img
                  src={product.thumbPreview}
                  alt="Thumbnail Preview"
                  style={{ width: "100px", height: "100px" }}
                />
                <button
                  type="button"
                  onClick={() => deleteThumb(index)}
                  className="text-red-600"
                >
                  Delete Thumb
                </button>
              </div>
            )}

            <label className="border p-1 rounded-full px-10 py-3 cursor-pointer text-center">
              Other Images
              <input
                type="file"
                name="images"
                multiple
                onChange={(e) => handleFileChange(index, e)}
                className="hidden"
                required
              />
            </label>
            <div className="image-previews flex flex-wrap mt-2">
              {product.imagePreviews.map((preview, i) => (
                <div
                  key={i}
                  style={{
                    display: "inline-block",
                    position: "relative",
                    marginRight: "5px",
                  }}
                >
                  <img
                    src={preview}
                    alt={`Image Preview ${i + 1}`}
                    style={{ width: "100px", height: "100px" }}
                  />
                  <button
                    type="button"
                    onClick={() => deleteImage(index, i)}
                    style={{
                      position: "absolute",
                      top: 0,
                      right: 0,
                      background: "red",
                      color: "white",
                      borderRadius: "50%",
                      width: "20px",
                      height: "20px",
                    }}
                  >
                    X
                  </button>
                </div>
              ))}
            </div>
          </div>
        ))}

        <div className="flex items-center justify-center">
          <div className="w-[95%]">
            <Button type="submit" fw>
              Create Products
            </Button>
            <button
              type="button"
              onClick={addProduct}
              className="px-4 py-2 mt-3 w-full text-white bg-gradient-to-r from-[#0f1c92] to-[#0e28d1] rounded-full"
            >
              Add Another Product
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default CreateProducts;
