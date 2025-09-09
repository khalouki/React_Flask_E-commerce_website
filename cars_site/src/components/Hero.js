import { ChevronRight, Settings, Shield, BadgeCheck } from "lucide-react"
import gears from "../images/gears.png"
export default function Hero() {
    return (
        <section className="relative overflow-hidden bg-black text-white">
            {/* Background Pattern */}
            <div className="container mx-auto px-4 py-20 md:py-32 relative z-10">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                    <div className="space-y-8">
                        <div>
                            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-4">
                                Trouvez Vos <span className="text-emerald-400">Pièces Auto</span> Parfaites
                            </h1>
                            <p className="text-lg md:text-xl text-gray-300 max-w-lg">
                                Découvrez des pièces automobiles premium à prix compétitifs avec notre vaste collection et une
                                expérience d'achat fluide.
                            </p>
                        </div>

                        <div className="flex flex-wrap gap-4">
                            <a
                                href="#parts"
                                className="px-6 py-3 bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-700 hover:to-emerald-600 text-white font-medium rounded-full transition-all duration-300 shadow-md hover:shadow-lg flex items-center"
                            >
                                Parcourir l'Inventaire
                                <ChevronRight className="ml-1 h-4 w-4" />
                            </a>
                            <a
                                href="#why-choose-us"
                                className="px-6 py-3 bg-transparent border border-white/30 hover:border-white/60 text-white font-medium rounded-full transition-all duration-300 flex items-center"
                            >
                                Pourquoi Nous Choisir
                            </a>
                        </div>

                        <div className="grid grid-cols-3 gap-4 pt-4">
                            <div className="flex flex-col items-center text-center">
                                <div className="w-12 h-12 rounded-full bg-emerald-500/20 flex items-center justify-center mb-2">
                                    <Settings className="h-6 w-6 text-emerald-400" />
                                </div>
                                <span className="text-sm font-medium">Sélection Premium</span>
                            </div>
                            <div className="flex flex-col items-center text-center">
                                <div className="w-12 h-12 rounded-full bg-emerald-500/20 flex items-center justify-center mb-2">
                                    <Shield className="h-6 w-6 text-emerald-400" />
                                </div>
                                <span className="text-sm font-medium">Qualité Garantie</span>
                            </div>
                            <div className="flex flex-col items-center text-center">
                                <div className="w-12 h-12 rounded-full bg-emerald-500/20 flex items-center justify-center mb-2">
                                    <BadgeCheck className="h-6 w-6 text-emerald-400" />
                                </div>
                                <span className="text-sm font-medium">Pièces Certifiées</span>
                            </div>
                        </div>
                    </div>

                    <div className="relative">
                        <div className="absolute -inset-4 bg-gradient-to-r from-emerald-500/20 to-emerald-400/10 rounded-2xl blur-xl opacity-70"></div>
                        <div className="relative  p-1 rounded-2xl ">
                            <img
                                src={gears}
                                alt="Showcase de pièces automobiles de luxe"
                                className="w-[30rem] h-[26rem] rounded-xl object-cover hover:scale-105 transition-transform"
                            />
                        </div>
                        <div className="absolute -bottom-6 -right-6 bg-emerald-600 text-white px-6 py-3 rounded-lg shadow-lg transform rotate-3">
                            <span className="text-xl font-bold">Nouvelles Arrivées!</span>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}
