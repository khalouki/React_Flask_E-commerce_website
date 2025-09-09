"use client"

import { useState, useEffect } from "react"
import { Link, useNavigate, useLocation } from "react-router-dom"
import { Settings, LogOut, User, Menu, X, Bookmark, ShoppingCart } from "lucide-react"
import Panel from "./Panel"

function Navbar({ isLoggedIn, user, onLogout, showToast }) {
    const navigate = useNavigate()
    const location = useLocation()
    const [scrolled, setScrolled] = useState(false)
    const [isDropdownOpen, setIsDropdownOpen] = useState(false)
    const [isPanelOpen, setIsPanelOpen] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 10)
        }
        window.addEventListener("scroll", handleScroll)
        return () => window.removeEventListener("scroll", handleScroll)
    }, [])

    const isAuthOrProfilePage =
        location.pathname === "/login" ||
        location.pathname === "/register" ||
        location.pathname === "/profile"

    const getActiveLink = () => {
        if (location.pathname === "/") {
            if (location.hash === "#parts") return "product"
            if (location.hash === "#why-choose-us") return "whychooseus"
            return "home"
        }
        if (location.pathname === "/contact") return "contact"
        if (location.pathname === "/admin") return "admin"
        if (location.pathname === "/orders") return "orders"
        return ""
    }

    const activeLink = getActiveLink()

    const toggleDropdown = (e) => {
        e.stopPropagation()
        setIsDropdownOpen(!isDropdownOpen)
    }

    const handleLogout = () => {
        onLogout();
        setIsDropdownOpen(false);
    };

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (!event.target.closest(".dropdown")) {
                setIsDropdownOpen(false)
            }
        }
        document.addEventListener("click", handleClickOutside)
        return () => document.removeEventListener("click", handleClickOutside)
    }, [])

    const firstLetter = isLoggedIn && user?.username ? user.username.charAt(0).toUpperCase() : ""

    return (
        <>
            <nav
                className={`fixed w-full z-50 transition-all duration-300 ${scrolled ? "bg-white shadow-lg py-2" : "bg-white/95 backdrop-blur-sm py-4"}`}
            >
                <div className="container mx-auto px-4">
                    <div className="flex justify-between items-center">
                        {/* Logo */}
                        <div
                            onClick={() => navigate("/")}
                            className="flex animate__animated animate__fadeIn items-center cursor-pointer"
                            aria-label="AutoPièces Accueil"
                        >
                            <Settings className="h-8 w-8 text-emerald-600 mr-2" />
                            <span className="text-xl font-bold text-emerald-600">AutoPièces</span>
                        </div>

                        {/* Desktop Navigation */}
                        <div className="hidden md:flex items-center flex-grow justify-center">
                            {!isAuthOrProfilePage && (
                                <ul className="flex space-x-8 items-center">
                                    <li>
                                        <a
                                            href="/"
                                            className={`relative text-sm font-medium hover:text-emerald-600 transition duration-200 ${activeLink === "home" ? "text-emerald-600" : "text-gray-700"}`}
                                        >
                                            Accueil
                                            {activeLink === "home" ? (
                                                <span className="absolute bottom-[-4px] left-0 w-full h-[2px] bg-emerald-600"></span>
                                            ) : (
                                                <span className="absolute bottom-[-4px] left-0 w-full h-[2px] bg-emerald-600 opacity-0 hover:opacity-100 transition-opacity duration-200"></span>
                                            )}
                                        </a>
                                    </li>
                                    <li>
                                        <a
                                            href="#parts"
                                            className={`relative text-sm font-medium hover:text-emerald-600 transition duration-200 ${activeLink === "product" ? "text-emerald-600" : "text-gray-700"}`}
                                        >
                                            Pièces
                                            {activeLink === "product" ? (
                                                <span className="absolute bottom-[-4px] left-0 w-full h-[2px] bg-emerald-600"></span>
                                            ) : (
                                                <span className="absolute bottom-[-4px] left-0 w-full h-[2px] bg-emerald-600 opacity-0 hover:opacity-100 transition-opacity duration-200"></span>
                                            )}
                                        </a>
                                    </li>
                                    <li>
                                        <a
                                            href="#why-choose-us"
                                            className={`relative text-sm font-medium hover:text-emerald-600 transition duration-200 ${activeLink === "whychooseus" ? "text-emerald-600" : "text-gray-700"}`}
                                        >
                                            Pourquoi Nous Choisir
                                            {activeLink === "whychooseus" ? (
                                                <span className="absolute bottom-[-4px] left-0 w-full h-[2px] bg-emerald-600"></span>
                                            ) : (
                                                <span className="absolute bottom-[-4px] left-0 w-full h-[2px] bg-emerald-600 opacity-0 hover:opacity-100 transition-opacity duration-200"></span>
                                            )}
                                        </a>
                                    </li>
                                    {isLoggedIn && !user?.is_admin && (
                                        <>
                                            <li>
                                                <Link
                                                    to="/contact"
                                                    className={`relative text-sm font-medium hover:text-emerald-600 transition duration-200 ${activeLink === "contact" ? "text-emerald-600" : "text-gray-700"}`}
                                                >
                                                    Contact
                                                    {activeLink === "contact" ? (
                                                        <span className="absolute bottom-[-4px] left-0 w-full h-[2px] bg-emerald-600"></span>
                                                    ) : (
                                                        <span className="absolute bottom-[-4px] left-0 w-full h-[2px] bg-emerald-600 opacity-0 hover:opacity-100 transition-opacity duration-200"></span>
                                                    )}
                                                </Link>
                                            </li>
                                            <li>
                                                <Link
                                                    to="/orders"
                                                    className={`relative text-sm font-medium hover:text-emerald-600 transition duration-200 ${activeLink === "orders" ? "text-emerald-600" : "text-gray-700"}`}
                                                >
                                                    Mes Commandes
                                                    {activeLink === "orders" ? (
                                                        <span className="absolute bottom-[-4px] left-0 w-full h-[2px] bg-emerald-600"></span>
                                                    ) : (
                                                        <span className="absolute bottom-[-4px] left-0 w-full h-[2px] bg-emerald-600 opacity-0 hover:opacity-100 transition-opacity duration-200"></span>
                                                    )}
                                                </Link>
                                            </li>
                                        </>
                                    )}
                                    {isLoggedIn && user?.is_admin && (
                                        <li>
                                            <Link
                                                to="/admin"
                                                className={`relative text-sm font-medium hover:text-emerald-600 transition duration-200 ${activeLink === "admin" ? "text-emerald-600" : "text-gray-700"}`}
                                                onClick={() => setMobileMenuOpen(false)}
                                            >
                                                Tableau de Bord Admin
                                                {activeLink === "admin" ? (
                                                    <span className="absolute bottom-[-4px] left-0 w-full h-[2px] bg-emerald-600"></span>
                                                ) : (
                                                    <span className="absolute bottom-[-4px] left-0 w-full h-[2px] bg-emerald-600 opacity-0 hover:opacity-100 transition-opacity duration-200"></span>
                                                )}
                                            </Link>
                                        </li>
                                    )}
                                </ul>
                            )}
                        </div>

                        {/* Mobile Menu Button */}
                        <button
                            className="md:hidden text-gray-700 hover:text-emerald-600 transition-colors"
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                        >
                            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                        </button>

                        {/* Desktop Auth */}
                        <div className="hidden md:flex items-center space-x-3">
                            {isLoggedIn ? (
                                <div className="flex items-center space-x-3 dropdown">
                                    {isLoggedIn && !user?.is_admin && (
                                        <button
                                            onClick={() => setIsPanelOpen(true)}
                                            className="flex items-center justify-center w-10 h-10 bg-gradient-to-r from-blue-600 to-blue-500 text-white rounded-full text-lg font-medium transition duration-200 hover:shadow-md"
                                            aria-label="Ouvrir le panier"
                                        >
                                            <ShoppingCart className="h-5 w-5" />
                                        </button>
                                    )}
                                    <button
                                        onClick={toggleDropdown}
                                        className="flex items-center justify-center w-10 h-10 bg-gradient-to-r from-emerald-600 to-emerald-500 text-white rounded-full text-lg font-medium transition duration-200 hover:shadow-md"
                                        aria-label="Menu utilisateur"
                                    >
                                        {firstLetter}
                                    </button>
                                    {isDropdownOpen && (
                                        <div className="absolute right-4 top-16 w-56 bg-white rounded-xl shadow-xl py-2 z-50 border border-gray-100 animate-in fade-in slide-in-from-top-5">
                                            <div className="px-4 py-3 border-b border-gray-100">
                                                <p className="text-sm text-gray-500">Connecté en tant que</p>
                                                <p className="text-sm font-medium text-gray-900 truncate">{user.username}</p>
                                            </div>
                                            <Link
                                                to="/profile"
                                                className="flex items-center px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50"
                                                onClick={() => setIsDropdownOpen(false)}
                                            >
                                                <User className="h-4 w-4 mr-2 text-gray-500" />
                                                Votre Profil
                                            </Link>
                                            <button
                                                onClick={handleLogout}
                                                className="flex items-center w-full text-left px-4 py-2.5 text-sm text-red-600 hover:bg-red-50"
                                            >
                                                <LogOut className="h-4 w-4 mr-2" />
                                                Se déconnecter
                                            </button>
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <div className="flex items-center space-x-3">
                                    <Link
                                        to="/login"
                                        className="text-sm font-medium px-4 py-2 rounded-lg border border-gray-300 shadow-sm hover:shadow-md transition-all duration-300 text-gray-800 hover:text-emerald-600 bg-white"
                                    >
                                        Se connecter
                                    </Link>
                                    <Link
                                        to="/register"
                                        className="text-sm font-medium bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-700 hover:to-emerald-600 text-white px-4 py-2 rounded-lg transition-all duration-300 shadow-sm hover:shadow-md"
                                    >
                                        S'inscrire
                                    </Link>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Mobile Menu */}
                    {mobileMenuOpen && (
                        <div className="md:hidden mt-4 pb-4 animate-in slide-in-from-top-5">
                            {!isAuthOrProfilePage && (
                                <ul className="flex flex-col space-y-4 mb-6">
                                    <li>
                                        <a
                                            href="/"
                                            className={`block py-2 px-3 rounded-lg ${activeLink === "home" ? "bg-emerald-50 text-emerald-600" : "text-gray-700 hover:bg-gray-50"}`}
                                            onClick={() => setMobileMenuOpen(false)}
                                        >
                                            Accueil
                                        </a>
                                    </li>
                                    <li>
                                        <a
                                            href="#parts"
                                            className={`block py-2 px-3 rounded-lg ${activeLink === "product" ? "bg-emerald-50 text-emerald-600" : "text-gray-700 hover:bg-gray-50"}`}
                                            onClick={() => setMobileMenuOpen(false)}
                                        >
                                            Pièces
                                        </a>
                                    </li>
                                    <li>
                                        <a
                                            href="#why-choose-us"
                                            className={`block py-2 px-3 rounded-lg ${activeLink === "whychooseus" ? "bg-emerald-50 text-emerald-600" : "text-gray-700 hover:bg-gray-50"}`}
                                            onClick={() => setMobileMenuOpen(false)}
                                        >
                                            Pourquoi Nous Choisir
                                        </a>
                                    </li>
                                    {isLoggedIn && !user?.is_admin && (
                                        <>
                                            <li>
                                                <Link
                                                    to="/contact"
                                                    className={`block py-2 px-3 rounded-lg ${activeLink === "contact" ? "bg-emerald-50 text-emerald-600" : "text-gray-700 hover:bg-gray-50"}`}
                                                    onClick={() => setMobileMenuOpen(false)}
                                                >
                                                    Contact
                                                </Link>
                                            </li>
                                            <li>
                                                <Link
                                                    to="/orders"
                                                    className={`block py-2 px-3 rounded-lg ${activeLink === "orders" ? "bg-emerald-50 text-emerald-600" : "text-gray-700 hover:bg-gray-50"}`}
                                                    onClick={() => setMobileMenuOpen(false)}
                                                >
                                                    Mes Commandes
                                                </Link>
                                            </li>
                                        </>
                                    )}
                                    {isLoggedIn && user?.is_admin && (
                                        <li>
                                            <Link
                                                to="/admin"
                                                className={`block py-2 px-3 rounded-lg ${activeLink === "admin" ? "bg-emerald-50 text-emerald-600" : "text-gray-700 hover:bg-gray-50"}`}
                                                onClick={() => setMobileMenuOpen(false)}
                                            >
                                                Tableau de Bord Admin
                                            </Link>
                                        </li>
                                    )}
                                </ul>
                            )}

                            {/* Mobile Auth */}
                            {isLoggedIn ? (
                                <div className="border-t border-gray-100 pt-4">
                                    <div className="flex items-center px-3 mb-3">
                                        <div className="w-10 h-10 bg-gradient-to-r from-emerald-600 to-emerald-500 rounded-full flex items-center justify-center text-white font-medium mr-3">
                                            {firstLetter}
                                        </div>
                                        <div>
                                            <p className="font-medium text-gray-900">{user.username}</p>
                                            <p className="text-xs text-gray-500">Connecté</p>
                                        </div>
                                    </div>
                                    {isLoggedIn && !user?.is_admin && (
                                        <button
                                            onClick={() => {
                                                setIsPanelOpen(true)
                                                setMobileMenuOpen(false)
                                            }}
                                            className="block py-2 px-3 text-gray-700 hover:bg-gray-50 rounded-lg mb-2"
                                        >
                                            <Bookmark className="h-4 w-4 inline mr-2" />
                                            Votre Panier
                                        </button>
                                    )}
                                    <Link
                                        to="/profile"
                                        className="block py-2 px-3 text-gray-700 hover:bg-gray-50 rounded-lg mb-2"
                                        onClick={() => setMobileMenuOpen(false)}
                                    >
                                        <User className="h-4 w-4 inline mr-2" />
                                        Votre Profil
                                    </Link>
                                    <button
                                        onClick={() => {
                                            handleLogout()
                                            setMobileMenuOpen(false)
                                        }}
                                        className="w-full text-left py-2 px-3 text-red-600 hover:bg-red-50 rounded-lg"
                                    >
                                        <LogOut className="h-4 w-4 inline mr-2" />
                                        Se déconnecter
                                    </button>
                                </div>
                            ) : (
                                <div className="flex flex-col space-y-3 border-t border-gray-100 pt-4">
                                    <Link
                                        to="/login"
                                        className="text-sm text-center font-bold px-4 py-2 rounded-lg border border-gray-300 shadow-sm hover:shadow-md transition-all duration-300 text-gray-800 hover:text-emerald-600 bg-white"
                                        onClick={() => setMobileMenuOpen(false)}
                                    >
                                        Se connecter
                                    </Link>
                                    <Link
                                        to="/register"
                                        className="py-2.5 px-3 text-center bg-gradient-to-r from-emerald-600 to-emerald-500 text-white rounded-lg shadow-sm"
                                        onClick={() => setMobileMenuOpen(false)}
                                    >
                                        S'inscrire
                                    </Link>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </nav>
            {isLoggedIn && !user?.is_admin && (
                <Panel isOpen={isPanelOpen} onClose={() => setIsPanelOpen(false)} isLoggedIn={isLoggedIn} user={user} showToast={showToast} />
            )}
        </>
    )
}

export default Navbar