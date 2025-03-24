'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

const familySetupSchema = z.object({
  name: z.string().min(1, 'Family name is required'),
});

type FamilySetupFormData = z.infer<typeof familySetupSchema>;

export default function FamilySetupForm() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FamilySetupFormData>({
    resolver: zodResolver(familySetupSchema),
  });
  
  const onSubmit = async (data: FamilySetupFormData) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await fetch('/api/families', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      
      const result = await response.json();
      
      if (!response.ok) {
        setError(result.error || 'An error occurred while creating your family');
        return;
      }
      
      // Redirect to dashboard on successful family creation
      router.push('/dashboard');
      router.refresh();
    } catch (err) {
      setError('An error occurred while creating your family');
      console.error('Family setup error:', err);
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div className="max-w-md w-full mx-auto p-6 bg-white rounded-lg shadow-md">
      <h1 className="text-2xl font-bold text-center mb-6">Create Your Family</h1>
      
      <p className="text-gray-600 mb-6 text-center">
        Create a family group to start planning meals and managing shopping lists.
      </p>
      
      {error && (
        <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}
      
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="mb-6">
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
            Family Name
          </label>
          <input
            id="name"
            type="text"
            placeholder="e.g., Smith Family"
            {...register('name')}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={isLoading}
          />
          {errors.name && (
            <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
          )}
        </div>
        
        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
          disabled={isLoading}
        >
          {isLoading ? 'Creating...' : 'Create Family'}
        </button>
      </form>
    </div>
  );
} 