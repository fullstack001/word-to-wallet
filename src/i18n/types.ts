import { locales } from "./config";

export type Locale = (typeof locales)[number];

export interface I18nConfig {
  locales: readonly string[];
  defaultLocale: string;
  localePrefix: "always" | "as-needed";
}

export interface TranslationMessages {
  common: {
    loading: string;
    error: string;
    configNotFound: string;
  };
  errors: {
    oops: string;
    somethingWentWrong: string;
    pageNotFound: string;
    pageNotExist: string;
    errorLoadingPage: string;
    errorLoadingApp: string;
    tryAgain: string;
    goHome: string;
    goToHomePage: string;
    errorDetails: string;
  };
  faq: {
    title: string;
    multipleUsers: string;
    multipleUsersAnswer: string;
    customerSupport: string;
    customerSupportAnswer: string;
    processingSpeed: string;
    processingSpeedAnswer: string;
    moneyBack: string;
    moneyBackAnswer: string;
    ctaTitle: string;
    ctaDescription: string;
    ctaButton: string;
  };
  footer: {
    selectLanguage: string;
  };
  auth: {
    signIn: string;
    email: string;
    password: string;
    emailAddress: string;
  };
  account: {
    account: string;
    membership: string;
    noSubscription: string;
    unlockAllTools: string;
    fullAccess: string;
    subscribeNow: string;
    subscribe: string;
    paymentMethod: string;
    saveTime: string;
    cardNumber: string;
    notSpecified: string;
    importantUpdates: string;
  };
  plan: {
    choosePlan: string;
    continue: string;
  };
  navbar: {
    profileDetails: string;
    noSubscription: string;
    myDocuments: string;
    myAccount: string;
  };
  hero: {
    badge: string;
    title: string;
    titleHighlight: string;
    subtitle: string;
    ctaPrimary: string;
    ctaSecondary: string;
    features: {
      noCreditCard: string;
      freeForever: string;
      cancelAnytime: string;
    };
  };
  howItWorks: {
    title: string;
    subtitle: string;
    steps: {
      step1: {
        title: string;
        description: string;
      };
      step2: {
        title: string;
        description: string;
      };
      step3: {
        title: string;
        description: string;
      };
    };
    cta: string;
  };
  features: {
    title: string;
    titleHighlight: string;
    subtitle: string;
    cards: {
      aiWriting: {
        title: string;
        description: string;
        features: string[];
      };
      audience: {
        title: string;
        description: string;
        features: string[];
      };
      sales: {
        title: string;
        description: string;
        features: string[];
      };
    };
  };
  security: {
    badge: string;
    title: string;
    subtitle: string;
    features: {
      encryption: {
        title: string;
        description: string;
      };
      processing: {
        title: string;
        description: string;
      };
      privacy: {
        title: string;
        description: string;
      };
      compliance: {
        title: string;
        description: string;
      };
    };
    trustedBy: string;
  };
  testimonials: {
    title: string;
    subtitle: string;
    rating: string;
    review1: {
      name: string;
      role: string;
      company: string;
      review: string;
    };
    review2: {
      name: string;
      role: string;
      company: string;
      review: string;
    };
    review3: {
      name: string;
      role: string;
      company: string;
      review: string;
    };
    review4: {
      name: string;
      role: string;
      company: string;
      review: string;
    };
    review5: {
      name: string;
      role: string;
      company: string;
      review: string;
    };
    review6: {
      name: string;
      role: string;
      company: string;
      review: string;
    };
  };
}
