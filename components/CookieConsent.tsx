"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

interface CookieConsentProps {
  lang: string;
  dict: any;
}

export default function CookieConsent({ lang, dict }: CookieConsentProps) {
  const [showConsent, setShowConsent] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem("cookie-consent");
    if (!consent) {
      setShowConsent(true);
    }
  }, []);

  const acceptCookies = () => {
    localStorage.setItem("cookie-consent", "true");
    setShowConsent(false);
  };

  if (!showConsent) return null;

  const content = dict.cookieConsent;
  const isRtl = lang === "ar";

  return (
    <>
      {/* Modal Backdrop */}
      <div className="fixed inset-0 bg-black/50 z-[1000] animate-in fade-in duration-300" />

      {/* Cookie Consent Modal */}
      <div
        className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[1001] w-full max-w-[550px] animate-in zoom-in-95 duration-300 px-4"
        dir={isRtl ? "rtl" : "ltr"}
      >
        <div className="bg-white rounded-[20px] shadow-2xl p-6 md:p-8 text-center flex flex-col items-center border border-gray-100">
          <h2 className="text-[#14183e] text-lg md:text-1xl font-bold mb-3 leading-tight">
            {content.title}
          </h2>
          <p className="text-gray-500 text-sm mb-6 leading-relaxed max-w-[460px]">
            {content.description}
          </p>
          <div className="flex flex-col md:flex-row gap-3 justify-center w-full max-w-[400px]">
            <button
              onClick={acceptCookies}
              className="bg-[#007bff] text-white font-bold py-2.5 px-6 rounded-full hover:bg-[#0069d9] transition-all text-base flex-1 cursor-pointer"
            >
              {content.accept}
            </button>
            <Link
              href={`/${lang}/privacy`}
              className="bg-[#6c757d] text-white font-bold py-2.5 px-6 rounded-full hover:bg-[#5a6268] transition-all text-base flex-1 cursor-pointer no-underline"
            >
              {content.policy}
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
