import { ArrowLeft, AlertCircle, Volume2, Phone, ExternalLink } from 'lucide-react';
import { CrisisScenario, GuidanceStep, Resource } from '../lib/supabase';

interface GuidanceViewProps {
  scenario: CrisisScenario;
  steps: GuidanceStep[];
  resources: Resource[];
  onBack: () => void;
  onSpeak: (text: string) => void;
  t: (key: string) => string;
}

export function GuidanceView({ scenario, steps, resources, onBack, onSpeak, t }: GuidanceViewProps) {
  return (
    <div className="max-w-4xl mx-auto">
      <button
        onClick={onBack}
        className="mb-6 flex items-center space-x-2 text-blue-600 hover:text-blue-800 font-medium"
      >
        <ArrowLeft className="w-5 h-5" />
        <span>{t('back')}</span>
      </button>

      <div className="bg-white rounded-2xl shadow-xl p-8 mb-6">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">{scenario.title}</h2>
        <p className="text-gray-700 text-lg mb-6">{scenario.description}</p>

        <div className="space-y-6">
          {steps.map((step) => (
            <div
              key={step.id}
              className={`p-6 rounded-xl border-2 ${
                step.is_urgent
                  ? 'bg-red-50 border-red-300'
                  : 'bg-gray-50 border-gray-200'
              }`}
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center space-x-3">
                  {step.is_urgent && <AlertCircle className="w-6 h-6 text-red-600" />}
                  <h3 className="text-xl font-semibold text-gray-900">
                    {t('step')} {step.step_number}: {step.title}
                  </h3>
                </div>
                <button
                  onClick={() => onSpeak(`${t('step')} ${step.step_number}: ${step.title}. ${step.description}`)}
                  className="p-2 rounded-lg hover:bg-white transition-colors"
                  title={t('speak')}
                >
                  <Volume2 className="w-5 h-5 text-blue-600" />
                </button>
              </div>
              <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-xl p-8">
        <h3 className="text-2xl font-bold text-gray-900 mb-6">{t('emergency_resources')}</h3>
        <div className="space-y-4">
          {resources.map((resource) => (
            <div
              key={resource.id}
              className={`p-6 rounded-xl border-2 ${
                resource.is_emergency
                  ? 'bg-red-50 border-red-300'
                  : 'bg-gray-50 border-gray-200'
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h4 className="text-lg font-semibold text-gray-900 mb-2">
                    {resource.name}
                  </h4>
                  <p className="text-gray-700 mb-3">{resource.description}</p>
                  <div className="flex flex-wrap gap-2">
                    {resource.phone_number && (
                      <a
                        href={`tel:${resource.phone_number}`}
                        className="inline-flex items-center space-x-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
                      >
                        <Phone className="w-4 h-4" />
                        <span>{resource.phone_number}</span>
                      </a>
                    )}
                    <a
                      href={resource.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      <ExternalLink className="w-4 h-4" />
                      <span>{t('visit_website')}</span>
                    </a>
                  </div>
                  {resource.languages_supported.length > 0 && (
                    <p className="text-sm text-gray-600 mt-3">
                      Languages: {resource.languages_supported.join(', ')}
                    </p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
