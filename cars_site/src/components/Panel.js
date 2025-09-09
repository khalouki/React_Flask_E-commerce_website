import { useState, useEffect } from "react";
import { X, Bookmark } from "lucide-react";
import { useNavigate } from "react-router-dom";
import PartCard from "./PartCard";

const BASE_URL = "http://localhost:5000";

function Panel({ isOpen, onClose, isLoggedIn, user, showToast }) {
    const [panelParts, setPanelParts] = useState([]);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        if (isOpen && isLoggedIn) {
            fetchPanelParts();
        } else if (isOpen && !isLoggedIn) {
            showToast("Veuillez vous connecter pour voir votre panier", "error");
            setLoading(false);
        }
    }, [isOpen, isLoggedIn, showToast]);

    const fetchPanelParts = async () => {
        setLoading(true);
        try {
            console.log("Fetching panel parts from:", `${BASE_URL}/api/panel`);
            const response = await fetch(`${BASE_URL}/api/panel`, {
                method: "GET",
                credentials: "include",
            });
            console.log("Panel fetch response:", response.status, response.statusText);
            if (!response.ok) {
                const errorData = await response.json();
                console.error("Panel error:", errorData);
                if (response.status === 401) {
                    throw new Error("Veuillez vous connecter pour voir votre panier");
                }
                throw new Error("Échec de la récupération des pièces du panier");
            }
            const data = await response.json();
            console.log("Panel parts data:", data);
            data.forEach(part => console.log(`Part ID: ${part.id}, Name: ${part.name}`));
            setPanelParts(data);
        } catch (err) {
            console.error("Panel fetch error:", err);
            showToast(err.message, "error");
        } finally {
            setLoading(false);
        }
    };

    const handleRemoveFromPanel = async (partId) => {
        try {
            console.log("Removing part from panel:", partId);
            const response = await fetch(`${BASE_URL}/api/panel`, {
                method: "DELETE",
                credentials: "include",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ partId }),
            });
            if (!response.ok) {
                throw new Error("Échec de la suppression de la pièce du panier");
            }
            setPanelParts((prev) => prev.filter((part) => part.id !== partId));
            showToast("Pièce supprimée du panier", "success");
            console.log("Part removed successfully:", partId);
        } catch (err) {
            console.error("Remove from panel error:", err);
            showToast(err.message, "error");
        }
    };

    const handleValidateOrder = () => {
        onClose(); // Close the panel
        navigate("/checkout");
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl shadow-xl w-full max-w-4xl max-h-[80vh] overflow-y-auto p-6 relative animate-in fade-in slide-in-from-top-5">
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2"
                    aria-label="Fermer le panier"
                >
                    <X className="h-6 w-6" />
                </button>
                <h2 className="text-2xl font-bold mb-6 text-gray-800">Vos Pièces Enregistrées</h2>
                {loading ? (
                    <div className="flex justify-center items-center h-64">
                        <div className="w-12 h-12 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
                    </div>
                ) : panelParts.length === 0 ? (
                    <div className="text-center py-12">
                        <Bookmark className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                        <p className="text-gray-600">Aucune pièce enregistrée dans votre panier.</p>
                    </div>
                ) : (
                    <>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
                            {panelParts.map((part) => (
                                <div key={part.id} className="relative">
                                    <PartCard
                                        part={part}
                                        isLoggedIn={isLoggedIn}
                                        user={user}
                                        isPanelView={true}
                                        showToast={showToast}
                                    />
                                    <button
                                        onClick={() => handleRemoveFromPanel(part.id)}
                                        className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-2 hover:bg-red-600 transition-colors z-10 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                                        aria-label="handle">
                                        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"/>
                                        </svg>
                                    </button>
                                </div>
                            ))}
                        </div>
                        <div className="flex justify-end">
                            <button
                                onClick={handleValidateOrder}
                                className="bg-emerald-600 text-white px-6 py-3 rounded-lg hover:bg-emerald-700 transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2"
                                disabled={loading || panelParts.length === 0}
                            >
                                Valider la Commande
                            </button>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}

export default Panel;