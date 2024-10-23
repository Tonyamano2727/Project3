import React, { useState, useEffect, useCallback } from "react";
import { InputForm, Button, Markdoweditor } from "../../components";
import { useForm } from "react-hook-form";
import { getBase64 } from "../../ultils/helper";
import { useSnackbar } from "notistack";
import { apiCreateServices } from "../../apis";

const Createdservices = ({ category }) => {
  const [thumbImage, setThumbImage] = useState(null);
  const [otherImages, setOtherImages] = useState([]);
  const [payload, setPayload] = useState({
    description: "",
  });

  const { enqueueSnackbar } = useSnackbar();
  const {
    register,
    formState: { errors },
    reset,
    handleSubmit,
    watch,
  } = useForm();

  const handleThumbFileChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      const base64 = await getBase64(file);
      setThumbImage(base64);
    }
  };

  const handleDeleteThumb = () => {
    setThumbImage(null);
  };

  const handleOtherFilesChange = async (e) => {
    const files = Array.from(e.target.files);
    const imagesPreview = [];
    for (let file of files) {
      const base64 = await getBase64(file);
      imagesPreview.push(base64);
    }
    setOtherImages(imagesPreview);
  };

  const handleDeleteOtherImage = (index) => {
    const updatedImages = otherImages.filter((_, i) => i !== index);
    setOtherImages(updatedImages);
  };

  const handleCreateService = async (data) => {
    const finalPayload = { ...data, ...payload };
    // Handle form submission logic here...

    try {
      const response = await apiCreateServices(finalPayload);
      if (response.success) {
        enqueueSnackbar("Service created successfully", { variant: "success" });
        reset();
        setThumbImage(null);
        setOtherImages([]);
      } else {
        enqueueSnackbar(response.data.mes, { variant: "error" });
      }
    } catch (error) {
      console.error("Error creating service:", error);
      enqueueSnackbar("An error occurred while creating the service.", {
        variant: "error",
      });
    }
  };

  return (
    <div className="w-[85%] bg-gray-300 rounded-2xl">
      <div className="p-10">
        <form onSubmit={handleSubmit(handleCreateService)}>
          <InputForm
            label="Service Title"
            register={register}
            errors={errors}
            id="title"
            validate={{
              required: "This field is required",
            }}
            placeholder="Enter service title"
          />

          <InputForm
            label="Price"
            register={register}
            errors={errors}
            id="price"
            validate={{
              required: "This field is required",
            }}
            placeholder="Enter service price"
          />

          <InputForm
            label="Category"
            register={register}
            errors={errors}
            id="category"
            validate={{
              required: "This field is required",
            }}
            placeholder="Enter category"
          />

          <Markdoweditor
            name="description"
            changevalue={(e) => setPayload((prev) => ({ ...prev, description: e }))}
            label="Service Description"
          />

          {/* Thumbnail and Images Section */}
          <div className="flex items-center justify-around mb-5">
            <div className="flex flex-col justify-center items-center">
              <label
                htmlFor="thumbImage"
                className="mt-2  bg-white px-4 py-2 rounded-lg cursor-pointer"
              >
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
                    src={thumbImage}
                    alt="Thumb Preview"
                    className="mt-2 h-20 w-20 object-cover"
                  />
                  <button
                    onClick={handleDeleteThumb}
                    className="absolute top-0 right-0 bg-red-600 text-white rounded-full p-1"
                  >
                    X
                  </button>
                </div>
              )}
            </div>

            <div className="flex flex-col justify-center items-center">
              <label
                htmlFor="otherImages"
                className="mt-2 bg-white px-4 py-2 rounded-lg cursor-pointer"
              >
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
                        src={image}
                        alt={`Other Image ${index}`}
                        className="h-20 w-20 object-cover"
                      />
                      <button
                        onClick={() => handleDeleteOtherImage(index)}
                        className="absolute top-0 right-0 bg-red-600 text-white rounded-full p-1"
                      >
                        X
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <Button type="submit" fw>Create Service</Button>
        </form>
      </div>
    </div>
  );
};

export default Createdservices;
