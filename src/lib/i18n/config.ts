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
        description: 'Pierwsza platforma, która pozwala Wam zdobywać nagrody w prawdziwym życiu, za kreatywność na TikToku',
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
        stats: {
          title: 'Dotrzyjcie do Młodego Pokolenia',
          stat1: {
            value: '15 milionów',
            label: 'Mieszkańców Polski używa TikToka'
          },
          stat2: {
            value: '16-24 lata',
            label: 'Najliczniejsza grupa użytkowników (IAB Polska)'
          },
          stat3: {
            value: 'To oni',
            label: 'Są fundamentem naszej platformy'
          },
          stat4: {
            value: 'Ruch społeczny',
            label: 'Dzięki nagrodą i rywalizacji SeeUTrending nie jest zwykłą kampanią, ale ruchem społecznym, zamieniającym Waszą markę w część kultury'
          }
        },
        whyUs: {
          title: 'Dlaczego SeeUTrending?',
          transparent: {
            title: 'Przejrzyste wyniki',
            description: 'Raporty z danymi i statystykami w czasie i po udanym konkursie'
          },
          community: {
            title: 'Stajecie się częścią społeczności',
            description: 'Młode pokolenie zamienia Wasze produkty w element ich życia, sprawiając, że ta kampania to nie jest tylko reklama'
          },
          tailored: {
            title: 'Konkursy szyte na miarę',
            description: 'Indywidualnie dopasowujemy konkursy do Waszej marki z elastycznością i otwartością'
          },
          safety: {
            title: 'Ochrona wizerunku',
            description: 'Profesjonalna moderacja i wytyczne zapewniają ochronę Waszej reputacji'
          },
          pricing: {
            title: 'Najlepsza cena',
            description: 'Wykorzystujemy ogromną grupę użytkowników pełną kreatywności tworząc ofertę nie porównywalną do innych'
          }
        },
        values: {
          title: 'Oferujemy jedyną taką kampanię',
          customization: {
            title: 'Dopasowanie',
            description: 'Konkursy idealnie dopasowane do Waszej marki i celów'
          },
          transparency: {
            title: 'Przejrzystość',
            description: 'Pełna transparentność wyników i analityki w czasie rzeczywistym'
          },
          accessibility: {
            title: 'Dostępność',
            description: 'Platforma dostępna dla marek każdej wielkości'
          },
          bestPrice: {
            title: 'Najlepsza Cena',
            description: 'Niezrównana wartość dzięki zaangażowanej społeczności twórców'
          }
        },
        cta: {
          title: 'Skontaktuj się z Nami',
          description: 'Gotowy na kampanię dopasowaną do Twojej marki? Napisz do naszego zespołu ekspertów.',
          email: 'brands@seeutrending.com'
        },
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
            name: 'Gorący Start',
            description: 'Twoje pierwsze 1000 wyświetleń to dopiero początek wielkiej przygody!'
          },
          viralStarter: {
            name: '10K Klub',
            description: 'Ponad 10K wyświetleń? Twoje treści zaczynają przyciągać uwagę!'
          },
          viralKing: {
            name: 'Złoty Viral',
            description: 'Pierwsze miejsce w konkursie - jesteś mistrzem tworzenia viral treści!'
          },
          silverWarrior: {
            name: 'Srebrny Wojownik',
            description: 'Drugie miejsce to świetny wynik! Jeszcze tylko krok do zwycięstwa.'
          },
          bronzeWarrior: {
            name: 'Brązowy Wojownik',
            description: 'Trzecie miejsce pokazuje, że jesteś w czołówce najlepszych twórców!'
          },
          communityFavorite: {
            name: 'Ulubieniec Społeczności',
            description: 'Najbardziej lubiany twórca - społeczność pokochała Twoje treści!'
          },
          fourthPlace: {
            name: 'Wschodząca Gwiazda',
            description: 'Czwarte miejsce to doskonały wynik - jesteś wschodząca gwiazdą!'
          },
          fifthPlace: {
            name: 'Top Twórca',
            description: 'Piąte miejsce w konkursie to świetny rezultat - należysz do topowych twórców!'
          },
          mostComments: {
            name: 'Mistrz Komentarzy',
            description: 'Najwięcej komentarzy pod treścią - potrafisz rozbudzić dyskusję!'
          },
          earlyAdopter: {
            name: 'Złote Tysiąc',
            description: 'Jesteś jednym z pierwszych 1000 użytkowników SeeUTrending - prawdziwy pionier!'
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
      // Contest Creation
      contest: {
        create: {
          formTitle: 'Utwórz Nowy Konkurs',
          formSubtitle: 'Krok',
          of: 'z',
          step1: 'Podstawowe Informacje',
          step2: 'Marka i Daty',
          step3: 'Nagrody',
          step4: 'Zasady i Wymagania',
          step5: 'Przegląd',
          back: 'Wróć',
          next: 'Dalej',
          creating: 'Tworzenie...',
          createContest: 'Utwórz Konkurs',
          title: 'Tytuł Konkursu',
          titlePlaceholder: 'np. Letni Taneczny Challenge 2025',
          description: 'Opis',
          descriptionPlaceholder: 'Opisz swój konkurs, czego szukasz i co go wyróżnia...',
          contestType: 'Typ Konkursu',
          openContest: 'Otwarty Konkurs',
          openContestDesc: 'Każdy może wziąć udział',
          inviteOnlyContest: 'Tylko na Zaproszenie',
          inviteOnlyContestDesc: 'Wymaga zatwierdzenia do udziału',
          brandInfo: 'Informacje o marce są opcjonalne. Pozostaw puste jeśli to konkurs SeeUTrending.',
          brandName: 'Nazwa Marki/Sponsora',
          brandNamePlaceholder: 'np. Nike, Coca-Cola, itp.',
          brandEmail: 'Email Kontaktowy Marki',
          brandEmailPlaceholder: 'kontakt@marka.pl',
          startDate: 'Data Rozpoczęcia',
          endDate: 'Data Zakończenia',
          prizeInfo: 'Wprowadź opisy nagród (np. "10,000 PLN", "iPhone 15 Pro", "Partnerstwo z marką")',
          firstPrize: 'Nagroda za 1. Miejsce',
          firstPrizePlaceholder: 'np. 10,000 PLN',
          secondPrize: 'Nagroda za 2. Miejsce',
          secondPrizePlaceholder: 'np. 5,000 PLN',
          thirdPrize: 'Nagroda za 3. Miejsce',
          thirdPrizePlaceholder: 'np. 3,000 PLN',
          participationReward: 'Nagroda za Udział (XP)',
          participationRewardDesc: 'Punkty XP przyznawane za sam udział',
          hashtag: 'Główny Hashtag',
          hashtagPlaceholder: 'LetniTaniec2025',
          hashtagDesc: 'Bez symbolu #. Tylko litery, cyfry i podkreślenia.',
          minFollowers: 'Minimalna Liczba Obserwujących',
          maxParticipants: 'Maksymalna Liczba Uczestników',
          maxParticipantsPlaceholder: 'Bez limitu',
          contentGuidelines: 'Wytyczne Dotyczące Treści',
          contentGuidelinesPlaceholder: 'np. Filmy muszą być oryginalne, minimum 15 sekund, treści przyjazne rodzinie...',
          additionalRules: 'Dodatkowe Zasady',
          additionalRulesPlaceholder: 'Inne zasady lub wymagania...',
          featured: 'Wyróżnij ten konkurs na stronie głównej',
          reviewTitle: 'Przejrzyj Szczegóły Konkursu',
          dates: 'Daty',
          prizes: 'Nagrody'
        }
      },
      // Explanatory Trailer
      trailer: {
        title: 'Jak to działa?',
        description: 'Zobacz jak działa SeeUTrending i poznaj wszystkie możliwości platformy',
        videoTitle: 'SeeUTrending - Jak To Działa',
        videoDescription: 'Kompletny przewodnik po platformie',
        clickToWatch: 'Kliknij aby obejrzeć',
        cta: 'Obejrzyj film, aby lepiej zrozumieć jak działa platforma'
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
        subtitle: 'Create contests that make your brand a nationwide trend',
        why_choose: 'Why SeeUTrending?',
        stats: {
          title: 'Reach the Young Generation',
          stat1: {
            value: '15 million',
            label: 'Polish residents use TikTok'
          },
          stat2: {
            value: '16-24 years',
            label: 'Largest user demographic (IAB Poland)'
          },
          stat3: {
            value: 'They are',
            label: 'The foundation of our platform'
          },
          stat4: {
            value: 'Social movement',
            label: 'Through rewards and competition, SeeUTrending is not just a campaign, but a social movement that turns your brand into part of culture'
          }
        },
        whyUs: {
          title: 'Why SeeUTrending?',
          transparent: {
            title: 'Transparent results',
            description: 'Reports with data and statistics during and after successful contests'
          },
          community: {
            title: 'Become part of the community',
            description: 'Young generation turns your products into an element of their lives, making this campaign more than just advertising'
          },
          tailored: {
            title: 'Tailored contests',
            description: 'We individually customize contests for your brand with flexibility and openness'
          },
          safety: {
            title: 'Brand protection',
            description: 'Professional moderation and guidelines ensure protection of your reputation'
          },
          pricing: {
            title: 'Best price',
            description: 'We leverage a huge group of creative users creating an offer incomparable to others'
          }
        },
        values: {
          title: 'We offer the only campaign like this',
          customization: {
            title: 'Customization',
            description: 'Contests perfectly tailored to your brand and goals'
          },
          transparency: {
            title: 'Transparency',
            description: 'Full transparency of results and analytics in real-time'
          },
          accessibility: {
            title: 'Accessibility',
            description: 'Platform accessible for brands of any size'
          },
          bestPrice: {
            title: 'Best Price',
            description: 'Unmatched value thanks to an engaged creator community'
          }
        },
        cta: {
          title: 'Contact Us',
          description: 'Ready for a campaign tailored to your brand? Contact our team of experts.',
          email: 'brands@seeutrending.com'
        },
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
            name: 'Golden Thousand',
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
      // Contest Creation
      contest: {
        create: {
          formTitle: 'Create New Contest',
          formSubtitle: 'Step',
          of: 'of',
          step1: 'Basic Information',
          step2: 'Brand & Dates',
          step3: 'Prizes',
          step4: 'Rules & Requirements',
          step5: 'Review',
          back: 'Back',
          next: 'Next',
          creating: 'Creating...',
          createContest: 'Create Contest',
          title: 'Contest Title',
          titlePlaceholder: 'e.g., Summer Dance Challenge 2025',
          description: 'Description',
          descriptionPlaceholder: 'Describe your contest, what you\'re looking for, and what makes it exciting...',
          contestType: 'Contest Type',
          openContest: 'Open Contest',
          openContestDesc: 'Anyone can participate',
          inviteOnlyContest: 'Invite-Only',
          inviteOnlyContestDesc: 'Requires approval to join',
          brandInfo: 'Brand information is optional. Leave blank if this is a SeeUTrending contest.',
          brandName: 'Brand/Sponsor Name',
          brandNamePlaceholder: 'e.g., Nike, Coca-Cola, etc.',
          brandEmail: 'Brand Contact Email',
          brandEmailPlaceholder: 'contact@brand.com',
          startDate: 'Start Date',
          endDate: 'End Date',
          prizeInfo: 'Enter prize descriptions (e.g., "10,000 PLN", "iPhone 15 Pro", "Brand Partnership")',
          firstPrize: '1st Place Prize',
          firstPrizePlaceholder: 'e.g., 10,000 PLN',
          secondPrize: '2nd Place Prize',
          secondPrizePlaceholder: 'e.g., 5,000 PLN',
          thirdPrize: '3rd Place Prize',
          thirdPrizePlaceholder: 'e.g., 3,000 PLN',
          participationReward: 'Participation Reward (XP)',
          participationRewardDesc: 'XP points awarded just for participating',
          hashtag: 'Main Hashtag',
          hashtagPlaceholder: 'SummerDance2025',
          hashtagDesc: 'Without the # symbol. Only letters, numbers, and underscores.',
          minFollowers: 'Minimum Followers',
          maxParticipants: 'Max Participants',
          maxParticipantsPlaceholder: 'Unlimited',
          contentGuidelines: 'Content Guidelines',
          contentGuidelinesPlaceholder: 'e.g., Videos must be original, minimum 15 seconds, family-friendly content...',
          additionalRules: 'Additional Rules',
          additionalRulesPlaceholder: 'Any other rules or requirements...',
          featured: 'Feature this contest on the homepage',
          reviewTitle: 'Review Contest Details',
          dates: 'Dates',
          prizes: 'Prizes'
        }
      },
      // Explanatory Trailer
      trailer: {
        title: 'Explanatory Trailer',
        description: 'See how SeeUTrending works and discover all platform features',
        videoTitle: 'SeeUTrending - How It Works',
        videoDescription: 'Complete platform guide',
        clickToWatch: 'Click to watch',
        cta: 'Watch the video to better understand how the platform works'
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