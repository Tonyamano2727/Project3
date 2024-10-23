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
const ButtonWrapper = ({ currency, showSpinner, amount , payload , setIsSuccess}) => {
  const navigate = useNavigate();
  const {current } = useSelector((state) => state.user);
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

  const handleSaveOrder = async() => {
      const response = await apicreateorder({...payload , status: 'Successed'})
      if(response.success){
        setIsSuccess(true)
        setTimeout(() => {
          Swal.fire('Congratulations to customer',current.lastname + current.firstname + ' for their successful payment').then(() => {
            navigate('/')
          })
        },500)
      }
  }

  return (
    <>
      {showSpinner && isPending && <div className="spinner" />}
      <PayPalButtons
        style={style}
        disabled={false}
        forceReRender={[style, currency, amount]}
        fundingSource={undefined}
        createOrder={(data, actions) =>
          actions.order
            .create({
              purchase_units: [
                { amount: { currency_code: currency, value: amount } },
              ],
            })
            .then((orderID) => orderID)
        }
        onApprove={(data, actions) =>
          actions.order.capture().then(async (response) => {
            console.log(response);
                if(response.status === 'COMPLETED'){
                    handleSaveOrder()
                }
          })
        }
      />
    </>
  );
};

export default function Paypal({setIsSuccess , amount , payload }) {
  return (
    <div className="w-[80%] flex flex-col justify-center z-0">
      <PayPalScriptProvider 
        options={{ clientId: "test", components: "buttons", currency: "USD" }}>
        <ButtonWrapper setIsSuccess={setIsSuccess} payload={payload} currency={'USD'} amount={amount} showSpinner={false} />
      </PayPalScriptProvider>
    </div>
  );
}
