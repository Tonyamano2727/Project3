import React, { useEffect, useState, useCallback } from "react";
import {
  useParams,
  useSearchParams,
  useNavigate,
  createSearchParams,
} from "react-router-dom";
import {
  Breadcrumb,
  Product,
  Search,
  Selectinput,
  Pagination,
  InputForm,
} from "../../components";
import { apiGetProducts, apiGetCategory } from "../../apis";
import Masonry from "react-masonry-css";
import { sorts } from "../../ultils/contants";
import { useForm } from "react-hook-form";
import backgroundservice from "../../assets/backgroundservice.png";

const breakpointColumnsObj = {
  default: 4,
  1024: 3,
  700: 2,
  500: 1,
};

const Products = ({ title}) => {
  const [products, setproducts] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [activedclick, setactivedclick] = useState(null);
  const [getallCategory, setgetallCategory] = useState([]);
  const [params] = useSearchParams();
  const [counts, setCounts] = useState(0);
  const [sort, setsort] = useState("");
  const navigate = useNavigate();
  const fetchProductsByCategory = async ({ queries }) => {
    const response =
      queries && Object.keys(queries).length > 0
        ? await apiGetProducts(queries)
        : await apiGetProducts();

    console.log(response);
    if (response.success) {
      setproducts(response);
      setCounts(response.counts);
    }
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = (data) => {
    const { q } = data;
    navigate({
      pathname: `/${category}`,
      search: createSearchParams({
        ...Object.fromEntries(params),
        q,
      }).toString(),
    });
  };

  const { category } = useParams();
  useEffect(() => {
    let param = [];
    for (let i of params.entries()) param.push(i);
    const queries = {};
    let priceQuery = {};

    for (let i of params) queries[i[0]] = i[1];
    if (queries.to && queries.from) {
      priceQuery = {
        $and: [
          { price: { gte: queries.from } },
          { price: { lte: queries.to } },
        ],
      };
      delete queries.price;
    }
    if (queries.from) queries.price = { gte: queries.from };
    if (queries.to) queries.price = { lte: queries.to };
    delete queries.to;
    delete queries.from;
    fetchProductsByCategory({ priceQuery, queries, category });
  }, [params, category, selectedCategory]);
  const fetchCategories = async () => {
    try {
      const response = await apiGetCategory();
      if (response.success) {
        setgetallCategory(response.getallCategory);
      } else {
        console.error(
          "Lỗi khi lấy danh mục:",
          response.message || "Unknown error"
        );
      }
    } catch (error) {
      console.error("Có lỗi xảy ra khi gọi API:", error);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);
  const ChangeActiveFilter = useCallback(
    (name) => {
      if (activedclick === name) setactivedclick(null);
      else setactivedclick(name);
    },
    [activedclick]
  );

  const changeValue = useCallback(
    (value) => {
      setsort(value);
    },
    [sort]
  );
  useEffect(() => {
    if (sort) {
      navigate({
        search: createSearchParams({
          sort,
        }).toString(),
      });
    }
  }, [sort]);

  return (
    <div className="w-full">
      <div className="w-full relative flex justify-center items-center flex-col bg-[#E7E7E7]">
        <img
          className="w-full object-cover h-[200px] md:h-[350px]"
          src={backgroundservice}
          alt="backgroundservice"
        />
        <div className="absolute text-white flex flex-col items-center md:items-start md:left-20 p-4">
          <h2 className="text-[24px] md:text-[45px] font-bold tracking-wide">
            Products
          </h2>
          <Breadcrumb title={title} />
        </div>
      </div>
      <div className="flex w-full justify-center items-center ">
        <form
          className="w-[96%] flex justify-center"
          onSubmit={handleSubmit(onSubmit)}>
          <InputForm
            id="q"
            register={register}
            errors={errors}
            style={"p-6 w-full xl:w-[98%] flex justify-center items-center"}
            placeholder="Search product by title"
          />
        </form>
      </div>
      <div className="xl:w-main rounded-3xl border p-4 flex justify-between mt-8 m-auto flex-wrap">
        <div className="lg:w-[40%] w-full">
          <span className="font-semibold text-sm">Filter by</span>
          <div className="flex items-center gap-4 mt-2 flex-wrap">
            <div className="w-[100%] lg:w-[40%]">
              <Search
                name="price"
                activedclick={activedclick}
                ChangeActiveFilter={ChangeActiveFilter}
                type="input"
              />
            </div>
            <div className="w-[100%] lg:w-[40%]">
              <Search
                name="color"
                activedclick={activedclick}
                ChangeActiveFilter={ChangeActiveFilter}
              />
            </div>
          </div>
        </div>
        <div className="lg:w-[40%] w-full">
          <span className="font-semibold text-sm">Sort by</span>
          <div className="w-full flex gap-5 flex-wrap">
            <div className="w-[100%] lg:w-[40%]">
              <Selectinput
                className="mt-2 rounded-full bg-gradient-to-r text-white from-[#0f1c92] to-[#0e28d1]"
                changeValue={changeValue}
                value={sort }
                texts = "Sort by date"
                options={sorts}
              />
            </div>
            <div className="w-[100%] lg:w-[40%]">
              <Selectinput
                className="mt-2 rounded-full bg-gradient-to-r text-white from-[#0f1c92] to-[#0e28d1]"
                texts = "Category"
                changeValue={(value) => {
                  if (!value) {
                    setSelectedCategory("");
                    const newParams = { ...Object.fromEntries(params) };
                    delete newParams.category;
                    navigate({
                      search: createSearchParams(newParams).toString(),
                    });
                  } else {
                    setSelectedCategory(value);
                    navigate({
                      search: createSearchParams({
                        ...Object.fromEntries(params),
                        category: value,
                      }).toString(),
                    });
                  }
                }}
                value={selectedCategory}
                options={[
                  ...getallCategory.map((category) => ({
                    text: category.title,
                    value: category.title,
                  })),
                ]}
                placeholder="Select Category"
              />
            </div>
          </div>
        </div>
      </div>
      <div className="mt-8 xl:w-main  m-auto">
        <Masonry
          breakpointCols={breakpointColumnsObj}
          className="my-masonry-grid"
          columnClassName="my-masonry-grid_column">
          {products?.products?.map((el) => (
            <Product key={el._id} pid={el._id} productData={el} />
          ))}
        </Masonry>
      </div>
      <div className="xl:w-main m-auto my-4 flex justify-end">
        <Pagination totalCount={counts} />
      </div>
    </div>
  );
};

export default Products;
