"use client"

import React, { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import back from '../images/back.jpg'
import Alert from '../components/Alert'

function EditProfile({ user, setUser, isLoggedIn, showToast }) {
    const BASE_URL = "http://localhost:5000";
    const [formData, setFormData] = useState({
        username: user?.username || "",
        email: user?.email || "",
        currentPassword: "",
        newPassword: ""
    })
    const [error, setError] = useState("")
    const [success, setSuccess] = useState("")
    const [isLoading, setIsLoading] = useState(false)
    const [showDeleteAlert, setShowDeleteAlert] = useState(false)
    const navigate = useNavigate()

    // Check if user is logged in
    useEffect(() => {
        if (!isLoggedIn || !user) {
            navigate("/login", { state: { from: "/profile" } })
        }
    }, [isLoggedIn, user, navigate])

    const handleChange = (e) => {
        const { name, value } = e.target
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }))
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setIsLoading(true)
        setError("")
        setSuccess("")

        // Validate inputs
        if (!formData.currentPassword) {
            setError("Current password is required")
            setIsLoading(false)
            return
        }
        if (formData.newPassword && formData.newPassword.length < 6) {
            setError("New password must be at least 6 characters")
            setIsLoading(false)
            return
        }

        try {
            const response = await fetch(`${BASE_URL}/api/update-profile`, {
                method: "PUT",
                credentials: "include",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    username: formData.username,
                    email: formData.email,
                    currentPassword: formData.currentPassword,
                    newPassword: formData.newPassword
                })
            })
            const data = await response.json()
            if (!response.ok) throw new Error(data.error || "Failed to update profile")
            setSuccess(data.message)
            setUser(data.user) // Update user state
            setFormData({
                ...formData,
                currentPassword: "",
                newPassword: ""
            })
        } catch (err) {
            setError(err.message)
        } finally {
            setIsLoading(false)
        }
    }

    const handleDeleteAccount = () => {
        console.log("Delete Account button clicked")
        setShowDeleteAlert(true)
    }

    const confirmDeleteAccount = async () => {
        console.log("Confirm Delete Account triggered")
        setShowDeleteAlert(false)
        setIsLoading(true)
        setError("")
        setSuccess("")

        try {
            const response = await fetch(`${BASE_URL}/api/delete-account`, {
                method: "DELETE",
                credentials: "include",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ currentPassword: formData.currentPassword })
            })
            const data = await response.json()
            if (!response.ok) throw new Error(data.error || "Failed to delete account")
            setUser(null)
            showToast("Your account has been deleted successfully", "success")
            navigate("/login")
        } catch (err) {
            setError(err.message)
        } finally {
            setIsLoading(false)
        }
    }

    if (!isLoggedIn || !user) {
        return null // Render nothing while redirecting
    }

    return (
        <div style={{ backgroundImage: `url(${back})` }} className="min-h-screen py-20 flex items-center justify-center bg-cover bg-center">
            {/* Overlay with blur effect */}
            <div className="absolute h-[51rem] inset-0 bg-[#4848e61f]"></div>
            {isLoading && (
                <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
                    <div className="w-16 h-16 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
                </div>
            )}
            {error && (
                <div className="fixed top-4 right-4 z-50 bg-red-500 text-white px-4 py-2 rounded-lg shadow-lg animate__animated animate__fadeInDown">
                    {error}
                </div>
            )}
            {success && (
                <div className="fixed top-4 right-4 z-50 bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg animate__animated animate__fadeInDown">
                    {success}
                </div>
            )}
            <Alert
                isOpen={showDeleteAlert}
                onClose={() => {
                    console.log("Alert closed")
                    setShowDeleteAlert(false)
                }}
                onConfirm={confirmDeleteAccount}
                title="Confirm Account Deletion"
                message="Are you sure you want to delete your account? This action cannot be undone."
            />
            <div className="max-w-lg w-full mx-4 bg-white rounded-lg shadow-xl overflow-hidden my-8 animate__animated animate__fadeIn">
                <div className="p-8">
                    <h2 className="text-3xl font-bold text-center mb-8 text-gray-800">Edit Profile</h2>
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="username">
                                Username
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <i className="fas fa-user text-gray-400 text-sm"></i>
                                </div>
                                <input
                                    type="text"
                                    id="username"
                                    name="username"
                                    value={formData.username}
                                    onChange={handleChange}
                                    className="w-full pl-10 px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
                                    placeholder="Enter your username"
                                />
                            </div>
                        </div>
                        <div>
                            <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="email">
                                Email
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <i className="fas fa-envelope text-gray-400 text-sm"></i>
                                </div>
                                <input
                                    type="email"
                                    id="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    className="w-full pl-10 px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
                                    placeholder="Enter your email"
                                />
                            </div>
                        </div>
                        <div>
                            <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="currentPassword">
                                Current Password
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <i className="fas fa-lock text-gray-400 text-sm"></i>
                                </div>
                                <input
                                    type="password"
                                    id="currentPassword"
                                    name="currentPassword"
                                    value={formData.currentPassword}
                                    onChange={handleChange}
                                    className="w-full pl-10 px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
                                    placeholder="Enter current password"
                                    required
                                />
                            </div>
                        </div>
                        <div>
                            <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="newPassword">
                                New Password (Optional)
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <i className="fas fa-lock text-gray-400 text-sm"></i>
                                </div>
                                <input
                                    type="password"
                                    id="newPassword"
                                    name="newPassword"
                                    value={formData.newPassword}
                                    onChange={handleChange}
                                    className="w-full pl-10 px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
                                    placeholder="Enter new password"
                                />
                            </div>
                        </div>
                        <div className="flex space-x-4">
                            <button
                                type="submit"
                                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors duration-200"
                                disabled={isLoading}
                            >
                                <i className="fas fa-save mr-2"></i> Save Changes
                            </button>
                            <button
                                type="button"
                                onClick={handleDeleteAccount}
                                className="flex-1 bg-red-600 hover:bg-red-700 text-white font-medium py-3 px-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-colors duration-200 cursor-pointer"
                                disabled={isLoading}
                            >
                                <i className="fas fa-trash-alt mr-2"></i> Delete Account
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default EditProfile