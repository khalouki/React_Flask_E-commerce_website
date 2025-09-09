import { useState, useEffect } from "react";
import back from '../images/back.jpg';

const BASE_URL = "http://localhost:5000";

function Orders({ isLoggedIn, showToast }) {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (isLoggedIn) {
            fetchOrders();
        } else {
            showToast("Veuillez vous connecter pour voir vos commandes", "error");
            setLoading(false);
        }
    }, [isLoggedIn, showToast]);

    const fetchOrders = async () => {
        setLoading(true);
        try {
            const response = await fetch(`${BASE_URL}/api/orders`, {
                method: "GET",
                credentials: "include",
            });
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || "Échec de la récupération des commandes");
            }
            const data = await response.json();
            setOrders(data);
        } catch (err) {
            showToast(err.message, "error");
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteOrder = async (orderId) => {
        if (!window.confirm("Voulez-vous vraiment supprimer cette commande ?")) return;
        try {
            const response = await fetch(`${BASE_URL}/api/orders/${orderId}`, {
                method: "DELETE",
                credentials: "include",
            });
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || "Échec de la suppression de la commande");
            }
            setOrders((prev) => prev.filter((order) => order.id !== orderId));
            showToast("Commande supprimée avec succès", "success");
        } catch (err) {
            showToast(err.message, "error");
        }
    };

    const calculateDeliveryDate = (createdAt, delayDays) => {
        const createdDate = new Date(createdAt);
        createdDate.setDate(createdDate.getDate() + delayDays);
        return createdDate.toLocaleDateString('fr-FR');
    };

    return (
        <div
            style={{ backgroundImage: `url(${back})`, backgroundSize: 'cover', backgroundPosition: 'center' }}
            className="min-h-screen pt-24 pb-16"
        >
            <div className="container mx-auto px-4">
                <h2 className="text-3xl font-bold text-center text-gray-800 mb-12">
                    Mes Commandes
                </h2>
                {loading ? (
                    <div className="flex justify-center items-center h-64">
                        <div className="w-12 h-12 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
                    </div>
                ) : orders.length === 0 ? (
                    <div className="text-center py-12 bg-white rounded-xl shadow-lg">
                        <p className="text-gray-600">Aucune commande enregistrée.</p>
                    </div>
                ) : (
                    <div className="space-y-6 max-w-4xl mx-auto">
                        {orders.map((order) => (
                            <div key={order.id} className="bg-white rounded-xl shadow-lg p-6 relative">
                                <h3 className="text-xl font-bold text-gray-800 mb-4">
                                    Commande #{order.id}
                                </h3>
                                <p className="text-sm text-gray-600 mb-2">
                                    Date: {new Date(order.created_at).toLocaleDateString('fr-FR')}
                                </p>
                                <p className="text-sm text-gray-600 mb-2">
                                    Statut: <span className={`font-medium ${order.status === 'Pending' ? 'text-yellow-600' : 'text-green-600'}`}>
                                        {order.status}
                                    </span>
                                </p>
                                <p className="text-sm text-gray-600 mb-2">
                                    Livraison Estimée: {calculateDeliveryDate(order.created_at, order.delivery_delay_days)}
                                </p>
                                <h4 className="text-lg font-semibold text-gray-800 mt-4 mb-2">
                                    Adresse
                                </h4>
                                <p className="text-sm text-gray-600">
                                    {order.address.street}, {order.address.city}, {order.address.postal_code}, {order.address.country}
                                </p>
                                <h4 className="text-lg font-semibold text-gray-800 mt-4 mb-2">
                                    Pièces
                                </h4>
                                <ul className="space-y-2">
                                    {order.parts.map((part) => (
                                        <li key={part.id} className="border-b py-2">
                                            <p className="font-medium text-gray-800">{part.name}</p>
                                            <p className="text-sm text-gray-600">Modèle: {part.car_model}</p>
                                            <p className="text-sm text-gray-600">Prix: {part.price}€</p>
                                        </li>
                                    ))}
                                </ul>
                                {order.status === 'Pending' && (
                                    <button
                                        onClick={() => handleDeleteOrder(order.id)}
                                        className="absolute top-4 right-4 bg-red-500 text-white rounded-full p-2 hover:bg-red-600 transition-colors focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                                        aria-label={`Supprimer la commande #${order.id}`}
                                    >
                                        <span>supprimer la commande</span>
                                    </button>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

export default Orders;