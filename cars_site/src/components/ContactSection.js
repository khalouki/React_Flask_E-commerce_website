"use client"

import React, { useState } from "react"
import { MapPin, Phone, Mail } from "lucide-react"

function ContactSection({ showToast }) {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        subject: "",
        message: ""
    })
    const [isLoading, setIsLoading] = useState(false)

    const handleChange = (e) => {
        const { name, value } = e.target
        setFormData(prev => ({
            ...prev,
            [name]: value
        }))
    }

    const validateForm = () => {
        if (!formData.name.trim()) {
            showToast("Le nom est requis", "error")
            return false
        }
        if (!formData.email.trim()) {
            showToast("L'email est requis", "error")
            return false
        }
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            showToast("Veuillez entrer une adresse email valide", "error")
            return false
        }
        if (!formData.message.trim()) {
            showToast("Le message est requis", "error")
            return false
        }
        return true
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setIsLoading(true)

        if (!validateForm()) {
            setIsLoading(false)
            return
        }

        try {
            const response = await fetch("http://localhost:5000/api/contact", {
                method: "POST",
                credentials: "include",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData)
            })
            const data = await response.json()
            if (!response.ok) throw new Error(data.error || "Échec de l'envoi du message")
            
            showToast("Votre message a été envoyé avec succès !", "success")
            setFormData({
                name: "",
                email: "",
                subject: "",
                message: ""
            })
        } catch (err) {
            showToast(err.message || "Une erreur est survenue. Veuillez réessayer.", "error")
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <section id="contact" className="py-16 bg-gray-50 min-h-screen pt-24">
            <div className="container mx-auto px-4">
                <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-800 mb-12 animate__animated animate__fadeInDown">
                    Contactez-<span className="text-emerald-600">Nous</span>
                </h2>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
                    {/* Contact Info */}
                    <div className="bg-white p-8 rounded-xl shadow-lg animate__animated animate__fadeInLeft">
                        <h3 className="text-2xl font-semibold text-gray-800 mb-6">Nos Coordonnées</h3>
                        <div className="space-y-6">
                            <div className="flex items-start gap-4">
                                <MapPin className="w-6 h-6 text-emerald-600 flex-shrink-0" />
                                <div>
                                    <h4 className="font-medium text-gray-800">Adresse</h4>
                                    <p className="text-gray-600">mghila 3 , Beni Mellal ,  maroc</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-4">
                                <Phone className="w-6 h-6 text-emerald-600 flex-shrink-0" />
                                <div>
                                    <h4 className="font-medium text-gray-800">Téléphone</h4>
                                    <p className="text-gray-600">+212 645367890</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-4">
                                <Mail className="w-6 h-6 text-emerald-600 flex-shrink-0" />
                                <div>
                                    <h4 className="font-medium text-gray-800">Email</h4>
                                    <p className="text-gray-600">fpbm@usms.ma</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Contact Form */}
                    <div className="bg-white p-8 rounded-xl shadow-lg animate__animated animate__fadeInRight">
                        <h3 className="text-2xl font-semibold text-gray-800 mb-6">Envoyez un Message</h3>
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="name">
                                        Votre Nom <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        id="name"
                                        name="name"
                                        type="text"
                                        value={formData.name}
                                        onChange={handleChange}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-200"
                                        placeholder="John Doe"
                                    />
                                </div>
                                <div>
                                    <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="email">
                                        Votre Email <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        id="email"
                                        name="email"
                                        type="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-200"
                                        placeholder="john@example.com"
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="subject">
                                    Sujet
                                </label>
                                <input
                                    id="subject"
                                    name="subject"
                                    type="text"
                                    value={formData.subject}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-200"
                                    placeholder="Sujet de votre message"
                                />
                            </div>
                            <div>
                                <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="message">
                                    Votre Message <span className="text-red-500">*</span>
                                </label>
                                <textarea
                                    id="message"
                                    name="message"
                                    value={formData.message}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-200"
                                    placeholder="Entrez votre message ici..."
                                    rows="5"
                                ></textarea>
                            </div>
                            <button
                                type="submit"
                                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-medium py-3 px-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98]"
                                disabled={isLoading}
                            >
                                {isLoading ? (
                                    <span className="flex items-center justify-center">
                                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        Envoi...
                                    </span>
                                ) : (
                                    "Envoyer le Message"
                                )}
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default ContactSection