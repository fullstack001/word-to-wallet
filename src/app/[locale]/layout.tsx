import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import { Providers } from "../providers";
import LanguageSetter from "./LanguageSetter";
import GoogleTranslateWidget from "@/components/common/GoogleTranslateWidget";
import { LoadingProvider } from "@/contexts/LoadingContext";
import GlobalLoading from "@/components/common/GlobalLoading";

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const messages = await getMessages({ locale });

  return (
    <NextIntlClientProvider messages={messages}>
      <Providers>
        <LoadingProvider>
          <LanguageSetter locale={locale} />
          <GoogleTranslateWidget />
          <GlobalLoading />
          {children}
        </LoadingProvider>
      </Providers>
    </NextIntlClientProvider>
  );
}
