import React from 'react';
import { Gift } from 'lucide-react';
import { BasicInfo } from './components/Questionnaire/BasicInfo';
import { InterestsStep } from './components/Questionnaire/InterestsStep';
import { OccasionBudgetStep } from './components/Questionnaire/OccasionBudgetStep';
import { GiftSuggestions } from './components/Questionnaire/GiftSuggestions';
import { QuestionnaireProvider, useQuestionnaire } from './context/QuestionnaireContext';
import { AuthProvider } from './context/AuthContext';
import { AuthGuard } from './components/Auth/AuthGuard';
import { useAuth } from './context/AuthContext';

function Header() {
  const { user, signOut } = useAuth();

  return (
    <header className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Gift className="h-8 w-8 text-indigo-600" />
            <h1 className="text-2xl font-bold text-gray-900">Gift Finder</h1>
          </div>
          {user && (
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">
                {user.email} ({user.role})
              </span>
              <button
                onClick={() => signOut()}
                className="text-sm text-indigo-600 hover:text-indigo-500"
              >
                Sign Out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

function QuestionnaireSteps() {
  const { currentStep } = useQuestionnaire();

  return (
    <div className="bg-white shadow rounded-lg p-6">
      {currentStep < 3 && (
        <div className="mb-8">
          <div className="flex items-center justify-between">
            {[1, 2, 3].map((step) => (
              <div key={step} className="flex items-center">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    step <= currentStep + 1
                      ? 'bg-indigo-600 text-white'
                      : 'bg-gray-200 text-gray-600'
                  }`}
                >
                  {step}
                </div>
                {step < 3 && (
                  <div
                    className={`h-1 w-12 sm:w-24 ${
                      step <= currentStep ? 'bg-indigo-600' : 'bg-gray-200'
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
          <div className="flex justify-between mt-2">
            <span className="text-sm font-medium">Basic Info</span>
            <span className="text-sm font-medium">Interests</span>
            <span className="text-sm font-medium">Occasion & Budget</span>
          </div>
        </div>
      )}

      {currentStep === 0 && <BasicInfo />}
      {currentStep === 1 && <InterestsStep />}
      {currentStep === 2 && <OccasionBudgetStep />}
      {currentStep === 3 && <GiftSuggestions />}
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <div className="min-h-screen bg-gray-50">
        <AuthGuard>
          <QuestionnaireProvider>
            <Header />
            <main className="max-w-3xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
              <QuestionnaireSteps />
            </main>
          </QuestionnaireProvider>
        </AuthGuard>
      </div>
    </AuthProvider>
  );
}

export default App;