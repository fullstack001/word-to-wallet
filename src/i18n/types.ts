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
  auction: {
    title: string;
    subtitle: string;
    myAuctions: string;
    createAuction: string;
    browseAll: string;
    manageAuctions: string;
    createNewAuction: string;
    noAuctionsFound: string;
    createFirstAuction: string;
    filters: {
      allAuctions: string;
      scheduled: string;
      active: string;
      sold: string;
      ended: string;
    };
    status: {
      scheduled: string;
      active: string;
      sold: string;
      soldBuyNow: string;
      soldOffer: string;
      ended: string;
      endedNoSale: string;
      cancelled: string;
    };
    create: {
      title: string;
      form: {
        title: string;
        titlePlaceholder: string;
        description: string;
        descriptionPlaceholder: string;
        currency: string;
        startingPrice: string;
        startingPricePlaceholder: string;
        reservePrice: string;
        reservePricePlaceholder: string;
        reservePriceHelp: string;
        buyNowPrice: string;
        buyNowPricePlaceholder: string;
        buyNowPriceHelp: string;
        startTime: string;
        endTime: string;
        extendSeconds: string;
        extendSecondsPlaceholder: string;
        extendSecondsHelp: string;
        minIncrement: string;
        minIncrementPlaceholder: string;
        createButton: string;
        cancelButton: string;
      };
      validation: {
        titleRequired: string;
        startingPriceRequired: string;
        reservePriceInvalid: string;
        buyNowPriceInvalid: string;
        reservePriceTooHigh: string;
        endTimeInvalid: string;
        startTimeInvalid: string;
      };
    };
    list: {
      startingPrice: string;
      currentBid: string;
      buyNow: string;
      starts: string;
      ends: string;
      timeLeft: string;
      ended: string;
      by: string;
      viewAuction: string;
      page: string;
      of: string;
      previous: string;
      next: string;
    };
    view: {
      placeBid: string;
      buyNow: string;
      makeOffer: string;
      bidAmount: string;
      minimumBid: string;
      yourBid: string;
      bidButton: string;
      offerAmount: string;
      offerButton: string;
      bidHistory: string;
      offers: string;
      noBids: string;
      noOffers: string;
      timeRemaining: string;
      days: string;
      hours: string;
      minutes: string;
      seconds: string;
      reserveNotMet: string;
      reserveMet: string;
      online: string;
      bidders: string;
    };
    bidding: {
      bidPlaced: string;
      bidFailed: string;
      bidTooLow: string;
      auctionEnded: string;
      auctionNotActive: string;
      buyNowSuccess: string;
      buyNowFailed: string;
      offerCreated: string;
      offerFailed: string;
      offerAccepted: string;
      offerDeclined: string;
    };
    currency: {
      USD: string;
      EUR: string;
      GBP: string;
      CAD: string;
      AUD: string;
    };
  };
}
