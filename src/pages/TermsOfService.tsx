import React from 'react'
import { motion } from 'framer-motion'
import { ArrowLeft, Shield, Users, Gavel, AlertTriangle, Mail } from 'lucide-react'
import { Link } from 'react-router-dom'

export function TermsOfService() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-purple-900">
      <div className="container mx-auto px-6 py-8 max-w-4xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <Link
            to="/"
            className="inline-flex items-center space-x-2 text-primary hover:text-primary/80 mb-6 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Powrót do strony głównej</span>
          </Link>
          
          <div className="flex items-center space-x-3 mb-4">
            <div className="p-3 bg-primary/20 rounded-lg">
              <Gavel className="w-8 h-8 text-primary" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white">Regulamin</h1>
              <p className="text-gray-400">Ostatnia aktualizacja: {new Date().toLocaleDateString('pl-PL')}</p>
            </div>
          </div>
        </motion.div>

        {/* Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-gradient-to-br from-gray-900/50 to-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-700 p-8 space-y-8"
        >
          {/* Introduction */}
          <section>
            <div className="flex items-center space-x-2 mb-4">
              <Shield className="w-5 h-5 text-primary" />
              <h2 className="text-xl font-bold text-white">Wprowadzenie</h2>
            </div>
            <p className="text-gray-300 leading-relaxed">
              Witamy w SeeUTrending - zgrywalizowanej platformie łączącej polskich twórców TikToka z konkursami na treści markowe.
              Korzystając z naszej usługi, zgadzasz się na niniejszy Regulamin ("Regulamin"). Prosimy o dokładne zapoznanie się z nim.
            </p>
          </section>

          {/* Acceptance of Terms */}
          <section>
            <h3 className="text-lg font-semibold text-white mb-3">1. Akceptacja Regulaminu</h3>
            <p className="text-gray-300 leading-relaxed mb-4">
              Uzyskując dostęp i korzystając z SeeUTrending, akceptujesz i zgadzasz się przestrzegać warunków niniejszej umowy.
              Jeśli nie zgadzasz się na przestrzeganie tych warunków, nie jesteś uprawniony do korzystania z tej usługi.
            </p>
          </section>

          {/* User Accounts */}
          <section>
            <div className="flex items-center space-x-2 mb-3">
              <Users className="w-5 h-5 text-primary" />
              <h3 className="text-lg font-semibold text-white">2. Konta Użytkowników i Rejestracja</h3>
            </div>
            <ul className="text-gray-300 space-y-2 leading-relaxed">
              <li>• Aby korzystać z SeeUTrending, musisz mieć ukończone 13 lat</li>
              <li>• Jesteś odpowiedzialny za zachowanie poufności swojego konta</li>
              <li>• Musisz podać dokładne i kompletne informacje rejestracyjne</li>
              <li>• Jesteś odpowiedzialny za wszystkie działania wykonywane na Twoim koncie</li>
              <li>• Musisz natychmiast powiadomić nas o każdym nieautoryzowanym użyciu swojego konta</li>
            </ul>
          </section>

          {/* TikTok Integration */}
          <section>
            <h3 className="text-lg font-semibold text-white mb-3">3. Integracja z TikTok</h3>
            <p className="text-gray-300 leading-relaxed mb-4">
              SeeUTrending integruje się z TikTok, aby zapewnić funkcje konkursów i analiz:
            </p>
            <ul className="text-gray-300 space-y-2 leading-relaxed">
              <li>• Możesz połączyć swoje konto TikTok, aby uczestniczyć w konkursach</li>
              <li>• Mamy dostęp tylko do danych, które wyraźnie autoryzujesz przez proces OAuth TikToka</li>
              <li>• Możesz w każdej chwili odłączyć swoje konto TikTok</li>
              <li>• Przestrzegamy Regulaminu TikToka i zasad API</li>
            </ul>
          </section>

          {/* Contest Participation */}
          <section>
            <h3 className="text-lg font-semibold text-white mb-3">4. Udział w Konkursach</h3>
            <ul className="text-gray-300 space-y-2 leading-relaxed">
              <li>• Zgłoszenia konkursowe muszą być zgodne z zasadami i wytycznymi konkursu</li>
              <li>• Treść musi być oryginalna i nie naruszać praw osób trzecich</li>
              <li>• Zastrzegamy sobie prawo do dyskwalifikacji zgłoszeń naruszających regulamin</li>
              <li>• Zwycięzcy są określani na podstawie przejrzystych algorytmów punktacji</li>
              <li>• Nagrody są rozdawane zgodnie z warunkami określonymi w regulaminie konkursu</li>
            </ul>
          </section>

          {/* Gamification System */}
          <section>
            <h3 className="text-lg font-semibold text-white mb-3">5. Grywalizacja i Nagrody</h3>
            <ul className="text-gray-300 space-y-2 leading-relaxed">
              <li>• Punkty XP i odznaki są zdobywane poprzez udział w platformie</li>
              <li>• Nagrody nie mają wartości pieniężnej, chyba że wyraźnie zaznaczono</li>
              <li>• Zastrzegamy sobie prawo do dostosowania systemu grywalizacji</li>
              <li>• Oszukańcza działalność może skutkować utratą nagród i zawieszeniem konta</li>
            </ul>
          </section>

          {/* Prohibited Conduct */}
          <section>
            <div className="flex items-center space-x-2 mb-3">
              <AlertTriangle className="w-5 h-5 text-red-400" />
              <h3 className="text-lg font-semibold text-white">6. Zakazane Zachowania</h3>
            </div>
            <p className="text-gray-300 leading-relaxed mb-4">Zobowiązujesz się nie:</p>
            <ul className="text-gray-300 space-y-2 leading-relaxed">
              <li>• Korzystać z usługi w celu niezgodnym z prawem</li>
              <li>• Przesyłać treści obrażliwych, zniesławiających lub niestosownych</li>
              <li>• Próbować manipulować wynikami konkursów lub systemami gier</li>
              <li>• Przeszkadzać w prawidłowym działaniu usługi</li>
              <li>• Tworzyć fałszywych kont lub używać narzędzi automatycznych</li>
              <li>• Naruszać żadnych obowiązujących przepisów prawa</li>
            </ul>
          </section>

          {/* Intellectual Property */}
          <section>
            <h3 className="text-lg font-semibold text-white mb-3">7. Własność Intelektualna</h3>
            <p className="text-gray-300 leading-relaxed mb-4">
              Platforma SeeUTrending, w tym jej projekt, funkcjonalność i treść, jest naszą własnością i chroniona prawami własności intelektualnej.
              Zachowujesz własność przesyłanych treści, ale przyznajesz nam niezbędne prawa do prowadzenia usługi.
            </p>
          </section>

          {/* Privacy */}
          <section>
            <h3 className="text-lg font-semibold text-white mb-3">8. Prywatność</h3>
            <p className="text-gray-300 leading-relaxed">
              Twoja prywatność jest dla nas ważna. Zapoznaj się z naszą Polityką Prywatności, która również reguluje korzystanie z usługi,
              aby zrozumieć nasze praktyki.
            </p>
          </section>

          {/* Limitation of Liability */}
          <section>
            <h3 className="text-lg font-semibold text-white mb-3">9. Ograniczenie Odpowiedzialności</h3>
            <p className="text-gray-300 leading-relaxed">
              SeeUTrending jest świadczone "tak jak jest" bez żadnych gwarancji. Nie ponosimy odpowiedzialności za żadne pośrednie,
              przypadkowe, specjalne, wynikowe lub represyjne szkody wynikające z korzystania z usługi.
            </p>
          </section>

          {/* Termination */}
          <section>
            <h3 className="text-lg font-semibold text-white mb-3">10. Rozwiązanie Umowy</h3>
            <p className="text-gray-300 leading-relaxed">
              Zastrzegamy sobie prawo do zakończenia lub zawieszenia Twojego konta i dostępu do usługi według naszego wyłącznego uznania,
              bez uprzedzenia, za zachowanie które naszym zdaniem narusza niniejszy Regulamin lub jest szkodliwe dla innych użytkowników, nas lub osób trzecich.
            </p>
          </section>

          {/* Changes to Terms */}
          <section>
            <h3 className="text-lg font-semibold text-white mb-3">11. Zmiany w Regulaminie</h3>
            <p className="text-gray-300 leading-relaxed">
              Zastrzegamy sobie prawo do modyfikacji niniejszego Regulaminu w dowolnym czasie. Powiadomimy użytkowników o istotnych zmianach
              poprzez e-mail lub powiadomienia na platformie. Dalsze korzystanie z usługi po zmianach oznacza akceptację.
            </p>
          </section>

          {/* Governing Law */}
          <section>
            <h3 className="text-lg font-semibold text-white mb-3">12. Prawo Obowiązujące</h3>
            <p className="text-gray-300 leading-relaxed">
              Niniejszy Regulamin podlega i jest interpretowany zgodnie z prawem polskim, bez względu na przepisy dotyczące kolizji praw.
            </p>
          </section>

          {/* Contact */}
          <section className="border-t border-gray-600 pt-6">
            <div className="flex items-center space-x-2 mb-3">
              <Mail className="w-5 h-5 text-primary" />
              <h3 className="text-lg font-semibold text-white">Informacje Kontaktowe</h3>
            </div>
            <p className="text-gray-300 leading-relaxed">
              Jeśli masz pytania dotyczące niniejszego Regulaminu, skontaktuj się z nami:
            </p>
            <div className="mt-4 p-4 bg-gray-800/50 rounded-lg">
              <p className="text-white font-medium">Wsparcie SeeUTrending</p>
              <p className="text-gray-300">E-mail: legal@seeutrending.com</p>
              <p className="text-gray-300">Strona internetowa: seeutrending.com</p>
            </div>
          </section>
        </motion.div>

        {/* Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-center mt-8"
        >
          <p className="text-gray-400 text-sm">
            © {new Date().getFullYear()} SeeUTrending. All rights reserved.
          </p>
        </motion.div>
      </div>
    </div>
  )
}