import { Settings, Facebook, Twitter, Instagram, Linkedin, ChevronRight } from "lucide-react"

function Footer() {
    return (
        <footer className="bg-gray-900 text-white">
            {/* Main Footer */}
            <div className="container mx-auto px-4 py-12">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {/* About */}
                    <div>
                        <div className="flex items-center space-x-2 mb-4">
                            <Settings className="h-6 w-6 text-emerald-500" />
                            <span className="text-xl font-bold text-emerald-500">AutoPièces</span>
                        </div>
                        <p className="text-gray-400 mb-6">
                            Votre destination de confiance pour des pièces automobiles premium à prix compétitifs. Nous privilégions
                            la qualité, la transparence et la satisfaction client.
                        </p>
                        <div className="flex space-x-4">
                            <a
                                href="#"
                                className="w-8 h-8 rounded-full bg-gray-800 flex items-center justify-center text-gray-400 hover:text-emerald-500 hover:bg-gray-700 transition-colors duration-300"
                            >
                                <Facebook size={16} />
                            </a>
                            <a
                                href="#"
                                className="w-8 h-8 rounded-full bg-gray-800 flex items-center justify-center text-gray-400 hover:text-emerald-500 hover:bg-gray-700 transition-colors duration-300"
                            >
                                <Twitter size={16} />
                            </a>
                            <a
                                href="#"
                                className="w-8 h-8 rounded-full bg-gray-800 flex items-center justify-center text-gray-400 hover:text-emerald-500 hover:bg-gray-700 transition-colors duration-300"
                            >
                                <Instagram size={16} />
                            </a>
                            <a
                                href="#"
                                className="w-8 h-8 rounded-full bg-gray-800 flex items-center justify-center text-gray-400 hover:text-emerald-500 hover:bg-gray-700 transition-colors duration-300"
                            >
                                <Linkedin size={16} />
                            </a>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h3 className="text-lg font-semibold mb-6 text-emerald-500">Liens Rapides</h3>
                        <ul className="space-y-3">
                            <li>
                                <a
                                    href="/"
                                    className="text-gray-400 hover:text-emerald-500 transition-colors duration-300 flex items-center"
                                >
                                    <ChevronRight className="h-4 w-4 mr-2" />
                                    Accueil
                                </a>
                            </li>
                            <li>
                                <a
                                    href="#parts"
                                    className="text-gray-400 hover:text-emerald-500 transition-colors duration-300 flex items-center"
                                >
                                    <ChevronRight className="h-4 w-4 mr-2" />
                                    Parcourir les Pièces
                                </a>
                            </li>
                            <li>
                                <a
                                    href="#why-choose-us"
                                    className="text-gray-400 hover:text-emerald-500 transition-colors duration-300 flex items-center"
                                >
                                    <ChevronRight className="h-4 w-4 mr-2" />
                                    Pourquoi Nous Choisir
                                </a>
                            </li>
                            <li>
                                <a
                                    href="#client-comments"
                                    className="text-gray-400 hover:text-emerald-500 transition-colors duration-300 flex items-center"
                                >
                                    <ChevronRight className="h-4 w-4 mr-2" />
                                    Témoignages
                                </a>
                            </li>
                            <li>
                                <a
                                    href="#info-location"
                                    className="text-gray-400 hover:text-emerald-500 transition-colors duration-300 flex items-center"
                                >
                                    <ChevronRight className="h-4 w-4 mr-2" />
                                    Contact
                                </a>
                            </li>
                        </ul>
                    </div>

                    {/* Services */}
                    <div>
                        <h3 className="text-lg font-semibold mb-6 text-emerald-500">Nos Services</h3>
                        <ul className="space-y-3">
                            <li>
                                <a
                                    href="#"
                                    className="text-gray-400 hover:text-emerald-500 transition-colors duration-300 flex items-center"
                                >
                                    <ChevronRight className="h-4 w-4 mr-2" />
                                    Vente de Pièces
                                </a>
                            </li>
                            <li>
                                <a
                                    href="#"
                                    className="text-gray-400 hover:text-emerald-500 transition-colors duration-300 flex items-center"
                                >
                                    <ChevronRight className="h-4 w-4 mr-2" />
                                    Programme d'Échange
                                </a>
                            </li>
                            <li>
                                <a
                                    href="#"
                                    className="text-gray-400 hover:text-emerald-500 transition-colors duration-300 flex items-center"
                                >
                                    <ChevronRight className="h-4 w-4 mr-2" />
                                    Options de Financement
                                </a>
                            </li>
                            <li>
                                <a
                                    href="#"
                                    className="text-gray-400 hover:text-emerald-500 transition-colors duration-300 flex items-center"
                                >
                                    <ChevronRight className="h-4 w-4 mr-2" />
                                    Garantie Étendue
                                </a>
                            </li>
                            <li>
                                <a
                                    href="#"
                                    className="text-gray-400 hover:text-emerald-500 transition-colors duration-300 flex items-center"
                                >
                                    <ChevronRight className="h-4 w-4 mr-2" />
                                    Installation de Pièces
                                </a>
                            </li>
                        </ul>
                    </div>

                    {/* Newsletter */}
                    <div>
                        <h3 className="text-lg font-semibold mb-6 text-emerald-500">Newsletter</h3>
                        <p className="text-gray-400 mb-4">
                            Abonnez-vous à notre newsletter pour les dernières mises à jour et offres.
                        </p>
                        <form className="space-y-3">
                            <div className="relative">
                                <input
                                    type="email"
                                    placeholder="Votre adresse email"
                                    className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:border-emerald-500 text-gray-300"
                                />
                            </div>
                            <button
                                type="submit"
                                className="w-full bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-700 hover:to-emerald-600 text-white px-4 py-3 rounded-lg transition-all duration-300 font-medium"
                            >
                                S'abonner
                            </button>
                        </form>
                    </div>
                </div>
            </div>

            {/* Copyright */}
            <div className="border-t border-gray-800 py-6">
                <div className="container mx-auto px-4 flex flex-col md:flex-row justify-between items-center">
                    <p className="text-gray-500 text-sm text-center md:text-left">
                        &copy; {new Date().getFullYear()} AutoPièces. Tous droits réservés.
                    </p>
                    <div className="flex space-x-6 mt-4 md:mt-0">
                        <a href="#" className="text-gray-500 hover:text-emerald-500 text-sm transition-colors duration-300">
                            Politique de Confidentialité
                        </a>
                        <a href="#" className="text-gray-500 hover:text-emerald-500 text-sm transition-colors duration-300">
                            Conditions d'Utilisation
                        </a>
                        <a href="#" className="text-gray-500 hover:text-emerald-500 text-sm transition-colors duration-300">
                            Politique des Cookies
                        </a>
                    </div>
                </div>
            </div>
        </footer>
    )
}

export default Footer
