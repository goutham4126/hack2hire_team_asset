import {
  createContext,
  useContext,
  useState,
  useEffect,
  useRef,
  useCallback,
} from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Mic, MicOff, Volume2, VolumeX, AlertCircle } from "lucide-react";

const VoiceNavigationContext = createContext(null);

export const useVoiceNavigation = () => {
  const context = useContext(VoiceNavigationContext);
  if (!context) {
    throw new Error(
      "useVoiceNavigation must be used within VoiceNavigationProvider"
    );
  }
  return context;
};

export function VoiceNavigationProvider({ children }) {
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(true);
  const [transcript, setTranscript] = useState("");
  const [feedback, setFeedback] = useState("");
  const [isSupported, setIsSupported] = useState(true);
  const [logs, setLogs] = useState([]);
  const [showLogs, setShowLogs] = useState(false);
  const [navigationHistory, setNavigationHistory] = useState([]);

  const recognitionRef = useRef(null);
  const isListeningRef = useRef(false);
  const restartTimeoutRef = useRef(null);

  const navigate = useNavigate();
  const location = useLocation();

  // Track navigation history
  useEffect(() => {
    setNavigationHistory((prev) => {
      const newHistory = [...prev, location.pathname];
      return newHistory.slice(-10); // Keep last 10 pages
    });
  }, [location.pathname]);

  const addLog = useCallback((message, type = "info") => {
    const timestamp = new Date().toLocaleTimeString();
    setLogs((prev) => [...prev.slice(-19), { message, type, timestamp }]);
    console.log(`[Voice Nav ${timestamp}]`, message);
  }, []);

  const navigationRoutes = {
    dashboard: "/",
    home: "/",
    profile: "/profile",
    settings: "/settings",
    help: "/help",
    schedule: "/schedule",
    appointment: "/schedule",
    booking: "/schedule",
    "symptom checker": "/symptom-checker",
    symptoms: "/symptom-checker",
  };

  const languages = {
    english: "en",
    hindi: "hi",
    telugu: "te",
    tamil: "ta",
    kannada: "kn",
    malayalam: "ml",
    bengali: "bn",
    marathi: "mr",
    gujarati: "gu",
    punjabi: "pa",
    urdu: "ur",
    odia: "or",
    assamese: "as",
    nepali: "ne",
    sinhala: "si",
    french: "fr",
    spanish: "es",
    german: "de",
    italian: "it",
    chinese: "zh-CN",
    japanese: "ja",
    korean: "ko",
    arabic: "ar",
    russian: "ru",
  };

  const speak = useCallback(
    (text) => {
      if (!isSpeaking) return;

      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.9;
      utterance.pitch = 1;
      utterance.volume = 1;
      utterance.onstart = () => setFeedback(text);
      utterance.onend = () => {
        setTimeout(() => setFeedback(""), 2000);
      };
      window.speechSynthesis.speak(utterance);
    },
    [isSpeaking]
  );

  const changeLanguage = useCallback(
    (languageCode) => {
      addLog(`Changing language to: ${languageCode}`, "success");

      if (languageCode === "en") {
        document.cookie =
          "googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
        document.cookie =
          "googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/en;";
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
        select.value = languageCode;
        select.dispatchEvent(new Event("change"));
        speak(`Language changed`);
        setFeedback(`✓ Language changed`);
      } else {
        addLog("Language selector not found", "error");
        setFeedback("❌ Language selector not available");
      }
    },
    [addLog, speak]
  );

  const processVoiceCommand = useCallback(
    (command) => {
      const lowerCommand = command.toLowerCase().trim();
      addLog(`Processing: "${lowerCommand}"`, "command");

      // REFRESH PAGE
      if (
        lowerCommand.includes("refresh") ||
        lowerCommand.includes("reload") ||
        lowerCommand === "refresh page" ||
        lowerCommand === "reload page"
      ) {
        addLog("Refreshing page", "success");
        speak("Refreshing page");
        setFeedback("🔄 Refreshing...");
        setTimeout(() => window.location.reload(), 500);
        return;
      }

      // GO BACK
      if (
        lowerCommand.includes("go back") ||
        lowerCommand.includes("back") ||
        lowerCommand === "previous page" ||
        lowerCommand === "last page"
      ) {
        addLog("Going back", "success");
        speak("Going back");
        setFeedback("⬅️ Going back");
        navigate(-1);
        return;
      }

      // FORWARD
      if (
        lowerCommand.includes("go forward") ||
        lowerCommand === "forward"
      ) {
        addLog("Going forward", "success");
        speak("Going forward");
        setFeedback("➡️ Going forward");
        navigate(1);
        return;
      }

      // LANGUAGE CHANGE
      if (
        lowerCommand.includes("change language") ||
        lowerCommand.includes("translate to") ||
        lowerCommand.includes("switch language") ||
        lowerCommand.includes("language")
      ) {
        for (const [langName, langCode] of Object.entries(languages)) {
          if (lowerCommand.includes(langName)) {
            changeLanguage(langCode);
            return;
          }
        }

        const availableLangs = Object.keys(languages)
          .slice(0, 5)
          .join(", ");
        speak(
          `Available languages include: ${availableLangs}, and more`
        );
        setFeedback('ℹ️ Say: change language to [language name]');
        addLog("Language list provided", "info");
        return;
      }

      // NAVIGATION COMMANDS
      if (
        lowerCommand.includes("go to") ||
        lowerCommand.includes("open") ||
        lowerCommand.includes("navigate to") ||
        lowerCommand.includes("show") ||
        lowerCommand.includes("take me to")
      ) {
        const commandText = lowerCommand
          .replace(/go to/g, "")
          .replace(/open/g, "")
          .replace(/navigate to/g, "")
          .replace(/show/g, "")
          .replace(/take me to/g, "")
          .replace(/the/g, "")
          .replace(/page/g, "")
          .trim();

        for (const [key, path] of Object.entries(navigationRoutes)) {
          if (commandText.includes(key)) {
            addLog(`Navigating to: ${key} (${path})`, "success");
            navigate(path);
            speak(`Opening ${key}`);
            setFeedback(`✓ Navigating to ${key}`);
            return;
          }
        }
      }

      // DIRECT EXACT MATCHES
      for (const [key, path] of Object.entries(navigationRoutes)) {
        if (lowerCommand === key || lowerCommand === key.replace("-", " ")) {
          addLog(`Direct navigation to: ${key} (${path})`, "success");
          navigate(path);
          speak(`Opening ${key}`);
          setFeedback(`✓ Navigating to ${key}`);
          return;
        }
      }

      // TOGGLE SIDEBAR
      if (
        lowerCommand.includes("toggle sidebar") ||
        lowerCommand.includes("sidebar")
      ) {
        const sidebarTrigger = document.querySelector(
          '[data-sidebar="trigger"]'
        );
        if (sidebarTrigger) {
          sidebarTrigger.click();
          speak("Toggling sidebar");
          setFeedback("📱 Sidebar toggled");
          addLog("Sidebar toggled", "success");
          return;
        }
      }

      // THEME SWITCHING
      if (
        lowerCommand.includes("dark mode") ||
        lowerCommand.includes("dark theme")
      ) {
        document.documentElement.classList.add("dark");
        localStorage.setItem("theme", "dark");
        speak("Dark mode activated");
        setFeedback("🌙 Dark mode on");
        addLog("Switched to dark mode", "success");
        return;
      }

      if (
        lowerCommand.includes("light mode") ||
        lowerCommand.includes("light theme")
      ) {
        document.documentElement.classList.remove("dark");
        localStorage.setItem("theme", "light");
        speak("Light mode activated");
        setFeedback("☀️ Light mode on");
        addLog("Switched to light mode", "success");
        return;
      }

      if (
        lowerCommand.includes("system theme") ||
        lowerCommand.includes("auto theme")
      ) {
        localStorage.setItem("theme", "system");
        const isDark = window.matchMedia(
          "(prefers-color-scheme: dark)"
        ).matches;
        if (isDark) {
          document.documentElement.classList.add("dark");
        } else {
          document.documentElement.classList.remove("dark");
        }
        speak("System theme activated");
        setFeedback("💻 System theme on");
        addLog("Switched to system theme", "success");
        return;
      }

      if (
        lowerCommand.includes("toggle theme") ||
        lowerCommand.includes("switch theme")
      ) {
        const isDark = document.documentElement.classList.contains(
          "dark"
        );
        if (isDark) {
          document.documentElement.classList.remove("dark");
          localStorage.setItem("theme", "light");
          speak("Light mode activated");
          setFeedback("☀️ Light mode on");
          addLog("Toggled to light mode", "success");
        } else {
          document.documentElement.classList.add("dark");
          localStorage.setItem("theme", "dark");
          speak("Dark mode activated");
          setFeedback("🌙 Dark mode on");
          addLog("Toggled to dark mode", "success");
        }
        return;
      }

      // HELP
      if (
        lowerCommand.includes("help") ||
        lowerCommand.includes("what can")
      ) {
        const helpText =
          "You can say: refresh page, go back, go to dashboard, change language to Hindi, dark mode, light mode, toggle sidebar, or show logs";
        speak(helpText);
        setFeedback("ℹ️ Showing available commands");
        addLog("Help requested", "info");
        return;
      }

      // LOGS TOGGLE
      if (
        lowerCommand.includes("show logs") ||
        lowerCommand.includes("display logs")
      ) {
        setShowLogs(true);
        setFeedback("📋 Showing logs");
        addLog("Logs displayed", "info");
        return;
      }

      if (
        lowerCommand.includes("hide logs") ||
        lowerCommand.includes("close logs")
      ) {
        setShowLogs(false);
        setFeedback("📋 Logs hidden");
        return;
      }

      // CONTROLS
      if (
        lowerCommand.includes("stop listening") ||
        lowerCommand.includes("turn off voice")
      ) {
        stopListening();
        return;
      }

      if (
        lowerCommand.includes("mute") ||
        lowerCommand.includes("silence")
      ) {
        setIsSpeaking(false);
        setFeedback("🔇 Voice feedback muted");
        addLog("Voice feedback muted", "info");
        return;
      }

      if (
        lowerCommand.includes("unmute") ||
        lowerCommand.includes("speak")
      ) {
        setIsSpeaking(true);
        speak("Voice feedback enabled");
        addLog("Voice feedback enabled", "info");
        return;
      }

      // SCROLL COMMANDS
      if (lowerCommand.includes("scroll up") || lowerCommand.includes("go up")) {
        window.scrollBy({ top: -300, behavior: "smooth" });
        speak("Scrolling up");
        setFeedback("⬆️ Scrolling up");
        addLog("Scrolled up", "info");
        return;
      }

      if (
        lowerCommand.includes("scroll down") ||
        lowerCommand.includes("go down")
      ) {
        window.scrollBy({ top: 300, behavior: "smooth" });
        speak("Scrolling down");
        setFeedback("⬇️ Scrolling down");
        addLog("Scrolled down", "info");
        return;
      }

      if (
        lowerCommand.includes("scroll to top") ||
        lowerCommand === "top"
      ) {
        window.scrollTo({ top: 0, behavior: "smooth" });
        speak("Scrolling to top");
        setFeedback("⬆️ Scrolling to top");
        addLog("Scrolled to top", "info");
        return;
      }

      if (
        lowerCommand.includes("scroll to bottom") ||
        lowerCommand === "bottom"
      ) {
        window.scrollTo({
          top: document.body.scrollHeight,
          behavior: "smooth",
        });
        speak("Scrolling to bottom");
        setFeedback("⬇️ Scrolling to bottom");
        addLog("Scrolled to bottom", "info");
        return;
      }

      // FALLBACK
      speak("Command not recognized. Say help for available commands.");
      setFeedback('⚠️ Command not recognized. Try "help"');
      addLog(`Unrecognized command: "${lowerCommand}"`, "warning");
    },
    [navigate, speak, addLog, changeLanguage]
  );

  const initializeRecognition = useCallback(() => {
    if (typeof window === "undefined") return false;

    if (!("webkitSpeechRecognition" in window) && !("SpeechRecognition" in window)) {
      setIsSupported(false);
      addLog("Speech recognition not supported", "error");
      return false;
    }

    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
        recognitionRef.current.onstart = null;
        recognitionRef.current.onresult = null;
        recognitionRef.current.onerror = null;
        recognitionRef.current.onend = null;
      } catch (e) {
        console.error("Cleanup error:", e);
      }
    }

    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = "en-US";
    recognition.maxAlternatives = 1;

    recognition.onstart = () => {
      addLog("Recognition started", "success");
      setFeedback("🎤 Listening...");
    };

    recognition.onresult = (event) => {
      let final = "";
      for (let i = event.resultIndex; i < event.results.length; i++) {
        if (event.results[i].isFinal) {
          final += event.results[i][0].transcript;
        }
      }

      if (final) {
        addLog(`Heard: "${final}"`, "info");
        setTranscript(final);
        processVoiceCommand(final);
      }
    };

    recognition.onerror = (event) => {
      addLog(`Error: ${event.error}`, "error");

      if (event.error === "not-allowed") {
        setFeedback("❌ Microphone permission denied");
        setIsListening(false);
        isListeningRef.current = false;
      } else if (event.error === "no-speech") {
        addLog("No speech detected, continuing...", "warning");
      } else if (event.error === "aborted") {
        addLog("Recognition aborted", "warning");
      } else if (event.error === "network") {
        addLog("Network error, will retry...", "error");
      } else {
        setFeedback(`Error: ${event.error}`);
      }
    };

    recognition.onend = () => {
      addLog("Recognition ended", "info");

      if (isListeningRef.current) {
        addLog("Restarting recognition...", "info");

        if (restartTimeoutRef.current) {
          clearTimeout(restartTimeoutRef.current);
        }

        restartTimeoutRef.current = setTimeout(() => {
          if (isListeningRef.current && recognitionRef.current) {
            try {
              recognitionRef.current.start();
            } catch (error) {
              addLog(`Failed to restart: ${error.message}`, "error");
              if (error.name === "InvalidStateError") {
                return;
              }
              setIsListening(false);
              isListeningRef.current = false;
            }
          }
        }, 300);
      }
    };

    recognitionRef.current = recognition;
    addLog("Recognition initialized", "success");
    return true;
  }, [addLog, processVoiceCommand]);

  useEffect(() => {
    initializeRecognition();

    return () => {
      addLog("Cleaning up voice navigation", "info");
      if (restartTimeoutRef.current) {
        clearTimeout(restartTimeoutRef.current);
      }
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
          recognitionRef.current.onstart = null;
          recognitionRef.current.onresult = null;
          recognitionRef.current.onerror = null;
          recognitionRef.current.onend = null;
        } catch (error) {
          console.error("Cleanup error:", error);
        }
      }
      window.speechSynthesis.cancel();
    };
  }, [initializeRecognition, addLog]);

  const startListening = useCallback(() => {
    if (!recognitionRef.current) {
      if (!initializeRecognition()) {
        setFeedback("❌ Speech recognition not available");
        return;
      }
    }

    try {
      recognitionRef.current.start();
      setIsListening(true);
      isListeningRef.current = true;
      speak("Voice commands activated");
      addLog("Voice commands activated", "success");
    } catch (error) {
      if (error.name === "InvalidStateError") {
        addLog("Recognition already started", "warning");
        return;
      }
      addLog(`Failed to start: ${error.message}`, "error");
      setFeedback("Failed to start voice commands");
    }
  }, [initializeRecognition, speak, addLog]);

  const stopListening = useCallback(() => {
    if (restartTimeoutRef.current) {
      clearTimeout(restartTimeoutRef.current);
    }

    setIsListening(false);
    isListeningRef.current = false;

    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
        speak("Voice commands deactivated");
        addLog("Voice commands deactivated", "info");
        setFeedback("Voice commands off");
      } catch (error) {
        addLog(`Stop error: ${error.message}`, "error");
      }
    }
  }, [speak, addLog]);

  const toggleListening = useCallback(() => {
    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  }, [isListening, stopListening, startListening]);

  const toggleSpeaking = () => {
    const newState = !isSpeaking;
    setIsSpeaking(newState);
    if (newState) {
      speak("Voice feedback enabled");
      addLog("Voice feedback enabled", "info");
    } else {
      setFeedback("🔇 Voice feedback muted");
      addLog("Voice feedback muted", "info");
    }
  };

  const toggleLogs = () => {
    setShowLogs(!showLogs);
  };

  return (
    <VoiceNavigationContext.Provider
      value={{
        isListening,
        isSpeaking,
        transcript,
        feedback,
        isSupported,
        logs,
        showLogs,
        toggleListening,
        toggleSpeaking,
        toggleLogs,
        startListening,
        stopListening,
      }}
    >
      {children}
    </VoiceNavigationContext.Provider>
  );
}

export function VoiceControlButton() {
  const {
    isListening,
    isSpeaking,
    feedback,
    isSupported,
    logs,
    showLogs,
    toggleListening,
    toggleSpeaking,
    toggleLogs,
  } = useVoiceNavigation();

  if (!isSupported) {
    return (
      <div className="fixed bottom-6 right-6 z-50 bg-red-50 border border-red-200 rounded-lg p-4 max-w-xs">
        <p className="text-sm text-red-800">
          Voice commands not supported in this browser
        </p>
      </div>
    );
  }

  return (
    <>
      {showLogs && (
        <div className="fixed bottom-24 right-6 z-50 w-96 bg-white dark:bg-gray-800 shadow-2xl rounded-lg border border-gray-200 dark:border-gray-700 max-h-96 overflow-hidden flex flex-col">
          <div className="bg-gray-50 dark:bg-gray-900 px-4 py-2 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
            <h3 className="font-semibold text-sm text-gray-700 dark:text-gray-300">
              Voice Navigation Logs
            </h3>
            <button
              onClick={toggleLogs}
              className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 text-xl leading-none"
            >
              ×
            </button>
          </div>
          <div className="overflow-y-auto p-2 space-y-1 flex-1">
            {logs.length === 0 ? (
              <p className="text-sm text-gray-500 text-center py-4">
                No logs yet
              </p>
            ) : (
              logs.map((log, idx) => (
                <div
                  key={idx}
                  className={`text-xs p-2 rounded ${
                    log.type === "error"
                      ? "bg-red-50 dark:bg-red-900/20 text-red-800 dark:text-red-300"
                      : log.type === "warning"
                      ? "bg-yellow-50 dark:bg-yellow-900/20 text-yellow-800 dark:text-yellow-300"
                      : log.type === "success"
                      ? "bg-green-50 dark:bg-green-900/20 text-green-800 dark:text-green-300"
                      : log.type === "command"
                      ? "bg-blue-50 dark:bg-blue-900/20 text-blue-800 dark:text-blue-300"
                      : "bg-gray-50 dark:bg-gray-900/20 text-gray-700 dark:text-gray-300"
                  }`}
                >
                  <span className="font-mono text-xs opacity-60">
                    {log.timestamp}
                  </span>
                  <span className="ml-2">{log.message}</span>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-2">
        {feedback && (
          <div className="bg-white dark:bg-gray-800 shadow-lg rounded-lg px-4 py-2 text-sm max-w-xs border border-gray-200 dark:border-gray-700">
            {feedback}
          </div>
        )}

        <div className="flex gap-2">
          <button
            onClick={toggleLogs}
            className={`p-3 rounded-full shadow-lg transition ${
              showLogs
                ? "bg-gray-400 hover:bg-gray-500 dark:bg-gray-600 dark:hover:bg-gray-700"
                : "bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600"
            }`}
            title={showLogs ? "Hide logs" : "Show logs"}
          >
            <AlertCircle className="w-5 h-5 text-white" />
          </button>

          <button
            onClick={toggleSpeaking}
            className={`p-3 rounded-full shadow-lg transition ${
              isSpeaking
                ? "bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600"
                : "bg-gray-600 hover:bg-gray-700 dark:bg-gray-500 dark:hover:bg-gray-600"
            }`}
            title={isSpeaking ? "Mute voice feedback" : "Unmute voice feedback"}
          >
            {isSpeaking ? (
              <Volume2 className="w-5 h-5 text-white" />
            ) : (
              <VolumeX className="w-5 h-5 text-white" />
            )}
          </button>

          <button
            onClick={toggleListening}
            className={`p-3 rounded-full shadow-lg transition ${
              isListening
                ? "bg-red-600 hover:bg-red-700 dark:bg-red-500 dark:hover:bg-red-600 animate-pulse"
                : "bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600"
            }`}
            title={isListening ? "Stop voice commands" : "Start voice commands"}
          >
            {isListening ? (
              <Mic className="w-5 h-5 text-white" />
            ) : (
              <MicOff className="w-5 h-5 text-white" />
            )}
          </button>
        </div>
      </div>
    </>
  );
}
