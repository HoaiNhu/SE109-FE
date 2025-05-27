import { useState } from "react";
import { useLocation } from "react-router-dom";
import ButtonComponent from "../../../../components/ButtonComponent/ButtonComponent";
import FormComponent from "../../../../components/FormComponent/FormComponent";
import "./UpdateContact.css";

const UpdateContact = () => {
    const { state: contactData } = useLocation(); // Nhận dữ liệu từ `state`
    const [contact, setcontact] = useState(
        contactData || {
            pName: "",
            contactPrice: "",
            contactSize: "",
            contactCategory: "",
            contactImage: null,
            contactDescription: "",
        }
    );

    const [imagePreview, setImagePreview] = useState(
        contact.contactImage || null
    );

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const previewURL = URL.createObjectURL(file); // Tạo URL tạm để hiển thị hình
            setImagePreview(previewURL);
            setcontact({ ...contact, contactImage: file });
        }
    };

    const handleEditImage = () => {
        document.getElementById("imageInput").click(); // Kích hoạt input chọn file
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log("contact data:", contact);
        // Thực hiện logic gửi sản phẩm (ví dụ: gọi API)
    };

    return (
        <div>
            <div className="container-xl update-contact">
                <h1 className="update-contact__title">LIÊN HỆ</h1>

                {/* update information */}
                <div className="update-contatct__information">
                    {/* info top */}
                    <div className="info__top-contact">
                        {/* info right */}
                        <div className="info__right-contact">
                            <div className="contactHolder-field">
                                <div className="contact-field-holder">
                                    <p className="contact-field">Tên doanh nghiệp:</p>
                                    <p className="contact-field">Địa chỉ:</p>
                                    <p className="contact-field">Email:</p>
                                    <p className="contact-field">Website:</p>
                                    <p className="contact-field">Hotline:</p>
                                    <p className="contact-field">Số điện thoại:</p>
                                    <p className="contact-field">Hotline CSKH:</p>
                                </div>
                                <div className="input-holder-contact">
                                    <div className="area1">
                                        <FormComponent></FormComponent>
                                        <FormComponent></FormComponent>
                                        <FormComponent></FormComponent>
                                        <FormComponent></FormComponent>
                                    </div>
                                    <div className="area2">
                                        <FormComponent></FormComponent>
                                        <FormComponent></FormComponent>
                                    </div>
                                </div>
                            </div>

                            <div className="info__left-contact">
                                <div className="contact__image-container">
                                    {imagePreview ? (
                                        <img
                                            src={imagePreview}
                                            alt="contact Preview"
                                            className="contact__image-preview"
                                        />
                                    ) : (
                                        <div className="contact__image-placeholder">
                                            Chọn hình ảnh
                                        </div>
                                    )}
                                    <input
                                        id="imageInput"
                                        className="contact__image"
                                        type="file"
                                        onChange={handleImageChange}
                                        accept="image/*"
                                        style={{ display: "none" }}
                                    />
                                    <div className="icon__update-image" onClick={handleEditImage}>
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            width="30"
                                            height="30"
                                            viewBox="0 0 30 30"
                                            fill="none"
                                        >
                                            <path
                                                d="M17.575 11.275L18.725 12.425L7.4 23.75H6.25V22.6L17.575 11.275ZM22.075 3.75C21.7625 3.75 21.4375 3.875 21.2 4.1125L18.9125 6.4L23.6 11.0875L25.8875 8.8C26.0034 8.68436 26.0953 8.547 26.158 8.39578C26.2208 8.24456 26.2531 8.08246 26.2531 7.91875C26.2531 7.75504 26.2208 7.59294 26.158 7.44172C26.0953 7.2905 26.0034 7.15314 25.8875 7.0375L22.9625 4.1125C22.7125 3.8625 22.4 3.75 22.075 3.75ZM17.575 7.7375L3.75 21.5625V26.25H8.4375L22.2625 12.425L17.575 7.7375Z"
                                                fill="#3A060E"
                                            />
                                        </svg>
                                    </div>
                                </div>
                            </div>
                        </div>

                    </div>
                    {/* submit */}
                    <div className="btn-submit">
                        <ButtonComponent onClick={handleSubmit}>Cập nhật</ButtonComponent>
                        <ButtonComponent>Thoát</ButtonComponent>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UpdateContact;
