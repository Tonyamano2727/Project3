import React, { useEffect } from "react";
import { Route, Routes } from "react-router-dom";
import {
  Home,
  Login,
  Public,
  FAQ,
  Service,
  Detailproducts,
  Blogs,
  Products,
  Detailcart,
  Resetpassword,
  Detailservice,
  Ourteam,
  Detailsblogs,
  Serviceplan,
  Detailsplanservice,
} from "./pages/publics";
import {
  AdminLayout,
  CreateProducts,
  ManageOrder,
  Manageuser,
  ManageProducts,
  Overview,
  Manageblogs,
  Managesupervise,
  Createdsupervise,
  Createdservices,
  Manageservices,
  Managehotdistric,
  Categoryservice,
  Managecounsel,
} from "./pages/admin";
import {
  MemberLayout,
  Personal,
  Orderhistory,
  Mywhistlist,
  Checkout,
} from "./pages/Member";

import path from "./ultils/path";
import { getCategory } from "./store/app/asyncAction";
import { useDispatch, useSelector } from "react-redux";
import Cart from "./components/Cart/Cart";
import { Showcart } from "./store/app/appslice";
import Managebooking from "./pages/admin/Managebooking";
import ProfileAdmin from "./pages/admin/ProfileAdmin";
import Createblogs from "./pages/admin/Createblogs";
import "./index.css";
import { SnackbarProvider } from "notistack";

function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getCategory());
  }, [dispatch]);

  const { isShowCart } = useSelector((state) => state.app);

  return (
    <SnackbarProvider
      maxSnack={3}
      classes={{
        root: "my-snackbar-root",
        variantSuccess: "my-snackbar-success",
        variantError: "my-snackbar-error",
        variantInfo: "my-snackbar-info",
        variantWarning: "my-snackbar-warning",
      }}>
      <div className="relative font-main overflow-hidden">
        {isShowCart && (
          <div
            onClick={() => dispatch(Showcart())}
            className="absolute min-h-screen bg-box inset-0 bg-overplay z-50 flex justify-end">
            <Cart />
          </div>
        )}

        <Routes>
          <Route path={path.PUBLIC} element={<Public />}>
            <Route path={path.HOME} element={<Home />} />
            <Route path={path.BLOGS} element={<Blogs />} />
            <Route
              path={path.DETAIL_PRODUCT__CATEGORY__PID__TITLE}
              element={<Detailproducts />}
            />
            <Route
              path={path.DETAIL_SERVICE__CATEGORY__SID__TITLE}
              element={<Detailservice />}
            />
            <Route
              path={path.DETAIL_BLOGS__CATEGORY__SID__TITLE}
              element={<Detailsblogs />}
            />
            <Route path={path.FAQ} element={<FAQ />} />
            <Route path={path.OUR_TEAM} element={<Ourteam />} />
            <Route path={path.SERVICES__PLAN} element={<Serviceplan />} />
            <Route path={path.OUR_SERVICES} element={<Service />} />
            <Route path={path.PRODUCTS_CATEGORY} element={<Products />} />
            <Route path={path.RESET_PASSWORD} element={<Resetpassword />} />
            <Route path={path.LOGIN} element={<Login />} />
            <Route path={path.DETAIL_CART} element={<Detailcart />} />
            <Route path={path.CHECK_OUT} element={<Checkout />} />
            <Route path={path.PERSONAL} element={<Personal />} />
            <Route path={path.WISHLIST} element={<Mywhistlist />} />
            <Route path={path.HISTORY} element={<Orderhistory />} />
            <Route
              path={path.DETAIL_SERVICEPLAN__CATEGORY__SID__TITLE}
              element={<Detailsplanservice />}
            />
          </Route>

          <Route path={path.ADMIN} element={<AdminLayout />}>
            <Route path={path.MANAGE_ORDER} element={<ManageOrder />} />
            <Route path={path.MANAGE_PRODUCTS} element={<ManageProducts />} />
            <Route path={path.MANAGE_USER} element={<Manageuser />} />
            <Route path={path.CREATE_PRODUCTS} element={<CreateProducts />} />
            <Route path={path.OVER_VIEW} element={<Overview />} />
            <Route path={path.MANAGE_BOOKING} element={<Managebooking />} />
            <Route path={path.MANAGE_BLOGS} element={<Manageblogs />} />
            <Route path={path.CREATE_BLOGS} element={<Createblogs />} />
            <Route path={path.MANAGE_COUNSEL} element={<Managecounsel />} />
            <Route path={path.PROFILE_ADMIN} element={<ProfileAdmin />} />
            <Route path={path.MANAGE_SUPERVISE} element={<Managesupervise />} />

            <Route
              path={path.MANAGE_HOTDISTRIC}
              element={<Managehotdistric />}
            />
            <Route
              path={path.CREATE_SUPERVISE}
              element={<Createdsupervise />}
            />
            <Route
              path={path.CATEGORY_SERVICES}
              element={<Categoryservice />}
            />
            <Route path={path.CREATE_SERVICES} element={<Createdservices />} />
            <Route path={path.MANAGE_SERVICES} element={<Manageservices />} />
          </Route>

          <Route path={path.MEMBER} element={<MemberLayout />} />
        </Routes>
      </div>
    </SnackbarProvider>
  );
}

export default App;
