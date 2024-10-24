import React, { useEffect, useState } from "react";
import { InputForm, Select, Markdoweditor, Button } from "../../components";
import { useForm, useFieldArray } from "react-hook-form";
import { useSelector } from "react-redux";
import { validate, getBase64 } from "../../ultils/helper";
import { useSnackbar } from "notistack";
import icons from "../../ultils/icons";
import { apiCreateProduct } from "../../apis"; // Đảm bảo bạn có hàm này trong apis

const { IoTrashBin } = icons;

const CreateProducts = () => {
  const { categories } = useSelector((state) => state.app);
  const [isFocusDescription, setIsFocusDescription] = useState(null);
  const { register, control, formState: { errors }, reset, handleSubmit, watch, setValue } = useForm({
    defaultValues: {
      products: [
        { title: "", price: "", quantity: "", color: "", category: "", brand: "", description: "", thumb: null, images: [] }
      ],
    },
  });

  const { fields, append, remove } = useFieldArray({ control, name: "products" });
  const [preview, setPreview] = useState([]);
  const { enqueueSnackbar } = useSnackbar();
  const [invalidFields, setInvalidFields] = useState(0);

  const handlePreviewThumb = async (file, index) => {
    const base64Thumb = await getBase64(file);
    setPreview(prev => {
      const newPreview = [...prev];
      newPreview[index] = { ...newPreview[index], thumb: base64Thumb };
      return newPreview;
    });
  };

  const handlePreviewImages = async (files, index) => {
    const imagesPreview = [];
    for (const file of files) {
      if (file.type !== "image/png" && file.type !== "image/jpeg") {
        enqueueSnackbar("File not supported", { variant: "warning" });
        return;
      }
      const base64 = await getBase64(file);
      imagesPreview.push({ name: file.name, path: base64 });
    }
    setPreview(prev => {
      const newPreview = [...prev];
      newPreview[index] = { ...newPreview[index], images: imagesPreview };
      return newPreview;
    });
  };

  useEffect(() => {
    fields.forEach((_, index) => {
      handlePreviewThumb(watch(`products.${index}.thumb`), index);
    });
  }, [watch("products")]);

  useEffect(() => {
    fields.forEach((_, index) => {
      handlePreviewImages(watch(`products.${index}.images`), index);
    });
  }, [watch("products")]);

  const handleCreateProducts = async (data) => {
    console.log("Form submitted with data:", data); // Debug: Kiểm tra dữ liệu
    const invalids = validate(data, setInvalidFields);
    console.log("Number of invalid fields:", invalids); // Debug line
    if (invalids === 0) {
      const formData = new FormData();
      data.products.forEach((product, index) => {
        formData.append(`products[${index}][title]`, product.title);
        formData.append(`products[${index}][price]`, product.price);
        formData.append(`products[${index}][quantity]`, product.quantity);
        formData.append(`products[${index}][color]`, product.color);
        formData.append(`products[${index}][category]`, product.category);
        formData.append(`products[${index}][brand]`, product.brand);
        formData.append(`products[${index}][description]`, product.description);

        if (product.thumb) {
          formData.append(`thumb${index}`, product.thumb[0]);
        }
        if (product.images.length > 0) {
          product.images.forEach((image) => {
            formData.append(`images${index}[]`, image.path); // Dùng [] để gửi nhiều ảnh
          });
        }
      });

      const response = await apiCreateProduct(formData);
      console.log("API Response:", response); // Debug line
      if (response.success) {
        enqueueSnackbar(response.mes, { variant: "success" });
        reset();
        setPreview([]);
      } else {
        enqueueSnackbar(response.mes, { variant: "error" });
      }
    }
  };

  const handleSubmitWithLogging = (data) => {
    console.log("Form submitted");
    handleCreateProducts(data); // Gọi hàm chính ở đây
  };

  const handleRemoveImage = (index, name) => {
    const files = [...watch(`products.${index}.images`)];
    const newFiles = files.filter((el) => el.name !== name);
    reset({
      products: fields.map((_, idx) =>
        idx === index ? { ...watch(`products.${index}`), images: newFiles } : watch(`products.${idx}`)
      ),
    });
    setPreview(prev => {
      const newPreview = [...prev];
      newPreview[index].images = newPreview[index].images.filter((el) => el.name !== name);
      return newPreview;
    });
  };

  return (
    <div className="w-[85%] bg-gradient-to-r from-[#d3b491] to-[#e07c93] rounded-2xl">
      <div className="p-10">
        <form onSubmit={handleSubmit(handleSubmitWithLogging)}>
          {fields.map((item, index) => (
            <div key={item.id} className="mb-6">
              <InputForm
                label="Name product"
                register={register}
                errors={errors}
                id={`products.${index}.title`}
                validate={{ required: "Need fill this field" }}
                placeholder="Name of new product"
                fullwith
              />
              <div className="w-full my-6 flex gap-4">
                <InputForm
                  label="Price product"
                  register={register}
                  errors={errors}
                  id={`products.${index}.price`}
                  validate={{ required: "Need fill this field" }}
                  placeholder="Price of new product"
                  fullwith
                />
                <InputForm
                  label="Quantity product"
                  register={register}
                  errors={errors}
                  id={`products.${index}.quantity`}
                  validate={{ required: "Need fill this field" }}
                  placeholder="Quantity of new product"
                  fullwith
                />
                <InputForm
                  label="Color product"
                  register={register}
                  errors={errors}
                  id={`products.${index}.color`}
                  validate={{ required: "Need fill this field" }}
                  placeholder="Color of new product"
                  fullwith
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
                  id={`products.${index}.category`}
                  validate={{ required: "Need fill this field" }}
                  errors={errors}
                />
                <Select
                  label="Brand"
                  options={categories
                    ?.find((el) => el._id === watch(`products.${index}.category`))
                    ?.brand?.map((el) => ({ code: el, value: el }))} 
                  register={register}
                  id={`products.${index}.brand`}
                  validate={{ required: "Need fill this field" }}
                  errors={errors}
                />
              </div>
              <Markdoweditor
                name={`products.${index}.description`}
                changevalue={(value) => setValue(`products.${index}.description`, value)}
                label="Description"
                setInvalidFields={setInvalidFields}
                setisfousdescription={setIsFocusDescription}
              />
              <div className="flex justify-around">
                <div className="flex flex-col justify-center items-center">
                  <div className="mt-8 text-center">
                    <div className="flex flex-col">
                      <label htmlFor={`thumb-${index}`} className="mt-2 inline-block bg-white text-black px-4 py-2 rounded-lg">
                        Thumb
                      </label>
                      <input
                        type="file"
                        accept="image/*"
                        {...register(`products.${index}.thumb`, { required: "Need fill this field" })}
                        onChange={(e) => handlePreviewThumb(e.target.files[0], index)}
                        id={`thumb-${index}`}
                        className="hidden"
                      />
                    </div>
                    {preview[index]?.thumb && (
                      <img
                        src={preview[index].thumb}
                        alt="product"
                        className="mt-2 w-[200px] object-contain"
                      />
                    )}
                    {errors[`products.${index}.thumb`] && (
                      <small className="text-red-500">{errors[`products.${index}.thumb`]?.message}</small>
                    )}
                  </div>
                </div>
                <div className="flex flex-col justify-center items-center">
                  <div className="mt-8 text-center">
                    <div className="flex flex-col">
                      <label htmlFor={`images-${index}`} className="mt-2 inline-block bg-white text-black px-4 py-2 rounded-lg">
                        Images
                      </label>
                      <input
                        type="file"
                        accept="image/*"
                        multiple
                        {...register(`products.${index}.images`)}
                        onChange={(e) => handlePreviewImages(e.target.files, index)}
                        id={`images-${index}`}
                        className="hidden"
                      />
                    </div>
                    {preview[index]?.images && preview[index].images.map((img, imgIndex) => (
                      <div key={imgIndex} className="relative mt-2">
                        <img
                          src={img.path}
                          alt="product"
                          className="w-[200px] object-contain"
                        />
                        <button type="button" onClick={() => handleRemoveImage(index, img.name)} className="absolute top-0 right-0">
                          <IoTrashBin className="text-red-500" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              <button type="button" onClick={() => remove(index)} className="bg-red-500 text-white px-4 py-2 rounded-lg mt-4">
                Remove Product
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={() => append({ title: "", price: "", quantity: "", color: "", category: "", brand: "", description: "", thumb: null, images: [] })}
            className="bg-blue-500 text-white px-4 py-2 rounded-lg"
          >
            Add Product
          </button>
          <Button name="Create Products" className="mt-6" />
        </form>
      </div>
    </div>
  );
};

export default CreateProducts;
