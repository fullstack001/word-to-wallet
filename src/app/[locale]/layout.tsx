import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import { Providers } from "../providers";
import LanguageSetter from "./LanguageSetter";
import GoogleTranslateWidget from "@/components/common/GoogleTranslateWidget";
import PersistLogin from "./PersistLogin";

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
        <PersistLogin />
        <LanguageSetter locale={locale} />
        <GoogleTranslateWidget />
        {children}
      </Providers>
    </NextIntlClientProvider>
  );
}
