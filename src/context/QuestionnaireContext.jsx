import React, { createContext, useContext, useState } from 'react';
import axios from 'axios';

const QuestionnaireContext = createContext(undefined);
const API_URL = import.meta.env.VITE_API_URL;

const initialRecipient = {
  name: '',
  age: 0,
  gender: 'other',
  relationship: '',
  interests: [],
  occasion: '',
  budget: {
    min: 0,
    max: 1000
  }
};

export function QuestionnaireProvider({ children }) {
  const [currentStep, setCurrentStep] = useState(0);
  const [recipient, setRecipient] = useState(initialRecipient);

  const updateRecipient = async (data) => {
    const updatedRecipient = { ...recipient, ...data };
    setRecipient(updatedRecipient);

    // If we have all required data, save to backend
    if (currentStep === 2) {
      try {
        const token = localStorage.getItem('authToken');
        const response = await axios.post(`${API_URL}/gifts/recipients`, updatedRecipient, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        setRecipient(response.data);
      } catch (error) {
        console.error('Failed to save recipient:', error);
        throw new Error(error.response?.data?.message || 'Failed to save recipient data');
      }
    }
  };

  const nextStep = () => setCurrentStep(prev => prev + 1);
  const prevStep = () => setCurrentStep(prev => Math.max(0, prev - 1));

  return (
    <QuestionnaireContext.Provider
      value={{
        currentStep,
        recipient,
        updateRecipient,
        nextStep,
        prevStep
      }}
    >
      {children}
    </QuestionnaireContext.Provider>
  );
}

export function useQuestionnaire() {
  const context = useContext(QuestionnaireContext);
  if (context === undefined) {
    throw new Error('useQuestionnaire must be used within a QuestionnaireProvider');
  }
  return context;
}