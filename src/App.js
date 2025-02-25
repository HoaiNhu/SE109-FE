import "@glints/poppins";
import axios from "axios";
import React, { Fragment, useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import WebFont from "webfontloader";
import "./../node_modules/bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-datepicker/dist/css/bootstrap-datepicker.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min";
import "bootstrap-datepicker";
import "./assets/css/reset.css";
import "./assets/css/style.css";
import DefaultComponent from "./components/DefaultComponent/DefaultComponent";
import FooterComponent from "./components/FooterComponent/FooterComponent";
import { routes } from "./routes";
import { AuthProvider } from "./context/AuthContext";
import { isJsonString } from "./utils";
import { jwtDecode } from "jwt-decode";
import { updateUser } from "./redux/slides/userSlide";
import * as UserService from "./services/UserService";
import { useDispatch, useSelector } from "react-redux";
import Loading from "./components/LoadingComponent/Loading";

function App() {
  const dispatch = useDispatch();
  const [showLoading, setShowLoading] = useState(false);
  const user = useSelector((state) => state.user);
  console.log("user", user);

  useEffect(() => {
    WebFont.load({
      google: {
        families: ["Poppins"],
      },
    });
  }, []);

  const handleDecoded = () => {
    let storageData = localStorage.getItem("access_token");
    // console.log("storageData", storageData);

    let decoded = {};
    if (storageData) {
      try {
        decoded = jwtDecode(storageData);
        console.log("decoded", decoded);
      } catch (error) {
        console.error("Token không hợp lệ", error);
      }
    }
    return { decoded, storageData };
  };

  useEffect(() => {
    setShowLoading(true);
    const { storageData, decoded } = handleDecoded();
    console.log("decoded?.id", decoded?.id);
    if (decoded?.id) {
      handleGetDetailsUser(decoded?.id, storageData);
    }
    setShowLoading(false);
  }, []);

  //token hết hạn
  UserService.axiosJWT.interceptors.request.use(
    async (config) => {
      // Do something before request is sent
      const currentTime = new Date();
      const { decoded } = handleDecoded();
      if (decoded?.exp < currentTime.getTime() / 1000) {
        // console.log("decoded?.exp", decoded?.exp);

        try {
          const data = await UserService.refreshToken();
          // localStorage.setItem("access_token", data?.access_token);
          config.headers["token"] = `Bearer ${data?.access_token}`;
        } catch (error) {
          console.error("Lỗi khi làm mới token", error);
        }
      }
      return config;
    },
    function (error) {
      // Do something with request error
      return Promise.reject(error);
    }
  );

  const handleGetDetailsUser = async (id, token) => {
    const res = await UserService.getDetailsUser(id, token);
    // console.log("res", res);
    dispatch(updateUser({ ...res?.data, access_token: token }));
  };

  // useEffect(() => {
  //   fetchApi();
  // }, []);

  // console.log(
  //   "REACT_APP_API_URL_BACKEND: ",
  //   process.env.REACT_APP_API_URL_BACKEND
  // );

  // const fetchApi = async () => {
  //   const res = await axios.get(
  //     `${process.env.REACT_APP_API_URL_BACKEND}/user/get-all-user`
  //   );
  //   return res.data;
  // };

  // const query = useQuery({ queryKey: ["todos"], queryFn: fetchApi });
  // console.log("query: ", query);

  return (
    <div style={{ fontFamily: "poppins" }}>
      <Loading isLoading={showLoading} />
      {!showLoading && (
        <Router>
          <AuthProvider>
            <Routes>
              {routes.map((route) => {
                const Page = route.page;
                const isCheckAuth = !route.isPrivate || user.isAdmin;
                // console.log(`Route: ${route.path}, isCheckAuth: ${isCheckAuth}`);

                const Header = route.isShowHeader ? DefaultComponent : Fragment;
                const Footer = route.isShowFooter ? FooterComponent : Fragment;
                return (
                  <Route
                    key={route.path}
                    path={isCheckAuth ? route.path : undefined}
                    // path={route.path}
                    element={
                      <div>
                        <Header />
                        <Page />
                        <Footer />
                      </div>
                    }
                  />
                );
              })}
            </Routes>
          </AuthProvider>
        </Router>
      )}
      {/* </Loading> */}
    </div>
  );
}

export default App;
