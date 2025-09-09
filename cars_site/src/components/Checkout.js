import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import back from '../images/back.jpg';

const BASE_URL = "http://localhost:5000";

function Checkout({ showToast }) {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        street: "",
        city: "",
        postal_code: "",
        country: "",
        card_number: "",
        expiry_date: "",
        cvv: ""
    });
    const [loading, setLoading] = useState(false);
    const [cartItems, setCartItems] = useState([]);
    const [cartLoading, setCartLoading] = useState(true);

    useEffect(() => {
        const fetchCartItems = async () => {
            try {
                const response = await fetch(`${BASE_URL}/api/panel`, {
                    method: "GET",
                    credentials: "include",
                });
                if (!response.ok) throw new Error("Failed to fetch cart items");
                const data = await response.json();
                setCartItems(data);
            } catch (err) {
                showToast(err.message, "error");
            } finally {
                setCartLoading(false);
            }
        };
        fetchCartItems();
    }, [showToast]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        const { street, city, postal_code, country, card_number, expiry_date, cvv } = formData;

        if (!street || !city || !postal_code || !country || !card_number || !expiry_date || !cvv) {
            showToast("Tous les champs sont requis", "error");
            setLoading(false);
            return;
        }

        if (cartItems.length === 0) {
            showToast("Votre panier est vide", "error");
            setLoading(false);
            return;
        }

        try {
            const response = await fetch(`${BASE_URL}/api/orders`, {
                method: "POST",
                credentials: "include",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    address: { street, city, postal_code, country }
                })
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || "Échec de la création de la commande");
            }

            const data = await response.json();
            showToast(data.message || "Commande créée avec succès", "success");
            navigate("/orders");
        } catch (err) {
            showToast(err.message, "error");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div
            style={{ backgroundImage: `url(${back})`, backgroundSize: 'cover', backgroundPosition: 'center' }}
            className="min-h-screen pt-24 pb-16"
        >
            <div className="container mx-auto px-4">
                <h2 className="text-3xl font-bold text-center text-gray-800 mb-12">
                    Finaliser la Commande
                </h2>

                {/* Cart Summary */}
                <div className="max-w-5xl mx-auto mb-8 bg-white p-6 rounded-xl shadow-lg">
                    <h3 className="text-xl font-semibold text-gray-800 mb-4">Votre Panier</h3>
                    {cartLoading ? (
                        <div className="flex justify-center items-center h-32">
                            <div className="w-8 h-8 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
                        </div>
                    ) : cartItems.length === 0 ? (
                        <p className="text-gray-600 text-center">Votre panier est vide.</p>
                    ) : (
                        <div className="space-y-4">
                            {cartItems.map((item) => (
                                <div key={item.id} className="flex justify-between items-center border-b pb-2">
                                    <div>
                                        <h4 className="font-medium text-gray-800">{item.name}</h4>
                                        <p className="text-sm text-gray-600">Pour: {item.car_model}</p>
                                    </div>
                                    <p className="text-lg font-bold text-emerald-600">{item.price} DH</p>
                                </div>
                            ))}
                            <div className="flex justify-between items-center pt-2">
                                <span className="text-lg font-semibold text-gray-800">Total</span>
                                <span className="text-lg font-bold text-emerald-600">
                                    {cartItems.reduce((sum, item) => sum + parseFloat(item.price), 0).toFixed(2)} DH
                                </span>
                            </div>
                        </div>
                    )}
                </div>

                {/* Checkout Form */}
                <form
                    onSubmit={handleSubmit}
                    className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-5xl mx-auto bg-white p-8 rounded-xl shadow-lg"
                >
                    {/* Address Form */}
                    <div>
                        <h3 className="text-xl font-semibold text-gray-800 mb-6">
                            Adresse de Livraison
                        </h3>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Rue *
                                </label>
                                <input
                                    type="text"
                                    name="street"
                                    value={formData.street}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500 outline-none transition-colors"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Ville *
                                </label>
                                <input
                                    type="text"
                                    name="city"
                                    value={formData.city}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500 outline-none transition-colors"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Code Postal *
                                </label>
                                <input
                                    type="text"
                                    name="postal_code"
                                    value={formData.postal_code}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500 outline-none transition-colors"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Pays *
                                </label>
                                <input
                                    type="text"
                                    name="country"
                                    value={formData.country}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500 outline-none transition-colors"
                                    required
                                />
                            </div>
                        </div>
                    </div>

                    {/* Payment Form */}
                    <div>
                        <h3 className="text-xl font-semibold text-gray-800 mb-6">
                            Informations de Paiement
                        </h3>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Numéro de Carte *
                                </label>
                                <input
                                    type="text"
                                    name="card_number"
                                    value={formData.card_number}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500 outline-none transition-colors"
                                    placeholder="1234 5678 9012 3456"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Date d'Expiration *
                                </label>
                                <input
                                    type="text"
                                    name="expiry_date"
                                    value={formData.expiry_date}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500 outline-none transition-colors"
                                    placeholder="MM/AA"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    CVV *
                                </label>
                                <input
                                    type="text"
                                    name="cvv"
                                    value={formData.cvv}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500 outline-none transition-colors"
                                    placeholder="123"
                                    required
                                />
                            </div>
                        </div>
                    </div>

                    {/* Submit Button */}
                    <div className="lg:col-span-2 mt-6">
                        <button
                            type="submit"
                            disabled={loading || cartLoading}
                            className="w-full bg-emerald-600 text-white px-6 py-3 rounded-lg hover:bg-emerald-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2"
                        >
                            {loading ? (
                                <span className="flex items-center justify-center gap-2">
                                    <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
                                    </svg>
                                    Envoi...
                                </span>
                            ) : (
                                "Confirmer la Commande"
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default Checkout;