import React from "react";
import FormComponent from "../../../../components/FormComponent/FormComponent";
import SideMenuComponent from "../../../../components/SideMenuComponent/SideMenuComponent";
import ButtonComponent from "../../../../components/ButtonComponent/ButtonComponent";
import "./AddStatusPage.css";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import * as StatusService from "../../../../services/StatusService";
import Loading from "../../../../components/LoadingComponent/Loading";
import Message from "../../../../components/MessageComponent/Message";
import { useMutationHook } from "../../../../hooks/useMutationHook";
import { isAdmin } from "../../../../utils";

const AddStatusPage = () => {
  const accessToken = localStorage.getItem("access_token");

  const [formData, setFormData] = useState({
    statusCode: "",
    statusName: "",
    statusDescription: "",
  });

  const [errors, setErrors] = useState({}); // State to track validation errors
  const [showLoading, setShowLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  // Validation function to check for empty fields
  const validateForm = () => {
    const newErrors = {};
    if (!formData.statusCode.trim()) {
      newErrors.statusCode = "Status Code is required";
    }
    if (!formData.statusName.trim()) {
      newErrors.statusName = "Status Name is required";
    }
    // Optional: Make statusDescription required or keep it optional
    if (!formData.statusDescription.trim()) {
      newErrors.statusDescription = "Status Description is required";
    }
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate form
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      setStatusMessage({
        type: "Error",
        message: "Please fill in all required fields.",
      });
      return;
    }

    // Clear errors and proceed with submission
    setErrors({});
    setShowLoading(true);
    mutation.mutate(formData);
  };

  const handleExit = () => {
    navigate(location.state?.from || "/status-list");
  };

  const mutation = useMutationHook((data) =>
    StatusService.createStatus(data, accessToken)
  );

  useEffect(() => {
    setShowLoading(false); // Reset loading state after mutation
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
    // Clear error for the field being edited
    setErrors((prevErrors) => ({
      ...prevErrors,
      [e.target.name]: "",
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
          <div className="side-menu__status">
            <SideMenuComponent>Store information</SideMenuComponent>
            <SideMenuComponent>Order</SideMenuComponent>
            <SideMenuComponent>Promotion</SideMenuComponent>
            <SideMenuComponent>Status</SideMenuComponent>
            <SideMenuComponent>Category</SideMenuComponent>
            <SideMenuComponent>User</SideMenuComponent>
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
                      error={errors.statusCode} // Pass error to FormComponent
                    />
                    {errors.statusCode && (
                      <span className="error-message">{errors.statusCode}</span>
                    )}
                  </div>
                  <div className="content__item">
                    <label className="name__title">Name</label>
                    <FormComponent
                      placeholder="Enter name"
                      name="statusName"
                      value={formData.statusName}
                      onChange={handleChange}
                      error={errors.statusName}
                    />
                    {errors.statusName && (
                      <span className="error-message">{errors.statusName}</span>
                    )}
                  </div>
                  <div className="content__item">
                    <label className="description__title">Description</label>
                    <FormComponent
                      placeholder="Enter description"
                      name="statusDescription"
                      value={formData.statusDescription}
                      onChange={handleChange}
                      error={errors.statusDescription}
                    />
                    {errors.statusDescription && (
                      <span className="error-message">
                        {errors.statusDescription}
                      </span>
                    )}
                  </div>
                </div>
              )}
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
