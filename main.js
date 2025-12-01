/* helpers */
const $ = (s, r=document) => r.querySelector(s);
const $$ = (s, r=document) => r.querySelectorAll(s);

/* Internationalization (i18n) */
(function(){
    let translations = {};
    let currentLang = 'en';
    const STORAGE_KEY = 'clnif_lang';
    const RTL_LANGS = ['he', 'ar'];
    
    let langButtons = [];
    const htmlRoot = document.documentElement;
    
    // Language codes mapping
    const langCodes = {
        'en': 'EN',
        'ru': 'RU',
        'he': 'HE',
        'ar': 'AR'
    };
    
    // Translations embedded directly to avoid CORS issues
    const translationsData = {
      "en": {
        "nav": {
          "home": "Home",
          "about": "About",
          "support": "How to Support",
          "transparency": "Transparency",
          "press": "Media",
          "gallery": "Gallery",
          "contact": "Contact"
        },
        "meta": {
          "title": "CLNIF - Champions League for Neighborhoods in Football",
          "description": "CLNIF unites youth and neighborhoods through football. Explore our mission, programs, media, gallery and transparency.",
          "skipLink": "Skip to content"
        },
        "hero": {
          "title": "Champions League",
          "titleAccent": "for Neighborhoods",
          "titleSuffix": "in Football",
          "lead": "We connect youth and neighborhoods through football. Inclusion, respect, leadership and fair play.",
          "learnMore": "Learn more",
          "transparency": "Transparency"
        },
        "about": {
          "mission": "Our Mission",
          "missionText": "We empower young people and strengthen neighborhoods by using football as a tool for education, health, and social cohesion. We work with local communities, schools, and partners to provide safe activities, mentoring, and leadership opportunities.",
          "missionPoint1": "Inclusive access for all backgrounds",
          "missionPoint2": "Fair play and safety on and off the field",
          "missionPoint3": "Clear governance and open communication",
          "programs": "Our Programs",
          "programLeague": "League",
          "programLeagueTitle": "Neighborhood League",
          "programLeagueDesc": "Seasonal tournaments and trainings that build teamwork, discipline and healthy lifestyles.",
          "programClinics": "Clinics",
          "programClinicsTitle": "Workshops & Clinics",
          "programClinicsDesc": "Skills with coaches and mentors: technique, communication, conflict resolution, personal safety.",
          "programCommunity": "Community",
          "programCommunityTitle": "Community Events",
          "programCommunityDesc": "Open trainings, friendly matches and meetups that bring families, volunteers and partners together."
        },
        "kpi": {
          "players": "Players",
          "teams": "Teams",
          "cities": "Cities & Villages",
          "waitlist": "On waitlist"
        },
        "support": {
          "title": "How to Support",
          "intro": "Our organization thrives on support from generous individuals and organizations. Every contribution makes a meaningful difference in empowering youth and strengthening communities.",
          "bankTitle": "Bank Transfer (Israel)",
          "bank": "Bank",
          "branch": "Branch",
          "accountNumber": "Account Number",
          "accountName": "Account Name",
          "swift": "SWIFT",
          "iban": "IBAN",
          "bankName": "Bank Name",
          "internationalTitle": "International Transfer",
          "usTitle": "US Tax-Deductible Donations",
          "usText": "For US citizens, donations are tax-deductible through our partnership with P.E.F. Israel Endowment Funds.",
          "orgId": "Organization ID",
          "donateButton": "Donate via P.E.F.",
          "importantTitle": "Important Information",
          "important1": "All donations are used directly for youth programs and community development",
          "important2": "We provide receipts for all contributions",
          "important3": "US donations through P.E.F. are tax-deductible under section 501(c)(3)",
          "important4": "For questions about donations, contact us at info@clnif.org"
        },
        "transparency": {
          "title": "Transparency",
          "intro": "We are a registered non-profit association and are committed to accountability. Our bylaws, annual balances, and bank ownership confirmation are available to the public.",
          "npoTitle": "Registered NPO",
          "npoText": "Israel NPO Reg. No.:",
          "viewGuidestar": "View on Guidestar",
          "neighborhoodsTitle": "Neighborhoods",
          "neighborhoodsText": "We operate across Israel in multiple districts and neighborhoods and keep expanding every season.",
          "youthTitle": "Youth & Mentors",
          "youthText": "Football plus mentorship, leadership development and community service with real life lessons."
        },
        "press": {
          "title": "In the Media",
          "subtitle": "Selected coverage about CLNIF."
        },
        "gallery": {
          "title": "Gallery",
          "driveButton": "Google Drive gallery"
        },
        "partners": {
          "title": "Partners & Support",
          "intro": "We collaborate with organizations and sponsors to support facilities, transportation, and equipment for teams."
        },
        "contact": {
          "title": "Contact",
          "email": "Email",
          "instagram": "Instagram",
          "facebook": "Facebook",
          "youtube": "YouTube"
        },
        "footer": {
          "rights": "All rights reserved.",
          "poweredBy": "Powered by"
        },
        "aria": {
          "openMenu": "Open menu",
          "closeMenu": "Close menu",
          "closePreview": "Close preview",
          "prevImage": "Previous image",
          "nextImage": "Next image",
          "imagePreview": "Image preview"
        }
      },
      "ru": {
        "nav": {
          "home": "Главная",
          "about": "О нас",
          "support": "Как поддержать",
          "transparency": "Прозрачность",
          "press": "СМИ",
          "gallery": "Галерея",
          "contact": "Контакты"
        },
        "meta": {
          "title": "CLNIF - Лига Чемпионов для Районов в Футболе",
          "description": "CLNIF объединяет молодежь и районы через футбол. Изучите нашу миссию, программы, СМИ, галерею и прозрачность.",
          "skipLink": "Перейти к содержимому"
        },
        "hero": {
          "title": "Лига Чемпионов",
          "titleAccent": "для Районов",
          "titleSuffix": "в Футболе",
          "lead": "Мы объединяем молодежь и районы через футбол. Инклюзивность, уважение, лидерство и честная игра.",
          "learnMore": "Узнать больше",
          "transparency": "Прозрачность"
        },
        "about": {
          "mission": "Наша Миссия",
          "missionText": "Мы расширяем возможности молодежи и укрепляем районы, используя футбол как инструмент для образования, здоровья и социальной сплоченности. Мы работаем с местными сообществами, школами и партнерами, чтобы обеспечить безопасные мероприятия, наставничество и возможности для лидерства.",
          "missionPoint1": "Инклюзивный доступ для всех слоев населения",
          "missionPoint2": "Честная игра и безопасность на поле и вне его",
          "missionPoint3": "Четкое управление и открытое общение",
          "programs": "Наши Программы",
          "programLeague": "Лига",
          "programLeagueTitle": "Районная Лига",
          "programLeagueDesc": "Сезонные турниры и тренировки, которые развивают командную работу, дисциплину и здоровый образ жизни.",
          "programClinics": "Клиники",
          "programClinicsTitle": "Мастер-классы и Клиники",
          "programClinicsDesc": "Навыки с тренерами и наставниками: техника, общение, разрешение конфликтов, личная безопасность.",
          "programCommunity": "Сообщество",
          "programCommunityTitle": "Общественные Мероприятия",
          "programCommunityDesc": "Открытые тренировки, товарищеские матчи и встречи, которые объединяют семьи, волонтеров и партнеров."
        },
        "kpi": {
          "players": "Игроков",
          "teams": "Команд",
          "cities": "Городов и Поселков",
          "waitlist": "В очереди"
        },
        "support": {
          "title": "Как Поддержать",
          "intro": "Наша организация процветает благодаря поддержке щедрых людей и организаций. Каждый вклад имеет значение для расширения возможностей молодежи и укрепления сообществ.",
          "bankTitle": "Банковский Перевод (Израиль)",
          "bank": "Банк",
          "branch": "Отделение",
          "accountNumber": "Номер Счета",
          "accountName": "Название Счета",
          "swift": "SWIFT",
          "iban": "IBAN",
          "bankName": "Название Банка",
          "internationalTitle": "Международный Перевод",
          "usTitle": "Налогооблагаемые Пожертвования из США",
          "usText": "Для граждан США пожертвования не облагаются налогом через наше партнерство с P.E.F. Israel Endowment Funds.",
          "orgId": "ID Организации",
          "donateButton": "Пожертвовать через P.E.F.",
          "importantTitle": "Важная Информация",
          "important1": "Все пожертвования используются напрямую для молодежных программ и развития сообществ",
          "important2": "Мы предоставляем квитанции для всех взносов",
          "important3": "Пожертвования из США через P.E.F. не облагаются налогом согласно разделу 501(c)(3)",
          "important4": "По вопросам о пожертвованиях свяжитесь с нами по info@clnif.org"
        },
        "transparency": {
          "title": "Прозрачность",
          "intro": "Мы зарегистрированная некоммерческая ассоциация и привержены подотчетности. Наши уставы, годовые балансы и подтверждение владения банковским счетом доступны общественности.",
          "npoTitle": "Зарегистрированная НКО",
          "npoText": "Рег. номер НКО Израиля:",
          "viewGuidestar": "Посмотреть на Guidestar",
          "neighborhoodsTitle": "Районы",
          "neighborhoodsText": "Мы работаем по всему Израилю в нескольких округах и районах и продолжаем расширяться каждый сезон.",
          "youthTitle": "Молодежь и Наставники",
          "youthText": "Футбол плюс наставничество, развитие лидерства и общественная служба с реальными жизненными уроками."
        },
        "press": {
          "title": "В СМИ",
          "subtitle": "Избранные материалы о CLNIF."
        },
        "gallery": {
          "title": "Галерея",
          "driveButton": "Галерея Google Drive"
        },
        "partners": {
          "title": "Партнеры и Поддержка",
          "intro": "Мы сотрудничаем с организациями и спонсорами для поддержки объектов, транспорта и оборудования для команд."
        },
        "contact": {
          "title": "Контакты",
          "email": "Email",
          "instagram": "Instagram",
          "facebook": "Facebook",
          "youtube": "YouTube"
        },
        "footer": {
          "rights": "Все права защищены.",
          "poweredBy": "Разработано"
        },
        "aria": {
          "openMenu": "Открыть меню",
          "closeMenu": "Закрыть меню",
          "closePreview": "Закрыть превью",
          "prevImage": "Предыдущее изображение",
          "nextImage": "Следующее изображение",
          "imagePreview": "Превью изображения"
        }
      },
      "he": {
        "nav": {
          "home": "בית",
          "about": "אודות",
          "support": "איך לתמוך",
          "transparency": "שקיפות",
          "press": "מדיה",
          "gallery": "גלריה",
          "contact": "יצירת קשר"
        },
        "meta": {
          "title": "CLNIF - ליגת האלופות לשכונות בכדורגל",
          "description": "CLNIF מאחדת נוער ושכונות דרך כדורגל. גלו את המשימה שלנו, התוכניות, המדיה, הגלריה והשקיפות.",
          "skipLink": "דלג לתוכן"
        },
        "hero": {
          "title": "ליגת האלופות",
          "titleAccent": "לשכונות",
          "titleSuffix": "בכדורגל",
          "lead": "אנו מחברים נוער ושכונות דרך כדורגל. הכלה, כבוד, מנהיגות ומשחק הוגן.",
          "learnMore": "למד עוד",
          "transparency": "שקיפות"
        },
        "about": {
          "mission": "המשימה שלנו",
          "missionText": "אנו מעצימים צעירים ומחזקים שכונות באמצעות שימוש בכדורגל ככלי לחינוך, בריאות ולכידות חברתית. אנו עובדים עם קהילות מקומיות, בתי ספר ושותפים כדי לספק פעילויות בטוחות, חונכות והזדמנויות מנהיגות.",
          "missionPoint1": "גישה מכילה לכל הרקעים",
          "missionPoint2": "משחק הוגן ובטיחות על המגרש ומחוצה לו",
          "missionPoint3": "ממשל ברור ותקשורת פתוחה",
          "programs": "התוכניות שלנו",
          "programLeague": "ליגה",
          "programLeagueTitle": "ליגת השכונות",
          "programLeagueDesc": "טורנירים ואימונים עונתיים שבונים עבודת צוות, משמעת ואורח חיים בריא.",
          "programClinics": "קליניקות",
          "programClinicsTitle": "סדנאות וקליניקות",
          "programClinicsDesc": "כישורים עם מאמנים ומנטורים: טכניקה, תקשורת, פתרון קונפליקטים, בטיחות אישית.",
          "programCommunity": "קהילה",
          "programCommunityTitle": "אירועי קהילה",
          "programCommunityDesc": "אימונים פתוחים, משחקים ידידותיים ופגישות שמביאות יחד משפחות, מתנדבים ושותפים."
        },
        "kpi": {
          "players": "שחקנים",
          "teams": "קבוצות",
          "cities": "ערים וכפרים",
          "waitlist": "ברשימת המתנה"
        },
        "support": {
          "title": "איך לתמוך",
          "intro": "הארגון שלנו משגשג בזכות תמיכה מאנשים וארגונים נדיבים. כל תרומה עושה הבדל משמעותי בהעצמת נוער וחיזוק קהילות.",
          "bankTitle": "העברה בנקאית (ישראל)",
          "bank": "בנק",
          "branch": "סניף",
          "accountNumber": "מספר חשבון",
          "accountName": "שם החשבון",
          "swift": "SWIFT",
          "iban": "IBAN",
          "bankName": "שם הבנק",
          "internationalTitle": "העברה בינלאומית",
          "usTitle": "תרומות פטורות ממס מארה\"ב",
          "usText": "לאזרחי ארה\"ב, תרומות פטורות ממס דרך השותפות שלנו עם P.E.F. Israel Endowment Funds.",
          "orgId": "מספר ארגון",
          "donateButton": "תרום דרך P.E.F.",
          "importantTitle": "מידע חשוב",
          "important1": "כל התרומות משמשות ישירות לתוכניות נוער ופיתוח קהילה",
          "important2": "אנו מספקים קבלות לכל התרומות",
          "important3": "תרומות מארה\"ב דרך P.E.F. פטורות ממס תחת סעיף 501(c)(3)",
          "important4": "לשאלות על תרומות, צרו קשר ב-info@clnif.org"
        },
        "transparency": {
          "title": "שקיפות",
          "intro": "אנו עמותה רשומה ללא כוונת רווח ומחויבים לאחריות. התקנונים, מאזנים שנתיים ואישור בעלות בנקאית שלנו זמינים לציבור.",
          "npoTitle": "עמותה רשומה",
          "npoText": "מספר רישום עמותה בישראל:",
          "viewGuidestar": "צפה ב-Guidestar",
          "neighborhoodsTitle": "שכונות",
          "neighborhoodsText": "אנו פועלים ברחבי ישראל במספר מחוזות ושכונות וממשיכים להתרחב כל עונה.",
          "youthTitle": "נוער ומנטורים",
          "youthText": "כדורגל פלוס חונכות, פיתוח מנהיגות ושירות קהילתי עם שיעורי חיים אמיתיים."
        },
        "press": {
          "title": "במדיה",
          "subtitle": "כיסוי נבחר על CLNIF."
        },
        "gallery": {
          "title": "גלריה",
          "driveButton": "גלריה ב-Google Drive"
        },
        "partners": {
          "title": "שותפים ותמיכה",
          "intro": "אנו משתפים פעולה עם ארגונים ותורמים לתמוך במתקנים, תחבורה וציוד לקבוצות."
        },
        "contact": {
          "title": "יצירת קשר",
          "email": "אימייל",
          "instagram": "אינסטגרם",
          "facebook": "פייסבוק",
          "youtube": "יוטיוב"
        },
        "footer": {
          "rights": "כל הזכויות שמורות.",
          "poweredBy": "מופעל על ידי"
        },
        "aria": {
          "openMenu": "פתח תפריט",
          "closeMenu": "סגור תפריט",
          "closePreview": "סגור תצוגה מקדימה",
          "prevImage": "תמונה קודמת",
          "nextImage": "תמונה הבאה",
          "imagePreview": "תצוגה מקדימה של תמונה"
        }
      },
      "ar": {
        "nav": {
          "home": "الرئيسية",
          "about": "من نحن",
          "support": "كيفية الدعم",
          "transparency": "الشفافية",
          "press": "الإعلام",
          "gallery": "المعرض",
          "contact": "اتصل بنا"
        },
        "meta": {
          "title": "CLNIF - دوري الأبطال للأحياء في كرة القدم",
          "description": "CLNIF توحد الشباب والأحياء من خلال كرة القدم. استكشف مهمتنا وبرامجنا ووسائل الإعلام والمعرض والشفافية.",
          "skipLink": "تخطي إلى المحتوى"
        },
        "hero": {
          "title": "دوري الأبطال",
          "titleAccent": "للأحياء",
          "titleSuffix": "في كرة القدم",
          "lead": "نوحد الشباب والأحياء من خلال كرة القدم. الشمولية والاحترام والقيادة واللعب النظيف.",
          "learnMore": "اعرف المزيد",
          "transparency": "الشفافية"
        },
        "about": {
          "mission": "مهمتنا",
          "missionText": "نمكن الشباب ونقوي الأحياء باستخدام كرة القدم كأداة للتعليم والصحة والتماسك الاجتماعي. نعمل مع المجتمعات المحلية والمدارس والشركاء لتوفير أنشطة آمنة والإرشاد وفرص القيادة.",
          "missionPoint1": "الوصول الشامل لجميع الخلفيات",
          "missionPoint2": "اللعب النظيف والسلامة داخل الملعب وخارجه",
          "missionPoint3": "الحكم الواضح والتواصل المفتوح",
          "programs": "برامجنا",
          "programLeague": "الدوري",
          "programLeagueTitle": "دوري الأحياء",
          "programLeagueDesc": "البطولات والتدريبات الموسمية التي تبني العمل الجماعي والانضباط وأنماط الحياة الصحية.",
          "programClinics": "العيادات",
          "programClinicsTitle": "ورش العمل والعيادات",
          "programClinicsDesc": "المهارات مع المدربين والمرشدين: التقنية والتواصل وحل النزاعات والسلامة الشخصية.",
          "programCommunity": "المجتمع",
          "programCommunityTitle": "فعاليات المجتمع",
          "programCommunityDesc": "التدريبات المفتوحة والمباريات الودية واللقاءات التي تجمع العائلات والمتطوعين والشركاء معًا."
        },
        "kpi": {
          "players": "لاعبين",
          "teams": "فرق",
          "cities": "مدن وقرى",
          "waitlist": "في قائمة الانتظار"
        },
        "support": {
          "title": "كيفية الدعم",
          "intro": "منظمتنا تزدهر بدعم من الأفراد والمنظمات الكريمة. كل مساهمة تحدث فرقًا ذا معنى في تمكين الشباب وتقوية المجتمعات.",
          "bankTitle": "تحويل بنكي (إسرائيل)",
          "bank": "البنك",
          "branch": "الفرع",
          "accountNumber": "رقم الحساب",
          "accountName": "اسم الحساب",
          "swift": "SWIFT",
          "iban": "IBAN",
          "bankName": "اسم البنك",
          "internationalTitle": "تحويل دولي",
          "usTitle": "تبرعات معفاة من الضرائب من الولايات المتحدة",
          "usText": "للمواطنين الأمريكيين، التبرعات معفاة من الضرائب من خلال شراكتنا مع P.E.F. Israel Endowment Funds.",
          "orgId": "رقم المنظمة",
          "donateButton": "تبرع عبر P.E.F.",
          "importantTitle": "معلومات مهمة",
          "important1": "جميع التبرعات تُستخدم مباشرة لبرامج الشباب وتنمية المجتمع",
          "important2": "نوفر إيصالات لجميع المساهمات",
          "important3": "التبرعات من الولايات المتحدة عبر P.E.F. معفاة من الضرائب بموجب القسم 501(c)(3)",
          "important4": "للأسئلة حول التبرعات، اتصل بنا على info@clnif.org"
        },
        "transparency": {
          "title": "الشفافية",
          "intro": "نحن جمعية غير ربحية مسجلة وملتزمون بالمساءلة. لوائحنا والأرصدة السنوية وتأكيد ملكية البنك متاحة للجمهور.",
          "npoTitle": "منظمة غير ربحية مسجلة",
          "npoText": "رقم تسجيل المنظمة غير الربحية في إسرائيل:",
          "viewGuidestar": "عرض على Guidestar",
          "neighborhoodsTitle": "الأحياء",
          "neighborhoodsText": "نعمل في جميع أنحاء إسرائيل في عدة مناطق وأحياء ونستمر في التوسع كل موسم.",
          "youthTitle": "الشباب والمرشدين",
          "youthText": "كرة القدم بالإضافة إلى الإرشاد وتطوير القيادة وخدمة المجتمع مع دروس الحياة الحقيقية."
        },
        "press": {
          "title": "في الإعلام",
          "subtitle": "تغطية مختارة حول CLNIF."
        },
        "gallery": {
          "title": "المعرض",
          "driveButton": "معرض Google Drive"
        },
        "partners": {
          "title": "الشركاء والدعم",
          "intro": "نتعاون مع المنظمات والرعاة لدعم المرافق والنقل والمعدات للفرق."
        },
        "contact": {
          "title": "اتصل بنا",
          "email": "البريد الإلكتروني",
          "instagram": "إنستغرام",
          "facebook": "فيسبوك",
          "youtube": "يوتيوب"
        },
        "footer": {
          "rights": "جميع الحقوق محفوظة.",
          "poweredBy": "مدعوم من"
        },
        "aria": {
          "openMenu": "فتح القائمة",
          "closeMenu": "إغلاق القائمة",
          "closePreview": "إغلاق المعاينة",
          "prevImage": "الصورة السابقة",
          "nextImage": "الصورة التالية",
          "imagePreview": "معاينة الصورة"
        }
      }
    };
    
    // Load translations (now synchronous, no fetch needed)
    function loadTranslations() {
        translations = translationsData;
    }
    
    // Get nested translation value
    function getTranslation(key, lang = currentLang) {
        const keys = key.split('.');
        let value = translations[lang];
        for (const k of keys) {
            if (!value || typeof value !== 'object') return null;
            value = value[k];
        }
        return value || null;
    }
    
    // Apply translations to all elements with data-i18n
    function applyTranslations() {
        // Update HTML lang and dir attributes
        htmlRoot.setAttribute('lang', currentLang);
        if (RTL_LANGS.includes(currentLang)) {
            htmlRoot.setAttribute('dir', 'rtl');
        } else {
            htmlRoot.setAttribute('dir', 'ltr');
        }
        
        // Update page title and meta description
        const pageTitle = $('#pageTitle');
        const pageDescription = $('#pageDescription');
        if (pageTitle) {
            const titleKey = pageTitle.getAttribute('data-i18n');
            if (titleKey) {
                const title = getTranslation(titleKey);
                if (title) {
                    pageTitle.textContent = title;
                    document.title = title;
                }
            }
        }
        if (pageDescription) {
            const descKey = pageDescription.getAttribute('data-i18n');
            if (descKey) {
                const desc = getTranslation(descKey);
                if (desc) {
                    pageDescription.setAttribute('content', desc);
                }
            }
        }
        
        // Update all elements with data-i18n
        $$('[data-i18n]').forEach(el => {
            const key = el.getAttribute('data-i18n');
            const translation = getTranslation(key);
            if (translation) {
                el.textContent = translation;
            }
        });
        
        // Update aria-label attributes
        $$('[data-i18n-aria]').forEach(el => {
            const key = el.getAttribute('data-i18n-aria');
            const translation = getTranslation(key);
            if (translation) {
                el.setAttribute('aria-label', translation);
            }
        });
        
        // Update aria-label for elements with data-i18n-aria-label
        $$('[data-i18n-aria-label]').forEach(el => {
            const key = el.getAttribute('data-i18n-aria-label');
            const translation = getTranslation(key);
            if (translation) {
                el.setAttribute('aria-label', translation);
            }
        });
        
        // Update active language button
        langButtons.forEach(btn => {
            const btnLang = btn.getAttribute('data-lang');
            if (btnLang === currentLang) {
                btn.classList.add('active');
            } else {
                btn.classList.remove('active');
            }
        });
    }
    
    // Get DOM elements (called after DOM is ready)
    function getDOMElements() {
        langButtons = Array.from(document.querySelectorAll('.lang-btn'));
    }
    
    // Switch language
    function switchLanguage(lang) {
        if (!translations[lang]) {
            console.warn(`Language ${lang} not found`);
            return;
        }
        currentLang = lang;
        localStorage.setItem(STORAGE_KEY, lang);
        applyTranslations();
    }
    
    // Initialize i18n
    function initI18n() {
        // Get DOM elements first
        getDOMElements();
        
        loadTranslations();
        
        // Get saved language or default to English
        const savedLang = localStorage.getItem(STORAGE_KEY);
        if (savedLang && translations[savedLang]) {
            currentLang = savedLang;
        } else {
            // Try to detect browser language
            const browserLang = navigator.language.split('-')[0];
            if (translations[browserLang]) {
                currentLang = browserLang;
            }
        }
        
        applyTranslations();
        
        // Setup language selector using event delegation
        setupLanguageSelector();
    }
    
    // Setup language selector buttons
    function setupLanguageSelector() {
        langButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const lang = btn.getAttribute('data-lang');
                if (lang) {
                    switchLanguage(lang);
                }
            });
        });
    }
    
    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initI18n);
    } else {
        initI18n();
    }
})();

/* Progress bar */
const progressBar = $('#progressBar');
if (progressBar) {
    window.addEventListener('scroll', () => {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
        const scrollPercent = (scrollTop / scrollHeight) * 100;
        progressBar.style.width = scrollPercent + '%';
    });
}

/* Toast notifications */
const Toast = {
    show(message, type = 'info', duration = 3000) {
        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        toast.textContent = message;
        document.body.appendChild(toast);
        
        setTimeout(() => toast.classList.add('show'), 100);
        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => toast.remove(), 300);
        }, duration);
    }
};

/* Loading states */
const Loading = {
    show(element) {
        element.classList.add('loading');
    },
    hide(element) {
        element.classList.remove('loading');
    }
};

/* drawer mobile */
(function(){
    const btn = $('.burger');
    const drawer = $('#drawer');
    const scrim = $('.scrim');
    if(!btn || !drawer) return;

    let open = false;
    let lastFocus = null;

    const show = () => {
        open = true;
        lastFocus = document.activeElement;
        drawer.classList.add('open');
        drawer.setAttribute('aria-hidden','false');
        btn.setAttribute('aria-expanded','true');
        if(scrim){ scrim.hidden=false; scrim.classList.add('open'); }
        document.body.style.overflow='hidden';
        (drawer.querySelector('a,button') || drawer).focus({preventScroll:true});
    };

    const hide = () => {
        open = false;
        drawer.classList.remove('open');
        drawer.setAttribute('aria-hidden','true');
        btn.setAttribute('aria-expanded','false');
        if(scrim){ scrim.hidden=true; scrim.classList.remove('open'); }
        document.body.style.overflow='';
        if(lastFocus) lastFocus.focus({preventScroll:true});
    };

    btn.addEventListener('click', ()=> open ? hide() : show());
    drawer.querySelector('.close')?.addEventListener('click', hide);
    scrim?.addEventListener('click', hide);
    addEventListener('keydown', e=>{ if(e.key==='Escape' && open) hide(); });
    drawer.addEventListener('click', e=>{ if(e.target.closest('a')) hide(); });

    // Enhanced swipe to close
    let sx = 0, sy = 0, startTime = 0;
    drawer.addEventListener('touchstart', e=>{ 
        sx = e.touches[0].clientX; 
        sy = e.touches[0].clientY;
        startTime = Date.now();
    }, {passive:true});
    
    drawer.addEventListener('touchend', e=>{
        const dx = e.changedTouches[0].clientX - sx;
        const dy = e.changedTouches[0].clientY - sy;
        const duration = Date.now() - startTime;
        const velocity = Math.abs(dx) / duration;
        
        // Close on swipe left with sufficient velocity or distance
        if(dx < -60 && Math.abs(dy) < 100 && velocity > 0.1) {
            hide();
        }
    }, {passive:true});
    
    // Improved touch feedback
    drawer.addEventListener('touchstart', e=>{
        const target = e.target.closest('a, button');
        if(target) target.style.transform = 'scale(0.98)';
    }, {passive:true});
    
    drawer.addEventListener('touchend', e=>{
        const target = e.target.closest('a, button');
        if(target) {
            target.style.transform = '';
            setTimeout(() => target.style.transform = '', 150);
        }
    }, {passive:true});
})();

/* smooth anchors without history spam */
document.addEventListener('click', e=>{
    const a = e.target.closest('a[href^="#"]');
    if(!a) return;
    const id = a.getAttribute('href').slice(1);
    const t = document.getElementById(id);
    if(!t) return;
    e.preventDefault();
    t.scrollIntoView({ behavior:'smooth', block:'start' });
    history.replaceState(null, '', `#${id}`);
});

/* lightbox with navigation */
(function(){
    const lb = document.querySelector('.lightbox'); if(!lb) return;
    const img = lb.querySelector('img');
    const closeBtn = lb.querySelector('.close');
    const prevBtn = lb.querySelector('.prev');
    const nextBtn = lb.querySelector('.next');
    let lastFocus = null;
    let currentIndex = 0;
    let galleryImages = [];

    const focusables = () => lb.querySelectorAll('button, [href], [tabindex]:not([tabindex="-1"])');

    function initGallery() {
        galleryImages = Array.from(document.querySelectorAll('#gallery [data-lightbox-src]'));
    }

    function updateNavigation() {
        if (galleryImages.length <= 1) {
            prevBtn.style.display = 'none';
            nextBtn.style.display = 'none';
            return;
        }
        
        prevBtn.style.display = 'flex';
        nextBtn.style.display = 'flex';
        prevBtn.disabled = currentIndex === 0;
        nextBtn.disabled = currentIndex === galleryImages.length - 1;
    }

    function open(src, index = 0){
        initGallery();
        currentIndex = index;
        lastFocus = document.activeElement;
        img.src = src;
        img.alt = 'Gallery preview';
        lb.classList.add('open');
        lb.setAttribute('aria-hidden','false');
        lb.setAttribute('tabindex','-1');
        document.body.style.overflow='hidden';
        updateNavigation();
        (closeBtn || lb).focus({preventScroll:true});
    }

    function close(){
        lb.classList.remove('open');
        lb.setAttribute('aria-hidden','true');
        img.src = '';
        document.body.style.overflow='';
        if(lastFocus) lastFocus.focus({preventScroll:true});
    }

    function showNext() {
        if (currentIndex < galleryImages.length - 1) {
            currentIndex++;
            const nextImg = galleryImages[currentIndex];
            img.src = nextImg.getAttribute('data-lightbox-src');
            updateNavigation();
        }
    }

    function showPrev() {
        if (currentIndex > 0) {
            currentIndex--;
            const prevImg = galleryImages[currentIndex];
            img.src = prevImg.getAttribute('data-lightbox-src');
            updateNavigation();
        }
    }

    document.addEventListener('click', e=>{
        const t = e.target.closest('[data-lightbox-src]');
        if(!t) return;
        e.preventDefault();
        const index = galleryImages.indexOf(t);
        open(t.getAttribute('data-lightbox-src'), index);
    });

    lb.addEventListener('click', e=>{
        if(e.target === lb || e.target.classList.contains('close')) close();
    });

    prevBtn.addEventListener('click', showPrev);
    nextBtn.addEventListener('click', showNext);

    addEventListener('keydown', e=>{
        if(!lb.classList.contains('open')) return;
        if(e.key === 'Escape') close();
        if(e.key === 'ArrowLeft') showPrev();
        if(e.key === 'ArrowRight') showNext();
        if(e.key === 'Tab'){
            const items = Array.from(focusables());
            if(!items.length) return;
            const i = items.indexOf(document.activeElement);
            if(e.shiftKey && (i <= 0)){ items[items.length-1].focus(); e.preventDefault(); }
            else if(!e.shiftKey && (i === items.length-1)){ items[0].focus(); e.preventDefault(); }
        }
    });
})();

/* YouTube video handled directly in HTML */

/* Simple lazy loading for gallery images - no loading animation */
(function(){
    const galleryImages = $$('#gallery img[loading="lazy"]');
    if(!galleryImages.length) return;
    
    const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if(entry.isIntersecting) {
                const img = entry.target;
                imageObserver.unobserve(img);
            }
        });
    }, { rootMargin: '50px' });
    
    galleryImages.forEach(img => imageObserver.observe(img));
})();

/* Enhanced scroll spy with animated indicator */
(function(){
    const navLinks = Array.from(document.querySelectorAll('a[data-spy-link]'));
    const sections = Array.from(document.querySelectorAll('[data-spy-section], #top'));
    const linksContainer = document.querySelector('.links');
    if(!navLinks.length || !sections.length || !linksContainer) return;

    const map = new Map(navLinks.map(a => [a.getAttribute('href').replace('#',''), a]));
    
    function updateIndicator(activeLink) {
        const indicator = linksContainer.querySelector('.nav-indicator');
        if (!indicator) return;
        
        const linkRect = activeLink.getBoundingClientRect();
        const containerRect = linksContainer.getBoundingClientRect();
        
        indicator.style.left = `${linkRect.left - containerRect.left}px`;
        indicator.style.width = `${linkRect.width}px`;
    }
    
    function setActive(id){
        navLinks.forEach(a => { a.removeAttribute('aria-current'); a.classList.remove('active'); });
        const link = map.get(id);
        if(link){ 
            link.setAttribute('aria-current','page'); 
            link.classList.add('active');
            updateIndicator(link);
        }
    }

    // Create animated indicator
    const indicator = document.createElement('div');
    indicator.className = 'nav-indicator';
    indicator.style.cssText = `
        position: absolute;
        top: 4px;
        height: calc(100% - 8px);
        background: linear-gradient(135deg, var(--c1), var(--c2) 45%, var(--c4));
        border-radius: 12px;
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        z-index: 1;
        pointer-events: none;
    `;
    linksContainer.appendChild(indicator);

    const io = new IntersectionObserver((entries)=>{
        entries.forEach(e=>{
            if(e.isIntersecting){
                const id = e.target.id || 'top';
                setActive(id);
            }
        });
    }, { root:null, threshold:0.6 });

    sections.forEach(s => io.observe(s));
    
    // Initialize indicator position
    const activeLink = navLinks.find(a => a.hasAttribute('aria-current'));
    if (activeLink) {
        updateIndicator(activeLink);
    }
})();
