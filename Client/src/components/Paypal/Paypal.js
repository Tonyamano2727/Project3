import {
  PayPalScriptProvider,
  PayPalButtons,
  usePayPalScriptReducer,
} from "@paypal/react-paypal-js";
import { useEffect } from "react";
import { apicreateorder } from "../../apis";
import Swal from "sweetalert2";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

// This value is from the props in the UI
const style = { layout: "vertical" };

// Custom component to wrap the PayPalButtons and show loading spinner
const ButtonWrapper = ({ currency, showSpinner, amount, payload, setIsSuccess }) => {
  const navigate = useNavigate();
  const { current } = useSelector((state) => state.user);
  const [{ isPending, options }, dispatch] = usePayPalScriptReducer();

  useEffect(() => {
    dispatch({
      type: "ResetOptions",
      value: {
        ...options,
        currency: currency,
      },
    });
  }, [currency, showSpinner]);

  // Ensure the amount is greater than 0
  const validatedAmount = amount > 0 ? amount : 1;

  const handleSaveOrder = async () => {
    try {
      const response = await apicreateorder({ ...payload, status: "Successed" });
      if (response.success) {
        setIsSuccess(true);
        setTimeout(() => {
          Swal.fire("Congratulations", `${current.lastname} ${current.firstname} for their successful payment`).then(() => {
            navigate("/");
          });
        }, 500);
      } else {
        console.error("Order creation failed", response);
        Swal.fire("Error", "Order creation failed. Please try again.", "error");
      }
    } catch (error) {
      console.error("Error during order creation:", error);
      Swal.fire("Error", "Something went wrong while processing the payment", "error");
    }
  };

  return (
    <>
      {showSpinner && isPending && <div className="spinner" />}
      <PayPalButtons
        style={style}
        disabled={false}
        forceReRender={[style, currency, validatedAmount]}
        fundingSource={undefined}
        createOrder={(data, actions) => {
          try {
            return actions.order
              .create({
                purchase_units: [{ amount: { currency_code: currency, value: validatedAmount } }],
              })
              .catch((error) => {
                console.error("Error during order creation:", error);
                Swal.fire("Error", "Failed to create PayPal order", "error");
              });
          } catch (error) {
            console.error("Error in createOrder function:", error);
            Swal.fire("Error", "Unexpected error in createOrder", "error");
          }
        }}
        onApprove={(data, actions) => {
          try {
            return actions.order.capture().then(async (response) => {
              try {
                if (response.status === "COMPLETED") {
                  handleSaveOrder();
                }
              } catch (error) {
                console.error("Error during payment approval:", error);
                Swal.fire("Error", "Failed to process payment approval", "error");
              }
            });
          } catch (error) {
            console.error("Error in onApprove function:", error);
            Swal.fire("Error", "Unexpected error in onApprove", "error");
          }
        }}
      />
    </>
  );
};

export default function Paypal({ setIsSuccess, amount, payload }) {
  return (
    <div className="w-[80%] flex flex-col justify-center z-0">
      <PayPalScriptProvider
        options={{ clientId: "test", components: "buttons", currency: "USD" }}
      >
        <ButtonWrapper
          setIsSuccess={setIsSuccess}
          payload={payload}
          currency={"USD"}
          amount={amount}
          showSpinner={false}
        />
      </PayPalScriptProvider>
    </div>
  );
}
