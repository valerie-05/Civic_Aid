import { useState, useEffect } from 'react';
import { supabase, CrisisScenario, GuidanceStep, Resource } from './lib/supabase';
import { useTextToSpeech } from './hooks/useTextToSpeech';
import { useTranslation } from './hooks/useTranslation';
import { Header } from './components/Header';
import { SearchBar } from './components/SearchBar';
import { CrisisCard } from './components/CrisisCard';
import { GuidanceView } from './components/GuidanceView';
import { AIAssistant } from './components/AIAssistant';
import { NewsHeadline } from './components/NewsHeadline';
import { VisaQuiz } from './components/VisaQuiz';
import { VisaInfoPanel } from './components/VisaInfoPanel';
import { Loader2, FileQuestion } from 'lucide-react';

function App() {
  const [scenarios, setScenarios] = useState<CrisisScenario[]>([]);
  const [selectedScenario, setSelectedScenario] = useState<CrisisScenario | null>(null);
  const [guidanceSteps, setGuidanceSteps] = useState<GuidanceStep[]>([]);
  const [resources, setResources] = useState<Resource[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [showVisaQuiz, setShowVisaQuiz] = useState(false);
  const [userVisaType, setUserVisaType] = useState<string | null>(null);

  const { speak, stop, isSpeaking, setSelectedLanguage } = useTextToSpeech();
  const { language, setLanguage, t } = useTranslation();

  useEffect(() => {
    loadScenarios();
  }, []);

  useEffect(() => {
    setSelectedLanguage(language);
  }, [language, setSelectedLanguage]);

  const loadScenarios = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('crisis_scenarios')
      .select('*')
      .order('severity', { ascending: false });

    if (!error && data) {
      setScenarios(data);
    }
    setLoading(false);
  };

  const loadGuidanceForScenario = async (scenario: CrisisScenario) => {
    setSelectedScenario(scenario);

    const [stepsResult, resourcesResult] = await Promise.all([
      supabase
        .from('guidance_steps')
        .select('*')
        .eq('scenario_id', scenario.id)
        .order('step_number', { ascending: true }),
      supabase
        .from('resources')
        .select('*')
        .contains('categories', [scenario.category])
    ]);

    if (stepsResult.data) setGuidanceSteps(stepsResult.data);
    if (resourcesResult.data) setResources(resourcesResult.data);
  };

  const handleScenarioMatch = async (scenarioId: string) => {
    const scenario = scenarios.find(s => s.id === scenarioId);
    if (scenario) {
      await loadGuidanceForScenario(scenario);
    }
  };

  const filteredScenarios = scenarios.filter(s =>
    s.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const visaRelevantScenarios = userVisaType
    ? scenarios.filter(
        (scenario) =>
          scenario.is_visa_specific &&
          scenario.visa_types?.includes(userVisaType)
      ).sort((a, b) => (b.importance_level || 0) - (a.importance_level || 0))
    : [];

  const handleToggleSpeech = () => {
    if (isSpeaking) {
      stop();
    }
  };

  const handleVisaQuizComplete = (visaType: string) => {
    setUserVisaType(visaType);
    localStorage.setItem('userVisaType', visaType);
  };

  useEffect(() => {
    const savedVisaType = localStorage.getItem('userVisaType');
    if (savedVisaType) {
      setUserVisaType(savedVisaType);
    }
  }, []);

  if (selectedScenario) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
        <Header
          currentLanguage={language}
          onLanguageChange={setLanguage}
          isSpeaking={isSpeaking}
          onToggleSpeech={handleToggleSpeech}
          title={t('crisis_guidance')}
        />
        <main className="py-8 px-4">
          <GuidanceView
            scenario={selectedScenario}
            steps={guidanceSteps}
            resources={resources}
            onBack={() => {
              setSelectedScenario(null);
              stop();
            }}
            onSpeak={speak}
            t={t}
          />
        </main>
        <AIAssistant onScenarioMatch={handleScenarioMatch} language={language} t={t} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      <Header
        currentLanguage={language}
        onLanguageChange={setLanguage}
        isSpeaking={isSpeaking}
        onToggleSpeech={handleToggleSpeech}
        title={t('crisis_guidance')}
        searchValue={searchQuery}
        onSearchChange={setSearchQuery}
        searchPlaceholder={t('search_placeholder')}
      />

      <main className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            {t('select_situation')}
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-6">
            {t('page_description')}
          </p>

          {!userVisaType && (
            <button
              onClick={() => setShowVisaQuiz(true)}
              className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium shadow-md"
            >
              <FileQuestion className="w-5 h-5" />
              Take Visa Assessment Quiz
            </button>
          )}

          {userVisaType && (
            <div className="inline-flex items-center gap-3 px-6 py-3 bg-green-50 border-2 border-green-200 rounded-lg">
              <div className="flex items-center gap-2">
                <span className="text-sm text-green-700 font-medium">
                  Visa Type Identified: <span className="uppercase font-bold">{userVisaType}</span>
                </span>
                <button
                  onClick={() => setShowVisaQuiz(true)}
                  className="text-xs text-blue-600 hover:text-blue-700 underline ml-2"
                >
                  Retake Quiz
                </button>
              </div>
            </div>
          )}
        </div>

        <div className="flex flex-col lg:flex-row gap-6">
          <div className="flex-1 min-w-0">
            {loading ? (
              <div className="flex justify-center items-center py-20">
                <Loader2 className="w-12 h-12 text-blue-600 animate-spin" />
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
                {filteredScenarios.map((scenario) => (
                  <CrisisCard
                    key={scenario.id}
                    scenario={scenario}
                    onClick={() => loadGuidanceForScenario(scenario)}
                    language={language}
                  />
                ))}
              </div>
            )}

            {!loading && filteredScenarios.length === 0 && (
              <div className="text-center py-20">
                <p className="text-xl text-gray-600">
                  {t('no_scenarios_found')}
                </p>
              </div>
            )}
          </div>

          <div className="w-full lg:w-80 flex-shrink-0 space-y-6">
            {userVisaType && visaRelevantScenarios.length > 0 && (
              <VisaInfoPanel
                visaType={userVisaType}
                relevantScenarios={visaRelevantScenarios}
                language={language}
                t={t}
                onScenarioClick={loadGuidanceForScenario}
              />
            )}
            <NewsHeadline t={t} />
          </div>
        </div>
      </main>

      <AIAssistant onScenarioMatch={handleScenarioMatch} language={language} t={t} />
      <VisaQuiz
        isOpen={showVisaQuiz}
        onClose={() => setShowVisaQuiz(false)}
        language={language}
        t={t}
        onComplete={handleVisaQuizComplete}
      />
    </div>
  );
}

export default App;
