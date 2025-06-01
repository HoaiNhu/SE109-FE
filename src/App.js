// src/App.js
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
import Chatbot from "./components/Chatbot/Chatbot";
import MyChatbot from "./components/Chatbot/Chatbot";

function App() {
  const dispatch = useDispatch();
  const [showLoading, setShowLoading] = useState(false);
  const user = useSelector((state) => state.user);

  useEffect(() => {
    WebFont.load({
      google: {
        families: ["Poppins"],
      },
    });
  }, []);

  const handleDecoded = () => {
    let storageData = localStorage.getItem("access_token");
    let decoded = {};
    if (storageData) {
      try {
        decoded = jwtDecode(storageData);
      } catch (error) {
        console.error("Token không hợp lệ", error);
      }
    }
    return { decoded, storageData };
  };

  useEffect(() => {
    setShowLoading(true);
    const { storageData, decoded } = handleDecoded();
    if (decoded?.id) {
      handleGetDetailsUser(decoded?.id, storageData);
    }
    setShowLoading(false);
  }, []);

  UserService.axiosJWT.interceptors.request.use(
    async (config) => {
      const currentTime = new Date();
      const { decoded } = handleDecoded();
      if (decoded?.exp < currentTime.getTime() / 1000) {
        try {
          const data = await UserService.refreshToken();
          config.headers["token"] = `Bearer ${data?.access_token}`;
        } catch (error) {
          console.error("Lỗi khi làm mới token", error);
        }
      }
      return config;
    },
    (error) => Promise.reject(error)
  );

  const handleGetDetailsUser = async (id, token) => {
    try {
      const res = await UserService.getDetailsUser(id, token);
      dispatch(updateUser({ ...res?.data, access_token: token }));
    } catch (error) {
      console.error("Error fetching user details:", error);
    }
  };

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
                const Header = route.isShowHeader ? DefaultComponent : Fragment;
                const Footer = route.isShowFooter ? FooterComponent : Fragment;

                return (
                  <Route
                    key={route.path}
                    path={isCheckAuth ? route.path : undefined}
                    element={
                      <div>
                        <Header />
                        <Page />
                        <MyChatbot userId={user._id || "guest"} />
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
    </div>
  );
}

export default App;