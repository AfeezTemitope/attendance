import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import MyImage from '../assets/homepage.jpg';
import './Transition.css';

const ImageWithTextSection: React.FC = () => {
    const navigate = useNavigate();
    const [fadeOut, setFadeOut] = useState(false);

    const navigateToAnotherPage = () => {
        setFadeOut(true);
        setTimeout(() => {
            navigate("/LandingPage");
        }, 300);
    };

    return (
        <div className={`relative h-screen w-full overflow-hidden ${fadeOut ? 'fade-out' : ''}`}>
            <img
                src={MyImage}
                alt="Descriptive Alt Text"
                className="absolute h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-transparent to-black opacity-50" />
            <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center text-white p-10 z-10">
                    <h1 className="text-5xl font-bold mb-7">Welcome to Our Platform!</h1>
                    <p className="mb-8">
                        Discover amazing features and benefits. Join us today to start your journey!
                    </p>
                    <button
                        onClick={navigateToAnotherPage}
                        className="bg-orange-500 hover:bg-orange-400 text-white font-bold py-2 px-4 rounded shadow focus:outline-none transition duration-300 ease-in-out"
                    >
                        Get Started
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ImageWithTextSection;
