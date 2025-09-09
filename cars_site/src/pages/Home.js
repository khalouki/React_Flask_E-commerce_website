import { useState, useEffect } from "react"
import { useLocation, useNavigate } from "react-router-dom"
import PartCard from "../components/PartCard"
import Pagination from "../components/Pagination"
import WhyChooseUs from "../components/WhyChooseUs"
import Hero from "../components/Hero"
import LocationSection from "../components/LocationSection"
import { Search, X, Settings } from "lucide-react"

const BASE_URL = "http://127.0.0.1:5000"
const PARTS_PER_PAGE = 6

function Home({ isLoggedIn, user }) {
    const [parts, setParts] = useState([])
    const [currentPage, setCurrentPage] = useState(1)
    const [totalPages, setTotalPages] = useState(1)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const [filters, setFilters] = useState({
        car_model: "",
        name: "",
    })
    const [isCommentLoading, setIsCommentLoading] = useState(false)
    const [comments, setComments] = useState([])
    const [commentForm, setCommentForm] = useState({ name: "", comment: "" })
    const [commentStatus, setCommentStatus] = useState(null)
    const [activeTab, setActiveTab] = useState("comments")
    const navigate = useNavigate()
    const location = useLocation()

    useEffect(() => {
        // Parse query parameters
        const params = new URLSearchParams(location.search)
        const car_model = params.get("car_model") || ""
        const name = params.get("name") || ""

        setFilters({
            car_model,
            name,
        })

        // Fetch parts with query parameters
        setLoading(true)
        setError(null)
        const query = new URLSearchParams({
            car_model,
            name,
            page: currentPage,
            per_page: PARTS_PER_PAGE,
        }).toString()

        fetch(`${BASE_URL}/api/parts?${query}`, {
            method: "GET",
            credentials: "include",
        })
            .then((response) => {
                if (!response.ok) {
                    if (response.status === 0) {
                        throw new Error("Erreur réseau: Impossible de se connecter au serveur. Vérifiez si le backend fonctionne.")
                    }
                    throw new Error(`Échec du chargement des pièces: ${response.status} ${response.statusText}`)
                }
                return response.json()
            })
            .then((data) => {
                setParts(data.parts)
                setTotalPages(data.total_pages)
                setLoading(false)
            })
            .catch((err) => {
                console.error("Erreur de récupération:", err.message)
                setError(err.message)
                setLoading(false)
            })

        // Fetch comments
        fetch(`${BASE_URL}/api/comments`, {
            method: "GET",
        })
            .then((response) => {
                if (!response.ok) throw new Error("Failed to fetch comments")
                return response.json()
            })
            .then((data) => {
                setComments(data)
            })
            .catch((err) => console.error("Comments fetch error:", err.message))
    }, [location.search, currentPage])

    const handlePageChange = (page) => {
        setCurrentPage(page)
        window.scrollTo({
            top: document.getElementById("parts").offsetTop - 100,
            behavior: "smooth",
        })
    }

    const handleFilterChange = (e) => {
        const { name, value } = e.target
        setFilters((prev) => ({
            ...prev,
            [name]: value,
        }))
        setCurrentPage(1) // Reset to first page on filter change
        updateURL({ ...filters, [name]: value })
    }

    const updateURL = (newFilters) => {
        const params = new URLSearchParams()
        if (newFilters.car_model) params.set("car_model", newFilters.car_model)
        if (newFilters.name) params.set("name", newFilters.name)
        navigate(`/?${params.toString()}`)
    }

    const handleCommentChange = (e) => {
        const { name, value } = e.target
        setCommentForm((prev) => ({ ...prev, [name]: value }))
    }

    const handleCommentSubmit = (e) => {
        e.preventDefault()
        setIsCommentLoading(true)
        if (!commentForm.name.trim() || !commentForm.comment.trim()) {
            setCommentStatus({ type: "error", message: "Le nom et le commentaire sont requis" })
            setTimeout(() => setCommentStatus(null), 3000)
            setIsCommentLoading(false)
            return
        }

        fetch(`${BASE_URL}/api/comments`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(commentForm),
        })
            .then((response) => {
                if (!response.ok) throw new Error("Failed to submit comment")
                return response.json()
            })
            .then((data) => {
                setCommentStatus({ type: "success", message: data.message })
                setCommentForm({ name: "", comment: "" })
                fetch(`${BASE_URL}/api/comments`)
                    .then((res) => res.json())
                    .then((data) => setComments(data))
                    .catch((err) => console.error("Comments refresh error:", err.message))
                setTimeout(() => setCommentStatus(null), 3000)
                setIsCommentLoading(false)
            })
            .catch((err) => {
                setCommentStatus({ type: "error", message: err.message })
                setTimeout(() => setCommentStatus(null), 3000)
                setIsCommentLoading(false)
            })
    }

    const clearFilters = () => {
        setFilters({
            car_model: "",
            name: "",
        })
        setCurrentPage(1)
        navigate("/")
    }

    return (
        <div className="overflow-hidden bg-gray-50">
            {isCommentLoading && (
                <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
                    <div className="w-16 h-16 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
                </div>
            )}
            <Hero />

            {/* Parts Section */}
            <section id="parts" className="py-16">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl md:text-4xl font-bold mb-4">
                            Nos <span className="text-emerald-600">Pièces Automobiles</span>
                        </h2>
                        <p className="text-gray-600 max-w-2xl mx-auto mb-8">
                            Découvrez notre sélection premium de pièces automobiles, chacune soigneusement inspectée et prête à
                            l'installation
                        </p>

                        {/* Search Inputs for Car Model and Name */}
                        <div className="flex flex-col md:flex-row justify-center items-center gap-4 mb-8">
                            <div className="relative w-full max-w-md">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                                <input
                                    type="text"
                                    name="car_model"
                                    placeholder="Rechercher par modèle de voiture..."
                                    className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-200 focus:border-emerald-300 focus:ring focus:ring-emerald-200 focus:ring-opacity-50 transition-colors duration-300"
                                    value={filters.car_model}
                                    onChange={handleFilterChange}
                                />
                            </div>
                            <div className="relative w-full max-w-md">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                                <input
                                    type="text"
                                    name="name"
                                    placeholder="Rechercher par nom de pièce..."
                                    className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-200 focus:border-emerald-300 focus:ring focus:ring-emerald-200 focus:ring-opacity-50 transition-colors duration-300"
                                    value={filters.name}
                                    onChange={handleFilterChange}
                                />
                            </div>
                        </div>
                        {(filters.car_model || filters.name) && (
                            <button
                                className="text-sm text-gray-500 hover:text-emerald-600 flex items-center gap-1 mx-auto"
                                onClick={clearFilters}
                            >
                                <X size={14} />
                                Effacer les Filtres
                            </button>
                        )}
                    </div>

                    {/* Parts Display */}
                    {loading ? (
                        <div className="flex justify-center items-center h-64">
                            <div className="flex flex-col items-center">
                                <div className="w-16 h-16 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
                                <p className="mt-4 text-lg">Chargement de notre collection...</p>
                            </div>
                        </div>
                    ) : error ? (
                        <div className="text-center py-12 bg-white rounded-xl shadow-sm">
                            <div className="bg-red-50 p-6 rounded-lg max-w-lg mx-auto">
                                <h3 className="text-xl font-medium text-red-600">Erreur de chargement des pièces</h3>
                                <p className="text-gray-500 mt-2">{error}</p>
                                <p className="text-gray-500">Veuillez vérifier le serveur backend ou contacter le support.</p>
                            </div>
                        </div>
                    ) : parts.length === 0 ? (
                        <div className="text-center py-12 bg-white rounded-xl shadow-sm">
                            <div className="bg-amber-50 p-6 rounded-lg max-w-lg mx-auto">
                                <Settings className="w-12 h-12 text-amber-500 mx-auto mb-4" />
                                <h3 className="text-xl font-medium text-gray-700">Aucune pièce trouvée</h3>
                                <p className="text-gray-500 mt-2">Essayez d'ajuster vos filtres</p>
                                <button
                                    className="mt-4 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition-colors duration-300"
                                    onClick={clearFilters}
                                >
                                    Réinitialiser les Filtres
                                </button>
                            </div>
                        </div>
                    ) : (
                        <>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                                {parts.map((part) => (
                                    <PartCard key={part.id} part={part} isLoggedIn={isLoggedIn} user={user || null} />
                                ))}
                            </div>
                            <div className="mt-12">
                                <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={handlePageChange} />
                            </div>
                        </>
                    )}
                </div>
            </section>

            <WhyChooseUs id="why-choose-us" />

            {/* Client Comments Section */}
            <section id="client-comments" className="py-16 bg-[#f5f5dce3]">
                <div className="container mx-auto px-4">
                    <h2 className="text-3xl md:text-4xl font-bold text-center mb-6">
                        Avis <span className="text-emerald-600">Clients</span>
                    </h2>
                    <p className="text-gray-600 max-w-3xl mx-auto text-center mb-8">
                        Découvrez ce que nos clients disent de leur expérience avec AutoPièces
                    </p>

                    {/* Tabs */}
                    <div className="max-w-6xl mx-auto">
                        <div className="flex border-b border-gray-200 mb-6">
                            <button
                                className={`px-6 py-3 text-sm font-medium transition-colors duration-300 ${activeTab === "comments"
                                        ? "text-emerald-600 border-b-2 border-emerald-600"
                                        : "text-gray-500 hover:text-emerald-600"
                                    }`}
                                onClick={() => setActiveTab("comments")}
                            >
                                Commentaires Récents
                            </button>
                            <button
                                className={`px-6 py-3 text-sm font-medium transition-colors duration-300 ${activeTab === "add"
                                        ? "text-emerald-600 border-b-2 border-emerald-600"
                                        : "text-gray-500 hover:text-emerald-600"
                                    }`}
                                onClick={() => setActiveTab("add")}
                            >
                                Partager Votre Avis
                            </button>
                        </div>

                        {/* Tab Content */}
                        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                            {activeTab === "comments" ? (
                                <div className="p-6">
                                    {comments.length === 0 ? (
                                        <div className="text-center py-12">
                                            <p className="text-gray-600">Aucun commentaire pour le moment. Soyez le premier à partager!</p>
                                        </div>
                                    ) : (
                                        <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2">
                                            {comments.map((comment) => (
                                                <div key={comment.id} className="border-b border-gray-100 pb-4">
                                                    <div className="flex items-center mb-2">
                                                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center text-white font-medium">
                                                            {comment.name.charAt(0).toUpperCase()}
                                                        </div>
                                                        <div className="ml-3">
                                                            <p className="font-medium text-gray-900">{comment.name}</p>
                                                            <p className="text-xs text-gray-500">
                                                                {new Date(comment.created_at).toLocaleDateString("fr-FR", {
                                                                    year: "numeric",
                                                                    month: "long",
                                                                    day: "numeric",
                                                                })}
                                                            </p>
                                                        </div>
                                                    </div>
                                                    <p className="text-gray-700 pl-12">{comment.comment}</p>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <div className="p-6">
                                    <form onSubmit={handleCommentSubmit} className="space-y-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Nom</label>
                                            <input
                                                type="text"
                                                name="name"
                                                value={commentForm.name}
                                                onChange={handleCommentChange}
                                                placeholder="Votre nom"
                                                className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:border-emerald-300 focus:ring focus:ring-emerald-200 focus:ring-opacity-50"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Commentaire</label>
                                            <textarea
                                                name="comment"
                                                value={commentForm.comment}
                                                onChange={handleCommentChange}
                                                placeholder="Partagez votre expérience avec nous"
                                                rows="6"
                                                className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:border-emerald-300 focus:ring focus:ring-emerald-200 focus:ring-opacity-50 resize-none"
                                            ></textarea>
                                        </div>
                                        <button
                                            type="submit"
                                            disabled={isCommentLoading}
                                            className="w-full bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-700 hover:to-emerald-600 text-white px-6 py-3 rounded-lg transition-all duration-300 shadow-sm hover:shadow-md font-medium"
                                        >
                                            {isCommentLoading ? "Envoi en cours..." : "Envoyer le Commentaire"}
                                        </button>
                                    </form>
                                </div>
                            )}
                        </div>
                    </div>

                    {commentStatus && (
                        <div
                            className={`fixed bottom-4 right-4 p-4 rounded-md shadow-lg text-white ${commentStatus.type === "success" ? "bg-emerald-600" : "bg-red-600"} animate-in slide-in-from-right`}
                        >
                            {commentStatus.message}
                        </div>
                    )}
                </div>
            </section>

            <LocationSection />
        </div>
    )
}

export default Home