import React from "react";
import FormComponent from "../../../../components/FormComponent/FormComponent";
import SideMenuComponent from "../../../../components/SideMenuComponent/SideMenuComponent";
import ButtonComponent from "../../../../components/ButtonComponent/ButtonComponent";
import "./AddStatusPage.css";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { createStatus } from "../../../../services/StatusService";
import Loading from "../../../../components/LoadingComponent/Loading";
import Message from "../../../../components/MessageComponent/Message";
import * as StatusService from "../../../../services/StatusService";
import { useMutationHook } from "../../../../hooks/useMutationHook";
import { isAdmin } from "../../../../utils";

const AddStatusPage = () => {
  // const [statusCode, setStatusCode] = useState("");
  // const [statusName, setStatusName] = useState("");
  // const [statusDescription, setStatusDescription] = useState("");
  const accessToken = localStorage.getItem("access_token");

  const [formData, setFormData] = useState({
    statusCode: "",
    statusName: "",
    statusDescription: "",
  });

  // const [errorMessage, setErrorMessage] = useState(null);
  const [showLoading, setShowLoading] = useState(false); // Thêm trạng thái riêng
  // const [errorMessage, setErrorMessage] = useState("");
  const [statusMessage, setStatusMessage] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  const handleSubmit = async (e) => {
    e.preventDefault();
    mutation.mutate(formData);
  };

  const handleExit = () => {
    navigate(location.state?.from || "/status-list");
  };

  const mutation = useMutationHook((data) =>
    StatusService.createStatus(data, accessToken)
  );
  useEffect(() => {
    if (mutation.isSuccess) {
      setFormData({
        statusCode: "",
        statusName: "",
        statusDescription: "",
      });
      setStatusMessage({
        type: "Success",
        message: "Status added successfully!",
      });
    } else if (mutation.isError) {
      const errorMessage =
        mutation.error?.message.message ||
        JSON.stringify(mutation.error) ||
        "Failed to add status.";
      console.log("errorMessage", errorMessage);
      setStatusMessage({
        type: "Error",
        message: errorMessage,
      });
    }
  }, [mutation.isSuccess, mutation.isError, mutation.error]);

  const handleChange = (e) => {
    setFormData((prevData) => ({
      ...prevData,
      [e.target.name]: e.target.value,
    }));
  };

  return (
    <div>
      <div className="container-xl">
        {statusMessage && (
          <Message
            type={statusMessage.type}
            message={
              typeof statusMessage.message === "string"
                ? statusMessage.message
                : JSON.stringify(statusMessage.message)
            }
            duration={3000}
            onClose={() => setStatusMessage(null)}
          />
        )}
        <div className="add-status__container">
          {/* side menu */}
          <div className="side-menu__status">
            <SideMenuComponent>Store information</SideMenuComponent>
            <SideMenuComponent>Order</SideMenuComponent>
            <SideMenuComponent>Promotion</SideMenuComponent>
            <SideMenuComponent>Status</SideMenuComponent>
            <SideMenuComponent>Category</SideMenuComponent>
            <SideMenuComponent>User list</SideMenuComponent>
            <SideMenuComponent>Statistic</SideMenuComponent>
          </div>

          <div className="add-status__content">
            <div className="status__info">
              <div className="add-status__title">
                <h2>Add status</h2>
              </div>

              <Loading isLoading={showLoading} />
              {!showLoading && (
                <div className="content">
                  <div className="content__item">
                    <label className="id__title">Code</label>
                    <FormComponent
                      placeholder="S5"
                      name="statusCode"
                      value={formData.statusCode}
                      onChange={handleChange}
                    ></FormComponent>
                  </div>
                  <div className="content__item">
                    <label className="name__title">Name</label>
                    <FormComponent
                      placeholder="Enter name"
                      name="statusName"
                      value={formData.statusName}
                      onChange={handleChange}
                    ></FormComponent>
                  </div>
                  <div className="content__item">
                    <label className="description__title">
                      Description
                    </label>
                    <FormComponent
                      placeholder="Enter description"
                      name="statusDescription"
                      value={formData.statusDescription}
                      onChange={handleChange}
                    ></FormComponent>
                  </div>
                </div>
              )}
              {/* button */}
              <div className="btn__add-status">
                <ButtonComponent type="submit" onClick={handleSubmit}>
                  Save
                </ButtonComponent>
                <ButtonComponent onClick={handleExit}>Exit</ButtonComponent>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddStatusPage;
