import React, { useState, useEffect } from 'react'

function Alert({ isOpen, onClose, onConfirm, title, message }) {
    const [isClosing, setIsClosing] = useState(false)

    // Handle closing animation
    useEffect(() => {
        if (!isOpen && isClosing) {
            const timer = setTimeout(() => {
                setIsClosing(false)
            }, 200) // Match animate__bounceOut duration (0.2s)
            return () => clearTimeout(timer)
        }
    }, [isOpen, isClosing])

    // Trigger closing animation before unmounting
    const handleClose = () => {
        setIsClosing(true)
        setTimeout(onClose, 200) // Delay onClose until animation completes
    }

    const handleConfirm = () => {
        setIsClosing(true)
        setTimeout(onConfirm, 200) // Delay onConfirm until animation completes
    }

    if (!isOpen && !isClosing) return null

    return (
        <div
            className={`fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50 animate__animated ${isClosing ? 'animate__bounceOut' : 'animate__bounceIn'}`}
            style={{ '--animate-duration': '0.2s' }}
            role="dialog"
            aria-labelledby="alert-title"
            aria-modal="true"
        >
            <div className="bg-white rounded-2xl shadow-2xl max-w-sm w-full mx-4 overflow-hidden">
                <div className="p-6">
                    <h3 id="alert-title" className="text-2xl font-bold text-gray-800 mb-4 flex items-center">
                        <i className="fas fa-exclamation-circle text-red-500 mr-3 text-xl"></i>
                        {title}
                    </h3>
                    <p className="text-gray-600 text-base mb-6">{message}</p>
                    <div className="flex space-x-3">
                        <button
                            onClick={handleClose}
                            className="flex-1 bg-gray-500 hover:bg-gray-600 hover:animate__animated hover:animate__pulse text-white font-semibold py-3 px-4 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-500 transition-colors duration-150"
                            style={{ '--animate-duration': '0.15s' }}
                            aria-label="Cancel"
                        >
                            <i className="fas fa-times mr-2"></i> Cancel
                        </button>
                        <button
                            onClick={handleConfirm}
                            className="flex-1 bg-blue-600 hover:bg-blue-700 hover:animate__animated hover:animate__pulse text-white font-semibold py-3 px-4 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-150"
                            style={{ '--animate-duration': '0.15s' }}
                            aria-label="Confirm"
                        >
                            <i className="fas fa-check mr-2"></i> Confirm
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Alert