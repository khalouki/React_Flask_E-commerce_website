import { MapPin, Phone, Mail, Clock } from "lucide-react"

export default function LocationSection() {
    return (
        <section id="info-location" className="py-20 bg-emerald-50">
            <div className="container mx-auto px-4 max-w-8xl">
                <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">
                    Visit <span className="text-emerald-600">CarMarket</span>
                </h2>
                <p className="text-gray-600 max-w-3xl mx-auto text-center mb-8">
                    We're conveniently located and ready to assist you with your car buying journey
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mx-auto">
                    {/* Contact Info Card */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden h-full">
                        <div className="bg-emerald-600 text-white p-5">
                            <h3 className="text-xl font-semibold">Contact Information</h3>
                        </div>
                        <div className="p-5 space-y-4">
                            <div className="flex items-start gap-3">
                                <div className="p-2 bg-emerald-50 rounded-full text-emerald-600">
                                    <MapPin className="w-5 h-5" />
                                </div>
                                <div>
                                    <p className="font-medium text-gray-800">Address</p>
                                    <p className="text-gray-600">126 Mghila, Beni Mellal, Maroc</p>
                                </div>
                            </div>

                            <div className="flex items-start gap-3">
                                <div className="p-2 bg-emerald-50 rounded-full text-emerald-600">
                                    <Phone className="w-5 h-5" />
                                </div>
                                <div>
                                    <p className="font-medium text-gray-800">TELE</p>
                                    <p className="text-gray-600">+212 653738676</p>
                                </div>
                            </div>

                            <div className="flex items-start gap-3">
                                <div className="p-2 bg-emerald-50 rounded-full text-emerald-600">
                                    <Mail className="w-5 h-5" />
                                </div>
                                <div>
                                    <p className="font-medium text-gray-800">Email</p>
                                    <p className="text-gray-600">fpbm@usms.ma</p>
                                </div>
                            </div>

                            <div className="flex items-start gap-3">
                                <div className="p-2 bg-emerald-50 rounded-full text-emerald-600">
                                    <Clock className="w-5 h-5" />
                                </div>
                                <div>
                                    <p className="font-medium text-gray-800">Heures d'ouverture</p>
                                    <p className="text-gray-600">Lundi - Samedi: 9 AM - 6 PM</p>
                                    <p className="text-gray-600">Dimanche: fermé</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Map Card */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden h-full">
                        <iframe
                            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3375.597283139771!2d-6.322921384925518!3d32.37840850834122!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMzLCsDIyJzQyLjMiTiA2wrAxOScxMy4yIlc!5e0!3m2!1sen!2sma!4v1620000000000!5m2!1sen!2sma"
                            width="100%"
                            height="100%"
                            className="min-h-[400px] border-0"
                            allowFullScreen=""
                            loading="lazy"
                            title="Faculté Polydisciplinaire de Beni Mellal Location"
                        ></iframe>
                    </div>
                </div>
            </div>
        </section>
    )
}
