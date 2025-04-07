import React, { useState, useEffect } from 'react';
import { Gift, ExternalLink, Heart, Share2, Loader2 } from 'lucide-react';
import { useQuestionnaire } from '../../context/QuestionnaireContext';
import { generateGiftSuggestions } from '../../lib/openai';

export function GiftSuggestions() {
  const { recipient } = useQuestionnaire();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [giftSuggestions, setGiftSuggestions] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [priceRange, setPriceRange] = useState(recipient.budget);
  const [savedGifts, setSavedGifts] = useState([]);

  useEffect(() => {
    let mounted = true;

    async function fetchGiftSuggestions() {
      try {
        setLoading(true);
        setError(null);
        const suggestions = await generateGiftSuggestions(recipient);
        if (mounted) {
          setGiftSuggestions(suggestions);
          console.log(suggestions);
        }
      } catch (err) {
        if (mounted) {
          setError(err.message || 'Failed to generate gift suggestions. Please try again.');
        }
        console.error(err);
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    }

    fetchGiftSuggestions();

    return () => {
      mounted = false;
    };
  }, [recipient]);

  const categories = Array.from(new Set(giftSuggestions.map(gift => gift.category)));

  const filteredGifts = giftSuggestions.filter(gift => {
    const matchesCategory = selectedCategories.length === 0 || selectedCategories.includes(gift.category);
    const matchesPrice = gift.price >= priceRange.min && gift.price <= priceRange.max;
    return matchesCategory && matchesPrice;
  });

  const toggleCategory = (category) => {
    setSelectedCategories(prev =>
      prev.includes(category)
        ? prev.filter(c => c !== category)
        : [...prev, category]
    );
  };

  const toggleSaveGift = (giftId) => {
    setSavedGifts(prev =>
      prev.includes(giftId)
        ? prev.filter(id => id !== giftId)
        : [...prev, giftId]
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-indigo-600 mx-auto mb-4" />
          <p className="text-gray-600">Generating personalized gift suggestions...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center p-8 bg-red-50 rounded-lg">
        <p className="text-red-600">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="mt-4 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">
          Personalized Gift Suggestions for {recipient.name}
        </h2>
        
        {/* Filters */}
        <div className="space-y-4 mb-8">
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Categories</h3>
            <div className="flex flex-wrap gap-2">
              {categories.map(category => (
                <button
                  key={category}
                  onClick={() => toggleCategory(category)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                    selectedCategories.includes(category)
                      ? 'bg-indigo-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Price Range</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Min ($)</label>
                <input
                  type="number"
                  value={priceRange.min}
                  onChange={(e) => setPriceRange(prev => ({ ...prev, min: Number(e.target.value) }))}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Max ($)</label>
                <input
                  type="number"
                  value={priceRange.max}
                  onChange={(e) => setPriceRange(prev => ({ ...prev, max: Number(e.target.value) }))}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Gift Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredGifts.map(gift => (
            <div key={gift.id} className="bg-white rounded-lg border shadow-sm overflow-hidden">
              <img
                src={`${gift.imageUrl}?w=600&h=400&fit=crop&auto=format`}
                alt={gift.name}
                className="w-full h-48 object-cover"
              />
              <div className="p-4 space-y-2">
                <h3 className="text-lg font-semibold text-gray-900">{gift.name}</h3>
                <p className="text-sm text-gray-600">{gift.description}</p>
                <p className="text-lg font-bold text-indigo-600">${gift.price.toFixed(2)}</p>
                <div className="flex items-center justify-between pt-2">
                  <button
                    onClick={() => toggleSaveGift(gift.id)}
                    className={`inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium ${
                      savedGifts.includes(gift.id)
                        ? 'bg-pink-100 text-pink-700'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    <Heart className={`w-4 h-4 mr-1 ${savedGifts.includes(gift.id) ? 'fill-current' : ''}`} />
                    {savedGifts.includes(gift.id) ? 'Saved' : 'Save'}
                  </button>
                  <div className="flex space-x-2">
                    <button
                      className="p-1.5 rounded-full text-gray-500 hover:bg-gray-100"
                      onClick={() => navigator.share?.({ title: gift.name, text: gift.description, url: gift.link })}
                    >
                      <Share2 className="w-4 h-4" />
                    </button>
                    <a
                      href={gift.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-1.5 rounded-full text-gray-500 hover:bg-gray-100"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}