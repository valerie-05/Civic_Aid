import { useState, useEffect, useCallback } from 'react';

export function useTextToSpeech() {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [selectedLanguage, setSelectedLanguage] = useState('en-US');

  useEffect(() => {
    const loadVoices = () => {
      const availableVoices = window.speechSynthesis.getVoices();
      setVoices(availableVoices);
    };

    loadVoices();
    window.speechSynthesis.onvoiceschanged = loadVoices;
  }, []);

  const speak = useCallback((text: string, language: string = selectedLanguage) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();

      const utterance = new SpeechSynthesisUtterance(text);

      const languagePrefix = language.split('-')[0];
      const preferredVoice = voices.find(v =>
        v.lang.startsWith(languagePrefix) &&
        (v.name.includes('Google') || v.name.includes('Microsoft') || v.name.includes('Premium') || v.name.includes('Natural'))
      ) || voices.find(v => v.lang.startsWith(languagePrefix));

      if (preferredVoice) {
        utterance.voice = preferredVoice;
      }

      utterance.lang = language;
      utterance.rate = 0.95;
      utterance.pitch = 1.0;
      utterance.volume = 1.0;

      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);

      window.speechSynthesis.speak(utterance);
    }
  }, [voices, selectedLanguage]);

  const stop = useCallback(() => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }
  }, []);

  return { speak, stop, isSpeaking, setSelectedLanguage };
}
