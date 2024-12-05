import React from "react";

const Header: React.FC = () => {
    return (
        <header className="bg-gray-800 p-4">
            <div className="container mx-auto text-center">
                <h1 className="text-4xl md:text-6xl font-bold text-gradient">
                    <span className="text-red-500">A</span>
                    <span className="text-orange-500">T</span>
                    <span className="text-yellow-500">T</span>
                    <span className="text-green-500">E</span>
                    <span className="text-blue-500">N</span>
                    <span className="text-indigo-500">D</span>
                    <span className="text-purple-500">A</span>
                    <span className="text-pink-500">N</span>
                    <span className="text-teal-500">C</span>
                    <span className="text-gray-500">E</span>
                </h1>
            </div>
        </header>
    );
};

export default Header;
