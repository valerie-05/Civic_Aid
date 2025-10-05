import { AlertCircle, Info, Calendar, FileText, ExternalLink } from 'lucide-react';
import { CrisisScenario } from '../lib/supabase';

interface VisaInfoPanelProps {
  visaType: string;
  relevantScenarios: CrisisScenario[];
  language: string;
  t: (key: string) => string;
  onScenarioClick: (scenario: CrisisScenario) => void;
}

const VISA_INFO: Record<string, {
  deadlines: string[];
  commonIssues: string[];
  resources: { name: string; url: string }[];
}> = {
  f1: {
    deadlines: ['I-20 expiration', 'OPT application (90 days before completion)', 'Program end date'],
    commonIssues: ['Maintaining full-time enrollment', 'On-campus employment limits', 'Travel signature validity'],
    resources: [
      { name: 'USCIS Student Resources', url: 'https://www.uscis.gov/working-in-the-united-states/students-and-exchange-visitors' },
      { name: 'SEVP Portal', url: 'https://studyinthestates.dhs.gov/' }
    ]
  },
  h1b: {
    deadlines: ['I-94 expiration', 'H-1B renewal (6 months before)', 'Green card filing deadlines'],
    commonIssues: ['Job changes and transfers', 'Layoffs and grace periods', 'Visa stamping for travel'],
    resources: [
      { name: 'USCIS H-1B Information', url: 'https://www.uscis.gov/working-in-the-united-states/temporary-workers/h-1b-specialty-occupations' },
      { name: 'DOL Foreign Labor Certification', url: 'https://www.dol.gov/agencies/eta/foreign-labor' }
    ]
  },
  b1b2: {
    deadlines: ['I-94 expiration', 'Extension application (before expiration)', '90-day limit for VWP'],
    commonIssues: ['Overstaying', 'Extension eligibility', 'Travel restrictions'],
    resources: [
      { name: 'CBP I-94 Information', url: 'https://i94.cbp.dhs.gov/' },
      { name: 'USCIS Visitor Visa Extension', url: 'https://www.uscis.gov/visit-the-united-states' }
    ]
  },
  greencard: {
    deadlines: ['Green card renewal (10 years)', 'Reentry permit (before travel)', 'Citizenship eligibility'],
    commonIssues: ['Maintaining residency', 'Conditional green card removal', 'Travel requirements'],
    resources: [
      { name: 'USCIS Green Card', url: 'https://www.uscis.gov/green-card' },
      { name: 'Green Card Renewal', url: 'https://www.uscis.gov/green-card/after-we-grant-your-green-card/renew-green-card' }
    ]
  },
  m1: {
    deadlines: ['I-20 expiration', 'Program completion date', 'Practical training application'],
    commonIssues: ['Course load requirements', 'Employment restrictions', 'Transfer procedures'],
    resources: [
      { name: 'SEVP M-1 Information', url: 'https://studyinthestates.dhs.gov/m-1-student' }
    ]
  },
  l1: {
    deadlines: ['I-94 expiration', 'L-1 extension deadlines', 'Blanket L petition'],
    commonIssues: ['Intercompany transfer requirements', 'Dual intent', 'Specialized knowledge criteria'],
    resources: [
      { name: 'USCIS L-1 Information', url: 'https://www.uscis.gov/working-in-the-united-states/temporary-workers/l-1a-intracompany-transferee-executive-or-manager' }
    ]
  },
  j1: {
    deadlines: ['DS-2019 expiration', 'Program end date', 'Grace period (30 days)'],
    commonIssues: ['Two-year home residency requirement', 'Program extensions', 'Category changes'],
    resources: [
      { name: 'DOS Exchange Visitor Program', url: 'https://j1visa.state.gov/' }
    ]
  },
  k1: {
    deadlines: ['Marriage within 90 days', 'Adjustment of status filing', 'Work authorization application'],
    commonIssues: ['Marriage requirements', 'Travel restrictions', 'Status adjustment process'],
    resources: [
      { name: 'USCIS K-1 Visa', url: 'https://www.uscis.gov/family/family-of-us-citizens/fiancee-visa' }
    ]
  }
};

export function VisaInfoPanel({ visaType, relevantScenarios, language, t, onScenarioClick }: VisaInfoPanelProps) {
  const getTranslatedText = (translations: Record<string, string> | undefined, fallback: string) => {
    if (!translations) return fallback;
    return translations[language] || translations['en'] || fallback;
  };

  const visaInfo = VISA_INFO[visaType] || VISA_INFO['f1'];
  const visaName = visaType.toUpperCase();

  return (
    <div className="space-y-6">
      {/* Visa-Specific Crises */}
      {relevantScenarios.length > 0 && (
        <div className="bg-gradient-to-br from-orange-50 to-red-50 rounded-xl shadow-lg border-2 border-orange-200 p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-orange-600 rounded-full flex items-center justify-center">
              <AlertCircle className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-900">
                {visaName} Visa: Important Information
              </h3>
              <p className="text-sm text-gray-600">
                Issues that may affect your visa status
              </p>
            </div>
          </div>

          <div className="space-y-3">
            {relevantScenarios.slice(0, 4).map((scenario) => (
              <button
                key={scenario.id}
                onClick={() => onScenarioClick(scenario)}
                className="w-full text-left p-4 bg-white rounded-lg border border-orange-200 hover:border-orange-400 hover:shadow-md transition-all"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-900 mb-1">
                      {getTranslatedText(scenario.title_translations, scenario.title)}
                    </h4>
                    <p className="text-sm text-gray-600 line-clamp-2">
                      {getTranslatedText(scenario.description_translations, scenario.description)}
                    </p>
                  </div>
                  <ExternalLink className="w-4 h-4 text-orange-600 flex-shrink-0 mt-1" />
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Important Deadlines */}
      <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
        <div className="flex items-center gap-3 mb-4">
          <Calendar className="w-6 h-6 text-blue-600" />
          <h3 className="text-lg font-bold text-gray-900">
            Important Deadlines for {visaName}
          </h3>
        </div>
        <ul className="space-y-2">
          {visaInfo.deadlines.map((deadline, index) => (
            <li key={index} className="flex items-start gap-2 text-gray-700">
              <span className="text-blue-600 mt-1">•</span>
              <span>{deadline}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Common Issues */}
      <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
        <div className="flex items-center gap-3 mb-4">
          <Info className="w-6 h-6 text-purple-600" />
          <h3 className="text-lg font-bold text-gray-900">
            Common {visaName} Issues
          </h3>
        </div>
        <ul className="space-y-2">
          {visaInfo.commonIssues.map((issue, index) => (
            <li key={index} className="flex items-start gap-2 text-gray-700">
              <span className="text-purple-600 mt-1">•</span>
              <span>{issue}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Official Resources */}
      <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
        <div className="flex items-center gap-3 mb-4">
          <FileText className="w-6 h-6 text-green-600" />
          <h3 className="text-lg font-bold text-gray-900">
            Official Resources
          </h3>
        </div>
        <div className="space-y-2">
          {visaInfo.resources.map((resource, index) => (
            <a
              key={index}
              href={resource.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between p-3 rounded-lg border border-gray-200 hover:border-green-400 hover:bg-green-50 transition-all group"
            >
              <span className="text-gray-900 font-medium">{resource.name}</span>
              <ExternalLink className="w-4 h-4 text-green-600 group-hover:text-green-700" />
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}
