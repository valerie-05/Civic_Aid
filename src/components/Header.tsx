import { Globe, Volume2, VolumeX, Search } from 'lucide-react';
import { SUPPORTED_LANGUAGES } from '../hooks/useTranslation';

interface HeaderProps {
  currentLanguage: string;
  onLanguageChange: (lang: string) => void;
  isSpeaking: boolean;
  onToggleSpeech: () => void;
  title: string;
  searchValue?: string;
  onSearchChange?: (value: string) => void;
  searchPlaceholder?: string;
}

export function Header({
  currentLanguage,
  onLanguageChange,
  isSpeaking,
  onToggleSpeech,
  title,
  searchValue,
  onSearchChange,
  searchPlaceholder
}: HeaderProps) {
  return (
    <header className="bg-gradient-to-r from-blue-600 to-blue-800 text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex flex-col lg:flex-row justify-between items-center gap-4">
          <div className="flex items-center space-x-3 flex-shrink-0">
            <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center">
              <Globe className="w-6 h-6 text-blue-600" />
            </div>
            <h1 className="text-2xl font-bold whitespace-nowrap">{title}</h1>
          </div>

          {onSearchChange && (
            <div className="flex-1 max-w-2xl w-full">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-blue-300" />
                <input
                  type="text"
                  value={searchValue || ''}
                  onChange={(e) => onSearchChange(e.target.value)}
                  placeholder={searchPlaceholder || 'Search...'}
                  className="w-full pl-10 pr-4 py-2 rounded-lg bg-blue-700 text-white placeholder-blue-300 border border-blue-500 focus:outline-none focus:ring-2 focus:ring-white focus:bg-blue-600 transition-colors"
                />
              </div>
            </div>
          )}

          <div className="flex items-center space-x-4 flex-shrink-0">
            <button
              onClick={onToggleSpeech}
              className="p-2 rounded-lg hover:bg-blue-700 transition-colors"
              title={isSpeaking ? 'Stop speaking' : 'Enable speech'}
            >
              {isSpeaking ? (
                <VolumeX className="w-5 h-5" />
              ) : (
                <Volume2 className="w-5 h-5" />
              )}
            </button>

            <select
              value={currentLanguage}
              onChange={(e) => onLanguageChange(e.target.value)}
              className="bg-blue-700 text-white px-4 py-2 rounded-lg border border-blue-500 focus:outline-none focus:ring-2 focus:ring-white"
            >
              {Object.entries(SUPPORTED_LANGUAGES).map(([code, name]) => (
                <option key={code} value={code}>
                  {name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>
    </header>
  );
}
