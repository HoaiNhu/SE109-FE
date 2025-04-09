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
            <h1 className="introduce__title">INTRODUCES</h1>
            <h3 className="introduce__welcome">Welcome to Avocado Jewelry</h3>
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
              <h4 className="introduce__paragraph--title">The brand story</h4>
              <p className="introduce__paragraph--content">
                We are a professional team of employees and leaders, including
                staff members and skilled artisans with years of experience in
                leading companies within the industry. Our company operates with
                a horizontal organizational structure, enhancing business
                efficiency and fostering seamless collaboration among
                departments.
              </p>
            </div>
          </div>
          <br></br>
          <br></br>
          <br></br>
          <div className="introduce__bot">
            {/* introduce left */}
            <div className="introduce__right">
              <h4 className="introduce__paragraph--title">Mission - Vision</h4>
              <p
                className="introduce__paragraph--content"
                style={{ marginRight: "10px" }}
              >
                Avocado proudly stands as a high-quality Vietnamese jewelry
                brand, built on passion and dedication to our customers. With a
                mission to bring sophisticated, luxurious, and unique jewelry
                designs, Avocado is not just a jewelry provider but a bridge
                that helps you shine in every important moment. From carefully
                selected precious materials and meticulous craftsmanship to
                exquisitely designed jewelry, we strive to offer the finest
                experience to our customers. Whether it's a meaningful gift, a
                personal accessory, or a statement piece for special occasions,
                Avocado is always by your side to create unforgettable and
                distinctive impressions. We deeply appreciate our customers'
                trust and are committed to continuous innovation and creativity,
                bringing products that exceed expectations. At Avocado, every
                piece of jewelry is not just an accessory but a symbol of love,
                dedication, and timeless value .
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
