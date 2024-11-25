import React, { useCallback, useEffect, useState } from "react";
import backgroundservice from "../../assets/backgroundservice.png";
import {
  createSearchParams,
  useParams,
  useLocation,
  useNavigate,
} from "react-router-dom";
import { apiGetProduct } from "../../apis/products";
import {
  Breadcrumb,
  Button,
  Selectquantity,
  Productinformation,
  Othermany,
} from "../../components";
import Slider from "react-slick";
import { formatMoney, renderStarFromNumber } from "../../ultils/helper";
import { useSelector, useDispatch } from "react-redux";
import { useSnackbar } from 'notistack';
import { getCurrent } from "../../store/user/asyncAction";
import path from "../../ultils/path";
import Swal from "sweetalert2";
import { apiupdatecart, apiupdatewhislist } from "../../apis";

const Detailproducts = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();
  const { current } = useSelector((state) => state.user);
  const { pid, title } = useParams();
  
  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true); // Loading state
  const { enqueueSnackbar } = useSnackbar(); // Initialize Notistack

  const fetchProductData = async () => {
    try {
      const response = await apiGetProduct(pid);
      if (response.success) {
        setProduct(response.productData);
      } else {
        enqueueSnackbar(response.mes, { variant: 'error' }); 
      }
    } catch (error) {
      enqueueSnackbar("Failed to fetch product data.", { variant: 'error' }); 
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (pid) fetchProductData();
  }, [pid]);

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: false,
    appendDots: (dots) => <div>{dots}</div>,
    customPaging: (i) => (
      <img
        src={product?.images[i]}
        alt={`Dot ${i + 1}`}
        style={{ width: "100%", objectFit: "contain" }}
      />
    ),
  };

  const handleQuantityChange = useCallback((number) => {
    window.scrollTo(0, 0);
    const parsedNumber = Number(number);
    if (!parsedNumber || parsedNumber < 1) {
      return;
    } else if (parsedNumber > product?.quantity) {
      enqueueSnackbar(`You can only order up to ${product?.quantity} items.`, { variant: 'error' });
      return;
    }
    setQuantity(parsedNumber);
  }, [product?.quantity, enqueueSnackbar]);

  const handleChangeQuantity = useCallback((flag) => {
    setQuantity((prev) => {
      if (flag === "minus" && prev === 1) return prev;
      if (flag === "minus") return prev - 1;
      if (flag === "Plus" && prev < product?.quantity) return prev + 1;
      enqueueSnackbar(`You can only order up to ${product?.quantity} items.`, { variant: 'error' });
      return prev;
    });
  }, [product?.quantity, enqueueSnackbar]);

  const handleAddToCart = async () => {
    if (!current) {
      return Swal.fire({
        title: "Almost",
        text: "Please login first",
        icon: "info",
        cancelButtonText: "Not now!",
        showConfirmButton: true,
        confirmButtonText: "Go to login page",
      }).then((rs) => {
        if (rs.isConfirmed) {
          navigate({
            pathname: `/${path.LOGIN}`,
            search: createSearchParams({
              redirect: location.pathname,
            }).toString(),
          });
        }
      });
    }
    
    const response = await apiupdatecart({
      pid,
      color: product?.color,
      quantity,
      price: product?.price,
      title: product?.title,
    });

    if (response.success) {
      enqueueSnackbar(response.mes, { variant: 'success' }); 
      dispatch(getCurrent());
    } else {
      enqueueSnackbar(response.mes, { variant: 'error' }); 
    }
  };

  const handleAddToWishlist = async () => {
    if (!current) {
      return Swal.fire({
        title: "Almost",
        text: "Please login first",
        icon: "info",
        cancelButtonText: "Not now!",
        showConfirmButton: true,
        confirmButtonText: "Go to login page",
      }).then((rs) => {
        if (rs.isConfirmed) {
          navigate({
            pathname: `/${path.LOGIN}`,
            search: createSearchParams({
              redirect: location.pathname,
            }).toString(),
          });
        }
      });
    }
    
    const response = await apiupdatewhislist(pid);
    if (response.success) {
      dispatch(getCurrent());
      enqueueSnackbar(response.mes, { variant: 'success' }); 
    } else {
      enqueueSnackbar(response.mes, { variant: 'error' }); 
    }
  };

  return (
    <div className="flex flex-col justify-center items-center">
      <div className="flex justify-center w-full ">
        <div className="w-full">
          <img
            className="relative"
            src={backgroundservice}
            alt="backgroundservice"
          />
        </div>
        <div className="flex absolute flex-col text-white left-20 top-[200px] p-4">
          <span className="text-[30px] font-medium uppercase">{title}</span>
          <Breadcrumb title={title} category={product?.category} />
        </div>
      </div>
      <div className="w-[80%] m-auto flex justify-center">
        <div className="flex w-full mt-5 gap-10">
          <div className="flex w-[50%] flex-col justify-start">
            <Slider {...settings}>
              {product?.images?.map((el, index) => (
                <img
                  key={index}
                  src={el}
                  alt="Subproducts"
                  className="h-[500px] object-contain"
                />
              ))}
            </Slider>
          </div>
          <div className="w-[100%] lg:w-[50%] flex flex-col text-center lg:text-start mt-12">
            <span className="text-[25px] font-semibold">{product?.title}</span>
            <span className="text-[20px]">{`${formatMoney(product?.price)} VNĐ `}</span>
            <span className="flex mt-3 justify-center lg:justify-start">
              {renderStarFromNumber(product?.totalRatings)}
            </span>
            <span className="text-[17px] mt-4 font-semibold">Color: {product?.color}</span>
            <span className="text-[17px] mt-4 font-semibold">Sold: {product?.sold}</span>
            <span className="text-[17px] mt-4 font-semibold">Storehouse: {product?.quantity}</span>
            <div className="mt-4 flex flex-col gap-8">
              <Selectquantity
                quantity={quantity}
                handleQuantity={handleQuantityChange}
                handlechangequantity={handleChangeQuantity}
              />
              <Button fw handleOnclick={handleAddToCart}>Add to cart</Button>
              <Button fw handleOnclick={handleAddToWishlist}>Add to Wishlist</Button>
            </div>
          </div>
        </div>
      </div>
      <div className="w-[80%] mt-5">
        <Productinformation />
      </div>
      <div className="m-auto w-[90%]">
        <Othermany />
      </div>
    </div>
  );
};

export default Detailproducts;
