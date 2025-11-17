import { redirect } from 'next/navigation'
import Link from "next/link";
import { Button } from "@/shared/common/components/ui/button";
import {
  ShoppingBag,
  Gift,
  Target,
  Users,
  Handshake,
  Camera,
  Check,
  Heart,
  Store,
  Shield
} from "lucide-react";
import { getUser } from '@/shared/auth/server'

export default async function LandingPage() {
  // Verificar si el usuario ya está autenticado
  const user = await getUser()

  if (user) {
    // Redirigir según rol
    switch (user.role) {
      case 'superadmin':
      case 'admin':
        redirect('/dashboard')
      case 'comercial':
        redirect('/scan')
      default:
        redirect('/wishlist')
    }
  }

  return (
    <div className="min-h-screen">
      {/* Navigation */}
      <nav className="bg-white/95 backdrop-blur-sm border-b border-pink-500/10 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 h-16 flex justify-between items-center">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-pink-500 to-purple-500 flex items-center justify-center text-white font-black text-2xl shadow-lg shadow-pink-500/30 transition-transform group-hover:scale-105">
              RR
            </div>
            <span className="text-2xl font-extrabold bg-gradient-to-r from-pink-500 to-purple-500 bg-clip-text text-transparent">
              Reserrega
            </span>
          </Link>
          <div className="flex items-center gap-3">
            <Link href="/login">
              <Button variant="ghost" className="text-gray-700 hover:text-pink-600">
                Iniciar sesión
              </Button>
            </Link>
            <Link href="/register">
              <Button className="bg-gradient-to-r from-pink-500 to-purple-500 hover:shadow-lg hover:shadow-pink-500/30 transition-all hover:-translate-y-0.5">
                ✨ Empezar gratis
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-pink-50 to-purple-50 py-20 md:py-32 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-radial from-orange-400/15 to-transparent rounded-full -translate-y-1/2 translate-x-1/2" />

        <div className="max-w-7xl mx-auto px-6 text-center relative">
          <div className="inline-flex items-center gap-2 bg-white px-5 py-2 rounded-full mb-6 border border-pink-500 text-pink-600 font-semibold shadow-sm">
            <span>🎁</span> El placer de comprar sin gastar
          </div>

          <h1 className="text-5xl md:text-7xl font-extrabold mb-6 leading-tight">
            Reserva lo que amas<br/>
            <span className="bg-gradient-to-r from-pink-500 to-purple-500 bg-clip-text text-transparent">
              Regala sin fallar
            </span>
          </h1>

          <p className="text-xl md:text-2xl text-gray-600 mb-12 max-w-3xl mx-auto leading-relaxed">
            La app que transforma tu experiencia de compra en un juego.
            Pruébatelo todo, crea tu lista perfecta, y recibe exactamente lo que quieres.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            <Link href="/register">
              <Button size="lg" className="bg-gradient-to-r from-pink-500 to-purple-500 hover:shadow-lg hover:shadow-pink-500/30 transition-all hover:-translate-y-0.5 text-lg px-8">
                🚀 Crear mi lista gratis
              </Button>
            </Link>
            <Link href="#how-it-works">
              <Button size="lg" variant="outline" className="border-pink-500 text-pink-600 hover:bg-pink-50 text-lg px-8">
                👀 Ver cómo funciona
              </Button>
            </Link>
          </div>

          <div className="bg-white rounded-2xl p-8 max-w-3xl mx-auto shadow-xl border border-pink-500/20">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="text-4xl font-extrabold text-pink-500 mb-1">100%</div>
                <div className="text-sm text-gray-600">Acierto en regalos</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-extrabold text-pink-500 mb-1">1€</div>
                <div className="text-sm text-gray-600">Por reserva de 15 días</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-extrabold text-pink-500 mb-1">0€</div>
                <div className="text-sm text-gray-600">Compromiso inicial</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-extrabold mb-4">
              ¿Por qué <span className="bg-gradient-to-r from-pink-500 to-purple-500 bg-clip-text text-transparent">Reserrega</span>?
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              La forma más inteligente de desear, reservar y recibir regalos perfectos
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-gray-50 rounded-2xl p-8 hover:bg-white hover:shadow-xl hover:border-pink-500 border-2 border-transparent hover:-translate-y-2 transition-all">
              <div className="text-5xl mb-4">🛍️</div>
              <h3 className="text-2xl font-bold mb-3">Compra sin gastar</h3>
              <p className="text-gray-600 leading-relaxed">
                Ve de tiendas, pruébate todo lo que quieras, escanea los productos
                que te encantan y resérvalo por solo 1€. Vive el placer de comprar
                sin el cargo en tu tarjeta.
              </p>
            </div>

            <div className="bg-gray-50 rounded-2xl p-8 hover:bg-white hover:shadow-xl hover:border-pink-500 border-2 border-transparent hover:-translate-y-2 transition-all">
              <div className="text-5xl mb-4">🎯</div>
              <h3 className="text-2xl font-bold mb-3">Regalos perfectos siempre</h3>
              <p className="text-gray-600 leading-relaxed">
                Tus amigos y familia ven exactamente lo que quieres: talla,
                color, modelo. Sin sorpresas desagradables, sin devoluciones.
                100% de acierto garantizado.
              </p>
            </div>

            <div className="bg-gray-50 rounded-2xl p-8 hover:bg-white hover:shadow-xl hover:border-pink-500 border-2 border-transparent hover:-translate-y-2 transition-all">
              <div className="text-5xl mb-4">💰</div>
              <h3 className="text-2xl font-bold mb-3">Marketplace competitivo</h3>
              <p className="text-gray-600 leading-relaxed">
                Cuando alguien quiere regalarte algo, múltiples tiendas compiten
                por ofrecerte el mejor precio. Tu regalador ahorra y tú recibes
                exactamente lo que pediste.
              </p>
            </div>

            <div className="bg-gray-50 rounded-2xl p-8 hover:bg-white hover:shadow-xl hover:border-pink-500 border-2 border-transparent hover:-translate-y-2 transition-all">
              <div className="text-5xl mb-4">👥</div>
              <h3 className="text-2xl font-bold mb-3">Círculo privado de regaladores</h3>
              <p className="text-gray-600 leading-relaxed">
                Crea tu red de amigos invisibles. Ellos ven tu lista, tú ves la
                suya. El sistema bloquea automáticamente productos cuando alguien
                los está comprando para evitar duplicados.
              </p>
            </div>

            <div className="bg-gray-50 rounded-2xl p-8 hover:bg-white hover:shadow-xl hover:border-pink-500 border-2 border-transparent hover:-translate-y-2 transition-all">
              <div className="text-5xl mb-4">🤝</div>
              <h3 className="text-2xl font-bold mb-3">Vaquitas para regalos caros</h3>
              <p className="text-gray-600 leading-relaxed">
                ¿Un regalo de 500€? Tus amigos pueden unirse y aportar entre
                todos. El sistema gestiona las contribuciones y libera el pago
                cuando se complete el objetivo.
              </p>
            </div>

            <div className="bg-gray-50 rounded-2xl p-8 hover:bg-white hover:shadow-xl hover:border-pink-500 border-2 border-transparent hover:-translate-y-2 transition-all">
              <div className="text-5xl mb-4">📸</div>
              <h3 className="text-2xl font-bold mb-3">Dos formas de crear tu lista</h3>
              <p className="text-gray-600 leading-relaxed">
                Modo casual: Haz fotos de lo que te gusta (GRATIS).
                Modo premium: Escanea productos en tienda con talla y modelo exactos.
                Tú eliges cómo quieres jugar.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How it Works */}
      <section id="how-it-works" className="py-20 bg-gradient-to-br from-pink-50 to-purple-50">
        <div className="max-w-5xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-extrabold mb-4">
              Así de fácil es <span className="bg-gradient-to-r from-pink-500 to-purple-500 bg-clip-text text-transparent">vivir la experiencia Reserrega</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Un proceso simple que revoluciona tu forma de desear y regalar
            </p>
          </div>

          <div className="space-y-12">
            {[
              {
                number: "1",
                title: "Ve de compras sin gastar",
                description: "Entra a tu tienda favorita, pruébate ese vestido que te encanta, ese bolso perfecto o esos zapatos de ensueño. Siente el placer de probártelo todo sin comprometerte a comprar nada.",
                emoji: "🛍️"
              },
              {
                number: "2",
                title: "Escanea y reserva por 1€",
                description: "¿Te queda perfecto? Abre Reserrega, escanea la etiqueta del producto y paga 1€ a la dependienta. El sistema guarda tu talla exacta, color y modelo. Tienes 15 días de reserva.",
                emoji: "📱"
              },
              {
                number: "3",
                title: "Tus amigos ven tu lista perfecta",
                description: "Tu círculo de regaladores entra a tu perfil y ve exactamente lo que quieres. Pueden comprar en la tienda original o buscar ofertas en el marketplace. Sin dudas, sin errores.",
                emoji: "🎁"
              },
              {
                number: "4",
                title: "Recibe exactamente lo que amas",
                description: "El regalo llega a tu casa con la talla perfecta, el color exacto y el modelo que elegiste. Sin devoluciones, sin decepciones. Solo la alegría de recibir lo que realmente querías.",
                emoji: "💝"
              }
            ].map((step, index) => (
              <div key={index} className="bg-white rounded-3xl p-12 shadow-lg grid md:grid-cols-2 gap-12 items-center">
                <div className={index % 2 === 1 ? "md:order-2" : ""}>
                  <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-br from-pink-500 to-purple-500 text-white font-extrabold text-2xl rounded-xl mb-4">
                    {step.number}
                  </div>
                  <h3 className="text-3xl font-bold mb-4">{step.title}</h3>
                  <p className="text-gray-600 text-lg leading-relaxed">{step.description}</p>
                </div>
                <div className={`bg-gradient-to-br from-pink-50 to-purple-50 rounded-2xl p-16 flex items-center justify-center ${index % 2 === 1 ? "md:order-1" : ""}`}>
                  <span className="text-9xl">{step.emoji}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-pink-500 to-purple-500 text-white">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-4xl md:text-5xl font-extrabold mb-4">
            El regalo perfecto empieza aquí
          </h2>
          <p className="text-xl md:text-2xl mb-12 opacity-95">
            Únete a miles de personas que ya están viviendo la experiencia Reserrega
          </p>

          <div className="bg-white/15 backdrop-blur-sm rounded-2xl p-8 mb-8 border border-white/20">
            <div className="space-y-4">
              <p className="text-lg">
                <strong>✅ Sin compromiso</strong> - Empieza gratis y actualiza cuando quieras
              </p>
              <p className="text-lg">
                <strong>✅ Resultados inmediatos</strong> - Crea tu primera lista en 5 minutos
              </p>
              <p className="text-lg">
                <strong>✅ Compatible con tus tiendas favoritas</strong> - Zara, Mango, H&M y más
              </p>
            </div>
          </div>

          <Link href="/register">
            <Button size="lg" className="bg-white text-pink-600 hover:bg-gray-50 shadow-xl hover:shadow-2xl transition-all hover:-translate-y-1 text-lg px-10">
              🎉 Crear mi lista GRATIS
            </Button>
          </Link>

          <p className="mt-4 text-sm opacity-90">
            No necesitas tarjeta de crédito • Configuración en 2 minutos
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-pink-500 to-purple-500 flex items-center justify-center text-white font-black text-xl">
              RR
            </div>
            <span className="text-xl font-bold">Reserrega</span>
          </div>

          <p className="text-white/80 mb-6">
            Reserva lo que amas, Regala sin fallar
          </p>

          <div className="flex gap-6 justify-center flex-wrap mb-6">
            <Link href="#" className="text-white/80 hover:text-pink-400 transition-colors">Privacidad</Link>
            <Link href="#" className="text-white/80 hover:text-pink-400 transition-colors">Términos</Link>
            <Link href="#" className="text-white/80 hover:text-pink-400 transition-colors">Para Tiendas</Link>
            <Link href="/contact" className="text-white/80 hover:text-pink-400 transition-colors">Contacto</Link>
          </div>

          <div className="h-px bg-white/10 my-6"></div>

          <p className="text-white/60 text-sm">
            © 2025 Reserrega. Todos los derechos reservados. Hecho con 💖 para ti.
          </p>
        </div>
      </footer>
    </div>
  );
}
