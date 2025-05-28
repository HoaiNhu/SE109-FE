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
            <h1 className="introduce__title">INTRODUCE</h1>
            <h3 className="introduce__welcome">
              Welcome to NNN.
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
                🌿 OUR BRAND STORY
              </h4>
              <p className="introduce__paragraph--content">
                From the very first glance, jewelry is more than just an accessory — it's a way to tell your personal story. Our jewelry website was born from a simple desire: to bring pure, elegant beauty with a personal touch to every woman.We believe that each piece of jewelry holds meaning. It's a gift to mark a milestone, a ring to celebrate love, or simply a bracelet that gives you a boost of confidence every time you wear it. What started from a small workshop, guided by hands full of passion, has grown into a digital space — so no matter where you are, you can find a piece of yourself in our designs.
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
                ✨ OUR MISSION - 🌟 OUR VISION
              </h4>
              <p
                className="introduce__paragraph--content"
                style={{ marginRight: "10px" }}
              >
                Our mission is to be a trusted companion, offering meaningful, high-quality, and beautifully designed jewelry that empowers individuals to express their identity, emotions, and values with elegance.

                To become a beloved jewelry brand in Vietnam and expand to the global market, where every product is crafted with inspiration, care, and a desire to celebrate the authentic beauty within everyone.
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
