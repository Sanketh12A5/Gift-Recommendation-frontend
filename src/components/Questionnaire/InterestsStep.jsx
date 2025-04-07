import React from 'react';
import { useForm } from 'react-hook-form';
import { useQuestionnaire } from '../../context/QuestionnaireContext';
import { Heart, ArrowLeft } from 'lucide-react';

const predefinedInterests = [
  'Reading', 'Gaming', 'Sports', 'Music', 'Art',
  'Technology', 'Cooking', 'Fashion', 'Travel', 'Photography',
  'Fitness', 'Movies', 'DIY', 'Gardening', 'Pets'
];

export function InterestsStep() {
  const { recipient, updateRecipient, nextStep, prevStep } = useQuestionnaire();
  const { register, handleSubmit, watch, setValue } = useForm({
    defaultValues: {
      interests: recipient.interests,
      customInterest: ''
    }
  });

  const selectedInterests = watch('interests', []);
  const customInterest = watch('customInterest', '');

  const onSubmit = (data) => {
    const allInterests = [...(data.interests || [])];
    if (data.customInterest) {
      allInterests.push(data.customInterest);
    }
    updateRecipient({ interests: allInterests });
    nextStep();
  };

  const handleCustomInterestAdd = () => {
    if (customInterest.trim()) {
      const newInterests = [...(selectedInterests || []), customInterest.trim()];
      setValue('interests', newInterests);
      setValue('customInterest', '');
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">What are their interests?</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {predefinedInterests.map((interest) => (
            <label
              key={interest}
              className="relative flex items-center justify-center p-4 border rounded-lg cursor-pointer hover:bg-gray-50"
            >
              <input
                type="checkbox"
                value={interest}
                {...register('interests')}
                className="absolute h-4 w-4 top-2 right-2"
              />
              <span className="text-sm text-center">{interest}</span>
            </label>
          ))}
        </div>
      </div>

      <div className="flex gap-2">
        <input
          type="text"
          placeholder="Add custom interest"
          {...register('customInterest')}
          className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
        />
        <button
          type="button"
          onClick={handleCustomInterestAdd}
          className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Add
        </button>
      </div>

      {selectedInterests.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {selectedInterests.map((interest) => (
            <span
              key={interest}
              className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-indigo-100 text-indigo-800"
            >
              <Heart className="w-4 h-4 mr-1" />
              {interest}
            </span>
          ))}
        </div>
      )}

      <div className="flex gap-4">
        <button
          type="button"
          onClick={prevStep}
          className="flex-1 inline-flex justify-center items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Previous
        </button>
        <button
          type="submit"
          className="flex-1 inline-flex justify-center items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Next
        </button>
      </div>
    </form>
  );
}