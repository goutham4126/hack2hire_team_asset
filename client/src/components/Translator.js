import { useEffect, useState } from "react";
import { Languages } from "lucide-react";

const languages = [
  { code: "en", label: "English" },
  { code: "hi", label: "हिन्दी" },
  { code: "te", label: "తెలుగు" },
  { code: "ta", label: "தமிழ்" },
  { code: "kn", label: "ಕನ್ನಡ" },
  { code: "ml", label: "മലയാളം" },
  { code: "bn", label: "বাংলা" },
  { code: "mr", label: "मराठी" },
  { code: "gu", label: "ગુજરાતી" },
  { code: "pa", label: "ਪੰਜਾਬੀ" },
  { code: "ur", label: "اردو" },
  { code: "or", label: "ଓଡ଼ିଆ" },
  { code: "as", label: "অসমীয়া" },
  { code: "ne", label: "नेपाली" },
  { code: "si", label: "සිංහල" },
  { code: "fr", label: "Français" },
  { code: "es", label: "Español" },
  { code: "de", label: "Deutsch" },
  { code: "it", label: "Italiano" },
  { code: "zh-CN", label: "中文" },
  { code: "ja", label: "日本語" },
  { code: "ko", label: "한국어" },
  { code: "ar", label: "العربية" },
  { code: "ru", label: "Русский" },
];

export default function Translator() {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    if (!document.getElementById("google-translate-script")) {
      const script = document.createElement("script");
      script.id = "google-translate-script";
      script.src =
        "//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
      document.body.appendChild(script);
    }

    window.googleTranslateElementInit = () => {
      if (!window.google || !window.google.translate) return;
      new window.google.translate.TranslateElement(
        {
          pageLanguage: "en",
          includedLanguages: languages.map((l) => l.code).join(","),
          autoDisplay: false,
        },
        "google_translate_container"
      );
      setIsLoaded(true);
    };

    const style = document.createElement("style");
    style.innerHTML = `
      .goog-te-banner-frame.skiptranslate { display: none !important; }
      .goog-te-gadget-icon { display: none !important; }
      .goog-te-menu-frame.skiptranslate { display: none !important; }
      .goog-te-menu-value span { display: none !important; }
      body { top: 0px !important; }
      .goog-tooltip, .goog-tooltip:hover { display: none !important; }
      .goog-text-highlight { background: none !important; box-shadow: none !important; }
      .goog-logo-link, .goog-te-gadget span, .goog-te-banner { display: none !important; }
      #google_translate_container select {
        background: transparent !important;
        color: inherit !important;
        border: none !important;
        font-size: 14px !important;
        outline: none !important;
      }
      iframe[id^=":"] { display: none !important; }
    `;
    document.head.appendChild(style);

    const observer = new MutationObserver(() => {
      const banner = document.querySelector(".goog-te-banner-frame");
      if (banner) banner.style.display = "none";
      document.body.style.top = "0px";
    });
    observer.observe(document.body, { childList: true, subtree: true });
  }, []);

  const handleLanguageChange = (code) => {
    if (code === "en") {
      document.cookie = "googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
      document.cookie = "googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/en;";
      try {
        localStorage.removeItem("googtrans");
        sessionStorage.removeItem("googtrans");
      } catch (err) {
        console.warn("Couldn't clear googtrans from storage:", err);
      }
      window.location.reload();
      return;
    }

    const select = document.querySelector(".goog-te-combo");
    if (select) {
      select.value = code;
      select.dispatchEvent(new Event("change"));
    }
  };

  return (
    <>
      <div id="google_translate_container" style={{ display: "none" }} />

      <div className="relative inline-block text-left">
        <button
          disabled={!isLoaded}
          className="flex gap-2 items-center border px-3 py-1 rounded-md text-sm"
          onClick={(e) => {
            e.stopPropagation();
            const menu = document.getElementById("lang-menu");
            menu.classList.toggle("hidden");
          }}
        >
          <Languages className="h-4 w-4" />
          Translate
        </button>

        {/* Dropdown */}
        <div
          id="lang-menu"
          className="absolute mt-2 w-40 bg-white text-black shadow-md border rounded-md hidden z-50"
        >
          {languages.map((lang) => (
            <div
              key={lang.code}
              onClick={() => handleLanguageChange(lang.code)}
              className="px-3 py-2 hover:bg-gray-100 cursor-pointer"
            >
              {lang.label}
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
