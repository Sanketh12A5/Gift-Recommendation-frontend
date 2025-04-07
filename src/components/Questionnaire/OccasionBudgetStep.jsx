import React from 'react';
import { useForm } from 'react-hook-form';
import { useQuestionnaire } from '../../context/QuestionnaireContext';
import { Gift, ArrowLeft } from 'lucide-react';

const occasions = [
  'Birthday', 'Wedding', 'Anniversary', 'Graduation',
  'Christmas', 'Housewarming', 'Baby Shower', 'Other'
];

export function OccasionBudgetStep() {
  const { recipient, updateRecipient, prevStep, nextStep } = useQuestionnaire();
  const { register, handleSubmit, formState: { errors }, watch } = useForm({
    defaultValues: {
      occasion: recipient.occasion,
      budget: recipient.budget
    }
  });

  const minBudget = watch('budget.min');
  const maxBudget = watch('budget.max');

  const onSubmit = (data) => {
    updateRecipient(data);
    nextStep();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">What's the occasion?</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {occasions.map((occasion) => (
            <label
              key={occasion}
              className="relative flex items-center justify-center p-4 border rounded-lg cursor-pointer hover:bg-gray-50"
            >
              <input
                type="radio"
                value={occasion}
                {...register('occasion', { required: 'Please select an occasion' })}
                className="absolute h-4 w-4 top-2 right-2"
              />
              <span className="text-sm text-center">{occasion}</span>
            </label>
          ))}
        </div>
        {errors.occasion && (
          <p className="mt-1 text-sm text-red-600">{errors.occasion.message}</p>
        )}
      </div>

      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">What's your budget range?</h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="min-budget" className="block text-sm font-medium text-gray-700">
              Minimum ($)
            </label>
            <input
              type="number"
              id="min-budget"
              {...register('budget.min', {
                required: 'Minimum budget is required',
                min: { value: 0, message: 'Minimum budget must be positive' }
              })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            />
            {errors.budget?.min && (
              <p className="mt-1 text-sm text-red-600">{errors.budget.min.message}</p>
            )}
          </div>
          <div>
            <label htmlFor="max-budget" className="block text-sm font-medium text-gray-700">
              Maximum ($)
            </label>
            <input
              type="number"
              id="max-budget"
              {...register('budget.max', {
                required: 'Maximum budget is required',
                min: { value: 0, message: 'Maximum budget must be positive' },
                validate: value => !minBudget || value >= minBudget || 'Maximum budget must be greater than minimum'
              })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            />
            {errors.budget?.max && (
              <p className="mt-1 text-sm text-red-600">{errors.budget.max.message}</p>
            )}
          </div>
        </div>
      </div>

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
          <Gift className="w-4 h-4 mr-2" />
          Find Gifts
        </button>
      </div>
    </form>
  );
}