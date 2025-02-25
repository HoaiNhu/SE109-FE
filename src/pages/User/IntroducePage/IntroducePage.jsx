import React from "react";
import "./IntroducePage.css";
import "../../../assets/css/style.css";
import img1 from "../../../assets/img/hero_2.jpg";
import story from "../../../assets/img/story.jpg";

const IntroducePage = () => {
  return (
    <div>
      <div className="container-xl introduce-container">
        {/* title */}
        <div className="introduce">
          {/* introduce top */}
          <div className="introduce__top">
            <h1 className="introduce__title">GIỚI THIỆU</h1>
            <h3 className="introduce__welcome">
              Chào mừng bạn đến với Avocado Bakery
            </h3>
          </div>

          {/* introduce bot */}
          <div className="introduce__bot">
            {/* introduce left */}
            <div className="introduce__left">
              <div className="introduce__image">
                <img src={img1} alt="Ảnh cái bánh" />
              </div>
              <div className="introduce__image--border"></div>
            </div>
            {/* introduce right */}
            <div className="introduce__right">
              <h4 className="introduce__paragraph--title">
                Câu chuyện thương hiệu
              </h4>
              <p className="introduce__paragraph--content">
                Là một hệ thống đội ngũ nhân viên và lãnh đạo chuyên nghiệp, gồm
                CBCNV và những người thợ đã có kinh nghiệm lâu năm trong các
                công ty đầu ngành. Mô hình vận hành hoạt động công ty được bố
                trí theo chiều ngang, làm gia tăng sự thuận tiện trong việc vận
                hành cỗ máy kinh doanh và gia tăng sự phối hợp thống nhất giữa
                các bộ phận trong công ty.
              </p>
            </div>
          </div>
          <br></br>
          <br></br>
          <br></br>
          <div className="introduce__bot">
            {/* introduce left */}
            <div className="introduce__right">
              <h4 className="introduce__paragraph--title">
                Sứ mệnh - tầm nhìn
              </h4>
              <p
                className="introduce__paragraph--content"
                style={{ marginRight: "10px" }}
              >
                Avocado tự hào là một thương hiệu bánh ngọt Việt Nam chất lượng
                cao, được xây dựng từ chính tình yêu và tâm huyết dành trọn cho
                khách hàng. Với sứ mệnh mang đến những chiếc bánh thơm ngon,
                tươi mới, và đầy sáng tạo, Avocado không chỉ là nơi cung cấp
                bánh mà còn là cầu nối gắn kết những khoảnh khắc hạnh phúc của
                mọi người. Từ nguyên liệu được chọn lọc kỹ lưỡng, quy trình sản
                xuất nghiêm ngặt đến việc thiết kế từng chiếc bánh theo phong
                cách tinh tế, chúng tôi luôn nỗ lực để mang lại trải nghiệm
                tuyệt vời nhất cho khách hàng. Bất kể là bữa tiệc sinh nhật, lễ
                cưới hay một buổi họp mặt ấm cúng, Avocado luôn đồng hành để tạo
                nên những ký ức đáng nhớ và ý nghĩa nhất. Chúng tôi trân trọng
                sự tin yêu của khách hàng và cam kết không ngừng sáng tạo để
                mang đến những sản phẩm vượt trên cả mong đợi. Với Avocado, mỗi
                chiếc bánh không chỉ là món ăn, mà còn là thông điệp của tình
                yêu, sự tận tâm và chất lượng.
              </p>
            </div>
            {/* introduce right */}
            <div className="introduce__left">
              <div className="introduce__image">
                <img src={story} alt="Ảnh cái bánh" />
              </div>
              <div className="introduce__image--border"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default IntroducePage;
