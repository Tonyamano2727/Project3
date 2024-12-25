import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Login from "./page/public/Login";
import SupervisorLayout from "./page/public/SupervisorLayout";
import path from "../src/ultils/path";
import "./index.css";
import Manageemployee from "./page/supervisor/Manageemployee";
import Overview from "./page/supervisor/Overview";
import Createdemployee from "./page/supervisor/Createdemployee";
import Managebooking from "./page/supervisor/Managebooking";
import Salary from "./page/supervisor/Salary";
import Managebookingplan from "./page/supervisor/Managebookingplan";

const PrivateRoute = ({ children }) => {
  const accessToken = localStorage.getItem("accessToken");
  return accessToken ? children : <Navigate to={path.LOGIN} />;
};

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          {/* Đường dẫn trang login */}
          <Route path={path.LOGIN} element={<Login />} />
          {/* Đường dẫn chính của supervisor */}
          <Route
            path={path.SUPER_LAYOUT}
            element={
              <PrivateRoute>
                <SupervisorLayout />
              </PrivateRoute>
            }
          >
            {/* Các route con */}
            <Route path={path.SALARY} element={<Salary />} />
            <Route path={path.MANAGE_EMPLOYYEE} element={<Manageemployee />} />
            <Route
              path={path.CREATED_EMPLOYYEE}
              element={<Createdemployee />}
            />
            <Route path={path.MANAGE_BOOKING} element={<Managebooking />} />
            <Route
              path={path.MANAGE_BOOKINGPPLAN}
              element={<Managebookingplan />}
            />
            <Route path={path.OVER_VIEW} element={<Overview />} />
          </Route>
        </Routes>
      </div>
    </Router>
  );
}

export default App;
