"use client"

import React from "react"
import { useNavigate } from "react-router-dom"
import back from "../images/back.jpg"

function NotFound() {
    const navigate = useNavigate()

    const handleBackToHome = () => {
        navigate("/")
    }

    return (
        <div 
            style={{ backgroundImage: `url(${back})` }} 
            className="min-h-screen py-20 flex items-center justify-center bg-cover bg-center"
        >
            <div className="max-w-lg w-full mx-4 bg-white rounded-lg shadow-xl overflow-hidden my-8 animate__animated animate__fadeIn">
                <div className="p-8 text-center">
                    <h2 className="text-4xl font-bold text-gray-800 mb-4">404 - Page Not Found</h2>
                    <p className="text-gray-600 mb-6">
                        Oops! The page you're looking for doesn't exist or has been moved.
                    </p>
                    <button
                        onClick={handleBackToHome}
                        className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors duration-300"
                    >
                        Back to Home
                    </button>
                </div>
            </div>
        </div>
    )
}

export default NotFound