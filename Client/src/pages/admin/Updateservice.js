import React, { useState, useEffect } from "react";
import { InputForm, Button, Markdoweditor } from "../../components";
import { useForm } from "react-hook-form";
import { getBase64 } from "../../ultils/helper";
import { useSnackbar } from "notistack";
import { apiUpdateServices } from "../../apis"; // Đảm bảo import đúng API

const UpdateServices = ({ category, editService, setEditService }) => {
  const [isFocusDescription, setIsFocusDescription] = useState(null);
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
  } = useForm();

  // Khi component được mount hoặc editService thay đổi, cập nhật dữ liệu
  useEffect(() => {
    if (editService) {
      reset({
        title: editService.title || "",
        price: editService.price || "",
        category: editService.category || "",
      });
      setPayload({ description: editService.description || "" });
      setThumbImage(editService.thumb || null);
      setOtherImages(editService.images || []);
    }
  }, [editService, reset]);

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

  const handleUpdateService = async (data) => {
    const finalPayload = { ...data, ...payload };
    const formData = new FormData();

    Object.entries(finalPayload).forEach(([key, value]) => {
      formData.append(key, value);
    });

    if (thumbImage) {
      const blob = await fetch(thumbImage).then((res) => res.blob());
      formData.append("thumb", blob, "thumb.jpg");
    }

    // Thêm các hình ảnh khác
    otherImages.forEach(async (image) => {
      const blob = await fetch(image).then((res) => res.blob());
      formData.append("images", blob, `image-${Date.now()}.jpg`);
    });

    // Gửi dữ liệu
    try {
      const response = await apiUpdateServices(formData, editService._id);
      // Xử lý phản hồi từ server...
    } catch (error) {
      console.error("Error updating service:", error);
      enqueueSnackbar("An error occurred while updating the service.", {
        variant: "error",
      });
    }
  };

  return (
    <div className="w-[85%] bg-gray-300 rounded-2xl">
      <div className="p-10">
        <form onSubmit={handleSubmit(handleUpdateService)}>
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
                className="mt-2 bg-gradient-to-r from-blue-400 to-purple-500 text-white px-4 py-2 rounded-lg cursor-pointer">
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
                    className="absolute top-0 right-0 bg-red-600 text-white rounded-full p-1">
                    X
                  </button>
                </div>
              )}
            </div>

            <div className="flex flex-col justify-center items-center">
              <label
                htmlFor="otherImages"
                className="mt-2 bg-gradient-to-r from-blue-400 to-purple-500 text-white px-4 py-2 rounded-lg cursor-pointer">
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
                        className="absolute top-0 right-0 bg-red-600 text-white rounded-full p-1">
                        X
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <Button type="submit">Update Service</Button>
        </form>
      </div>
    </div>
  );
};

export default UpdateServices;
