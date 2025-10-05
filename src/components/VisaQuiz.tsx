import { useState, useEffect } from 'react';
import { X, CheckCircle, ArrowRight, ArrowLeft, FileQuestion } from 'lucide-react';
import { supabase, QuizQuestion, QuizOption } from '../lib/supabase';
import { getUserId } from '../utils/sessionStorage';

interface VisaQuizProps {
  isOpen: boolean;
  onClose: () => void;
  language: string;
  t: (key: string) => string;
  onComplete: (visaType: string) => void;
}

interface QuestionWithOptions extends QuizQuestion {
  options: QuizOption[];
}

export function VisaQuiz({ isOpen, onClose, language, t, onComplete }: VisaQuizProps) {
  const [questions, setQuestions] = useState<QuestionWithOptions[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOptions, setSelectedOptions] = useState<Record<string, string[]>>({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (isOpen) {
      loadQuiz();
    }
  }, [isOpen]);

  const loadQuiz = async () => {
    setLoading(true);
    const { data: questionsData } = await supabase
      .from('quiz_questions')
      .select('*')
      .order('question_order', { ascending: true });

    if (questionsData) {
      const questionsWithOptions = await Promise.all(
        questionsData.map(async (question) => {
          const { data: options } = await supabase
            .from('quiz_options')
            .select('*')
            .eq('question_id', question.id)
            .order('option_order', { ascending: true });

          return {
            ...question,
            options: options || []
          };
        })
      );
      setQuestions(questionsWithOptions);
    }
    setLoading(false);
  };

  const getTranslation = (translations: Record<string, string>) => {
    return translations[language] || translations['en'] || '';
  };

  const handleOptionSelect = (questionId: string, optionId: string, isMultiple: boolean) => {
    if (isMultiple) {
      const current = selectedOptions[questionId] || [];
      const updated = current.includes(optionId)
        ? current.filter(id => id !== optionId)
        : [...current, optionId];
      setSelectedOptions({ ...selectedOptions, [questionId]: updated });
    } else {
      setSelectedOptions({ ...selectedOptions, [questionId]: [optionId] });
    }
  };

  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      handleSubmit();
    }
  };

  const handleBack = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const handleSubmit = async () => {
    setSubmitting(true);

    const userId = getUserId();
    const visaTypeCounts: Record<string, number> = {};

    for (const [questionId, optionIds] of Object.entries(selectedOptions)) {
      const question = questions.find(q => q.id === questionId);
      if (!question) continue;

      for (const optionId of optionIds) {
        const option = question.options.find(o => o.id === optionId);
        if (option?.visa_type_mapping) {
          for (const visaType of option.visa_type_mapping) {
            visaTypeCounts[visaType] = (visaTypeCounts[visaType] || 0) + 1;
          }
        }
      }

      await supabase.from('user_quiz_responses').insert({
        user_id: userId,
        question_id: questionId,
        selected_options: optionIds,
      });
    }

    const determinedVisaType = Object.entries(visaTypeCounts)
      .sort(([, a], [, b]) => b - a)[0]?.[0] || 'other';

    onComplete(determinedVisaType);
    setSubmitting(false);
    onClose();
  };

  if (!isOpen) return null;

  const currentQuestion = questions[currentQuestionIndex];
  const currentSelected = currentQuestion ? selectedOptions[currentQuestion.id] || [] : [];
  const canProceed = currentSelected.length > 0;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <FileQuestion className="w-8 h-8 text-blue-600" />
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Visa Type Assessment</h2>
              <p className="text-sm text-gray-600">
                Question {currentQuestionIndex + 1} of {questions.length}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6">
          {loading ? (
            <div className="flex justify-center items-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
          ) : currentQuestion ? (
            <>
              <div className="mb-8">
                <div className="w-full bg-gray-200 rounded-full h-2 mb-6">
                  <div
                    className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${((currentQuestionIndex + 1) / questions.length) * 100}%` }}
                  ></div>
                </div>

                <h3 className="text-xl font-semibold text-gray-900 mb-6">
                  {getTranslation(currentQuestion.question_translations)}
                </h3>

                <div className="space-y-3">
                  {currentQuestion.options.map((option) => {
                    const isSelected = currentSelected.includes(option.id);
                    return (
                      <button
                        key={option.id}
                        onClick={() => handleOptionSelect(
                          currentQuestion.id,
                          option.id,
                          currentQuestion.question_type === 'multiple_choice'
                        )}
                        className={`w-full text-left p-4 rounded-lg border-2 transition-all ${
                          isSelected
                            ? 'border-blue-600 bg-blue-50'
                            : 'border-gray-200 hover:border-blue-300 hover:bg-gray-50'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-gray-900 font-medium">
                            {getTranslation(option.option_translations)}
                          </span>
                          {isSelected && (
                            <CheckCircle className="w-5 h-5 text-blue-600 flex-shrink-0 ml-2" />
                          )}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="flex items-center justify-between pt-6 border-t border-gray-200">
                <button
                  onClick={handleBack}
                  disabled={currentQuestionIndex === 0}
                  className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-colors ${
                    currentQuestionIndex === 0
                      ? 'text-gray-400 cursor-not-allowed'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <ArrowLeft className="w-5 h-5" />
                  {t('back')}
                </button>

                <button
                  onClick={handleNext}
                  disabled={!canProceed || submitting}
                  className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-colors ${
                    !canProceed || submitting
                      ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      : 'bg-blue-600 text-white hover:bg-blue-700'
                  }`}
                >
                  {currentQuestionIndex === questions.length - 1 ? 'Complete' : 'Next'}
                  {currentQuestionIndex < questions.length - 1 && <ArrowRight className="w-5 h-5" />}
                </button>
              </div>
            </>
          ) : (
            <div className="text-center py-10 text-gray-600">
              No questions available
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
