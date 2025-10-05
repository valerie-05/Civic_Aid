import { AlertCircle, Clock, AlertTriangle } from 'lucide-react';
import { CrisisScenario } from '../lib/supabase';

interface CrisisCardProps {
  scenario: CrisisScenario;
  onClick: () => void;
  language: string;
}

export function CrisisCard({ scenario, onClick, language }: CrisisCardProps) {
  const getTranslatedText = (translations: Record<string, string> | undefined, fallback: string) => {
    if (!translations) return fallback;
    return translations[language] || translations['en'] || fallback;
  };

  const title = getTranslatedText(scenario.title_translations, scenario.title);
  const description = getTranslatedText(scenario.description_translations, scenario.description);
  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical':
        return 'bg-red-50 border-red-300 hover:bg-red-100';
      case 'high':
        return 'bg-orange-50 border-orange-300 hover:bg-orange-100';
      case 'medium':
        return 'bg-yellow-50 border-yellow-300 hover:bg-yellow-100';
      default:
        return 'bg-blue-50 border-blue-300 hover:bg-blue-100';
    }
  };

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'critical':
        return <AlertTriangle className="w-6 h-6 text-red-600" />;
      case 'high':
        return <AlertCircle className="w-6 h-6 text-orange-600" />;
      default:
        return <Clock className="w-6 h-6 text-blue-600" />;
    }
  };

  return (
    <button
      onClick={onClick}
      className={`w-full text-left p-6 rounded-xl border-2 transition-all transform hover:scale-105 ${getSeverityColor(scenario.severity)}`}
    >
      <div className="flex items-start space-x-4">
        <div className="flex-shrink-0">
          {getSeverityIcon(scenario.severity)}
        </div>
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            {title}
          </h3>
          <p className="text-sm text-gray-700 line-clamp-2">
            {description}
          </p>
        </div>
      </div>
    </button>
  );
}
