import React, { useState } from "react";
import { InputForm, Button, Markdoweditor } from "../../components";
import { useForm } from "react-hook-form";
import { useSnackbar } from "notistack";
import { apiCreateServices } from "../../apis";

const Createdservices = ({ category }) => {
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

  const handleThumbFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setThumbImage(file); // Lưu file thay vì base64
    }
  };

  const handleDeleteThumb = () => {
    setThumbImage(null);
  };

  const handleOtherFilesChange = (e) => {
    const files = Array.from(e.target.files);
    setOtherImages(files); // Lưu file thay vì base64
  };

  const handleDeleteOtherImage = (index) => {
    const updatedImages = otherImages.filter((_, i) => i !== index);
    setOtherImages(updatedImages);
  };

  const handleCreateService = async (data) => {
    // Kiểm tra nếu không có hình ảnh nào
    if (!thumbImage && otherImages.length === 0) {
      enqueueSnackbar("Bạn cần cung cấp ít nhất một hình ảnh để tạo dịch vụ.", { variant: "error" });
      return;
    }

    // Tạo một FormData object cho upload file
    const formData = new FormData();

    // Append regular form fields
    formData.append("title", data.title);
    formData.append("description", payload.description); // Đảm bảo description là một chuỗi
    formData.append("price", data.price);
    formData.append("category", data.category);

    // Append files (thumbImage và otherImages)
    if (thumbImage) formData.append("thumb", thumbImage); // Thêm file thực tế
    if (otherImages.length > 0) {
      otherImages.forEach((image) => {
        formData.append("images", image); // Thêm file thực tế
      });
    }

    try {
      const response = await apiCreateServices(formData);
      if (response.success) {
        enqueueSnackbar("Dịch vụ đã được tạo thành công", { variant: "success" });
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
            value={category}
            validate={{
              required: "This field is required",
            }}
            placeholder="Enter category"
          />

          <Markdoweditor
            name="description"
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
                    src={URL.createObjectURL(thumbImage)} // Sử dụng URL.createObjectURL để hiển thị hình ảnh
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
                        src={URL.createObjectURL(image)} // Sử dụng URL.createObjectURL để hiển thị hình ảnh
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

          <Button type="submit" fw>
            Create Service
          </Button>
        </form>
      </div>
    </div>
  );
};

export default Createdservices;
