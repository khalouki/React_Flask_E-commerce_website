import { Shield, DollarSign, RefreshCw, ArrowLeftRight, Settings } from "lucide-react"

function WhyChooseUs() {
    const features = [
        {
            icon: <Shield className="h-6 w-6" />,
            title: "Pièces de Qualité",
            description: "Toutes nos pièces subissent un contrôle qualité rigoureux pour garantir fiabilité et durabilité.",
        },
        {
            icon: <DollarSign className="h-6 w-6" />,
            title: "Meilleurs Prix",
            description: "Nous offrons des prix compétitifs et des options de financement transparentes sans frais cachés.",
        },
        {
            icon: <RefreshCw className="h-6 w-6" />,
            title: "Garantie Étendue",
            description: "Chaque achat inclut une garantie complète pour votre tranquillité d'esprit.",
        },
        {
            icon: <ArrowLeftRight className="h-6 w-6" />,
            title: "Échange Facile",
            description: "Échangez vos anciennes pièces et obtenez la meilleure valeur pour votre nouvel achat.",
        },
    ]

    return (
        <section id="why-choose-us" className="py-20 bg-gradient-to-b from-white to-emerald-50">
            <div className="container mx-auto px-4 max-w-7xl">
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-4xl font-bold mb-4">
                        Pourquoi Choisir <span className="text-emerald-600">AutoPièces</span>
                    </h2>
                    <p className="text-gray-600 max-w-2xl mx-auto">
                        Nous nous engageons à fournir une expérience d'achat exceptionnelle avec transparence et intégrité
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {features.map((feature, index) => (
                        <div
                            key={index}
                            className="bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300 overflow-hidden group"
                        >
                            <div className="h-1 bg-emerald-600 transform origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></div>
                            <div className="p-6">
                                <div className="inline-flex items-center justify-center w-14 h-14 bg-emerald-50 text-emerald-600 rounded-full mb-6 group-hover:bg-emerald-100 transition-colors duration-300">
                                    {feature.icon}
                                </div>
                                <h3 className="text-xl font-semibold mb-3 text-gray-900">{feature.title}</h3>
                                <p className="text-gray-600 leading-relaxed">{feature.description}</p>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="mt-16 text-center">
                    <a
                        href="#parts"
                        className="inline-flex items-center justify-center px-8 py-3 bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-700 hover:to-emerald-600 text-white font-medium rounded-full transition-all duration-300 shadow-md hover:shadow-lg"
                        aria-label="Parcourir notre inventaire de pièces"
                    >
                        <Settings className="h-5 w-5 mr-2" />
                        Parcourir Notre Inventaire
                    </a>
                </div>
            </div>
        </section>
    )
}

export default WhyChooseUs
