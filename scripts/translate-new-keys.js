// Script to translate new keys in all language files
const fs = require('fs');
const path = require('path');

const messagesDir = path.join(__dirname, '../messages');

// Translations for new keys in each language
const translations = {
  ko: { // Korean
    common: {
      goToDashboard: "대시보드로 이동",
      backToDashboard: "대시보드로 돌아가기",
      allCourses: "모든 코스",
      browseCourses: "코스 둘러보기",
      errorLoadingCourses: "코스 로드 오류",
      backToBlogs: "블로그로 돌아가기",
      accountSettings: "계정 설정",
      accountType: "계정 유형",
      administrator: "관리자",
      standardUser: "일반 사용자",
      notProvided: "제공되지 않음",
      tryAgain: "다시 시도",
      blogNotFound: "블로그를 찾을 수 없습니다",
      browseSubjects: "과목 둘러보기",
      selectSubject: "과목을 선택하여 코스를 확인하세요",
      exploreCourses: "코스 탐색",
      personalInformation: "개인 정보",
      name: "이름",
      email: "이메일",
      subjects: "과목",
      noSubjectsFound: "과목을 찾을 수 없습니다",
      unknownSubject: "알 수 없는 과목",
      untitledCourse: "제목 없는 코스",
      searchCourses: "코스 검색...",
      loadingCourses: "코스 로드 중...",
      courses: "코스",
      of: "의",
      inThisSubject: "이 과목에서",
      exploreAllAvailableCourses: "사용 가능한 모든 코스 탐색",
      noCoursesFound: "코스를 찾을 수 없습니다",
      noCoursesInSubject: "코스 없음",
      noCoursesAvailable: "사용 가능한 코스 없음",
      noCoursesInSubjectDesc: "이 과목에는 아직 게시된 코스가 없습니다",
      noCoursesAvailableDesc: "현재 게시된 코스가 없습니다",
      viewAllCourses: "모든 코스 보기",
      refresh: "새로고침",
      availableCourses: "사용 가능한 코스",
      coursesAvailableToStart: "코스 학습 시작 가능",
      filteredBySubject: "(과목별 필터링됨)",
      viewAll: "모두 보기",
      filterBySubject: "과목별 필터:",
      clearFilter: "필터 지우기",
      noCoursesFoundForSubject: "이 과목에 대한 코스를 찾을 수 없습니다",
      noCoursesFoundForSubjectDesc: "다른 과목을 선택하거나 필터를 지워 모든 코스를 확인하세요.",
      noCoursesAvailableDesc2: "현재 게시된 코스가 없습니다. 나중에 다시 확인해주세요.",
      tryAdjustingSearch: "검색어를 조정해보세요",
      noDescriptionAvailable: "설명 없음",
      selectSubjectToViewCourses: "과목을 선택하여 코스를 확인하세요.",
      subscription: {
        noSubscription: "구독 없음",
        trialActive: "시험 활성",
        trialExpired: "시험 만료",
        subscriptionCanceled: "구독 취소됨",
        trialDaysRemaining: "시험: {days}일 남음",
        canceledDaysRemaining: "취소됨 - {days}일 남음",
        canceledActiveUntilEnd: "취소됨 - 기간 종료까지 활성",
        pro: "프로"
      }
    },
    navbar: {
      course: "코스",
      auctions: "경매",
      contactUs: "문의하기",
      blogs: "블로그",
      dashboard: "대시보드",
      settings: "설정",
      adminPanel: "관리자 패널",
      logout: "로그아웃",
      menu: "메뉴",
      welcomeBack: "다시 오신 것을 환영합니다",
      user: "사용자"
    },
    footer: {
      termsOfUse: "이용 약관",
      contactUs: "문의하기"
    }
  },
  zh: { // Chinese
    common: {
      goToDashboard: "前往仪表板",
      backToDashboard: "返回仪表板",
      allCourses: "所有课程",
      browseCourses: "浏览课程",
      errorLoadingCourses: "加载课程错误",
      backToBlogs: "返回博客",
      accountSettings: "账户设置",
      accountType: "账户类型",
      administrator: "管理员",
      standardUser: "标准用户",
      notProvided: "未提供",
      tryAgain: "重试",
      blogNotFound: "找不到博客",
      browseSubjects: "浏览科目",
      selectSubject: "选择科目以查看其课程",
      exploreCourses: "探索课程",
      personalInformation: "个人信息",
      name: "姓名",
      email: "电子邮件",
      subjects: "科目",
      noSubjectsFound: "未找到科目",
      unknownSubject: "未知科目",
      untitledCourse: "未命名课程",
      searchCourses: "搜索课程...",
      loadingCourses: "加载课程中...",
      courses: "课程",
      of: "的",
      inThisSubject: "在此科目中",
      exploreAllAvailableCourses: "探索所有可用课程",
      noCoursesFound: "未找到课程",
      noCoursesInSubject: "没有课程",
      noCoursesAvailable: "没有可用课程",
      noCoursesInSubjectDesc: "此科目还没有已发布的课程",
      noCoursesAvailableDesc: "目前没有已发布的课程",
      viewAllCourses: "查看所有课程",
      refresh: "刷新",
      availableCourses: "可用课程",
      coursesAvailableToStart: "课程可开始学习",
      filteredBySubject: "（按科目筛选）",
      viewAll: "查看全部",
      filterBySubject: "按科目筛选：",
      clearFilter: "清除筛选",
      noCoursesFoundForSubject: "此科目未找到课程",
      noCoursesFoundForSubjectDesc: "尝试选择其他科目或清除筛选以查看所有课程。",
      noCoursesAvailableDesc2: "目前没有已发布的课程。请稍后再查看新内容。",
      tryAdjustingSearch: "尝试调整搜索词",
      noDescriptionAvailable: "无描述",
      selectSubjectToViewCourses: "选择科目以查看其课程。",
      subscription: {
        noSubscription: "无订阅",
        trialActive: "试用中",
        trialExpired: "试用已过期",
        subscriptionCanceled: "订阅已取消",
        trialDaysRemaining: "试用：剩余 {days} 天",
        canceledDaysRemaining: "已取消 - 剩余 {days} 天",
        canceledActiveUntilEnd: "已取消 - 在期间结束前仍有效",
        pro: "专业版"
      }
    },
    navbar: {
      course: "课程",
      auctions: "拍卖",
      contactUs: "联系我们",
      blogs: "博客",
      dashboard: "仪表板",
      settings: "设置",
      adminPanel: "管理面板",
      logout: "登出",
      menu: "菜单",
      welcomeBack: "欢迎回来",
      user: "用户"
    },
    footer: {
      termsOfUse: "使用条款",
      contactUs: "联系我们"
    }
  },
  es: { // Spanish
    common: {
      goToDashboard: "Ir al Panel",
      backToDashboard: "Volver al Panel",
      allCourses: "Todos los Cursos",
      browseCourses: "Explorar Cursos",
      errorLoadingCourses: "Error al Cargar Cursos",
      backToBlogs: "Volver a los Blogs",
      accountSettings: "Configuración de Cuenta",
      accountType: "Tipo de Cuenta",
      administrator: "Administrador",
      standardUser: "Usuario Estándar",
      notProvided: "No proporcionado",
      tryAgain: "Intentar de Nuevo",
      blogNotFound: "Blog no encontrado",
      browseSubjects: "Explorar Materias",
      selectSubject: "Selecciona una materia para ver sus cursos",
      exploreCourses: "Explorar cursos en",
      personalInformation: "Información Personal",
      name: "Nombre",
      email: "Correo Electrónico",
      subjects: "Materias",
      noSubjectsFound: "No se encontraron materias",
      unknownSubject: "Materia Desconocida",
      untitledCourse: "Curso Sin Título",
      searchCourses: "Buscar cursos...",
      loadingCourses: "Cargando cursos...",
      courses: "cursos",
      of: "de",
      inThisSubject: "en esta materia",
      exploreAllAvailableCourses: "Explorar todos los cursos disponibles",
      noCoursesFound: "No se encontraron cursos",
      noCoursesInSubject: "No hay cursos en",
      noCoursesAvailable: "No hay cursos disponibles",
      noCoursesInSubjectDesc: "Esta materia aún no tiene cursos publicados",
      noCoursesAvailableDesc: "Actualmente no hay cursos publicados disponibles",
      viewAllCourses: "Ver Todos los Cursos",
      refresh: "Actualizar",
      availableCourses: "Cursos Disponibles",
      coursesAvailableToStart: "cursos disponibles para comenzar a aprender",
      filteredBySubject: "(filtrado por materia)",
      viewAll: "Ver Todo",
      filterBySubject: "Filtrar por Materia:",
      clearFilter: "Limpiar Filtro",
      noCoursesFoundForSubject: "No se encontraron cursos para esta materia",
      noCoursesFoundForSubjectDesc: "Intenta seleccionar una materia diferente o limpia el filtro para ver todos los cursos.",
      noCoursesAvailableDesc2: "Actualmente no hay cursos publicados disponibles. Vuelve más tarde para ver nuevo contenido.",
      tryAdjustingSearch: "Intenta ajustar tus términos de búsqueda",
      noDescriptionAvailable: "No hay descripción disponible",
      selectSubjectToViewCourses: "Selecciona una materia para ver sus cursos.",
      subscription: {
        noSubscription: "Sin Suscripción",
        trialActive: "Prueba Activa",
        trialExpired: "Prueba Expirada",
        subscriptionCanceled: "Suscripción Cancelada",
        trialDaysRemaining: "Prueba: {days} días restantes",
        canceledDaysRemaining: "Cancelada - {days} días restantes",
        canceledActiveUntilEnd: "Cancelada - Activa hasta el final del período",
        pro: "Pro"
      }
    },
    navbar: {
      course: "Curso",
      auctions: "Subastas",
      contactUs: "Contáctanos",
      blogs: "Blogs",
      dashboard: "Panel",
      settings: "Configuración",
      adminPanel: "Panel de Administración",
      logout: "Cerrar Sesión",
      menu: "Menú",
      welcomeBack: "¡Bienvenido de nuevo!",
      user: "Usuario"
    },
    footer: {
      termsOfUse: "Términos de Uso",
      contactUs: "Contáctanos"
    }
  },
  fr: { // French
    common: {
      goToDashboard: "Aller au Tableau de Bord",
      backToDashboard: "Retour au Tableau de Bord",
      allCourses: "Tous les Cours",
      browseCourses: "Parcourir les Cours",
      errorLoadingCourses: "Erreur de Chargement des Cours",
      backToBlogs: "Retour aux Blogs",
      accountSettings: "Paramètres du Compte",
      accountType: "Type de Compte",
      administrator: "Administrateur",
      standardUser: "Utilisateur Standard",
      notProvided: "Non fourni",
      tryAgain: "Réessayer",
      blogNotFound: "Blog introuvable",
      browseSubjects: "Parcourir les Matières",
      selectSubject: "Sélectionnez une matière pour voir ses cours",
      exploreCourses: "Explorer les cours dans",
      personalInformation: "Informations Personnelles",
      name: "Nom",
      email: "E-mail",
      subjects: "Matières",
      noSubjectsFound: "Aucune matière trouvée",
      unknownSubject: "Matière Inconnue",
      untitledCourse: "Cours Sans Titre",
      searchCourses: "Rechercher des cours...",
      loadingCourses: "Chargement des cours...",
      courses: "cours",
      of: "de",
      inThisSubject: "dans cette matière",
      exploreAllAvailableCourses: "Explorer tous les cours disponibles",
      noCoursesFound: "Aucun cours trouvé",
      noCoursesInSubject: "Aucun cours dans",
      noCoursesAvailable: "Aucun cours disponible",
      noCoursesInSubjectDesc: "Cette matière n'a pas encore de cours publiés",
      noCoursesAvailableDesc: "Il n'y a actuellement aucun cours publié disponible",
      viewAllCourses: "Voir Tous les Cours",
      refresh: "Actualiser",
      availableCourses: "Cours Disponibles",
      coursesAvailableToStart: "cours disponibles pour commencer à apprendre",
      filteredBySubject: "(filtré par matière)",
      viewAll: "Voir Tout",
      filterBySubject: "Filtrer par Matière:",
      clearFilter: "Effacer le Filtre",
      noCoursesFoundForSubject: "Aucun cours trouvé pour cette matière",
      noCoursesFoundForSubjectDesc: "Essayez de sélectionner une matière différente ou effacez le filtre pour voir tous les cours.",
      noCoursesAvailableDesc2: "Il n'y a actuellement aucun cours publié disponible. Revenez plus tard pour du nouveau contenu.",
      tryAdjustingSearch: "Essayez d'ajuster vos termes de recherche",
      noDescriptionAvailable: "Aucune description disponible",
      selectSubjectToViewCourses: "Sélectionnez une matière pour voir ses cours.",
      subscription: {
        noSubscription: "Aucune Abonnement",
        trialActive: "Essai Actif",
        trialExpired: "Essai Expiré",
        subscriptionCanceled: "Abonnement Annulé",
        trialDaysRemaining: "Essai: {days} jours restants",
        canceledDaysRemaining: "Annulé - {days} jours restants",
        canceledActiveUntilEnd: "Annulé - Actif jusqu'à la fin de la période",
        pro: "Pro"
      }
    },
    navbar: {
      course: "Cours",
      auctions: "Enchères",
      contactUs: "Nous Contacter",
      blogs: "Blogs",
      dashboard: "Tableau de Bord",
      settings: "Paramètres",
      adminPanel: "Panneau d'Administration",
      logout: "Déconnexion",
      menu: "Menu",
      welcomeBack: "Bon retour !",
      user: "Utilisateur"
    },
    footer: {
      termsOfUse: "Conditions d'Utilisation",
      contactUs: "Nous Contacter"
    }
  },
  de: { // German
    common: {
      goToDashboard: "Zum Dashboard gehen",
      backToDashboard: "Zurück zum Dashboard",
      allCourses: "Alle Kurse",
      browseCourses: "Kurse durchsuchen",
      errorLoadingCourses: "Fehler beim Laden der Kurse",
      backToBlogs: "Zurück zu den Blogs",
      accountSettings: "Kontoeinstellungen",
      accountType: "Kontotyp",
      administrator: "Administrator",
      standardUser: "Standardbenutzer",
      notProvided: "Nicht angegeben",
      tryAgain: "Erneut versuchen",
      blogNotFound: "Blog nicht gefunden",
      browseSubjects: "Fächer durchsuchen",
      selectSubject: "Wählen Sie ein Fach aus, um dessen Kurse anzuzeigen",
      exploreCourses: "Kurse erkunden in",
      personalInformation: "Persönliche Informationen",
      name: "Name",
      email: "E-Mail",
      subjects: "Fächer",
      noSubjectsFound: "Keine Fächer gefunden",
      unknownSubject: "Unbekanntes Fach",
      untitledCourse: "Kurs ohne Titel",
      searchCourses: "Kurse suchen...",
      loadingCourses: "Kurse werden geladen...",
      courses: "Kurse",
      of: "von",
      inThisSubject: "in diesem Fach",
      exploreAllAvailableCourses: "Alle verfügbaren Kurse erkunden",
      noCoursesFound: "Keine Kurse gefunden",
      noCoursesInSubject: "Keine Kurse in",
      noCoursesAvailable: "Keine Kurse verfügbar",
      noCoursesInSubjectDesc: "Dieses Fach hat noch keine veröffentlichten Kurse",
      noCoursesAvailableDesc: "Derzeit sind keine veröffentlichten Kurse verfügbar",
      viewAllCourses: "Alle Kurse Anzeigen",
      refresh: "Aktualisieren",
      availableCourses: "Verfügbare Kurse",
      coursesAvailableToStart: "Kurse verfügbar zum Lernen beginnen",
      filteredBySubject: "(nach Fach gefiltert)",
      viewAll: "Alle Anzeigen",
      filterBySubject: "Nach Fach Filtern:",
      clearFilter: "Filter Löschen",
      noCoursesFoundForSubject: "Keine Kurse für dieses Fach gefunden",
      noCoursesFoundForSubjectDesc: "Versuchen Sie, ein anderes Fach auszuwählen oder löschen Sie den Filter, um alle Kurse zu sehen.",
      noCoursesAvailableDesc2: "Derzeit sind keine veröffentlichten Kurse verfügbar. Schauen Sie später für neue Inhalte vorbei.",
      tryAdjustingSearch: "Versuchen Sie, Ihre Suchbegriffe anzupassen",
      noDescriptionAvailable: "Keine Beschreibung verfügbar",
      selectSubjectToViewCourses: "Wählen Sie ein Fach aus, um dessen Kurse anzuzeigen.",
      subscription: {
        noSubscription: "Kein Abonnement",
        trialActive: "Testphase Aktiv",
        trialExpired: "Testphase Abgelaufen",
        subscriptionCanceled: "Abonnement Gekündigt",
        trialDaysRemaining: "Testphase: {days} Tage verbleibend",
        canceledDaysRemaining: "Gekündigt - {days} Tage verbleibend",
        canceledActiveUntilEnd: "Gekündigt - Aktiv bis Periodenende",
        pro: "Pro"
      }
    },
    navbar: {
      course: "Kurs",
      auctions: "Auktionen",
      contactUs: "Kontaktieren Sie uns",
      blogs: "Blogs",
      dashboard: "Dashboard",
      settings: "Einstellungen",
      adminPanel: "Administrationsbereich",
      logout: "Abmelden",
      menu: "Menü",
      welcomeBack: "Willkommen zurück!",
      user: "Benutzer"
    },
    footer: {
      termsOfUse: "Nutzungsbedingungen",
      contactUs: "Kontaktieren Sie uns"
    }
  },
  cs: { // Czech
    common: {
      goToDashboard: "Přejít na Nástěnku",
      backToDashboard: "Zpět na Nástěnku",
      allCourses: "Všechny Kurzy",
      browseCourses: "Procházet Kurzy",
      errorLoadingCourses: "Chyba při Načítání Kurzů",
      backToBlogs: "Zpět na Blog",
      accountSettings: "Nastavení Účtu",
      accountType: "Typ Účtu",
      administrator: "Správce",
      standardUser: "Standardní Uživatel",
      notProvided: "Neposkytnuto",
      tryAgain: "Zkusit Znovu",
      blogNotFound: "Blog nenalezen",
      browseSubjects: "Procházet Předměty",
      selectSubject: "Vyberte předmět pro zobrazení jeho kurzů",
      exploreCourses: "Prozkoumat kurzy v",
      personalInformation: "Osobní Informace",
      name: "Jméno",
      email: "E-mail",
      subjects: "Předměty",
      noSubjectsFound: "Nebyly nalezeny žádné předměty"
    },
    navbar: {
      course: "Kurz",
      auctions: "Aukce",
      contactUs: "Kontaktujte Nás",
      blogs: "Blogy",
      dashboard: "Nástěnka",
      settings: "Nastavení",
      adminPanel: "Administrátorský Panel",
      logout: "Odhlásit se",
      menu: "Menu",
      welcomeBack: "Vítejte zpět!",
      user: "Uživatel"
    },
    footer: {
      termsOfUse: "Podmínky Použití",
      contactUs: "Kontaktujte Nás"
    }
  },
  nl: { // Dutch
    common: {
      goToDashboard: "Ga naar Dashboard",
      backToDashboard: "Terug naar Dashboard",
      allCourses: "Alle Cursussen",
      browseCourses: "Blader door Cursussen",
      errorLoadingCourses: "Fout bij Laden van Cursussen",
      backToBlogs: "Terug naar Blogs",
      accountSettings: "Accountinstellingen",
      accountType: "Accounttype",
      administrator: "Beheerder",
      standardUser: "Standaardgebruiker",
      notProvided: "Niet opgegeven",
      tryAgain: "Opnieuw Proberen",
      blogNotFound: "Blog niet gevonden",
      browseSubjects: "Blader door Vakken",
      selectSubject: "Selecteer een vak om de cursussen te bekijken",
      exploreCourses: "Verken cursussen in",
      personalInformation: "Persoonlijke Informatie",
      name: "Naam",
      email: "E-mail",
      subjects: "Vakken",
      noSubjectsFound: "Geen vakken gevonden"
    },
    navbar: {
      course: "Cursus",
      auctions: "Veilingen",
      contactUs: "Neem Contact Op",
      blogs: "Blogs",
      dashboard: "Dashboard",
      settings: "Instellingen",
      adminPanel: "Beheerpaneel",
      logout: "Uitloggen",
      menu: "Menu",
      welcomeBack: "Welkom terug!",
      user: "Gebruiker"
    },
    footer: {
      termsOfUse: "Gebruiksvoorwaarden",
      contactUs: "Neem Contact Op"
    }
  },
  it: { // Italian
    common: {
      goToDashboard: "Vai alla Dashboard",
      backToDashboard: "Torna alla Dashboard",
      allCourses: "Tutti i Corsi",
      browseCourses: "Sfoglia i Corsi",
      errorLoadingCourses: "Errore nel Caricamento dei Corsi",
      backToBlogs: "Torna ai Blog",
      accountSettings: "Impostazioni Account",
      accountType: "Tipo di Account",
      administrator: "Amministratore",
      standardUser: "Utente Standard",
      notProvided: "Non fornito",
      tryAgain: "Riprova",
      blogNotFound: "Blog non trovato",
      browseSubjects: "Sfoglia le Materie",
      selectSubject: "Seleziona una materia per vedere i suoi corsi",
      exploreCourses: "Esplora i corsi in",
      personalInformation: "Informazioni Personali",
      name: "Nome",
      email: "E-mail",
      subjects: "Materie",
      noSubjectsFound: "Nessuna materia trovata"
    },
    navbar: {
      course: "Corso",
      auctions: "Aste",
      contactUs: "Contattaci",
      blogs: "Blog",
      dashboard: "Dashboard",
      settings: "Impostazioni",
      adminPanel: "Pannello di Amministrazione",
      logout: "Esci",
      menu: "Menu",
      welcomeBack: "Bentornato!",
      user: "Utente"
    },
    footer: {
      termsOfUse: "Termini di Utilizzo",
      contactUs: "Contattaci"
    }
  },
  ja: { // Japanese
    common: {
      goToDashboard: "ダッシュボードに移動",
      backToDashboard: "ダッシュボードに戻る",
      allCourses: "すべてのコース",
      browseCourses: "コースを閲覧",
      errorLoadingCourses: "コースの読み込みエラー",
      backToBlogs: "ブログに戻る",
      accountSettings: "アカウント設定",
      accountType: "アカウントタイプ",
      administrator: "管理者",
      standardUser: "標準ユーザー",
      notProvided: "提供されていません",
      tryAgain: "再試行",
      blogNotFound: "ブログが見つかりません",
      browseSubjects: "科目を閲覧",
      selectSubject: "科目を選択してコースを表示",
      exploreCourses: "コースを探索",
      personalInformation: "個人情報",
      name: "名前",
      email: "メール",
      subjects: "科目",
      noSubjectsFound: "科目が見つかりません"
    },
    navbar: {
      course: "コース",
      auctions: "オークション",
      contactUs: "お問い合わせ",
      blogs: "ブログ",
      dashboard: "ダッシュボード",
      settings: "設定",
      adminPanel: "管理パネル",
      logout: "ログアウト",
      menu: "メニュー",
      welcomeBack: "おかえりなさい！",
      user: "ユーザー"
    },
    footer: {
      termsOfUse: "利用規約",
      contactUs: "お問い合わせ"
    }
  },
  ms: { // Malay
    common: {
      goToDashboard: "Pergi ke Papan Pemuka",
      backToDashboard: "Kembali ke Papan Pemuka",
      allCourses: "Semua Kursus",
      browseCourses: "Lihat Kursus",
      errorLoadingCourses: "Ralat Memuatkan Kursus",
      backToBlogs: "Kembali ke Blog",
      accountSettings: "Tetapan Akaun",
      accountType: "Jenis Akaun",
      administrator: "Pentadbir",
      standardUser: "Pengguna Standard",
      notProvided: "Tidak disediakan",
      tryAgain: "Cuba Lagi",
      blogNotFound: "Blog tidak dijumpai",
      browseSubjects: "Lihat Subjek",
      selectSubject: "Pilih subjek untuk melihat kursusnya",
      exploreCourses: "Terokai kursus dalam",
      personalInformation: "Maklumat Peribadi",
      name: "Nama",
      email: "E-mel",
      subjects: "Subjek",
      noSubjectsFound: "Tiada subjek dijumpai"
    },
    navbar: {
      course: "Kursus",
      auctions: "Lelong",
      contactUs: "Hubungi Kami",
      blogs: "Blog",
      dashboard: "Papan Pemuka",
      settings: "Tetapan",
      adminPanel: "Panel Pentadbir",
      logout: "Log Keluar",
      menu: "Menu",
      welcomeBack: "Selamat kembali!",
      user: "Pengguna"
    },
    footer: {
      termsOfUse: "Terma Penggunaan",
      contactUs: "Hubungi Kami"
    }
  },
  pl: { // Polish
    common: {
      goToDashboard: "Przejdź do Panelu",
      backToDashboard: "Wróć do Panelu",
      allCourses: "Wszystkie Kursy",
      browseCourses: "Przeglądaj Kursy",
      errorLoadingCourses: "Błąd Ładowania Kursów",
      backToBlogs: "Wróć do Blogów",
      accountSettings: "Ustawienia Konta",
      accountType: "Typ Konta",
      administrator: "Administrator",
      standardUser: "Użytkownik Standardowy",
      notProvided: "Nie podano",
      tryAgain: "Spróbuj Ponownie",
      blogNotFound: "Blog nie znaleziony",
      browseSubjects: "Przeglądaj Przedmioty",
      selectSubject: "Wybierz przedmiot, aby zobaczyć jego kursy",
      exploreCourses: "Poznaj kursy w",
      personalInformation: "Informacje Osobiste",
      name: "Imię",
      email: "E-mail",
      subjects: "Przedmioty",
      noSubjectsFound: "Nie znaleziono przedmiotów"
    },
    navbar: {
      course: "Kurs",
      auctions: "Aukcje",
      contactUs: "Skontaktuj się z Nami",
      blogs: "Blogi",
      dashboard: "Panel",
      settings: "Ustawienia",
      adminPanel: "Panel Administracyjny",
      logout: "Wyloguj",
      menu: "Menu",
      welcomeBack: "Witaj ponownie!",
      user: "Użytkownik"
    },
    footer: {
      termsOfUse: "Warunki Użytkowania",
      contactUs: "Skontaktuj się z Nami"
    }
  },
  pt: { // Portuguese
    common: {
      goToDashboard: "Ir para o Painel",
      backToDashboard: "Voltar ao Painel",
      allCourses: "Todos os Cursos",
      browseCourses: "Navegar Cursos",
      errorLoadingCourses: "Erro ao Carregar Cursos",
      backToBlogs: "Voltar aos Blogs",
      accountSettings: "Configurações da Conta",
      accountType: "Tipo de Conta",
      administrator: "Administrador",
      standardUser: "Usuário Padrão",
      notProvided: "Não fornecido",
      tryAgain: "Tentar Novamente",
      blogNotFound: "Blog não encontrado",
      browseSubjects: "Navegar Matérias",
      selectSubject: "Selecione uma matéria para ver seus cursos",
      exploreCourses: "Explorar cursos em",
      personalInformation: "Informações Pessoais",
      name: "Nome",
      email: "E-mail",
      subjects: "Matérias",
      noSubjectsFound: "Nenhuma matéria encontrada"
    },
    navbar: {
      course: "Curso",
      auctions: "Leilões",
      contactUs: "Entre em Contato",
      blogs: "Blogs",
      dashboard: "Painel",
      settings: "Configurações",
      adminPanel: "Painel de Administração",
      logout: "Sair",
      menu: "Menu",
      welcomeBack: "Bem-vindo de volta!",
      user: "Usuário"
    },
    footer: {
      termsOfUse: "Termos de Uso",
      contactUs: "Entre em Contato"
    }
  },
  ro: { // Romanian
    common: {
      goToDashboard: "Mergi la Tablou de Bord",
      backToDashboard: "Înapoi la Tablou de Bord",
      allCourses: "Toate Cursurile",
      browseCourses: "Răsfoiește Cursuri",
      errorLoadingCourses: "Eroare la Încărcarea Cursurilor",
      backToBlogs: "Înapoi la Bloguri",
      accountSettings: "Setări Cont",
      accountType: "Tip de Cont",
      administrator: "Administrator",
      standardUser: "Utilizator Standard",
      notProvided: "Nu este furnizat",
      tryAgain: "Încearcă Din Nou",
      blogNotFound: "Blog negăsit",
      browseSubjects: "Răsfoiește Subiecte",
      selectSubject: "Selectează un subiect pentru a vedea cursurile sale",
      exploreCourses: "Explorează cursuri în",
      personalInformation: "Informații Personale",
      name: "Nume",
      email: "E-mail",
      subjects: "Subiecte",
      noSubjectsFound: "Nu s-au găsit subiecte"
    },
    navbar: {
      course: "Curs",
      auctions: "Licitatii",
      contactUs: "Contactează-ne",
      blogs: "Bloguri",
      dashboard: "Tablou de Bord",
      settings: "Setări",
      adminPanel: "Panou de Administrare",
      logout: "Deconectare",
      menu: "Meniu",
      welcomeBack: "Bun venit înapoi!",
      user: "Utilizator"
    },
    footer: {
      termsOfUse: "Termeni de Utilizare",
      contactUs: "Contactează-ne"
    }
  },
  sr: { // Serbian
    common: {
      goToDashboard: "Иди на Контролну Таблу",
      backToDashboard: "Назад на Контролну Таблу",
      allCourses: "Сви Курсеви",
      browseCourses: "Прегледај Курсеве",
      errorLoadingCourses: "Грешка при Учитавању Курсева",
      backToBlogs: "Назад на Блогове",
      accountSettings: "Подешавања Налога",
      accountType: "Тип Налога",
      administrator: "Администратор",
      standardUser: "Стандардни Корисник",
      notProvided: "Није наведено",
      tryAgain: "Покушај Поново",
      blogNotFound: "Блог није пронађен",
      browseSubjects: "Прегледај Предмете",
      selectSubject: "Изаберите предмет да бисте видели његове курсеве",
      exploreCourses: "Истражите курсеве у",
      personalInformation: "Лични Подаци",
      name: "Име",
      email: "Е-пошта",
      subjects: "Предмети",
      noSubjectsFound: "Није пронађен ниједан предмет"
    },
    navbar: {
      course: "Курс",
      auctions: "Аукције",
      contactUs: "Контактирајте Нас",
      blogs: "Блогови",
      dashboard: "Контролна Табла",
      settings: "Подешавања",
      adminPanel: "Административни Панел",
      logout: "Одјава",
      menu: "Мени",
      welcomeBack: "Добродошли назад!",
      user: "Корисник"
    },
    footer: {
      termsOfUse: "Услови Коришћења",
      contactUs: "Контактирајте Нас"
    }
  },
  se: { // Swedish
    common: {
      goToDashboard: "Gå till Instrumentpanel",
      backToDashboard: "Tillbaka till Instrumentpanel",
      allCourses: "Alla Kurser",
      browseCourses: "Bläddra Kurser",
      errorLoadingCourses: "Fel vid Laddning av Kurser",
      backToBlogs: "Tillbaka till Bloggar",
      accountSettings: "Kontoinställningar",
      accountType: "Kontotyp",
      administrator: "Administratör",
      standardUser: "Standardanvändare",
      notProvided: "Inte angivet",
      tryAgain: "Försök Igen",
      blogNotFound: "Blogg hittades inte",
      browseSubjects: "Bläddra Ämnen",
      selectSubject: "Välj ett ämne för att se dess kurser",
      exploreCourses: "Utforska kurser i",
      personalInformation: "Personlig Information",
      name: "Namn",
      email: "E-post",
      subjects: "Ämnen",
      noSubjectsFound: "Inga ämnen hittades"
    },
    navbar: {
      course: "Kurs",
      auctions: "Auktioner",
      contactUs: "Kontakta Oss",
      blogs: "Bloggar",
      dashboard: "Instrumentpanel",
      settings: "Inställningar",
      adminPanel: "Administratörspanel",
      logout: "Logga Ut",
      menu: "Meny",
      welcomeBack: "Välkommen tillbaka!",
      user: "Användare"
    },
    footer: {
      termsOfUse: "Användarvillkor",
      contactUs: "Kontakta Oss"
    }
  },
  th: { // Thai
    common: {
      goToDashboard: "ไปที่แดชบอร์ด",
      backToDashboard: "กลับไปที่แดชบอร์ด",
      allCourses: "หลักสูตรทั้งหมด",
      browseCourses: "เรียกดูหลักสูตร",
      errorLoadingCourses: "ข้อผิดพลาดในการโหลดหลักสูตร",
      backToBlogs: "กลับไปที่บล็อก",
      accountSettings: "การตั้งค่าบัญชี",
      accountType: "ประเภทบัญชี",
      administrator: "ผู้ดูแลระบบ",
      standardUser: "ผู้ใช้มาตรฐาน",
      notProvided: "ไม่ได้ระบุ",
      tryAgain: "ลองอีกครั้ง",
      blogNotFound: "ไม่พบบล็อก",
      browseSubjects: "เรียกดูวิชา",
      selectSubject: "เลือกวิชาเพื่อดูหลักสูตร",
      exploreCourses: "สำรวจหลักสูตรใน",
      personalInformation: "ข้อมูลส่วนตัว",
      name: "ชื่อ",
      email: "อีเมล",
      subjects: "วิชา",
      noSubjectsFound: "ไม่พบวิชา"
    },
    navbar: {
      course: "หลักสูตร",
      auctions: "การประมูล",
      contactUs: "ติดต่อเรา",
      blogs: "บล็อก",
      dashboard: "แดชบอร์ด",
      settings: "การตั้งค่า",
      adminPanel: "แผงผู้ดูแลระบบ",
      logout: "ออกจากระบบ",
      menu: "เมนู",
      welcomeBack: "ยินดีต้อนรับกลับ!",
      user: "ผู้ใช้"
    },
    footer: {
      termsOfUse: "ข้อกำหนดการใช้งาน",
      contactUs: "ติดต่อเรา"
    }
  },
  tr: { // Turkish
    common: {
      goToDashboard: "Panele Git",
      backToDashboard: "Panele Dön",
      allCourses: "Tüm Kurslar",
      browseCourses: "Kurslara Göz At",
      errorLoadingCourses: "Kurslar Yüklenirken Hata",
      backToBlogs: "Bloglara Dön",
      accountSettings: "Hesap Ayarları",
      accountType: "Hesap Türü",
      administrator: "Yönetici",
      standardUser: "Standart Kullanıcı",
      notProvided: "Sağlanmadı",
      tryAgain: "Tekrar Dene",
      blogNotFound: "Blog bulunamadı",
      browseSubjects: "Konulara Göz At",
      selectSubject: "Kurslarını görmek için bir konu seçin",
      exploreCourses: "Kursları keşfet",
      personalInformation: "Kişisel Bilgiler",
      name: "Ad",
      email: "E-posta",
      subjects: "Konular",
      noSubjectsFound: "Konu bulunamadı"
    },
    navbar: {
      course: "Kurs",
      auctions: "Müzayedeler",
      contactUs: "Bize Ulaşın",
      blogs: "Bloglar",
      dashboard: "Panel",
      settings: "Ayarlar",
      adminPanel: "Yönetim Paneli",
      logout: "Çıkış Yap",
      menu: "Menü",
      welcomeBack: "Tekrar hoş geldiniz!",
      user: "Kullanıcı"
    },
    footer: {
      termsOfUse: "Kullanım Şartları",
      contactUs: "Bize Ulaşın"
    }
  },
  uk: { // Ukrainian
    common: {
      goToDashboard: "Перейти до Панелі",
      backToDashboard: "Повернутися до Панелі",
      allCourses: "Всі Курси",
      browseCourses: "Переглянути Курси",
      errorLoadingCourses: "Помилка Завантаження Курсів",
      backToBlogs: "Повернутися до Блогів",
      accountSettings: "Налаштування Облікового Запису",
      accountType: "Тип Облікового Запису",
      administrator: "Адміністратор",
      standardUser: "Стандартний Користувач",
      notProvided: "Не надано",
      tryAgain: "Спробувати Знову",
      blogNotFound: "Блог не знайдено",
      browseSubjects: "Переглянути Предмети",
      selectSubject: "Виберіть предмет, щоб переглянути його курси",
      exploreCourses: "Дослідити курси в",
      personalInformation: "Особиста Інформація",
      name: "Ім'я",
      email: "Електронна Пошта",
      subjects: "Предмети",
      noSubjectsFound: "Предмети не знайдено"
    },
    navbar: {
      course: "Курс",
      auctions: "Аукціони",
      contactUs: "Зв'яжіться з Нами",
      blogs: "Блоги",
      dashboard: "Панель",
      settings: "Налаштування",
      adminPanel: "Панель Адміністратора",
      logout: "Вийти",
      menu: "Меню",
      welcomeBack: "Ласкаво просимо назад!",
      user: "Користувач"
    },
    footer: {
      termsOfUse: "Умови Використання",
      contactUs: "Зв'яжіться з Нами"
    }
  },
  vi: { // Vietnamese
    common: {
      goToDashboard: "Đi đến Bảng Điều Khiển",
      backToDashboard: "Quay lại Bảng Điều Khiển",
      allCourses: "Tất cả Khóa Học",
      browseCourses: "Duyệt Khóa Học",
      errorLoadingCourses: "Lỗi Tải Khóa Học",
      backToBlogs: "Quay lại Blog",
      accountSettings: "Cài Đặt Tài Khoản",
      accountType: "Loại Tài Khoản",
      administrator: "Quản Trị Viên",
      standardUser: "Người Dùng Tiêu Chuẩn",
      notProvided: "Không được cung cấp",
      tryAgain: "Thử Lại",
      blogNotFound: "Không tìm thấy blog",
      browseSubjects: "Duyệt Môn Học",
      selectSubject: "Chọn một môn học để xem các khóa học của nó",
      exploreCourses: "Khám phá khóa học trong",
      personalInformation: "Thông Tin Cá Nhân",
      name: "Tên",
      email: "E-mail",
      subjects: "Môn Học",
      noSubjectsFound: "Không tìm thấy môn học"
    },
    navbar: {
      course: "Khóa Học",
      auctions: "Đấu Giá",
      contactUs: "Liên Hệ Chúng Tôi",
      blogs: "Blog",
      dashboard: "Bảng Điều Khiển",
      settings: "Cài Đặt",
      adminPanel: "Bảng Quản Trị",
      logout: "Đăng Xuất",
      menu: "Menu",
      welcomeBack: "Chào mừng trở lại!",
      user: "Người Dùng"
    },
    footer: {
      termsOfUse: "Điều Khoản Sử Dụng",
      contactUs: "Liên Hệ Chúng Tôi"
    }
  },
  fi: { // Finnish
    common: {
      goToDashboard: "Siirry Koontinäyttöön",
      backToDashboard: "Takaisin Koontinäyttöön",
      allCourses: "Kaikki Kurssit",
      browseCourses: "Selaa Kursseja",
      errorLoadingCourses: "Virhe Kurssien Lataamisessa",
      backToBlogs: "Takaisin Blogeihin",
      accountSettings: "Tilin Asetukset",
      accountType: "Tilin Tyyppi",
      administrator: "Järjestelmänvalvoja",
      standardUser: "Vakio Käyttäjä",
      notProvided: "Ei annettu",
      tryAgain: "Yritä Uudelleen",
      blogNotFound: "Blogia ei löytynyt",
      browseSubjects: "Selaa Aiheita",
      selectSubject: "Valitse aihe nähdäksesi sen kurssit",
      exploreCourses: "Tutki kursseja",
      personalInformation: "Henkilökohtaiset Tiedot",
      name: "Nimi",
      email: "Sähköposti",
      subjects: "Aiheet",
      noSubjectsFound: "Aiheita ei löytynyt"
    },
    navbar: {
      course: "Kurssi",
      auctions: "Huutokaupat",
      contactUs: "Ota Yhteyttä",
      blogs: "Blogit",
      dashboard: "Koontinäyttö",
      settings: "Asetukset",
      adminPanel: "Hallintapaneeli",
      logout: "Kirjaudu Ulos",
      menu: "Valikko",
      welcomeBack: "Tervetuloa takaisin!",
      user: "Käyttäjä"
    },
    footer: {
      termsOfUse: "Käyttöehdot",
      contactUs: "Ota Yhteyttä"
    }
  },
  el: { // Greek
    common: {
      goToDashboard: "Μετάβαση στον Πίνακα Ελέγχου",
      backToDashboard: "Επιστροφή στον Πίνακα Ελέγχου",
      allCourses: "Όλα τα Μαθήματα",
      browseCourses: "Περιήγηση Μαθημάτων",
      errorLoadingCourses: "Σφάλμα Φόρτωσης Μαθημάτων",
      backToBlogs: "Επιστροφή στα Blog",
      accountSettings: "Ρυθμίσεις Λογαριασμού",
      accountType: "Τύπος Λογαριασμού",
      administrator: "Διαχειριστής",
      standardUser: "Τυπικός Χρήστης",
      notProvided: "Δεν παρέχεται",
      tryAgain: "Δοκίμασε Ξανά",
      blogNotFound: "Το Blog δεν βρέθηκε",
      browseSubjects: "Περιήγηση Θεμάτων",
      selectSubject: "Επιλέξτε ένα θέμα για να δείτε τα μαθήματά του",
      exploreCourses: "Εξερευνήστε μαθήματα σε",
      personalInformation: "Προσωπικές Πληροφορίες",
      name: "Όνομα",
      email: "Ηλεκτρονικό Ταχυδρομείο",
      subjects: "Θέματα",
      noSubjectsFound: "Δεν βρέθηκαν θέματα"
    },
    navbar: {
      course: "Μάθημα",
      auctions: "Δημοπρασίες",
      contactUs: "Επικοινωνήστε Μαζί Μας",
      blogs: "Blog",
      dashboard: "Πίνακας Ελέγχου",
      settings: "Ρυθμίσεις",
      adminPanel: "Πίνακας Διαχείρισης",
      logout: "Αποσύνδεση",
      menu: "Μενού",
      welcomeBack: "Καλώς ήρθατε πίσω!",
      user: "Χρήστης"
    },
    footer: {
      termsOfUse: "Όροι Χρήσης",
      contactUs: "Επικοινωνήστε Μαζί Μας"
    }
  },
  hu: { // Hungarian
    common: {
      goToDashboard: "Ugrás az Irányítópultra",
      backToDashboard: "Vissza az Irányítópulthoz",
      allCourses: "Összes Kurzus",
      browseCourses: "Kurzusok Böngészése",
      errorLoadingCourses: "Hiba a Kurzusok Betöltésekor",
      backToBlogs: "Vissza a Blogokhoz",
      accountSettings: "Fiók Beállítások",
      accountType: "Fiók Típusa",
      administrator: "Rendszergazda",
      standardUser: "Szabványos Felhasználó",
      notProvided: "Nincs megadva",
      tryAgain: "Próbáld Újra",
      blogNotFound: "Blog nem található",
      browseSubjects: "Tantárgyak Böngészése",
      selectSubject: "Válassz egy tantárgyat a kurzusok megtekintéséhez",
      exploreCourses: "Kurzusok felfedezése",
      personalInformation: "Személyes Adatok",
      name: "Név",
      email: "E-mail",
      subjects: "Tantárgyak",
      noSubjectsFound: "Nem találhatók tantárgyak"
    },
    navbar: {
      course: "Kurzus",
      auctions: "Árverések",
      contactUs: "Lépj Kapcsolatba Velünk",
      blogs: "Blogok",
      dashboard: "Irányítópult",
      settings: "Beállítások",
      adminPanel: "Adminisztrációs Panel",
      logout: "Kijelentkezés",
      menu: "Menü",
      welcomeBack: "Üdv újra!",
      user: "Felhasználó"
    },
    footer: {
      termsOfUse: "Felhasználási Feltételek",
      contactUs: "Lépj Kapcsolatba Velünk"
    }
  },
  id: { // Indonesian
    common: {
      goToDashboard: "Buka Dasbor",
      backToDashboard: "Kembali ke Dasbor",
      allCourses: "Semua Kursus",
      browseCourses: "Jelajahi Kursus",
      errorLoadingCourses: "Kesalahan Memuat Kursus",
      backToBlogs: "Kembali ke Blog",
      accountSettings: "Pengaturan Akun",
      accountType: "Jenis Akun",
      administrator: "Administrator",
      standardUser: "Pengguna Standar",
      notProvided: "Tidak disediakan",
      tryAgain: "Coba Lagi",
      blogNotFound: "Blog tidak ditemukan",
      browseSubjects: "Jelajahi Mata Pelajaran",
      selectSubject: "Pilih mata pelajaran untuk melihat kursusnya",
      exploreCourses: "Jelajahi kursus di",
      personalInformation: "Informasi Pribadi",
      name: "Nama",
      email: "E-mail",
      subjects: "Mata Pelajaran",
      noSubjectsFound: "Tidak ada mata pelajaran ditemukan"
    },
    navbar: {
      course: "Kursus",
      auctions: "Lelang",
      contactUs: "Hubungi Kami",
      blogs: "Blog",
      dashboard: "Dasbor",
      settings: "Pengaturan",
      adminPanel: "Panel Admin",
      logout: "Keluar",
      menu: "Menu",
      welcomeBack: "Selamat datang kembali!",
      user: "Pengguna"
    },
    footer: {
      termsOfUse: "Syarat Penggunaan",
      contactUs: "Hubungi Kami"
    }
  }
};

// Function to update a language file
function updateLanguageFile(langCode, translations) {
  const filePath = path.join(messagesDir, `${langCode}.json`);
  
  if (!fs.existsSync(filePath)) {
    console.log(`File ${langCode}.json does not exist, skipping...`);
    return;
  }
  
  const content = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  
  // Update common section (including nested objects)
  if (translations.common) {
    if (!content.common) content.common = {};
    Object.keys(translations.common).forEach(key => {
      if (typeof translations.common[key] === 'object' && translations.common[key] !== null && !Array.isArray(translations.common[key])) {
        // Handle nested objects like subscription
        if (!content.common[key]) content.common[key] = {};
        Object.keys(translations.common[key]).forEach(nestedKey => {
          content.common[key][nestedKey] = translations.common[key][nestedKey];
        });
      } else {
        content.common[key] = translations.common[key];
      }
    });
  }
  
  // Update navbar section
  if (translations.navbar) {
    if (!content.navbar) content.navbar = {};
    Object.keys(translations.navbar).forEach(key => {
      content.navbar[key] = translations.navbar[key];
    });
  }
  
  // Update footer section
  if (translations.footer) {
    if (!content.footer) content.footer = {};
    Object.keys(translations.footer).forEach(key => {
      content.footer[key] = translations.footer[key];
    });
  }
  
  // Write back to file
  fs.writeFileSync(filePath, JSON.stringify(content, null, 2) + '\n', 'utf8');
  console.log(`✅ Updated ${langCode}.json`);
}

// Update all language files
Object.keys(translations).forEach(langCode => {
  updateLanguageFile(langCode, translations[langCode]);
});

console.log('\n✅ All language files have been updated with proper translations!');

