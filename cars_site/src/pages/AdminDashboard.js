import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Trash2, Edit, Package } from "lucide-react";
import Pagination from "../components/Pagination";
import EditModal from "../components/EditModal";

const BASE_URL = "http://localhost:5000";

function AdminDashboard({ user, showToast }) {
  const [parts, setParts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [form, setForm] = useState({
    name: "",
    car_model: "",
    price: "",
    description: "",
    image: null,
  });
  const [editingPart, setEditingPart] = useState(null);
  const [activeTab, setActiveTab] = useState("parts");
  const navigate = useNavigate();
  const location = useLocation();
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Verify admin status
  useEffect(() => {
    if (!user || !user.is_admin) {
      showToast("Access denied. Admin privileges required.", "error");
      const previousLocation = location.state?.from || "/";
      const timer = setTimeout(() => {
        navigate(previousLocation, { replace: true });
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [user, navigate, location, showToast]);

  const fetchParts = () => {
    setLoading(true);
    fetch(`${BASE_URL}/api/parts?page=${currentPage}&per_page=6`, {
      method: "GET",
      credentials: "include",
    })
      .then((response) => {
        if (!response.ok) throw new Error("Failed to fetch parts");
        return response.json();
      })
      .then((data) => {
        setParts(data.parts);
        setTotalPages(data.total_pages);
        setLoading(false);
      })
      .catch((err) => {
        showToast(err.message, "error");
        setLoading(false);
      });
  };

  const fetchOrders = () => {
    setLoading(true);
    fetch(`${BASE_URL}/api/admin/orders`, {
      method: "GET",
      credentials: "include",
    })
      .then((response) => {
        if (!response.ok) throw new Error("Failed to fetch orders");
        return response.json();
      })
      .then((data) => {
        setOrders(data);
        setLoading(false);
      })
      .catch((err) => {
        showToast(err.message, "error");
        setLoading(false);
      });
  };

  useEffect(() => {
    if (user && user.is_admin) {
      if (activeTab === "parts") {
        fetchParts();
      } else if (activeTab === "orders") {
        fetchOrders();
      }
    }
  }, [user, currentPage, activeTab]);

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleInputChange = (e) => {
    const { name, value, files } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: files ? files[0] : value,
    }));
  };

  const handleAddPart = (e) => {
    e.preventDefault();
    setIsLoading(true);
    const formData = new FormData();
    formData.append('name', form.name);
    formData.append('car_model', form.car_model);
    formData.append('price', form.price);
    formData.append('description', form.description);
    if (form.image) {
      formData.append('image', form.image);
    }

    fetch(`${BASE_URL}/api/admin/parts`, {
      method: "POST",
      credentials: "include",
      body: formData,
    })
      .then((response) => {
        if (!response.ok) throw new Error("Failed to add part");
        return response.json();
      })
      .then((data) => {
        showToast(data.message, "success");
        fetchParts();
        setForm({
          name: "",
          car_model: "",
          price: "",
          description: "",
          image: null,
        });
        setIsLoading(false);
      })
      .catch((err) => {
        showToast(err.message, "error");
        setIsLoading(false);
      });
  };

  const handleEdit = (part) => {
    setEditingPart(part);
  };

  const handleSaveEdit = (updatedPart, callback) => {
    setIsLoading(true);
    const formData = new FormData();
    Object.keys(updatedPart).forEach((key) => {
      formData.append(key, updatedPart[key]);
    });

    fetch(`${BASE_URL}/api/admin/parts/${editingPart.id}`, {
      method: "PUT",
      credentials: "include",
      body: formData,
    })
      .then((response) => {
        if (!response.ok) throw new Error("Failed to update part");
        return response.json();
      })
      .then((data) => {
        showToast(data.message, "success");
        fetchParts();
        setIsLoading(false);
        callback();
      })
      .catch((err) => {
        showToast(err.message, "error");
        setIsLoading(false);
        callback();
      });
  };

  const handleDelete = (partId) => {
    if (!window.confirm("Are you sure you want to delete this part?")) return;
    setIsLoading(true);
    fetch(`${BASE_URL}/api/admin/parts/${partId}`, {
      method: "DELETE",
      credentials: "include",
    })
      .then((response) => {
        if (!response.ok) throw new Error("Failed to delete part");
        return response.json();
      })
      .then((data) => {
        showToast(data.message, "success");
        fetchParts();
        setIsLoading(false);
      })
      .catch((err) => {
        showToast(err.message, "error");
        setIsLoading(false);
      });
  };

  const handleStatusChange = (orderId, newStatus) => {
    if (!window.confirm(`Are you sure you want to change the order status to "${newStatus}"?`)) return;
    setIsLoading(true);
    fetch(`${BASE_URL}/api/admin/orders/${orderId}/status`, {
      method: "PUT",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: newStatus }),
    })
      .then((response) => {
        if (!response.ok) throw new Error("Failed to update order status");
        return response.json();
      })
      .then((data) => {
        showToast(data.message, "success");
        fetchOrders();
        setIsLoading(false);
      })
      .catch((err) => {
        showToast(err.message, "error");
        setIsLoading(false);
      });
  };

  // Prevent rendering dashboard content for non-admins
  if (!user || !user.is_admin) {
    return (
      <div className="min-h-screen bg-gray-50" />
    );
  }

  return (
    <div className="min-h-screen mt-8 bg-[#80808052] py-16">
      {isLoading && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
          <div className="w-16 h-16 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
        </div>
      )}
      {editingPart && (
        <EditModal
          part={editingPart}
          onClose={() => setEditingPart(null)}
          onSave={handleSaveEdit}
        />
      )}
      <div className="container mx-auto px-12">
        <h2 className="text-3xl font-bold text-center mb-8">
          Admin <span className="text-emerald-600">Dashboard</span>
        </h2>
        {/* Tabs */}
        <div className="mb-8">
          <div className="flex border-b border-gray-200">
            <button
              className={`px-4 py-2 font-medium text-sm ${activeTab === "parts" ? "border-b-2 border-emerald-600 text-emerald-600" : "text-gray-600 hover:text-emerald-600"}`}
              onClick={() => setActiveTab("parts")}
            >
              Gérer les Pièces
            </button>
            <button
              className={`px-4 py-2 font-medium text-sm ${activeTab === "orders" ? "border-b-2 border-emerald-600 text-emerald-600" : "text-gray-600 hover:text-emerald-600"}`}
              onClick={() => setActiveTab("orders")}
            >
              Gérer les Commandes
            </button>
          </div>
        </div>

        {/* Parts Section */}
        {activeTab === "parts" && (
          <>
            <div className="bg-white p-6 rounded-lg shadow-sm mb-8">
              <h3 className="text-xl font-semibold mb-4">Ajouter une Nouvelle Pièce</h3>
              <form onSubmit={handleAddPart} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Nom</label>
                  <input
                    type="text"
                    name="name"
                    value={form.name}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 rounded-lg border border-gray-200"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Modèle de Voiture</label>
                  <input
                    type="text"
                    name="car_model"
                    value={form.car_model}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 rounded-lg border border-gray-200"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Prix (€)</label>
                  <input
                    type="number"
                    name="price"
                    value={form.price}
                    onChange={handleInputChange}
                    step="0.01"
                    className="w-full px-4 py-2 rounded-lg border border-gray-200"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                  <textarea
                    name="description"
                    value={form.description}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 rounded-lg border border-gray-200"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Image</label>
                  <input
                    type="file"
                    name="image"
                    accept="image/*"
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 rounded-lg border border-gray-200"
                    required
                  />
                </div>
                <div className="md:col-span-2">
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-emerald-600 text-white px-6 py-3 rounded-lg hover:bg-emerald-700"
                  >
                    Ajouter la Pièce
                  </button>
                </div>
              </form>
            </div>
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-xl font-semibold mb-4">Gérer les Pièces</h3>
              {loading ? (
                <div className="flex justify-center items-center h-64">
                  <div className="w-16 h-16 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
                </div>
              ) : parts.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-gray-600">Aucune pièce trouvée.</p>
                </div>
              ) : (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
                    {parts.map((part) => (
                      <article
                        key={part.id}
                        className="border border-gray-200 rounded-lg p-4 hover:shadow-lg transition-shadow duration-300 flex flex-col"
                      >
                        <div className="relative h-48 overflow-hidden rounded-lg mb-3">
                          <img
                            src={part.image ? `${BASE_URL}/${part.image}` : "/placeholder.svg"}
                            alt={part.name}
                            className="w-full h-full object-cover"
                            loading="lazy"
                          />
                        </div>
                        <div className="flex-grow space-y-1">
                          <h3 className="font-semibold text-lg">{part.name}</h3>
                          <p className="text-gray-600">Pour: {part.car_model}</p>
                          <p className="text-gray-800 font-medium">Prix: {part.price}€</p>
                        </div>
                        <div className="flex gap-3 mt-4">
                          <button
                            onClick={() => handleEdit(part)}
                            className="flex-1 flex items-center justify-center gap-1 text-white bg-gradient-to-r from-cyan-500 to-blue-500 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-cyan-300 font-medium px-3 py-2 rounded-md transition-colors"
                            aria-label={`Modifier ${part.name}`}
                          >
                            <Edit size={16} />
                            <span>Modifier</span>
                          </button>
                          <button
                            onClick={() => handleDelete(part.id)}
                            className="flex-1 flex items-center justify-center gap-1 bg-gradient-to-r from-red-400 via-red-500 to-red-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-red-300 font-medium text-white px-3 py-2 rounded-md transition-colors"
                            aria-label={`Supprimer ${part.name}`}
                          >
                            <Trash2 size={16} />
                            <span>Supprimer</span>
                          </button>
                        </div>
                      </article>
                    ))}
                  </div>
                  <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={handlePageChange}
                  />
                </>
              )}
            </div>
          </>
        )}

        {/* Orders Section */}
        {activeTab === "orders" && (
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-xl font-semibold mb-4">Gérer les Commandes</h3>
            {loading ? (
              <div className="flex justify-center items-center h-64">
                <div className="w-16 h-16 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
              </div>
            ) : orders.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-600">Aucune commande trouvée.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Utilisateur</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Adresse</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Pièces</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Statut</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {orders.map((order) => (
                      <tr key={order.id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{order.id}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {order.user.username} ({order.user.email})
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900">
                          {order.address.street}, {order.address.city}, {order.address.postal_code}, {order.address.country}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900">
                          {order.parts.map((part) => part.name).join(", ")}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{order.status}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {new Date(order.created_at).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          <select
                            value={order.status}
                            onChange={(e) => handleStatusChange(order.id, e.target.value)}
                            className="px-2 py-1 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                          >
                            <option value="Pending">En attente</option>
                            <option value="Delivered">Livré</option>
                            <option value="Cancelled">Annulé</option>
                          </select>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default AdminDashboard;