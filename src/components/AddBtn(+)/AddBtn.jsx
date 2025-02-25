import React from 'react';
import './AddBtn.css';
import { useNavigate } from 'react-router-dom';

const AddBtn = ({ path }) => {
    const navigate = useNavigate();

    const handleClickAdd = (path) => {
        navigate(path);
    };

    return (
        <div className='AddBtnHolder'>
            <button className='AddBtn' onClick={() => handleClickAdd(path)}>
                <svg xmlns="http://www.w3.org/2000/svg" width="69" height="69" viewBox="0 0 69 69" fill="none">
                    <circle cx="34.5" cy="34.5" r="34.5" fill="#B1E321" />
                    <text
                        x="50%"
                        y="60%"
                        dominant-baseline="middle"
                        text-anchor="middle"
                        fill="#3A060E"
                        font-size="64"
                        font-family="Arial, sans-serif"
                    >
                        +
                    </text>
                </svg>
            </button>
        </div>
    );
};

export default AddBtn;
