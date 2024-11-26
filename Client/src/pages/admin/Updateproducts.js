import React, { useState, useEffect, useCallback } from "react";
import { Button, InputForm, Markdoweditor, Select } from "../../components";
import { useForm } from "react-hook-form";
import { validate, getBase64 } from "../../ultils/helper";
import { useSnackbar } from "notistack"; 
import icons from "../../ultils/icons";
import { apiUpdateproduct } from "../../apis";
import { useSelector } from "react-redux";

const { IoTrashBin } = icons;

const Updateproducts = ({ editproduct, render, seteditproduct }) => {
  const { enqueueSnackbar } = useSnackbar(); 
  const [isfousdescription, setisfousdescription] = useState(null);
  const { categories } = useSelector((state) => state.app);
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
  } = useForm();

  const [payload, setpayload] = useState({
    description: "",
  });
  const [preview, setpreview] = useState({
    thumb: null,
    images: [],
  });

  useEffect(() => {
    reset({
      title: editproduct?.title || "",
      price: editproduct?.price || "",
      quantity: editproduct?.quantity || "",
      color: editproduct?.color || "",
      category: editproduct?.category || "",
      brand: editproduct?.brand?.toLowerCase() || "",
    });
    setpayload({
      description:
        typeof editproduct?.description === "object"
          ? editproduct?.description?.join(", ")
          : editproduct?.description,
    });
    setpreview({
      thumb: editproduct?.thumb || "",
      images: editproduct?.images || [],
    });
  }, [editproduct, reset]);

  const [invalidFields, setInvalidFields] = useState([]);
  const changeValue = useCallback(
    (e) => {
      setpayload(e);
    },
    [payload]
  );

  const handlePreviewThumb = async (file) => {
    const base64Thumb = await getBase64(file);
    setpreview((prev) => ({ ...prev, thumb: base64Thumb }));
  };

  const handlePreviewimages = async (files) => {
    const imagesPreview = [];
    for (let file of files) {
      if (file.type !== "image/png" && file.type !== "image/jpeg") {
        enqueueSnackbar("File not supported", { variant: "warning" });
        return;
      }
      const base64 = await getBase64(file);
      imagesPreview.push(base64);
    }
    setpreview((prev) => ({ ...prev, images: imagesPreview }));
  };

  useEffect(() => {
    if (watch("thumb") instanceof FileList && watch("thumb").length > 0)
      handlePreviewThumb(watch("thumb")[0]);
  }, [watch("thumb")]);

  useEffect(() => {
    if (watch("images") instanceof FileList && watch("images").length > 0)
      handlePreviewimages(watch("images"));
  }, [watch("images")]);

  const handleUpdateProduct = async (data) => {
    const invalids = validate(payload, setInvalidFields);
    if (invalids === 0) {
      if (data.category)
        data.category = categories.find((el) => el.title === data.category)?.title;
  
      const finalPayload = { ...data, ...payload };
      
      // Log dữ liệu để kiểm tra trước khi gửi
      console.log('Final Payload:', finalPayload);
  
      const formData = new FormData();
      for (let [key, value] of Object.entries(finalPayload)) {
        formData.append(key, value);
      }
  
      // Kiểm tra và log trước khi gửi ảnh thumbnail
      if (watch("thumb")?.[0]) {
        console.log('Appending thumb:', watch("thumb")[0]);
        formData.append("thumb", watch("thumb")[0]);
      } else {
        console.log('Using previous thumb:', preview.thumb);
        formData.append("thumb", preview.thumb);
      }
  
      // Kiểm tra và log trước khi gửi ảnh khác
      if (watch("images")?.length > 0) {
        for (let file of watch("images")) {
          console.log('Appending image:', file);
          formData.append("images", file);
        }
      } else {
        preview.images.forEach((image, index) => {
          console.log('Using previous image:', image);
          formData.append("images", image);
        });
      }
  
      try {
        // Gọi API để cập nhật sản phẩm
        const response = await apiUpdateproduct(formData, editproduct._id);
        console.log('API Response:', response);
  
        if (response.success) {
          enqueueSnackbar("Product updated successfully!", { variant: "success" });
          render();
          seteditproduct(null);
        } else {
          enqueueSnackbar(response.mes, { variant: "error" });
        }
      } catch (error) {
        console.error("Update failed:", error);
        enqueueSnackbar("Error updating product!", { variant: "error" });
      }
    }
  };

  const handleRemoveImage = (index) => {
    const newImages = [...preview.images]; 
    newImages.splice(index, 1); 
    setpreview((prev) => ({
      ...prev,
      images: newImages, 
    }));

    const currentImages = watch("images") || [];
    const newFiles = [...currentImages].filter((_, i) => i !== index);
    reset({
      images: newFiles, 
    });
  };

  return (
    <div className="w-full flex flex-col gap-4 text-start absolute z-50 bg-white p-10">
      <div className="p-4 border-b w-full flex justify-between items-center">
        <h1 className="text-3xl font-bold tracking-tight ">Update products</h1>
        <span
          className="cursor-pointer text-main"
          onClick={() => seteditproduct(null)}>
          Cancel
        </span>
      </div>
      <div className="">
        <form onSubmit={handleSubmit(handleUpdateProduct)}>
          <InputForm
            label="Name product"
            register={register}
            errors={errors}
            id="title"
            validate={{
              required: "Need to fill this field",
            }}
            className="flex-1"
            placeholder="Name of new product"
          />
          <div className="w-full my-6 flex gap-4">
            <InputForm
              label="Price product"
              register={register}
              errors={errors}
              id="price"
              validate={{
                required: "Need to fill this field",
              }}
              style="flex-auto"
              placeholder="Price of new product"
              fullwith={true}
            />
            <InputForm
              label="Quantity product"
              register={register}
              errors={errors}
              id="quantity"
              validate={{
                required: "Need to fill this field",
              }}
              style="flex-auto"
              placeholder="Quantity of new product"
              fullwith={true}
            />
            <InputForm
              label="Color product"
              register={register}
              errors={errors}
              id="color"
              validate={{
                required: "Need to fill this field",
              }}
              style="flex-auto"
              placeholder="Color of new product"
              fullwith={true}
            />
          </div>
          <div className="w-full flex my-6 gap-4">
            <Select
              label="Category"
              options={categories?.map((el) => ({
                code: el.title,
                value: el.title,
              }))}
              register={register}
              id="category"
              validate={{ required: "Need to fill this field" }}
              style="flex-1"
              errors={errors}
            />
            <Select
              label="Brand"
              options={categories
                ?.find((el) => el.title === watch("category"))
                ?.brand?.map((el) => ({ code: el, value: el }))} 
              register={register}
              id="brand"
              validate={{ required: "Need to fill this field" }}
              style="flex-1"
              errors={errors}
            />
          </div>
          <Markdoweditor
            name="description"
            changevalue={changeValue}
            label="Description"
            invalidFields={invalidFields}
            setinvalidFields={setInvalidFields}
            value={payload.description}
            setisfousdescription={setisfousdescription}
          />
          <div className="flex justify-around w-full">
            <div className="flex flex-col w-[40%] text-center mt-10 items-center">
              <label
                  htmlFor="thumb"
                  className="mt-2 inline-block text-center bg-gradient-to-r from-blue-400 to-purple-500 text-white px-4 py-2 rounded-lg cursor-pointer hover:opacity-90 transition-opacity">
                  Upload thumb
                </label>
              <input
                type="file"
                id="thumb"
                {...register("thumb", { required: "Update New Thumb Pleas" })}
                className="hidden"
              />
              {errors["thumb"] && (
                <small className="text-xs text-red-500">
                  {errors["thumb"]?.message}
                </small>
              )}
              {preview.thumb && (
                <div className="my-4">
                  <img
                    src={preview.thumb}
                    alt="thumb"
                    className="object-cover h-32 w-[150px]"
                  />
                </div>
              )}
            </div>

            <div className="flex flex-col mt-8 w-[40%]">
              <div className="flex items-center mt-2 flex-col text-center w-full">
                <label
                  htmlFor="images"
                  className="mt-2 inline-block text-center bg-gradient-to-r from-blue-400 to-purple-500 text-white px-4 py-2 rounded-lg cursor-pointer hover:opacity-90 transition-opacity">
                  Upload Images
                </label>
                <input
                  type="file"
                  id="images"
                  multiple
                  {...register("images", { required: "Update New Thumb Pleas" })}
                  className="hidden"
                />
                {errors["images"] && (
                  <small className="text-xs text-red-500">
                    {errors["images"]?.message}
                  </small>
                )}
                <div className="flex flex-wrap items-center justify-center gap-10">
                  {preview.images.length > 0 &&
                    preview.images.map((image, index) => (
                      <div key={index} className="relative mt-5">
                        <img
                          src={image}
                          alt="preview"
                          className="object-cover h-32 w-[150px]"
                        />
                        <span
                          onClick={() => handleRemoveImage(index)} 
                          className="absolute top-0 right-0 cursor-pointer">
                          <IoTrashBin className="text-2xl text-red-500" />
                        </span>
                      </div>
                    ))}
                </div>
              </div>
            </div>
          </div>
          <div className="mt-8">
            <Button fw type="submit">
              Update Product
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Updateproducts;
