import React, { useCallback, useEffect, useState } from "react";
import { InputForm, Select, Button, Markdoweditor } from "../../components";
import { useForm } from "react-hook-form";
import { useSelector } from "react-redux";
import { validate, getBase64 } from "../../ultils/helper";
import { useSnackbar } from "notistack"; // Import Notistack
import icons from "../../ultils/icons";
import { apiCreateProduct } from "../../apis";

const { IoTrashBin } = icons;

const CreateProducts = () => {
  const [isFocusDescription, setisfousdescription] = useState(null);
  const { categories } = useSelector((state) => state.app);
  const {
    register,
    formState: { errors },
    reset,
    handleSubmit,
    watch,
  } = useForm({
    category: "",
  });

  const [payload, setPayload] = useState({
    description: "",
  });

  const [preview, setPreview] = useState({
    thumb: null,
    images: [],
  });

  const [invalidFields, setInvalidFields] = useState([]);
  const changeValue = useCallback(
    (e) => {
      setPayload(e);
    },
    [payload]
  );

  const [hover, setHover] = useState(null);
  const { enqueueSnackbar } = useSnackbar();

  const handlePreviewThumb = async (file) => {
    const base64Thumb = await getBase64(file);
    setPreview((prev) => ({ ...prev, thumb: base64Thumb }));
  };

  const handlePreviewImages = async (files) => {
    const imagesPreview = [];
    for (let file of files) {
      if (file.type !== "image/png" && file.type !== "image/jpeg") {
        enqueueSnackbar("File not supported", { variant: "warning" }); // Use Notistack
        return;
      }
      const base64 = await getBase64(file);
      imagesPreview.push({ name: file.name, path: base64 });
    }
    setPreview((prev) => ({ ...prev, images: imagesPreview }));
  };

  useEffect(() => {
    handlePreviewThumb(watch("thumb")[0]);
  }, [watch("thumb")]);

  useEffect(() => {
    handlePreviewImages(watch("images"));
  }, [watch("images")]);

  const handleCreateProduct = async (data) => {
    const invalids = validate(payload, setInvalidFields);
    if (invalids === 0) {
      if (data.category)
        data.category = categories?.find(
          (el) => el._id === data.category
        )?.title;

      const finalPayload = { ...data, ...payload };
      const formData = new FormData();
      for (let i of Object.entries(finalPayload)) formData.append(i[0], i[1]);
      if (finalPayload.thumb) formData.append("thumb", finalPayload.thumb[0]);
      if (finalPayload.images) {
        for (let image of finalPayload.images)
          formData.append("images", image.path); // Ensure to append image path
      }

      const response = await apiCreateProduct(formData);
      if (response.success) {
        enqueueSnackbar(response.mes, { variant: "success" }); // Use Notistack
        reset();
        setPayload({
          thumb: "",
          images: [],
        });
      } else {
        enqueueSnackbar(response.mes, { variant: "error" }); // Use Notistack
      }
    }
  };

  const handleRemoveImage = (name) => {
    const files = [...watch("images")];
    reset({
      images: files?.filter((el) => el.name !== name),
    });
    if (preview.images?.some((el) => el.name === name))
      setPreview((prev) => ({
        ...prev,
        images: prev.images.filter((el) => el.name !== name),
      }));
  };

  return (
    <div className="w-[85%]  bg-gradient-to-r from-[#d3b491] to-[#e07c93] rounded-2xl">
      <div className="p-10">
        <form onSubmit={handleSubmit(handleCreateProduct)}>
          <InputForm
            label="Name product"
            register={register}
            errors={errors}
            id="title"
            validate={{
              required: "Need fill this field",
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
                required: "Need fill this field",
              }}
              style="w-full"
              placeholder="Price of new product"
              fullWith={true}
            />
            <InputForm
              label="Quantity product"
              register={register}
              errors={errors}
              id="quantity"
              validate={{
                required: "Need fill this field",
              }}
              style="w-full"
              placeholder="Quantity of new product"
              fullWith={true}
            />
            <InputForm
              label="Color product"
              register={register}
              errors={errors}
              id="color"
              validate={{
                required: "Need fill this field",
              }}
              style="w-full"
              placeholder="Color of new product"
              fullWith={true}
            />
          </div>
          <div className="w-full flex my-6 gap-4">
            <Select
              label="Category"
              options={categories?.map((el) => ({
                code: el._id,
                value: el.title,
              }))}
              register={register}
              id="category"
              validate={{ required: "Need fill this field" }}
              style="flex-1"
              errors={errors}
            />
            <Select
              label="Brand"
              options={categories
                ?.find((el) => el._id === watch("category"))
                ?.brand?.map((el) => ({ code: el, value: el }))}
              register={register}
              id="brand"
              validate={{ required: "Need fill this field" }}
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
            setisfousdescription={setisfousdescription}
          />
          <div className="flex justify-around">
            <div className="flex flex-col justify-center items-center">
              <div className=" mt-8 text-center">
                <div className="flex flex-col">
                  <label
                    htmlFor="thumb"
                    className="mt-2 inline-block  bg-white text-black  px-4 py-2 rounded-lg ">
                    Thumb
                  </label>
                  <input
                    type="file"
                    id="thumb"
                    {...register("thumb", { required: "Need fill" })}
                    className="hidden"
                  />
                </div>
                {errors["thumb"] && (
                  <small className="text-xs text-red-500">
                    {errors["thumb"]?.message}
                  </small>
                )}
              </div>
              {preview.thumb && (
                <div className="my-4">
                  <img
                    src={preview.thumb}
                    alt="thumb"
                    className="w-[200px] object-contain"></img>
                </div>
              )}
            </div>
            <div className="flex flex-col items-center">
              <div className="flex gap-2 mt-8">
                <div className="flex text-start">
                  <div className="flex items-center mt-2">
                    <label
                      htmlFor="images"
                      className="inline-block w-auto px-4 py-2 rounded-lg cursor-pointer bg-white text-black">
                      Image Products
                    </label>
                    <input
                      type="file"
                      id="images"
                      multiple
                      {...register("images", { required: "Need fill" })}
                      className="hidden"
                    />
                  </div>
                  {errors["images"] && (
                    <small className="text-xs text-red-500">
                      {errors["images"]?.message}
                    </small>
                  )}
                </div>
              </div>
              {preview.images.length > 0 && (
                <div className="my-4 flex w-full gap-3 flex-wrap">
                  {preview.images?.map((el, idx) => (
                    <div
                      onMouseEnter={() => setHover(el.name)}
                      className="w-fit flex relative"
                      onMouseLeave={() => setHover(null)}
                      key={idx}>
                      <img
                        src={el.path}
                        alt="product"
                        className="w-[100px] object-contain"></img>
                      {hover === el.name && (
                        <div
                          className="absolute cursor-pointer flex justify-end inset-0 bg-orange-200"
                          onClick={() => handleRemoveImage(el.name)}>
                          <IoTrashBin className="p-2" size={44} color="black" />
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
          <div className="mt-8">
            <Button fw type="submit" style={'bg-white text-black w-full rounded-full p-3'}>
              Create new product
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateProducts;
