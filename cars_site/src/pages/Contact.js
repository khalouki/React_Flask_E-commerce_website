"use client"

import React, { useEffect } from "react"
import { useNavigate } from "react-router-dom"
import ContactSection from "../components/ContactSection"
import back from "../images/back.jpg"

function Contact({ isLoggedIn }) {
    const navigate = useNavigate()

    // Check if user is logged in
    useEffect(() => {
        if (!isLoggedIn) {
            navigate("/login", { state: { from: "/contact" } })
        }
    }, [isLoggedIn, navigate])

    if (!isLoggedIn) {
        return null // Render nothing while redirecting
    }

    return (
        <div style={{ backgroundImage: `url(${back})` }} className="min-h-screen py-20 flex items-center justify-center bg-cover bg-center">
            {/* Overlay with blur effect */}
            <div className="absolute h-[61rem] inset-0 bg-[#4848e61f]"></div>
            <ContactSection isLoggedIn={isLoggedIn} />
        </div>
    )
}

export default Contact