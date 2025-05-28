import React from "react";
import "./SideMenuComponent.css";
import ButtonNoBGComponent from "../ButtonNoBGComponent/ButtonNoBGComponent";

const SideMenuComponent = (props) => {
  return (
    <div>
      <div className="side-menu sticky-left">
        <div
          className=" btn__side-menu"
          role="group"
          aria-label="Vertical button group"
        >
          <button className="btn__component" onClick={props.onClick}>
            {props.children}
          </button>
        </div>
      </div>
    </div>
  );
};

export default SideMenuComponent;
