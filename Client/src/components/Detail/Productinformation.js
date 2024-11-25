import React, { useState, useEffect } from "react";
import { Productinfortabs } from "../../ultils/contants";
import {
  useNavigate,
  useParams,
  createSearchParams,
  useLocation,
} from "react-router-dom";
import { apiGetProduct, apiRateProduct } from "../../apis/products";
import { renderStarFromNumber } from "../../ultils/helper";
import path from "../../ultils/path";
import { useSelector } from "react-redux";
import DOMPurify from "dompurify";
import Button from "../Button/Button";
import Swal from "sweetalert2";
import { useSnackbar } from "notistack"; 

const Productinformation = () => {
  const { enqueueSnackbar } = useSnackbar();
  const { current } = useSelector((state) => state.user);
  const { pid } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [activedtab, setActivedTab] = useState(1);
  const [product, setProduct] = useState(null);
  const [star, setStar] = useState(0);
  const [comment, setComment] = useState("");

  // Fetch product data
  const fetchProductData = async () => {
    const response = await apiGetProduct(pid);
    if (response.success) setProduct(response.productData);
  };

  useEffect(() => {
    if (pid) fetchProductData();
  }, [pid]);

  // Handle Rating Submit
  const handleRatingSubmit = async () => {
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
            search: createSearchParams({ redirect: location.pathname }).toString(),
          });
        }
      });
    }
  
    const response = await apiRateProduct({ star, comment, pid });
    if (response.status) { // Check for 'status' instead of 'success'
      enqueueSnackbar("Rating submitted successfully!", {
        variant: "success",
        anchorOrigin: { vertical: 'top', horizontal: 'right' },
      });
      fetchProductData(); // Refresh product data after rating
    } else {
      enqueueSnackbar(response.message || "Failed to submit rating", {
        variant: "error",
        anchorOrigin: { vertical: 'top', horizontal: 'right' },
      });
    }
  };
  

  return (
    <div className="mt-9">
      <div className="gap-2 flex items-center justify-center">
        {Productinfortabs.map((el) => (
          <span
            className={`cursor-pointer p-2 px-4 ${
              activedtab === +el.id
                ? "bg-white border border-b-0"
                : "bg-gray-200"
            }`}
            onClick={() => setActivedTab(el.id)}
            key={el.id}>
            {el.title}
          </span>
        ))}
      </div>

      <div className="w-full h-[auto] border p-3 text-[15px] ">
        {activedtab === 1 && (
          <div>
            {product?.description?.length > 1 && (
              <span className="flex leading-8 mt-4 flex-col">
                {product?.description}
              </span>
            )}
            {product?.description?.length === 1 && (
              <div
                className="flex leading-8 mt-4 flex-col"
                dangerouslySetInnerHTML={{
                  __html: DOMPurify.sanitize(product?.description[0]),
                }}></div>
            )}
          </div>
        )}

        

      
        {activedtab === 2 && (
          <div>
            <h2>Reviews</h2>

           
            <div>
              <h3>Rate this product</h3>
              <div>
                {[1, 2, 3, 4, 5].map((i) => (
                  <span
                    key={i}
                    onClick={() => setStar(i)}
                    style={{
                      cursor: "pointer",
                      color: i <= star ? "gold" : "gray", // Highlight selected stars
                    }}>
                    ★
                  </span>
                ))}
              </div>
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Leave your comment here"
                rows="4"
                style={{ width: "100%", marginTop: "10px" }}
              />
              <Button handleOnclick={handleRatingSubmit}>Submit Rating</Button>
            </div>

            {/* Display existing reviews */}
            {product?.ratings?.length > 0 ? (
              product.ratings.map((rating) => (
                <div key={rating._id} className="p-4 border-b">
                  <div className="flex items-center">
                    {renderStarFromNumber(rating.star)}
                    <span className="ml-2 text-sm text-gray-600">
                      by {rating.postedBy}
                    </span>
                  </div>
                  <p className="mt-2">
                    {rating.comment ? rating.comment : "No comment provided."}
                  </p>
                </div>
              ))
            ) : (
              <p>No reviews yet.</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Productinformation;
