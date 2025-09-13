import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import LanguageDetector from 'i18next-browser-languagedetector'

// Translation resources
const resources = {
  pl: {
    translation: {
      // Navigation
      nav: {
        home: 'Strona główna',
        contests: 'Konkursy',
        education_hub: 'Centrum Edukacji',
        rewards: 'Nagrody',
        brands: 'Marki',
        login: 'Zaloguj się',
        signup: 'Zarejestruj się'
      },
      // Hero section
      hero: {
        title: 'SeeUTrending',
        subtitle: 'Show w którym TY też możesz zagrać',
        description: 'Gamifikowana platforma dla konkursów UGC marek, gdzie twórcy rywalizują w rankingach krajowych w czasie rzeczywistym.',
        cta: {
          primary: 'Weź udział',
          secondary: 'Dla Marek'
        },
        stats: {
          users: 'Użytkownicy'
        }
      },
      // Leaderboard
      leaderboard: {
        title: 'Ranking na żywo',
        locked: {
          title: 'Brak aktywnych konkursów',
          description: 'Zarejestruj się już teraz! Osoby z kontami dowiadują się o wszystkim jako pierwsze.',
          cta: 'Załóż konto'
        }
      },
      // Updates section
      updates: {
        badge: 'Aktualności Zespołu',
        title: 'Najnowsze Informacje',
        subtitle: 'Bądź na bieżąco z najważniejszymi aktualizacjami od zespołu SeeUTrending',
        earlyAdopters: {
          title: '1000 pierwszych użytkowników otrzyma bonusowe punkty XP',
          description: 'Pierwsze 1000 użytkowników, którzy założą konto na SeeUTrending otrzyma bonusowe punkty które zwiększają szansę na zdobycie niektórych odznak i nagród, takich jak wejścia na imprezy.',
          date: 'Aktywne teraz'
        },
        firstContest: {
          title: 'Pierwszy konkurs na żywo już wkrótce!',
          description: 'Przygotowujemy pierwszy konkurs z prawdziwymi nagrodami i możliwością zdobycia prestiżowych odznak. Szykuj swoją kreatywność!',
          date: 'Już wkrótce'
        },
        type: {
          announcement: 'Ogłoszenie',
          upcoming: 'Nadchodzi'
        },
        priority: {
          high: 'Ważne'
        },
        cta: {
          title: 'Nie przegap żadnych nowości!',
          description: 'Zarejestruj się już teraz, aby być pierwszym, który dowie się o nowych konkursach, nagrodach i wydarzeniach.',
          button: 'Utwórz konto teraz'
        }
      },
      // Platform purpose
      purpose: {
        title: 'Twoja szansa na wielkość',
        description: 'Tu każdy może zostać gwiazdą! Rywalizuj z najlepszymi twórcami w Polsce, zdobywaj nagrody i buduj swoją markę osobistą w społeczności, która naprawdę Cię wspiera.',
        cta: 'Dołącz do ruchu'
      },
      // Features
      features: {
        forBrands: {
          title: 'Dla Marek',
          description: 'Rozpoczynaj konkursy z jasnym ROI i autentycznym zaangażowaniem Gen Z'
        },
        forCreators: {
          title: 'Dla Twórców', 
          description: 'Rywalizuj krajowo, zdobywaj odznaki i uzyskuj dostęp do monetyzacji'
        },
        forSpectators: {
          title: 'Dla Widzów',
          description: 'Oglądaj, ucz się, bierz udział i odkrywaj wirusowe treści'
        }
      },
      // Authentication
      auth: {
        login: {
          title: 'Zaloguj się',
          subtitle: 'Witaj z powrotem! Zaloguj się do swojego konta.',
          submit: 'Zaloguj się',
          signing_in: 'Logowanie...',
          forgot_password: 'Zapomniałeś hasła?',
          no_account: 'Nie masz konta?',
          sign_up: 'Zarejestruj się'
        },
        register: {
          title: 'Utwórz konto',
          subtitle: 'Dołącz do SeeUTrending i zacznij rywalizację.',
          submit: 'Utwórz konto',
          creating_account: 'Tworzenie konta...',
          have_account: 'Masz już konto?',
          sign_in: 'Zaloguj się',
          terms_prefix: 'Akceptuję',
          terms_link: 'Regulamin',
          terms_and: 'oraz',
          privacy_link: 'Politykę Prywatności'
        },
        signup: {
          email_confirmation_sent: 'Konto zostało utworzone! Sprawdź swoją skrzynkę e-mail i kliknij link potwierdzający, aby dokończyć rejestrację.'
        },
        fields: {
          name: 'Imię i nazwisko',
          email: 'Adres e-mail',
          password: 'Hasło',
          confirm_password: 'Potwierdź hasło',
          role: 'Wybierz swoją rolę'
        },
        placeholders: {
          name: 'Wprowadź swoje imię i nazwisko',
          email: 'twoj@email.com',
          password: 'Wprowadź hasło',
          confirm_password: 'Potwierdź swoje hasło'
        },
        roles: {
          creator: {
            title: 'Twórca',
            description: 'Twórz treści, rywalizuj i zdobywaj nagrody'
          },
          brand: {
            title: 'Marka',
            description: 'Organizuj konkursy i współpracuj z twórcami'
          },
          spectator: {
            title: 'Widz',
            description: 'Oglądaj, kibicuj i bądź częścią społeczności'
          }
        },
        validation: {
          name_required: 'Imię i nazwisko jest wymagane',
          name_min_length: 'Imię i nazwisko musi mieć co najmniej 2 znaki',
          name_max_length: 'Imię i nazwisko może mieć maksymalnie 50 znaków',
          email_required: 'Adres e-mail jest wymagany',
          email_invalid: 'Wprowadź poprawny adres e-mail',
          password_required: 'Hasło jest wymagane',
          password_min_length: 'Hasło musi mieć co najmniej 6 znaków',
          password_complexity: 'Hasło musi zawierać małą literę, wielką literę i cyfrę',
          confirm_password_required: 'Potwierdź hasło',
          passwords_match: 'Hasła muszą być identyczne',
          terms_required: 'Musisz zaakceptować regulamin'
        },
        errors: {
          invalid_credentials: 'Nieprawidłowy e-mail lub hasło',
          user_exists: 'Użytkownik z tym e-mailem już istnieje',
          password_too_short: 'Hasło musi mieć co najmniej 6 znaków',
          invalid_email: 'Nieprawidłowy format e-maila',
          email_not_confirmed: 'Potwierdź swój e-mail przed logowaniem',
          unexpected: 'Wystąpił nieoczekiwany błąd'
        }
      },
      // Brand page
      brands: {
        title: 'Dla Marek',
        subtitle: 'Twórzcie konkursy, które sprawiają, że wasza marka staje się ogólnokrajowym trendem',
        why_choose: 'Dlaczego SeeUTrending?',
        description: 'Stwórz dopasowany konkurs do swojej marki. Nasza platforma to pierwsze na świecie miejsce które daje możliwość na gamifikacje procesu tworzenia kontentu. Dotrzyj do młodego pokolenia z nami.',
        features: {
          performance: {
            title: 'Analityka w Czasie Rzeczywistym',
            description: 'Śledź zaangażowanie, zasięg i koszty na bieżąco dzięki zaawansowanemu panelowi analitycznemu z pełną przejrzystością wyników.'
          },
          engagement: {
            title: 'Prawdziwe Zaangażowanie Gen Z',
            description: 'Współpracuj ze zweryfikowanymi twórcami, którzy autentycznie reprezentują Twoją markę i tworzą treści o potencjale wirusowym.'
          },
          gamification: {
            title: 'Motywująca Rywalizacja',
            description: 'System rankingów i odznaczeń motywuje twórców do wyższej jakości materiałów i zwiększa ich zaangażowanie w konkurs.'
          },
          analytics: {
            title: 'Kompleksowa Analityka',
            description: 'Szczegółowe raporty efektywności treści, wyników twórców i wzorców zachowań odbiorców dla pełnego obrazu kampanii.'
          },
          safety: {
            title: 'Ochrona Wizerunku Marki',
            description: 'Profesjonalna moderacja treści i przestrzeganie wytycznych marki zapewniają pełne bezpieczeństwo Twojej reputacji.'
          },
          tailored: {
            title: 'Konkursy Szyte na Miarę',
            description: 'Indywidualne strategie konkursowe dopasowane do charakteru Twojej marki i docelowej grupy odbiorców.'
          }
        },
        enterprise: {
          title: 'Rozwiązania dla Każdej Skali Biznesu',
          description: 'Elastyczne plany cenowe dostosowane do potrzeb startupów, średnich firm i korporacji z listy Fortune 500.',
          custom_pricing: 'Wycena Indywidualna',
          support: 'Wsparcie 24/7',
          uptime: 'Dostępność 99.9%'
        },
        cta: {
          title: 'Rozpocznij Swoją Pierwszą Kampanię',
          description: 'Dołącz do grona marek, które już odkryły potencjał SeeUTrending w budowaniu autentycznych relacji z pokoleniem Z.',
          contact_title: 'Skontaktuj się z Nami',
          contact_description: 'Gotowy na kampanię dopasowaną do Twojej marki? Napisz do naszego zespołu ekspertów.',
          email: 'brands@seeutrending.com'
        },
        coming_soon: '🚧 Platforma już wkrótce - Zapisz się na listę oczekujących!',
        back_home: 'Powrót do strony głównej'
      },
      // Education Hub
      education: {
        title: 'Centrum Edukacji',
        subtitle: 'Praktyczne wskazówki zwiększające Twoje szanse w konkursach',
        coming_soon: {
          title: 'Pracujemy nad tym!',
          description: 'Przygotowujemy dla Ciebie kompleksowy przewodnik z tajnikami sukcesu na TikToku. Dowiesz się jak tworzyć wirusowe treści i wygrywać konkursy.'
        },
        features: {
          strategy: {
            title: 'Strategie Treści',
            description: 'Poznaj sekrety tworzenia angażujących materiałów'
          },
          viral: {
            title: 'Schematy Virali',
            description: 'Naucz się mechanizmów rozprzestrzeniania treści'
          },
          guides: {
            title: 'Przewodniki Krok po Kroku',
            description: 'Szczegółowe instrukcje dla każdego rodzaju konkursu'
          }
        },
        notify: {
          title: 'Bądź pierwszy, który się dowie!',
          description: 'Otrzymaj powiadomienie, gdy centrum edukacji będzie gotowe.',
          cta: 'Dołącz teraz'
        },
        progress: 'W trakcie tworzenia...'
      },
      // Rewards page
      rewards: {
        hero: {
          title: 'Nagrody i Osiągnięcia',
          subtitle: 'Twoja aktywność na TikToku przekłada się na prawdziwe nagrody w życiu',
          realLife: 'Prawdziwe Życie',
          mainMessage: 'SeeUTrending została stworzona, aby dać młodemu pokoleniu możliwość doświadczenia czegoś w prawdziwym życiu dzięki aktywności na TikToku.'
        },
        types: {
          title: 'Rodzaje Nagród',
          description: 'Odkryj wszystkie sposoby, w jakie możesz być nagradzany za swoją kreatywność i zaangażowanie.',
          examples: 'Przykłady',
          money: {
            title: 'Nagrody Pieniężne',
            description: 'Otrzymuj prawdziwe pieniądze za najbardziej wirusowe treści i wysokie miejsca w konkursach.'
          },
          experiences: {
            title: 'Doświadczenia i Eventy',
            description: 'Uczestnictwo w ekskluzywnych imprezach i wydarzeniach organizowanych przez SeeUTrending i marki partnerskie.'
          },
          products: {
            title: 'Produkty i Gadżety',
            description: 'Najnowsze produkty od marek partnerskich, które doskonale pasują do Twojego stylu życia.'
          },
          recognition: {
            title: 'Uznanie i Status',
            description: 'Zbuduj swoją reputację dzięki odznaczeniom, pozycji w rankingu i społecznemu uznaniu.'
          }
        },
        badges: {
          title: 'System Odznaczeń',
          description: 'Zbieraj odznaczenia za swoje osiągnięcia. Każde ma swoją historię i pokazuje Twoje umiejętności.',
          rarity: {
            common: 'Częsta',
            rare: 'Rzadka',
            epic: 'Epicki',
            legendary: 'Legendarny'
          },
          hotStart: {
            name: 'Hot Start',
            description: 'Twoje pierwsze 1000 wyświetleń to dopiero początek wielkiej przygody!'
          },
          viralStarter: {
            name: 'Viral Stage',
            description: 'Ponad 10K wyświetleń? Twoje treści zaczynają przyciągać uwagę!'
          },
          viralKing: {
            name: 'Golden Viral',
            description: 'Pierwsze miejsce w konkursie - jesteś mistrzem tworzenia viral treści!'
          },
          silverWarrior: {
            name: 'Silver Warrior',
            description: 'Drugie miejsce to świetny wynik! Jeszcze tylko krok do zwycięstwa.'
          },
          bronzeWarrior: {
            name: 'Bronze Warrior',
            description: 'Trzecie miejsce pokazuje, że jesteś w czołówce najlepszych twórców!'
          },
          communityFavorite: {
            name: 'Ulubieniec Społeczności',
            description: 'Najbardziej lubiany twórca - społeczność pokochała Twoje treści!'
          },
          fourthPlace: {
            name: 'Rising Star',
            description: 'Czwarte miejsce to doskonały wynik - jesteś wschodząca gwiazdą!'
          },
          fifthPlace: {
            name: 'Top Creator',
            description: 'Piąte miejsce w konkursie to świetny rezultat - należysz do topowych twórców!'
          },
          mostComments: {
            name: 'Komentarz Master',
            description: 'Najwięcej komentarzy pod treścią - potrafisz rozbudzić dyskusję!'
          },
          repeatableBadges: {
            title: 'Zdobywaj Wielokrotnie',
            description: 'Wszystkie odznaczenia można zdobywać wielokrotnie - na Twoim profilu będzie widać liczbę zdobytych odznaczeń każdego typu!'
          }
        },
        cta: {
          title: 'Rozpocznij Zdobywanie Nagród',
          description: 'Dołącz do tysięcy twórców, którzy już zarabiają prawdziwe nagrody za swoją kreatywność na TikToku.',
          primary: 'Zacznij Zarabiać',
          secondary: 'Zobacz Konkursy'
        },
        stats: {
          maxPrize: 'Maks. nagroda',
          badges: 'Dostępnych odznaczeń',
          realRewards: 'Prawdziwe nagrody',
          earning: 'Możliwość zarobku'
        }
      },
      // How It Works section
      howItWorks: {
        title: 'Jak Działamy',
        subtitle: 'System, który pozwala Wam doświadczać prawdziwych korzyści za aktywność na TikToku, a markom tworzyć dopasowane konkursy. Pierwsza taka platforma na świecie.',
        stepsTitle: 'Proces w 3 krokach',
        steps: {
          brands: {
            title: 'Marki Tworzą Konkursy',
            description: 'Marki tworzą dla Was konkursy dopasowane do ich stylu, zostawiając wam ogrom wolności'
          },
          creators: {
            title: 'Twórcy Uczestniczą',
            description: 'Użytkownicy TikToka używają swojej kreatywności i zabawy z przyjaciółmi, aby tworzyć treści konkursowe.'
          },
          rewards: {
            title: 'Wszyscy Wygrywają',
            description: 'Twórcy zdobywają punkty, nagrody, prestiż społeczny i zaproszenia na wydarzenia w prawdziwym życiu.'
          }
        },
        stakeholder: {
          brands: 'Dla Marek',
          creators: 'Dla Twórców',
          everyone: 'Dla Wszystkich'
        },
        benefitsTitle: 'Co możesz zyskać?',
        benefitsSubtitle: 'To sposób dla młodego pokolenia, aby czerpać korzyści ze swojej aktywności na TikToku w prawdziwym życiu.',
        benefits: {
          points: {
            title: 'Zdobywaj Punkty XP',
            description: 'Każda aktywność przynosi punkty doświadczenia, które przekładają się na większe korzyści.'
          },
          badges: {
            title: 'Kolekcjonuj Odznaki',
            description: 'Zdobywaj unikalne odznaki za osiągnięcia i buduj swoją reputację w społeczności.'
          },
          rewards: {
            title: 'Prawdziwe Nagrody',
            description: 'Od pieniędzy przez produkty po ekskluzywne doświadczenia - wszystko jest prawdziwe.'
          },
          prestige: {
            title: 'Prestiż Społeczny',
            description: 'Buduj swoją markę osobistą i zyskuj uznanie w społeczności twórców.'
          },
          events: {
            title: 'Zaproszenia na Imprezy',
            description: 'Najaktywniejszy użytkownicy otrzymują zaproszenia na ekskluzywne wydarzenia.'
          },
          opportunities: {
            title: 'Możliwości Kariery',
            description: 'Otwórz drzwi do rozmów kwalifikacyjnych i współpracy z markami.'
          }
        },
        cta: {
          title: 'Gotowy, aby zacząć swoją przygodę?',
          description: '',
          primary: 'Zacznij Teraz',
          secondary: 'Jestem Marką'
        }
      },
      // Mission section
      mission: {
        title: 'Jak Działamy',
        step1: {
          title: 'Konkursy Szyte na Miarę',
          description: 'Tworzymy unikalne wyzwania dopasowane do każdej marki i jej produktów. Każdy konkurs to przemyślana strategia łącząca kreatywność z autentycznym przekazem marki.'
        },
        step2: {
          title: 'Kreatywne Wideo z Produktem',
          description: 'Twórcy naturalnie włączają produkty do swoich treści, tworząc autentyczne materiały, które rezonują z Gen Z. To nie reklama - to prawdziwa kreacja z duszą.'
        },
        step3: {
          title: 'Rywalizacja i Nagrody',
          description: 'Ranking na żywo napędza konkurencję! Twórcy walczą o szczyty list, zdobywając odznaki, punkty i rzeczywiste nagrody. Każdy like to krok bliżej zwycięstwa.'
        },
        summary: 'SeeUTrending łączy marki z najtalentowszymi twórcami Gen Z w Polsce poprzez zgamifikowane konkursy, które generują autentyczne zaangażowanie i wirusowe treści na skalę krajową.',
        cta: 'Rozpocznij Przygodę'
      },
      // Rewards
      rewards: {
        hero: {
          title: 'Nagrody i Osiągnięcia',
          subtitle: 'Twoja aktywność na TikToku = prawdziwe nagrody w życiu',
          realLife: 'Prawdziwe Życie',
          mainMessage: 'Na SeeUTrending każdy like, view i udział w konkursie przekłada się na rzeczywiste korzyści, wydarzenia i doświadczenia.'
        },
        types: {
          title: 'Rodzaje Nagród',
          description: 'Od pieniędzy przez ekskluzywne wydarzenia po unikalne produkty - każda aktywność się opłaca',
          examples: 'Przykłady:',
          money: {
            title: 'Nagrody Finansowe',
            description: 'Prawdziwe pieniądze za najlepsze i najwirusowsze filmy w konkursach'
          },
          experiences: {
            title: 'Doświadczenia i Wydarzenia',
            description: 'Ekskluzywne imprezy i spotkania dla najbardziej aktywnych twórców'
          },
          products: {
            title: 'Produkty i Gadżety',
            description: 'Najnowsze produkty, technologia i merchandising od współpracujących marek'
          },
          recognition: {
            title: 'Uznanie i Status',
            description: 'Odznaki profilowe, pozycje w rankingach i rozpoznawalność w społeczności'
          }
        },
        badges: {
          title: 'System Odznak',
          description: 'Zdobywaj unikalne odznaki za osiągnięcia i buduj swoją reputację w społeczności twórców',
          repeatableBadges: {
            title: 'Odznaki Wielokrotne',
            description: 'Wiele odznak można zdobyć kilkukrotnie - każde następne zdobycie jest liczone na Twoim profilu!'
          },
          rarity: {
            common: 'Częsta',
            rare: 'Rzadka',
            epic: 'Epicka',
            legendary: 'Legendarna'
          },
          hotStart: {
            name: 'Gorący Start',
            description: 'Twój pierwszy film osiągnął 1000 wyświetleń - to dopiero początek!'
          },
          viralStarter: {
            name: 'Viral Stage',
            description: 'Gratulacje! Osiągnąłeś 10 000 wyświetleń na jednym filmie'
          },
          trendingTitan: {
            name: 'Tytan Trendów',
            description: 'Niesamowite! 100 000 wyświetleń to prawdziwy viral content'
          },
          viralKing: {
            name: 'Golden Viral',
            description: 'Pierwsze miejsce w konkursie - jesteś mistrzem tworzenia viral treści!'
          },
          silverWarrior: {
            name: 'Silver Warrior',
            description: 'Drugie miejsce w konkursie - blisko perfekcji, gratulacje!'
          },
          bronzeWarrior: {
            name: 'Brązowy Wojownik',
            description: 'Trzecie miejsce w konkursie - jesteś w ścisłej czołówce!'
          },
          consistencyMaster: {
            name: 'Mistrz Konsekwencji',
            description: 'Siedem dni aktywności z rzędu - twoja determinacja imponuje'
          },
          communityFavorite: {
            name: 'Ulubieniec Społeczności',
            description: 'Twój film otrzymał najwięcej polubień - społeczność Cię kocha!'
          },
          firstTimer: {
            name: 'Pierwszak',
            description: 'Witaj w SeeUTrending! To odznaka za pierwszy udział w konkursie'
          },
          fourthPlace: {
            name: 'Rising Star',
            description: 'Czwarte miejsce to doskonały wynik - jesteś wschodząca gwiazdą!'
          },
          fifthPlace: {
            name: 'Top Creator',
            description: 'Piąte miejsce w konkursie to świetny rezultat - należysz do topowych twórców!'
          },
          mostComments: {
            name: 'Komentarz Master',
            description: 'Najwięcej komentarzy pod treścią - potrafisz rozbudzić dyskusję!'
          },
          earlyAdopter: {
            name: 'Pionier',
            description: 'Jesteś jednym z pierwszych 1000 użytkowników SeeUTrending - prawdziwy pionier!'
          }
        },
        cta: {
          title: 'Gotowy na Nagrody?',
          description: 'Dołącz do tysięcy twórców, którzy już zarabiają i zdobywają nagrody za swoją kreatywność',
          primary: 'Zacznij Zdobywać Nagrody',
          secondary: 'Zobacz Aktywne Konkursy'
        },
        stats: {
          maxPrize: 'Maksymalna Nagroda',
          events: 'Wydarzeń Rocznie',
          community: 'Aktywnych Twórców'
        }
      },
      // Contests
      contests: {
        title: 'Konkursy',
        subtitle: 'Odkryj aktywne konkursy i pokaż swoje umiejętności całej Polsce',
        noActive: {
          title: 'Brak Aktywnych Konkursów',
          description: 'Aktualnie nie ma żadnych aktywnych konkursów, ale już wkrótce pojawią się nowe wyzwania!'
        },
        coming: {
          mainMessage: 'Już wkrótce odbędą się zaplanowane i aktywne konkursy, w których TY będziesz mógł zdobywać nagrody, punkty, odznaki i zaproszenia na imprezy.',
          rewards: 'Nagrody',
          points: 'Punkty',
          parties: 'Imprezy',
          topUsers: 'Dla użytkowników z najwyższą liczbą XP organizowane będą ekskluzywne wydarzenia i imprezy!'
        },
        cta: {
          title: 'Bądź Pierwszym w Kolejce',
          description: 'Zarejestruj się już teraz, aby otrzymać powiadomienie o pierwszym konkursie',
          register: 'Zarejestruj się',
          brands: 'Dla Marek'
        }
      },
      // Common
      common: {
        loading: 'Ładowanie...',
        error: 'Wystąpił błąd',
        tryAgain: 'Spróbuj ponownie',
        close: 'Zamknij',
        save: 'Zapisz',
        cancel: 'Anuluj',
        continue: 'Kontynuuj',
        back: 'Wróć',
        next: 'Dalej',
        finish: 'Zakończ',
        or: 'lub'
      }
    }
  },
  en: {
    translation: {
      // Navigation
      nav: {
        home: 'Home',
        contests: 'Contests',
        education_hub: 'Education Hub',
        rewards: 'Rewards',
        brands: 'Brands',
        login: 'Log in',
        signup: 'Sign up'
      },
      // Hero section
      hero: {
        title: 'SeeUTrending',
        subtitle: 'A show where YOU can also play',
        description: 'Gamified platform for branded UGC contests where creators compete in real-time national leaderboards.',
        cta: {
          primary: 'Join the Movement',
          secondary: 'For Brands'
        },
        stats: {
          users: 'Users'
        }
      },
      // Leaderboard  
      leaderboard: {
        title: 'Live Leaderboard',
        locked: {
          title: 'No active contests',
          description: 'Create your account now! People with accounts get information first.',
          cta: 'Create Account'
        }
      },
      // Updates section
      updates: {
        badge: 'Team Updates',
        title: 'Latest News',
        subtitle: 'Stay up to date with the most important updates from the SeeUTrending team',
        earlyAdopters: {
          title: 'First 1000 users will get extra points!',
          description: 'Users who create accounts in the first 1000 people will receive bonus points which means greater chances for rewards, bonuses like parties and priority information about all new features.',
          date: 'Active now'
        },
        firstContest: {
          title: 'First live contest coming soon!',
          description: 'We are preparing the first contest with real rewards and the opportunity to earn prestigious badges. Get your creativity ready!',
          date: 'Coming soon'
        },
        type: {
          announcement: 'Announcement',
          upcoming: 'Coming'
        },
        priority: {
          high: 'Important'
        },
        cta: {
          title: 'Don\'t miss any news!',
          description: 'Sign up now to be the first to know about new contests, rewards and events.',
          button: 'Create Account Now'
        }
      },
      // Platform purpose
      purpose: {
        title: 'Your chance at greatness',
        description: 'Here everyone can become a star! Compete with the best creators in Poland, win rewards and build your personal brand in a community that truly supports you.',
        cta: 'Join the movement'
      },
      // Features
      features: {
        forBrands: {
          title: 'For Brands',
          description: 'Launch contests with clear ROI and authentic Gen Z engagement'
        },
        forCreators: {
          title: 'For Creators',
          description: 'Compete nationally, earn badges, and access monetization'
        }, 
        forSpectators: {
          title: 'For Spectators',
          description: 'Watch, learn, participate, and discover viral content'
        }
      },
      // Authentication
      auth: {
        login: {
          title: 'Log In',
          subtitle: 'Welcome back! Sign in to your account.',
          submit: 'Log In',
          signing_in: 'Signing in...',
          forgot_password: 'Forgot your password?',
          no_account: "Don't have an account?",
          sign_up: 'Sign up'
        },
        register: {
          title: 'Create Account',
          subtitle: 'Join SeeUTrending and start competing.',
          submit: 'Create Account',
          creating_account: 'Creating account...',
          have_account: 'Already have an account?',
          sign_in: 'Sign in',
          terms_prefix: 'I accept the',
          terms_link: 'Terms of Service',
          terms_and: 'and',
          privacy_link: 'Privacy Policy'
        },
        signup: {
          email_confirmation_sent: 'Account created successfully! Check your email and click the confirmation link to complete your registration.'
        },
        fields: {
          name: 'Full name',
          email: 'Email address',
          password: 'Password',
          confirm_password: 'Confirm password',
          role: 'Choose your role'
        },
        placeholders: {
          name: 'Enter your full name',
          email: 'your@email.com',
          password: 'Enter your password',
          confirm_password: 'Confirm your password'
        },
        roles: {
          creator: {
            title: 'Creator',
            description: 'Create content, compete and earn rewards'
          },
          brand: {
            title: 'Brand',
            description: 'Host contests and collaborate with creators'
          },
          spectator: {
            title: 'Spectator',
            description: 'Watch, cheer and be part of the community'
          }
        },
        validation: {
          name_required: 'Full name is required',
          name_min_length: 'Name must be at least 2 characters',
          name_max_length: 'Name must be no more than 50 characters',
          email_required: 'Email address is required',
          email_invalid: 'Please enter a valid email address',
          password_required: 'Password is required',
          password_min_length: 'Password must be at least 6 characters',
          password_complexity: 'Password must contain lowercase, uppercase, and number',
          confirm_password_required: 'Please confirm your password',
          passwords_match: 'Passwords must match',
          terms_required: 'You must accept the terms and conditions'
        },
        errors: {
          invalid_credentials: 'Invalid email or password',
          user_exists: 'User with this email already exists',
          password_too_short: 'Password must be at least 6 characters',
          invalid_email: 'Invalid email format',
          email_not_confirmed: 'Please confirm your email before signing in',
          unexpected: 'An unexpected error occurred'
        }
      },
      // Brand page
      brands: {
        title: 'For Brands',
        subtitle: 'Launch authentic UGC contests with measurable engagement',
        why_choose: 'Why Choose SeeUTrending?',
        description: 'Connect with Gen Z creators in real-time competitive environments. Our gamified platform drives authentic engagement, measurable results, and viral content creation at scale.',
        features: {
          performance: {
            title: 'Performance Analytics',
            description: 'Monitor engagement, reach, and CPM metrics in real-time with detailed analytics dashboard.'
          },
          engagement: {
            title: 'Gen Z Authentic Engagement',
            description: 'Access verified creators who genuinely connect with your brand and create viral-worthy content.'
          },
          gamification: {
            title: 'Competitive Gamification',
            description: 'Leaderboards and badges drive creators to produce higher quality content and increase participation.'
          },
          analytics: {
            title: 'Performance Analytics',
            description: 'Comprehensive insights into content performance, creator rankings, and audience engagement patterns.'
          },
          safety: {
            title: 'Brand Safety First',
            description: 'Advanced content moderation and brand guidelines enforcement to protect your reputation.'
          },
          tailored: {
            title: 'Tailored Contest Design',
            description: 'Custom contest strategies designed specifically for your brand and target audience, deployed efficiently.'
          }
        },
        enterprise: {
          title: 'Enterprise-Ready Solutions',
          description: 'Flexible pricing plans designed for brands of all sizes, from startups to Fortune 500 companies.',
          custom_pricing: 'Custom Pricing',
          support: 'Support',
          uptime: 'Uptime'
        },
        cta: {
          title: 'Ready to Launch Your First Contest?',
          description: 'Join leading brands who trust SeeUTrending to connect with Gen Z creators and drive authentic engagement at scale.',
          contact_title: 'Get in Touch',
          contact_description: 'Ready to create tailored contests for your brand? Contact our team to get started.',
          email: 'brands@seeutrending.com'
        },
        coming_soon: '🚧 Platform launching soon - Be the first to know!',
        back_home: 'Back to Home'
      },
      // Education Hub
      education: {
        title: 'Education Hub',
        subtitle: 'Practical tips to increase your chances in contests',
        coming_soon: {
          title: 'We\'re working on it!',
          description: 'We\'re preparing a comprehensive guide with TikTok success secrets for you. Learn how to create viral content and win contests.'
        },
        features: {
          strategy: {
            title: 'Content Strategies',
            description: 'Learn the secrets of creating engaging materials'
          },
          viral: {
            title: 'Viral Patterns',
            description: 'Understand the mechanisms of content distribution'
          },
          guides: {
            title: 'Step-by-Step Guides',
            description: 'Detailed instructions for every type of contest'
          }
        },
        notify: {
          title: 'Be the first to know!',
          description: 'Get notified when the education hub is ready.',
          cta: 'Notify me'
        },
        progress: 'In development...'
      },
      // Rewards page
      rewards: {
        hero: {
          title: 'Rewards & Achievements',
          subtitle: 'Your TikTok activity translates into real-life rewards',
          realLife: 'Real Life',
          mainMessage: 'SeeUTrending was created to give the young generation an opportunity to experience something in real life through their TikTok activity.'
        },
        types: {
          title: 'Types of Rewards',
          description: 'Discover all the ways you can be rewarded for your creativity and engagement.',
          examples: 'Examples',
          money: {
            title: 'Financial Rewards',
            description: 'Earn real money for the most viral content and high contest placements.'
          },
          experiences: {
            title: 'Experiences & Events',
            description: 'Participate in exclusive parties and events organized by SeeUTrending and partner brands.'
          },
          products: {
            title: 'Products & Gadgets',
            description: 'Latest products from partner brands that perfectly fit your lifestyle.'
          },
          recognition: {
            title: 'Recognition & Status',
            description: 'Build your reputation through badges, leaderboard positions, and social recognition.'
          }
        },
        badges: {
          title: 'Badge System',
          description: 'Collect badges for your achievements. Each one tells a story and showcases your skills.',
          rarity: {
            common: 'Common',
            rare: 'Rare',
            epic: 'Epic',
            legendary: 'Legendary'
          },
          hotStart: {
            name: 'Hot Start',
            description: 'Your first 1,000 views are just the beginning of a great adventure!'
          },
          viralStarter: {
            name: 'Viral Stage',
            description: 'Over 10K views? Your content is starting to get attention!'
          },
          viralKing: {
            name: 'Golden Viral',
            description: 'First place in a contest - you are a master of creating viral content!'
          },
          silverWarrior: {
            name: 'Silver Warrior',
            description: 'Second place is a great result! Just one step away from victory.'
          },
          bronzeWarrior: {
            name: 'Bronze Warrior',
            description: 'Third place shows you are among the top creators!'
          },
          communityFavorite: {
            name: 'Community Favorite',
            description: 'Most liked creator - the community loved your content!'
          },
          fourthPlace: {
            name: 'Rising Star',
            description: 'Fourth place is an excellent result - you are a rising star!'
          },
          fifthPlace: {
            name: 'Top Creator',
            description: 'Fifth place in the contest is a great result - you belong to top creators!'
          },
          mostComments: {
            name: 'Comment Master',
            description: 'Most comments on your content - you know how to spark discussions!'
          },
          earlyAdopter: {
            name: 'Pioneer',
            description: 'You are one of the first 1000 SeeUTrending users - a true pioneer!'
          },
          repeatableBadges: {
            title: 'Earn Multiple Times',
            description: 'All badges can be earned multiple times - your profile will show the count of each badge type you\'ve earned!'
          }
        },
        cta: {
          title: 'Start Earning Rewards',
          description: 'Join thousands of creators who are already earning real rewards for their TikTok creativity.',
          primary: 'Start Earning',
          secondary: 'View Contests'
        },
        stats: {
          maxPrize: 'Max prize',
          badges: 'Available badges',
          realRewards: 'Real rewards',
          earning: 'Earning potential'
        }
      },
      // How It Works section
      howItWorks: {
        title: 'How We Work',
        subtitle: 'A system that allows brands to create tailored contests for TikTok users, and creators to earn from their creativity.',
        stepsTitle: '3-Step Process',
        steps: {
          brands: {
            title: 'Brands Create Contests',
            description: 'Brands design personalized TikTok challenges tailored to their target audience and marketing goals.'
          },
          creators: {
            title: 'Creators Participate',
            description: 'TikTok users use their creativity and fun with friends to create contest content.'
          },
          rewards: {
            title: 'Everyone Wins',
            description: 'Creators earn points, rewards, social prestige, and invitations to real-life events.'
          }
        },
        stakeholder: {
          brands: 'For Brands',
          creators: 'For Creators',
          everyone: 'For Everyone'
        },
        benefitsTitle: 'What can you gain?',
        benefitsSubtitle: 'It\'s a way for the young generation to get something from their TikTok activity in real life.',
        benefits: {
          points: {
            title: 'Earn XP Points',
            description: 'Every activity brings experience points that translate into greater benefits.'
          },
          badges: {
            title: 'Collect Badges',
            description: 'Earn unique badges for achievements and build your reputation in the community.'
          },
          rewards: {
            title: 'Real Rewards',
            description: 'From money through products to exclusive experiences - everything is real.'
          },
          prestige: {
            title: 'Social Prestige',
            description: 'Build your personal brand and gain recognition in the creator community.'
          },
          events: {
            title: 'Party Invitations',
            description: 'Most active users receive invitations to exclusive events.'
          },
          opportunities: {
            title: 'Career Opportunities',
            description: 'Open doors to interviews and collaborations with brands.'
          }
        },
        cta: {
          title: 'Ready to start your adventure?',
          description: 'Start your adventure and transform your TikTok passion into real benefits.',
          primary: 'Start Now',
          secondary: 'I\'m a Brand'
        }
      },
      // Mission section
      mission: {
        title: 'How We Work',
        step1: {
          title: 'Tailored Contests',
          description: 'We create unique challenges tailored to each brand and their products. Every contest is a thoughtful strategy combining creativity with authentic brand messaging.'
        },
        step2: {
          title: 'Creative Videos with Products',
          description: 'Creators naturally incorporate products into their content, crafting authentic material that resonates with Gen Z. This isn\'t advertising - it\'s genuine creation with soul.'
        },
        step3: {
          title: 'Competition & Rewards',
          description: 'Live leaderboards fuel the competition! Creators battle for the top spots, earning badges, points, and real rewards. Every like is a step closer to victory.'
        },
        summary: 'SeeUTrending connects brands with Poland\'s most talented Gen Z creators through gamified contests that generate authentic engagement and viral content on a national scale.',
        cta: 'Start Your Journey'
      },
      // Rewards
      rewards: {
        hero: {
          title: 'Rewards & Achievements',
          subtitle: 'Your TikTok activity = real rewards in life',
          realLife: 'Real Life',
          mainMessage: 'On SeeUTrending, every like, view, and contest participation translates into real benefits, events, and experiences.'
        },
        types: {
          title: 'Types of Rewards',
          description: 'From money through exclusive events to unique products - every activity pays off',
          examples: 'Examples:',
          money: {
            title: 'Financial Rewards',
            description: 'Real money for the best and most viral videos in contests'
          },
          experiences: {
            title: 'Experiences & Events',
            description: 'Exclusive parties and meetups for the most active creators'
          },
          products: {
            title: 'Products & Gadgets',
            description: 'Latest products, technology, and merchandise from partner brands'
          },
          recognition: {
            title: 'Recognition & Status',
            description: 'Profile badges, leaderboard positions, and recognition in the creator community'
          }
        },
        badges: {
          title: 'Badge System',
          description: 'Earn unique badges for achievements and build your reputation in the creator community',
          repeatableBadges: {
            title: 'Repeatable Badges',
            description: 'Many badges can be earned multiple times - each achievement is counted on your profile!'
          },
          rarity: {
            common: 'Common',
            rare: 'Rare',
            epic: 'Epic',
            legendary: 'Legendary'
          },
          hotStart: {
            name: 'Hot Start',
            description: 'Your first video reached 1,000 views - this is just the beginning!'
          },
          viralStarter: {
            name: 'Viral Starter',
            description: 'Congratulations! You reached 10,000 views on one video'
          },
          trendingTitan: {
            name: 'Trending Titan',
            description: 'Amazing! 100,000 views is true viral content'
          },
          viralKing: {
            name: 'Viral King',
            description: 'First place in a contest - you are the master of content creation!'
          },
          silverStreak: {
            name: 'Silver Streak',
            description: 'Second place in a contest - close to perfection, congratulations!'
          },
          bronzeWarrior: {
            name: 'Bronze Warrior',
            description: 'Third place in a contest - you are in the top tier!'
          },
          consistencyMaster: {
            name: 'Consistency Master',
            description: 'Seven days of activity in a row - your determination is impressive'
          },
          communityFavorite: {
            name: 'Community Favorite',
            description: 'Your video received the most likes - the community loves you!'
          },
          firstTimer: {
            name: 'First Timer',
            description: 'Welcome to SeeUTrending! This badge is for your first contest participation'
          }
        },
        cta: {
          title: 'Ready for Rewards?',
          description: 'Join thousands of creators who are already earning and winning rewards for their creativity',
          primary: 'Start Earning Rewards',
          secondary: 'View Active Contests'
        },
        stats: {
          maxPrize: 'Maximum Prize',
          events: 'Events Per Year',
          community: 'Active Creators'
        }
      },
      // Contests
      contests: {
        title: 'Contests',
        subtitle: 'Discover active contests and showcase your skills to all of Poland',
        noActive: {
          title: 'No Active Contests',
          description: 'There are currently no active contests, but new challenges are coming soon!'
        },
        coming: {
          mainMessage: 'Soon there will be scheduled and active contests where YOU will be able to get rewards, earn points, badges and get invitations for parties.',
          rewards: 'Rewards',
          points: 'Points',
          parties: 'Parties',
          topUsers: 'For users with the highest XP score, events and parties will be organized to encourage people to stay active!'
        },
        cta: {
          title: 'Be First in Line',
          description: 'Register now to get notified about the first contest',
          register: 'Sign Up',
          brands: 'For Brands'
        }
      },
      // Common
      common: {
        loading: 'Loading...',
        error: 'An error occurred', 
        tryAgain: 'Try again',
        close: 'Close',
        save: 'Save', 
        cancel: 'Cancel',
        continue: 'Continue',
        back: 'Back',
        next: 'Next',
        finish: 'Finish',
        or: 'or'
      }
    }
  }
}

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    lng: 'pl', // Default to Polish
    fallbackLng: 'pl',
    interpolation: {
      escapeValue: false
    },
    detection: {
      order: ['localStorage', 'navigator', 'htmlTag'],
      caches: ['localStorage']
    }
  })

export default i18n