"use client"

import { useState, useEffect } from "react"
import { Settings, Edit, Trash2, PlusCircle, Loader2 } from "lucide-react"

const BASE_URL = "http://localhost:5000"

function PartCard({ part, isLoggedIn, user, onEdit, onDelete, isPanelView = false }) {
    const [isLoading, setIsLoading] = useState(false)
    const [message, setMessage] = useState(null)
    const [isInPanel, setIsInPanel] = useState(false)

    useEffect(() => {
        if (isLoggedIn && !isPanelView) {
            checkIfInPanel()
        }
        console.log(`PartCard rendering - Part ID: ${part.id}, isPanelView: ${isPanelView}, Image: ${part.image}`);
    }, [isLoggedIn, isPanelView])

    const checkIfInPanel = async () => {
        try {
            const response = await fetch(`${BASE_URL}/api/panel`, {
                method: "GET",
                credentials: "include",
            })
            if (response.ok) {
                const panelParts = await response.json()
                setIsInPanel(panelParts.some((panelPart) => panelPart.id === part.id))
            }
        } catch (err) {
            console.error("Error checking panel:", err)
        }
    }

    const handleAddToPanel = async () => {
        try {
            setIsLoading(true)
            setMessage(null)
            console.log("Adding part to panel:", part.id)

            const response = await fetch(`${BASE_URL}/api/panel`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify({ partId: part.id }),
            })

            console.log("Add to panel response:", response.status, response.statusText)
            if (!response.ok) {
                if (response.status === 401) {
                    throw new Error("Veuillez vous connecter pour ajouter au panier")
                }
                throw new Error("Échec de l'ajout au panier")
            }

            const data = await response.json()
            setMessage({ type: "success", text: data.message })
            setIsInPanel(true)
            setTimeout(() => setMessage(null), 3000)
        } catch (err) {
            console.error("Add to panel error:", err)
            setMessage({ type: "error", text: err.message })
            setTimeout(() => setMessage(null), 3000)
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="relative overflow-hidden rounded-xl border border-gray-200 bg-white transition-all duration-300 hover:shadow-lg">
            {/* Toast notification (only outside panel) */}
            {!isPanelView && message && (
                <div
                    className={`absolute right-4 top-4 z-50 flex items-center gap-2 rounded-lg p-3 text-sm font-medium text-white shadow-lg animate-in slide-in-from-right ${message.type === "success" ? "bg-green-500" : "bg-red-500"}`}
                >
                    {message.type === "success" ? (
                        <div className="flex items-center gap-2">
                            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                            {message.text}
                        </div>
                    ) : (
                        <div className="flex items-center gap-2">
                            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                            {message.text}
                        </div>
                    )}
                </div>
            )}

            {/* Part image (only outside panel) */}
            {!isPanelView && (
                <div className="relative">
                    <img
                        src={part.image ? `${BASE_URL}/${part.image}` : "/placeholder.svg"}
                        alt={part.name}
                        className="h-56 w-full object-cover transition-transform duration-500 hover:scale-105"
                        onError={() => console.error(`Failed to load image for part ${part.id}: ${part.image}`)}
                    />
                </div>
            )}

            {/* Part details */}
            <div className="p-5">
                <h3 className="mb-2 text-xl font-bold text-gray-800">{part.name}</h3>
                <p className="text-sm text-gray-600 mb-2">Pour: {part.car_model}</p>
                <p className="text-sm text-gray-600 mb-4">{part.description}</p>

                <div className="mt-4 flex items-center justify-between">
                    <p className="text-2xl font-bold text-green-600">{part.price} DH</p>
                    {!isPanelView && (
                        <div className="flex items-center gap-1 rounded-full bg-green-100 px-2 py-1 text-xs font-medium text-green-800">
                            <Settings size={14} />
                            <span>Disponible</span>
                        </div>
                    )}
                </div>

                {/* Action buttons (only outside panel) */}
                {!isPanelView && (
                    <div className="mt-5 space-y-3">
                        {!isLoggedIn && (
                            <button
                                disabled
                                className="flex w-full items-center justify-center gap-2 rounded-lg bg-gray-400 px-4 py-2.5 text-sm font-medium text-white opacity-50 cursor-not-allowed"
                            >
                                <PlusCircle size={16} />
                                <span>Connectez-vous pour Acheter</span>
                            </button>
                        )}

                        {isLoggedIn && !user.is_admin && (
                            <button
                                onClick={handleAddToPanel}
                                disabled={isLoading || isInPanel}
                                className="flex w-full items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-green-500 to-emerald-600 px-4 py-2.5 text-sm font-medium text-white shadow-sm transition-all duration-300 hover:from-green-600 hover:to-emerald-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-70"
                            >
                                {isLoading ? (
                                    <>
                                        <Loader2 size={16} className="animate-spin" />
                                        <span>Ajout...</span>
                                    </>
                                ) : isInPanel ? (
                                    <>
                                        <PlusCircle size={16} />
                                        <span>Dans le Panier</span>
                                    </>
                                ) : (
                                    <>
                                        <PlusCircle size={16} />
                                        <span>Ajouter au Panier</span>
                                    </>
                                )}
                            </button>
                        )}

                        {user?.is_admin && onEdit && onDelete && (
                            <div className="flex gap-2">
                                <button
                                    onClick={() => onEdit(part)}
                                    className="flex flex-1 items-center justify-center gap-1.5 rounded-lg bg-blue-600 px-3 py-2.5 text-sm font-medium text-white transition-colors hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                                >
                                    <Edit size={16} />
                                    <span>Modifier</span>
                                </button>

                                <button
                                    onClick={() => onDelete(part.id)}
                                    className="flex flex-1 items-center justify-center gap-1.5 rounded-lg bg-red-600 px-3 py-2.5 text-sm font-medium text-white transition-colors hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                                >
                                    <Trash2 size={16} />
                                    <span>Supprimer</span>
                                </button>
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* Full-screen loading overlay (only outside panel) */}
            {!isPanelView && isLoading && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
                    <div className="flex flex-col items-center gap-3 rounded-lg bg-white p-6 shadow-xl">
                        <div className="h-10 w-10 animate-spin rounded-full border-4 border-green-500 border-t-transparent"></div>
                        <p className="text-sm font-medium text-gray-700">Traitement de la demande...</p>
                    </div>
                </div>
            )}
        </div>
    )
}

export default PartCard