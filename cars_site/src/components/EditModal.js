import { useState } from "react";
import { X } from "lucide-react";

function EditModal({ part, onClose, onSave }) {
    const [form, setForm] = useState({
        name: part?.name || "",
        car_model: part?.car_model || "",
        price: part?.price || "",
        description: part?.description || "",
        image: null,
    });
    const [isLoading, setIsLoading] = useState(false);

    const handleInputChange = (e) => {
        const { name, value, files } = e.target;
        setForm((prev) => ({
            ...prev,
            [name]: files ? files[0] : value,
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setIsLoading(true);
        onSave(form, () => {
            setIsLoading(false);
            onClose();
        });
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-2xl">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-xl font-semibold">Modifier la Pièce</h3>
                    <button onClick={onClose} className="text-gray-600 hover:text-gray-800">
                        <X size={24} />
                    </button>
                </div>
                <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                        <label className="block text-sm font-medium text-gray-700 mb-1">Nouvelle Image</label>
                        <input
                            type="file"
                            name="image"
                            accept="image/*"
                            onChange={handleInputChange}
                            className="w-full px-4 py-2 rounded-lg border border-gray-200"
                        />
                    </div>
                    <div className="md:col-span-2 flex gap-2">
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="flex-1 bg-emerald-600 text-white px-6 py-3 rounded-lg hover:bg-emerald-700"
                        >
                            {isLoading ? "Enregistrement..." : "Enregistrer les Modifications"}
                        </button>
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 bg-gray-300 text-gray-800 px-6 py-3 rounded-lg hover:bg-gray-400"
                        >
                            Annuler
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default EditModal;