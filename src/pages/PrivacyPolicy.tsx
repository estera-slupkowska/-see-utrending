import React from 'react'
import { motion } from 'framer-motion'
import { ArrowLeft, Shield, Eye, Database, Lock, Cookie, Mail, UserCheck } from 'lucide-react'
import { Link } from 'react-router-dom'

export function PrivacyPolicy() {
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
              <Shield className="w-8 h-8 text-primary" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white">Polityka Prywatności</h1>
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
              <Eye className="w-5 h-5 text-primary" />
              <h2 className="text-xl font-bold text-white">Wprowadzenie</h2>
            </div>
            <p className="text-gray-300 leading-relaxed">
              SeeUTrending ("my", "nasz" lub "nas") jest zobowiązany do ochrony Twojej prywatności. Niniejsza Polityka Prywatności wyjaśnia, w jaki sposób gromadzimy,
              używamy, ujawniamy i chronimy Twoje informacje podczas korzystania z naszej platformy do konkursów twórców TikToka i grywalizacji.
            </p>
          </section>

          {/* Information We Collect */}
          <section>
            <div className="flex items-center space-x-2 mb-4">
              <Database className="w-5 h-5 text-primary" />
              <h3 className="text-lg font-semibold text-white">1. Informacje Które Gromadzimy</h3>
            </div>

            <div className="space-y-4">
              <div>
                <h4 className="text-white font-medium mb-2">Informacje o Koncie</h4>
                <ul className="text-gray-300 space-y-1 leading-relaxed ml-4">
                  <li>• Adres e-mail i imię do tworzenia konta</li>
                  <li>• Informacje profilowe które podajesz (biografia, awatar, preferencje)</li>
                  <li>• Preferencje i ustawienia konta</li>
                </ul>
              </div>

              <div>
                <h4 className="text-white font-medium mb-2">Dane Integracji TikTok</h4>
                <ul className="text-gray-300 space-y-1 leading-relaxed ml-4">
                  <li>• Nazwa użytkownika TikTok, wyświetlana nazwa i informacje profilowe</li>
                  <li>• Liczba obserwujących i podstawowe statystyki konta</li>
                  <li>• URL-e video i metadane dla zgłoszeń konkursowych</li>
                  <li>• Metryki wydajności video (wyświetlenia, polubienia, komentarze, udostępnienia)</li>
                  <li>• Tokeny OAuth (zaszyfrowane i bezpiecznie przechowywane)</li>
                </ul>
              </div>

              <div>
                <h4 className="text-white font-medium mb-2">Aktywność na Platformie</h4>
                <ul className="text-gray-300 space-y-1 leading-relaxed ml-4">
                  <li>• Zgłoszenia konkursowe i historia udziału</li>
                  <li>• Punkty XP, odznaki i postęp osiągnięć</li>
                  <li>• Rankingi i wyniki na tablicach wyników</li>
                  <li>• Dane o korzystaniu z platformy i interakcjach</li>
                </ul>
              </div>

              <div>
                <h4 className="text-white font-medium mb-2">Informacje Techniczne</h4>
                <ul className="text-gray-300 space-y-1 leading-relaxed ml-4">
                  <li>• Adres IP i informacje o przeglądarce</li>
                  <li>• Typ urządzenia i system operacyjny</li>
                  <li>• Analityka użytkowania platformy i dane wydajności</li>
                </ul>
              </div>
            </div>
          </section>

          {/* How We Use Information */}
          <section>
            <h3 className="text-lg font-semibold text-white mb-3">2. Jak Używamy Twoich Informacji</h3>
            <p className="text-gray-300 leading-relaxed mb-4">Używamy zebranych informacji do:</p>
            <ul className="text-gray-300 space-y-2 leading-relaxed">
              <li>• Świadczenia i utrzymania usług naszej platformy konkursów</li>
              <li>• Uwierzytelniania Twojego konta i umożliwienia integracji z TikTok</li>
              <li>• Śledzenia zgłoszeń konkursowych i obliczania rankingów</li>
              <li>• Przyznawania punktów XP, odznak i innych nagród grywalizacyjnych</li>
              <li>• Wysyłania powiadomień o konkursach, osiągnięciach i aktualizacjach platformy</li>
              <li>• Generowania analiz i insights dla twórców i marek</li>
              <li>• Poprawy funkcjonalności platformy i doświadczenia użytkownika</li>
              <li>• Zapobiegania oszustwom i zapewnienia uczciwego udziału w konkursach</li>
              <li>• Przestrzegania zobowiązań prawnych i egzekwowania naszego Regulaminu</li>
            </ul>
          </section>

          {/* Information Sharing */}
          <section>
            <h3 className="text-lg font-semibold text-white mb-3">3. Udostępnianie i Ujawnianie Informacji</h3>
            <p className="text-gray-300 leading-relaxed mb-4">Możemy udostępniać Twoje informacje w następujących okolicznościach:</p>
            
            <div className="space-y-4">
              <div>
                <h4 className="text-white font-medium mb-2">Informacje Publiczne</h4>
                <ul className="text-gray-300 space-y-1 leading-relaxed ml-4">
                  <li>• Rankingi i wyniki konkursów (z nazwą użytkownika/pseudonimem)</li>
                  <li>• Osiągnięcia odznak i poziomy XP (jeśli zdecydujesz się je wyświetlać)</li>
                  <li>• Metadane zgłoszeń konkursowych (tytuł video, statystyki wydajności)</li>
                </ul>
              </div>

              <div>
                <h4 className="text-white font-medium mb-2">Partnerzy Markowi</h4>
                <ul className="text-gray-300 space-y-1 leading-relaxed ml-4">
                  <li>• Zagregowane, anonimowe dane o wynikach konkursów</li>
                  <li>• Metryki wydajności twórców dla sponsor. konkursów (za zgodą)</li>
                </ul>
              </div>

              <div>
                <h4 className="text-white font-medium mb-2">Dostawcy Usług</h4>
                <ul className="text-gray-300 space-y-1 leading-relaxed ml-4">
                  <li>• Dostawcy usług analitycznych i hostingu</li>
                  <li>• Dostawcy usług e-mail i powiadomień</li>
                  <li>• Dostawcy usług uwierzytelniania i bezpieczeństwa</li>
                </ul>
              </div>

              <div>
                <h4 className="text-white font-medium mb-2">Wymogi Prawne</h4>
                <ul className="text-gray-300 space-y-1 leading-relaxed ml-4">
                  <li>• Gdy wymagane jest to przez prawo lub proces prawny</li>
                  <li>• Aby chronić nasze prawa, własność lub bezpieczeństwo</li>
                  <li>• Aby zapobiec oszustwom lub nadużyciom naszej platformy</li>
                </ul>
              </div>
            </div>
          </section>

          {/* TikTok Integration Privacy */}
          <section>
            <div className="flex items-center space-x-2 mb-3">
              <UserCheck className="w-5 h-5 text-primary" />
              <h3 className="text-lg font-semibold text-white">4. Prywatność Integracji TikTok</h3>
            </div>
            <ul className="text-gray-300 space-y-2 leading-relaxed">
              <li>• Mamy dostęp tylko do danych TikTok które wyraźnie autoryzujesz przez OAuth</li>
              <li>• Tokeny dostępu TikTok są zaszyfrowane i bezpiecznie przechowywane</li>
              <li>• Możesz odłączyć swoje konto TikTok w każdej chwili</li>
              <li>• Przestrzegamy polityk prywatności TikTok i wymogów ochrony danych</li>
              <li>• Nie przechowujemy ani nie mamy dostępu do Twojego hasła TikTok</li>
              <li>• Treść video pozostaje na TikTok - przechowujemy tylko metadane i metryki wydajności</li>
            </ul>
          </section>

          {/* Data Security */}
          <section>
            <div className="flex items-center space-x-2 mb-3">
              <Lock className="w-5 h-5 text-primary" />
              <h3 className="text-lg font-semibold text-white">5. Bezpieczeństwo Danych</h3>
            </div>
            <p className="text-gray-300 leading-relaxed mb-4">Wdrażamy odpowiednie środki bezpieczeństwa do ochrony Twoich informacji:</p>
            <ul className="text-gray-300 space-y-2 leading-relaxed">
              <li>• Szyfrowanie end-to-end dla transmisji wrażliwych danych</li>
              <li>• Zaszyfrowane przechowywanie tokenów OAuth TikTok</li>
              <li>• Regularne audyty bezpieczeństwa i oceny podatności</li>
              <li>• Kontrola dostępu i uwierzytelnianie naszych systemów</li>
              <li>• Bezpieczny hosting bazy danych z procedurami backup i odzyskiwania</li>
            </ul>
          </section>

          {/* Data Retention */}
          <section>
            <h3 className="text-lg font-semibold text-white mb-3">6. Przechowywanie Danych</h3>
            <ul className="text-gray-300 space-y-2 leading-relaxed">
              <li>• Dane konta są przechowywane podczas gdy Twoje konto jest aktywne</li>
              <li>• Dane konkursów i grywalizacji są przechowywane do śledzenia historycznego</li>
              <li>• Dane integracji TikTok są usuwane gdy odłączysz swoje konto</li>
              <li>• Dane analityczne mogą być przechowywane w zagregowanej, zanonimizowanej formie</li>
              <li>• Możesz poprosić o usunięcie danych kontaktując się z nami</li>
            </ul>
          </section>

          {/* Your Rights (GDPR Compliance) */}
          <section>
            <h3 className="text-lg font-semibold text-white mb-3">7. Twoje Prawa Prywatności (RODO)</h3>
            <p className="text-gray-300 leading-relaxed mb-4">Zgodnie z obowiązującymi przepisami o ochronie danych, masz prawo do:</p>
            <ul className="text-gray-300 space-y-2 leading-relaxed">
              <li>• <strong>Dostępu:</strong> Zażądania kopii Twoich danych osobowych</li>
              <li>• <strong>Sprostowania:</strong> Poprawienia nieprawidłowych lub niekompletnych danych</li>
              <li>• <strong>Usunięcia:</strong> Zażądania usunięcia Twoich danych osobowych</li>
              <li>• <strong>Przenośności:</strong> Otrzymania Twoich danych w przenośnym formacie</li>
              <li>• <strong>Ograniczenia:</strong> Ograniczenia sposobu przetwarzania Twoich danych</li>
              <li>• <strong>Sprzeciwu:</strong> Wniesienia sprzeciwu wobec określonych działań przetwarzania</li>
              <li>• <strong>Cofnięcia Zgody:</strong> Odwołania zgody na przetwarzanie danych</li>
            </ul>
          </section>

          {/* Cookies */}
          <section>
            <div className="flex items-center space-x-2 mb-3">
              <Cookie className="w-5 h-5 text-primary" />
              <h3 className="text-lg font-semibold text-white">8. Pliki Cookie i Śledzenie</h3>
            </div>
            <p className="text-gray-300 leading-relaxed mb-4">Używamy plików cookie i podobnych technologii do:</p>
            <ul className="text-gray-300 space-y-2 leading-relaxed">
              <li>• Utrzymywania Twojej sesji logowania i preferencji</li>
              <li>• Analizowania użytkowania platformy i poprawy funkcjonalności</li>
              <li>• Dostarczania spersonalizowanych treści i rekomendacji</li>
              <li>• Umożliwiania integracji i udostępniania w mediach społecznościowych</li>
            </ul>
            <p className="text-gray-300 leading-relaxed mt-4">
              Możesz kontrolować ustawienia cookie przez preferencje Twojej przeglądarki.
            </p>
          </section>

          {/* International Transfers */}
          <section>
            <h3 className="text-lg font-semibold text-white mb-3">9. Międzynarodowe Transfery Danych</h3>
            <p className="text-gray-300 leading-relaxed">
              Twoje informacje mogą być przetwarzane i przechowywane w krajach innych niż Polska. Zapewniamy odpowiednie zabezpieczenia
              do ochrony Twoich danych podczas międzynarodowych transferów, w tym używanie Standardowych Klauzul Umownych
              i współpracę z dostawcami usług którzy przestrzegają standardy ochrony danych UE.
            </p>
          </section>

          {/* Children's Privacy */}
          <section>
            <h3 className="text-lg font-semibold text-white mb-3">10. Prywatność Dzieci</h3>
            <p className="text-gray-300 leading-relaxed">
              Nasza usługa jest przeznaczona dla użytkowników w wieku 13 lat i starszych. Nie gromadzimy świadomie danych osobowych od dzieci
              poniżej 13 roku życia. Jeśli dowiemy się, że zebraliśmy dane od dziecka poniżej 13 lat, podejmiemy kroki w celu usunięcia takich informacji.
            </p>
          </section>

          {/* Changes to Privacy Policy */}
          <section>
            <h3 className="text-lg font-semibold text-white mb-3">11. Zmiany w tej Polityce Prywatności</h3>
            <p className="text-gray-300 leading-relaxed">
              Możemy od czasu do czasu aktualizować tę Politykę Prywatności. Powiadomimy Cię o wszelkich zmianach poprzez opublikowanie nowej Polityki Prywatności
              na tej stronie i aktualizację daty "Ostatnia aktualizacja". Zachecamy do okresowego przeglądania tej Polityki Prywatności pod kątem wszelkich zmian.
            </p>
          </section>

          {/* Contact */}
          <section className="border-t border-gray-600 pt-6">
            <div className="flex items-center space-x-2 mb-3">
              <Mail className="w-5 h-5 text-primary" />
              <h3 className="text-lg font-semibold text-white">Informacje Kontaktowe</h3>
            </div>
            <p className="text-gray-300 leading-relaxed mb-4">
              Jeśli masz pytania dotyczące tej Polityki Prywatności lub Twoich danych osobowych, skontaktuj się z nami:
            </p>
            <div className="p-4 bg-gray-800/50 rounded-lg">
              <p className="text-white font-medium">Inspektor Ochrony Danych SeeUTrending</p>
              <p className="text-gray-300">E-mail: privacy@seeutrending.com</p>
              <p className="text-gray-300">Strona internetowa: seeutrending.com</p>
              <p className="text-gray-300 mt-2 text-sm">
                Dla mieszkańców UE: Masz również prawo złożyć skargę do lokalnego organu ochrony danych.
              </p>
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