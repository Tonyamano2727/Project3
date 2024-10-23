import React, { useEffect, useState } from "react";
import { ProductsCard } from "..";
import { apiGetProducts } from "../../apis/products";
const Featureproducts = (productData) => {
  const [products, setProducts] = useState(null);

  const fetchProducts = async () => {
    const responese = await apiGetProducts({
      limit: 9,
      totalRatings: 5,
    });
    if (responese.success) setProducts(responese.products);
  };
  useEffect(() => {
    fetchProducts();
  }, []);
  return (
    <>
      <div  className="w-full">
        <h3 className=" font-semibold text-[25px] gap-8  mt-[10px] ml-[60px] ">
          FEATURE PRODUCTS
        </h3>
        <div className="flex flex-wrap p-4 justify-center items-center">
          {products?.map((el) => (
            <ProductsCard
              key={el.id}
              id={el._id}
              productData={el}
            />
          ))}
        </div>
      </div>
    </>
  );
};

export default Featureproducts;
