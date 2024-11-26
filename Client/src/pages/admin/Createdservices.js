import React, { useState, useEffect } from "react";
import { InputForm, Button, Markdoweditor } from "../../components";
import { useForm } from "react-hook-form";
import { useSnackbar } from "notistack";
import { apiCreateServices, apigetallcategoryservice } from "../../apis";

const Createdservices = () => {
  const [isFocusDescription, setIsFocusDescription] = useState(null);
  const [thumbImage, setThumbImage] = useState(null);
  const [otherImages, setOtherImages] = useState([]);
  const [payload, setPayload] = useState({
    description: "",
    category: "",
  });
  const [categories, setCategories] = useState([]); 

  const { enqueueSnackbar } = useSnackbar();
  const {
    register,
    formState: { errors },
    reset,
    handleSubmit,
  } = useForm();

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await apigetallcategoryservice();
        console.log("Fetched categories:", response); // Log the response
        if (Array.isArray(response.categories) && response.categories.length > 0) {
          setCategories(response.categories); // Set categories
        }
      } catch (err) {
        console.log("Error fetching categories: " + err.message);
      } finally {
        console.log(false);
      }
    };
  
    fetchCategories();
  }, []);
  const handleThumbFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setThumbImage(file);
    }
  };

  const handleDeleteThumb = () => {
    setThumbImage(null);
  };

  const handleOtherFilesChange = (e) => {
    const files = Array.from(e.target.files);
    setOtherImages(files);
  };

  const handleDeleteOtherImage = (index) => {
    const updatedImages = otherImages.filter((_, i) => i !== index);
    setOtherImages(updatedImages);
  };

  const handleCreateService = async (data) => {
    if (!thumbImage && otherImages.length === 0) {
      enqueueSnackbar("Bạn cần cung cấp ít nhất một hình ảnh để tạo dịch vụ.", {
        variant: "error",
      });
      return;
    }

    const formData = new FormData();
    formData.append("title", data.title);
    formData.append("description", payload.description);
    formData.append("price", data.price);
    formData.append("category", payload.category);

    if (thumbImage) formData.append("thumb", thumbImage);
    if (otherImages.length > 0) {
      otherImages.forEach((image) => {
        formData.append("images", image);
      });
    }

    try {
      const response = await apiCreateServices(formData);
      if (response.success) {
        enqueueSnackbar("Dịch vụ đã được tạo thành công", {
          variant: "success",
        });
        reset();
        setThumbImage(null);
        setOtherImages([]);
      } else {
        enqueueSnackbar(response.data.mes, { variant: "error" });
      }
    } catch (error) {
      console.error("Lỗi khi tạo dịch vụ:", error);
      enqueueSnackbar("Đã xảy ra lỗi khi tạo dịch vụ.", { variant: "error" });
    }
  };

  return (
    <div className="w-[85%] bg-white rounded-2xl">
      <div className="p-10">
        <form onSubmit={handleSubmit(handleCreateService)}>
          <InputForm
            label="Service Title"
            register={register}
            errors={errors}
            id="title"
            validate={{ required: "This field is required" }}
            placeholder="Enter service title"
          />

          <InputForm
            label="Price"
            register={register}
            errors={errors}
            id="price"
            validate={{ required: "This field is required" }}
            placeholder="Enter service price"
          />
          <div className="mb-4">
            <label htmlFor="category" className="block mt-3 text-[13px] mb-2">
              Category
            </label>
            <select
              id="category"
              {...register("category", { required: "This field is required" })}
              onChange={(e) => {
                const selectedCategory = categories.find(
                  (cat) => cat._id === e.target.value
                );
                setPayload((prev) => ({
                  ...prev,
                  category: selectedCategory?.title || "",
                }));
              }}
              className={`border p-2 w-full  rounded-3xl ${
                errors.category ? "border-red-500" : "border-gray-300"
              }`}>
              <option value="">Select category</option>
              {categories.map((category) => (
                <option key={category._id} value={category._id}>
                  {category.title}
                </option>
              ))}
            </select>
            {errors.category && (
              <span className="text-red-500">{errors.category.message}</span>
            )}
          </div>

          <Markdoweditor
            name="description"
            value={payload.description}
            changevalue={(content) =>
              setPayload((prev) => ({ ...prev, description: content }))
            }
            label="Service Description"
            setisfousdescription={setIsFocusDescription}
          />

          <div className="flex items-center justify-around mb-5">
            <div className="flex flex-col justify-center items-center">
              <label
                htmlFor="thumbImage"
                className="mt-2 bg-white px-4 py-2 rounded-lg cursor-pointer">
                Thumb Image
              </label>
              <input
                id="thumbImage"
                className="hidden"
                type="file"
                accept="image/*"
                onChange={handleThumbFileChange}
              />
              {thumbImage && (
                <div className="relative">
                  <img
                    src={URL.createObjectURL(thumbImage)}
                    alt="Thumb Preview"
                    className="mt-2 h-20 w-20 object-cover"
                  />
                  <button
                    onClick={handleDeleteThumb}
                    className="absolute top-0 right-0 bg-red-600 text-white rounded-full p-1">
                    X
                  </button>
                </div>
              )}
            </div>

            <div className="flex flex-col justify-center items-center">
              <label
                htmlFor="otherImages"
                className="mt-2 bg-white px-4 py-2 rounded-lg cursor-pointer">
                Other Images
              </label>
              <input
                id="otherImages"
                className="hidden"
                type="file"
                accept="image/*"
                multiple
                onChange={handleOtherFilesChange}
              />
              {otherImages.length > 0 && (
                <div className="mt-2 grid grid-cols-3 gap-2">
                  {otherImages.map((image, index) => (
                    <div key={index} className="relative">
                      <img
                        src={URL.createObjectURL(image)}
                        alt={`Other Image ${index}`}
                        className="h-20 w-20 object-cover"
                      />
                      <button
                        onClick={() => handleDeleteOtherImage(index)}
                        className="absolute top-0 right-0 bg-red-600 text-white rounded-full p-1">
                        X
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <Button type="submit" fw style={'w-full p-2 mt-2 bg-white rounded-2xl bg-gradient-to-r from-[#979db6] to-gray-300'}>
            Create Service
          </Button>
        </form>
      </div>
    </div>
  );
};

export default Createdservices;
