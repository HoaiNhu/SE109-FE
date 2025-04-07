import React, { useEffect, useRef, useState } from "react";
import styles from "./HeaderComponent.module.css";
import img from "../../assets/img/AVOCADO.png";
import SearchBoxComponent from "../SearchBoxComponent/SearchBoxComponent";
import ButtonComponent from "../ButtonComponent/ButtonComponent";
import ButtonNoBGComponent from "../ButtonNoBGComponent/ButtonNoBGComponent";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useSelector } from "react-redux";
import { Popover, OverlayTrigger, Button } from "react-bootstrap";
import SideMenuComponent from "../SideMenuComponent/SideMenuComponent";
import * as UserService from "../../services/UserService";
import { useDispatch } from "react-redux";
import { resetUser } from "../../redux/slides/userSlide";
import Loading from "../LoadingComponent/Loading";
import UserIconComponent from "../UserIconComponent/UserIconComponent";
import CartIconComponent from "../CartIconComponent/CartIconComponent";

const HeaderComponent = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [showLoading, setShowLoading] = useState(false);
  const [userName, setUserName] = useState("");
  const [userImage, setUserImage] = useState("");

  const handleNavigationLogin = () => {
    navigate("/login");
  };
  const handleClickCart = () => {
    navigate("/cart");
  };

  // const { user, logout } = useAuth();

  const user = useSelector((state) => state.user);
  // console.log("user", user);

  //Lấy số lượng sản phẩm trong giỏ
  const cartItems = useSelector((state) => state.cart.products);
  const cartQuantity = cartItems.reduce(
    (total, item) => total + item.quantity,
    0
  ); // Tính tổng số lượng sản phẩm

  const handleLogout = async () => {
    setShowLoading(true);
    await UserService.logoutUser();
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    localStorage.removeItem("cart");
    // console.log(
    //   "Access token after removal:",
    //   localStorage.getItem("access-token")
    // ); // Kiểm tra xem token đã bị xóa chưa
    dispatch(resetUser());
    setShowLoading(false);
    handleNavigationLogin();
  };

  useEffect(() => {
    setShowLoading(true);
    setUserName(user?.userName);
    setShowLoading(false);
  }, [user?.userName, user?.userImage]);

  //Click Search
  const handleSearch = (query) => {
    if (!query.trim()) {
      alert("Please enter a keyword to search!");
      return;
    }
    navigate(`/search?search=${encodeURIComponent(query.trim())}`);
  };

  const handleUserInfo = () => {
    navigate("/user-info"); // Navigate to user information page
  };

  const popover = (
    <Popover id="popover-basic">
      <Popover.Body>
        <div className="d-flex flex-column">
          <SideMenuComponent
            variant="link"
            className="text-start"
            onClick={handleUserInfo}
          >
            Profile
          </SideMenuComponent>
          <SideMenuComponent
            variant="link"
            className="text-start"
            onClick={handleLogout}
          >
            Log out
          </SideMenuComponent>
        </div>
      </Popover.Body>
    </Popover>
  );

  return (
    <div className="bg-white sticky-top bg-shadow">
      <div
        className="container-xl text-center "
        style={{ width: "width-screen" }}
      >
        <div className={styles.navbar}>
          <div className="container-fluid">
            {/* nav top */}
            <div className="row">
              <div className="col">
                <a className="navbar-brand" href="/">
                  <img src={img} alt="Avocado" className="navbar__img" />
                </a>
              </div>
              <div className={`col ${styles.navbar__search__form}`}>
                <SearchBoxComponent
                  onSearch={handleSearch}
                  onButtonClick={(query) => handleSearch(query)}
                />
              </div>

              <div className={`col ${styles.nav__cart}`}>
                {user?.isAdmin === false && (
                  <div className={styles.cart__icon__wrapper}>
                    <CartIconComponent onClick={handleClickCart} />
                    {cartQuantity > 0 && (
                      <span className={styles.cart__quantity}>
                        {cartQuantity}
                      </span>
                    )}
                  </div>
                )}
              </div>
              <div className={`col text-end ${styles.btn__container}`}>
                <Loading isLoading={showLoading} />
                {!showLoading && user?.isLoggedIn ? (
                  <OverlayTrigger
                    trigger="click"
                    placement="bottom"
                    overlay={popover}
                  >
                    <div className={styles.user__icon}>
                      {userImage ? (
                        <img
                          src={userImage}
                          alt="avatar"
                          style={{
                            width: "30px",
                            height: "30px",
                            borderRadius: "50%",
                            objectFit: "cover",
                          }}
                        />
                      ) : (
                        <UserIconComponent />
                      )}
                      <span style={{color:"#09122C)"}}>{user.userName || user.userEmail || "User"}</span>
                    </div>
                  </OverlayTrigger>
                ) : (
                  <div className="d-flex gap-2">
                    <Link to="/signup" className={styles.btn__signup}>
                      Sign up
                    </Link>
                    <div className={styles.btn__signup}>
                      <ButtonComponent onClick={handleNavigationLogin}>
                        Log in
                      </ButtonComponent>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* nav bottom */}
            <div className={`row ${styles.nav__bot}`}>
              <div className={styles.nav__content}>
                {/* nav admin */}
                {user?.isAdmin ? (
                  <>
                    <ButtonNoBGComponent to="/">Home</ButtonNoBGComponent>
                    <ButtonNoBGComponent to="/admin/products">
                      Product
                    </ButtonNoBGComponent>
                    <ButtonNoBGComponent to="/admin/news">
                      News
                    </ButtonNoBGComponent>
                    <ButtonNoBGComponent to="/introduce">
                      Our Story
                    </ButtonNoBGComponent>
                    <ButtonNoBGComponent to="/admin/introduce">
                      Contact
                    </ButtonNoBGComponent>
                    <ButtonNoBGComponent to="/admin/store-info">
                      Manage
                    </ButtonNoBGComponent>
                  </>
                ) : (
                  // nav user
                  <>
                    <ButtonNoBGComponent to="/">Home</ButtonNoBGComponent>
                    <ButtonNoBGComponent to="/products">
                      Product
                    </ButtonNoBGComponent>
                    <ButtonNoBGComponent to="/news">
                      News
                    </ButtonNoBGComponent>
                    <ButtonNoBGComponent to="/introduce">
                      Our Story
                    </ButtonNoBGComponent>
                    <ButtonNoBGComponent to="/contact">
                      Contact
                    </ButtonNoBGComponent>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeaderComponent;
