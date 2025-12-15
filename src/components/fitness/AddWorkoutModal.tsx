import React, { useState } from 'react';
import { X, Plus, Trash2 } from 'lucide-react';
import { Workout, WorkoutType, Exercise, WorkoutCategory } from '@/types/fitness';
import { workoutCategories } from '@/data/fitnessData';
import WorkoutCategoryCard from './WorkoutCategoryCard';

interface AddWorkoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (workout: Omit<Workout, 'id'>) => void;
}

const AddWorkoutModal: React.FC<AddWorkoutModalProps> = ({ isOpen, onClose, onAdd }) => {
  const [step, setStep] = useState(1);
  const [selectedCategory, setSelectedCategory] = useState<WorkoutCategory | null>(null);
  const [workoutName, setWorkoutName] = useState('');
  const [duration, setDuration] = useState('');
  const [calories, setCalories] = useState('');
  const [notes, setNotes] = useState('');
  const [exercises, setExercises] = useState<Omit<Exercise, 'id'>[]>([
    { name: '', sets: undefined, reps: undefined, weight: undefined, duration: undefined }
  ]);

  const resetForm = () => {
    setStep(1);
    setSelectedCategory(null);
    setWorkoutName('');
    setDuration('');
    setCalories('');
    setNotes('');
    setExercises([{ name: '', sets: undefined, reps: undefined, weight: undefined, duration: undefined }]);
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const handleCategorySelect = (category: WorkoutCategory) => {
    setSelectedCategory(category);
    setStep(2);
  };

  const addExercise = () => {
    setExercises([...exercises, { name: '', sets: undefined, reps: undefined, weight: undefined, duration: undefined }]);
  };

  const removeExercise = (index: number) => {
    if (exercises.length > 1) {
      setExercises(exercises.filter((_, i) => i !== index));
    }
  };

  const updateExercise = (index: number, field: keyof Omit<Exercise, 'id'>, value: string | number) => {
    const updated = [...exercises];
    if (field === 'name') {
      updated[index] = { ...updated[index], [field]: value as string };
    } else {
      updated[index] = { ...updated[index], [field]: value ? Number(value) : undefined };
    }
    setExercises(updated);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCategory || !workoutName || !duration) return;

    const workout: Omit<Workout, 'id'> = {
      type: selectedCategory.id,
      name: workoutName,
      duration: parseInt(duration),
      calories: parseInt(calories) || Math.round(parseInt(duration) * 8),
      date: new Date().toISOString().split('T')[0],
      exercises: exercises
        .filter(e => e.name.trim())
        .map((e, i) => ({ ...e, id: `new-${i}` })),
      notes: notes || undefined
    };

    onAdd(workout);
    handleClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={handleClose}
      />
      
      {/* Modal */}
      <div className="relative bg-slate-900 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden border border-slate-700/50 shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-700/50">
          <div>
            <h2 className="text-xl font-bold text-white">Log Workout</h2>
            <p className="text-sm text-slate-400 mt-1">
              {step === 1 ? 'Choose workout type' : 'Enter workout details'}
            </p>
          </div>
          <button 
            onClick={handleClose}
            className="p-2 rounded-lg hover:bg-slate-800 transition-colors text-slate-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-180px)]">
          {step === 1 ? (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {workoutCategories.map((category) => (
                <WorkoutCategoryCard
                  key={category.id}
                  category={category}
                  onClick={handleCategorySelect}
                  isSelected={selectedCategory?.id === category.id}
                />
              ))}
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Selected Category */}
              {selectedCategory && (
                <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-800/50">
                  <div 
                    className="w-10 h-10 rounded-lg flex items-center justify-center"
                    style={{ backgroundColor: `${selectedCategory.color}20` }}
                  >
                    <img 
                      src={selectedCategory.image} 
                      alt={selectedCategory.name}
                      className="w-full h-full object-cover rounded-lg"
                    />
                  </div>
                  <div>
                    <span className="text-white font-medium">{selectedCategory.name}</span>
                    <button 
                      type="button"
                      onClick={() => setStep(1)}
                      className="block text-xs text-indigo-400 hover:text-indigo-300"
                    >
                      Change type
                    </button>
                  </div>
                </div>
              )}

              {/* Workout Name */}
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Workout Name *
                </label>
                <input
                  type="text"
                  value={workoutName}
                  onChange={(e) => setWorkoutName(e.target.value)}
                  placeholder="e.g., Morning Strength Training"
                  className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  required
                />
              </div>

              {/* Duration & Calories */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Duration (minutes) *
                  </label>
                  <input
                    type="number"
                    value={duration}
                    onChange={(e) => setDuration(e.target.value)}
                    placeholder="45"
                    min="1"
                    className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Calories Burned
                  </label>
                  <input
                    type="number"
                    value={calories}
                    onChange={(e) => setCalories(e.target.value)}
                    placeholder="Auto-calculated"
                    min="0"
                    className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  />
                </div>
              </div>

              {/* Exercises */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-sm font-medium text-slate-300">
                    Exercises
                  </label>
                  <button
                    type="button"
                    onClick={addExercise}
                    className="flex items-center gap-1 text-sm text-indigo-400 hover:text-indigo-300"
                  >
                    <Plus className="w-4 h-4" />
                    Add Exercise
                  </button>
                </div>
                <div className="space-y-3">
                  {exercises.map((exercise, index) => (
                    <div key={index} className="p-4 bg-slate-800/50 rounded-xl space-y-3">
                      <div className="flex items-center gap-2">
                        <input
                          type="text"
                          value={exercise.name}
                          onChange={(e) => updateExercise(index, 'name', e.target.value)}
                          placeholder="Exercise name"
                          className="flex-1 px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                        {exercises.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removeExercise(index)}
                            className="p-2 text-red-400 hover:text-red-300 hover:bg-red-400/10 rounded-lg transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                      <div className="grid grid-cols-4 gap-2">
                        <input
                          type="number"
                          value={exercise.sets || ''}
                          onChange={(e) => updateExercise(index, 'sets', e.target.value)}
                          placeholder="Sets"
                          min="0"
                          className="px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                        <input
                          type="number"
                          value={exercise.reps || ''}
                          onChange={(e) => updateExercise(index, 'reps', e.target.value)}
                          placeholder="Reps"
                          min="0"
                          className="px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                        <input
                          type="number"
                          value={exercise.weight || ''}
                          onChange={(e) => updateExercise(index, 'weight', e.target.value)}
                          placeholder="Weight"
                          min="0"
                          className="px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                        <input
                          type="number"
                          value={exercise.duration || ''}
                          onChange={(e) => updateExercise(index, 'duration', e.target.value)}
                          placeholder="Min"
                          min="0"
                          className="px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Notes */}
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Notes
                </label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="How did the workout feel? Any achievements?"
                  rows={3}
                  className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none"
                />
              </div>
            </form>
          )}
        </div>

        {/* Footer */}
        {step === 2 && (
          <div className="p-6 border-t border-slate-700/50 flex justify-end gap-3">
            <button
              type="button"
              onClick={handleClose}
              className="px-6 py-2.5 rounded-xl text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              disabled={!workoutName || !duration}
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-medium hover:from-indigo-600 hover:to-purple-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Log Workout
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default AddWorkoutModal;
