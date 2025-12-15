import React, { useState } from 'react';
import { UserProfile, Measurement } from '@/types/fitness';
import { User, Target, Scale, TrendingDown, Edit2, Check, X } from 'lucide-react';

interface ProfileSectionProps {
  profile: UserProfile;
  onUpdateProfile: (profile: UserProfile) => void;
}

const ProfileSection: React.FC<ProfileSectionProps> = ({ profile, onUpdateProfile }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedProfile, setEditedProfile] = useState(profile);

  const latestMeasurement = profile.measurements[profile.measurements.length - 1];
  const previousMeasurement = profile.measurements[profile.measurements.length - 2];
  
  const weightChange = previousMeasurement 
    ? latestMeasurement.weight - previousMeasurement.weight 
    : 0;

  const progressToGoal = profile.targetWeight < profile.weight
    ? ((profile.measurements[0].weight - latestMeasurement.weight) / (profile.measurements[0].weight - profile.targetWeight)) * 100
    : ((latestMeasurement.weight - profile.measurements[0].weight) / (profile.targetWeight - profile.measurements[0].weight)) * 100;

  const handleSave = () => {
    onUpdateProfile(editedProfile);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditedProfile(profile);
    setIsEditing(false);
  };

  return (
    <div className="bg-slate-800/50 backdrop-blur-xl rounded-2xl border border-slate-700/50 overflow-hidden">
      {/* Header */}
      <div className="p-6 border-b border-slate-700/50">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center">
              <User className="w-8 h-8 text-white" />
            </div>
            <div>
              {isEditing ? (
                <input
                  type="text"
                  value={editedProfile.name}
                  onChange={(e) => setEditedProfile({ ...editedProfile, name: e.target.value })}
                  className="text-xl font-bold text-white bg-slate-700 px-3 py-1 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              ) : (
                <h3 className="text-xl font-bold text-white">{profile.name}</h3>
              )}
              <p className="text-slate-400 text-sm">Fitness Enthusiast</p>
            </div>
          </div>
          
          {isEditing ? (
            <div className="flex items-center gap-2">
              <button
                onClick={handleCancel}
                className="p-2 rounded-lg hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
              <button
                onClick={handleSave}
                className="p-2 rounded-lg bg-green-500/20 text-green-400 hover:bg-green-500/30 transition-colors"
              >
                <Check className="w-5 h-5" />
              </button>
            </div>
          ) : (
            <button
              onClick={() => setIsEditing(true)}
              className="p-2 rounded-lg hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
            >
              <Edit2 className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>

      {/* Stats Grid */}
      <div className="p-6 grid grid-cols-2 md:grid-cols-4 gap-4">
        {/* Current Weight */}
        <div className="bg-slate-700/30 rounded-xl p-4">
          <div className="flex items-center gap-2 text-slate-400 mb-2">
            <Scale className="w-4 h-4" />
            <span className="text-sm">Current Weight</span>
          </div>
          {isEditing ? (
            <input
              type="number"
              value={editedProfile.weight}
              onChange={(e) => setEditedProfile({ ...editedProfile, weight: parseFloat(e.target.value) })}
              className="text-2xl font-bold text-white bg-slate-600 px-2 py-1 rounded w-24 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          ) : (
            <div className="flex items-baseline gap-1">
              <span className="text-2xl font-bold text-white">{profile.weight}</span>
              <span className="text-slate-400 text-sm">lbs</span>
            </div>
          )}
          {weightChange !== 0 && !isEditing && (
            <div className={`flex items-center gap-1 mt-1 text-xs ${weightChange < 0 ? 'text-green-400' : 'text-red-400'}`}>
              <TrendingDown className={`w-3 h-3 ${weightChange > 0 ? 'rotate-180' : ''}`} />
              <span>{Math.abs(weightChange)} lbs this week</span>
            </div>
          )}
        </div>

        {/* Target Weight */}
        <div className="bg-slate-700/30 rounded-xl p-4">
          <div className="flex items-center gap-2 text-slate-400 mb-2">
            <Target className="w-4 h-4" />
            <span className="text-sm">Target Weight</span>
          </div>
          {isEditing ? (
            <input
              type="number"
              value={editedProfile.targetWeight}
              onChange={(e) => setEditedProfile({ ...editedProfile, targetWeight: parseFloat(e.target.value) })}
              className="text-2xl font-bold text-white bg-slate-600 px-2 py-1 rounded w-24 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          ) : (
            <div className="flex items-baseline gap-1">
              <span className="text-2xl font-bold text-white">{profile.targetWeight}</span>
              <span className="text-slate-400 text-sm">lbs</span>
            </div>
          )}
          <div className="text-xs text-slate-500 mt-1">
            {Math.abs(profile.weight - profile.targetWeight)} lbs to go
          </div>
        </div>

        {/* Weekly Goal */}
        <div className="bg-slate-700/30 rounded-xl p-4">
          <div className="flex items-center gap-2 text-slate-400 mb-2">
            <Target className="w-4 h-4" />
            <span className="text-sm">Weekly Goal</span>
          </div>
          {isEditing ? (
            <input
              type="number"
              value={editedProfile.weeklyGoal}
              onChange={(e) => setEditedProfile({ ...editedProfile, weeklyGoal: parseInt(e.target.value) })}
              className="text-2xl font-bold text-white bg-slate-600 px-2 py-1 rounded w-24 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          ) : (
            <div className="flex items-baseline gap-1">
              <span className="text-2xl font-bold text-white">{profile.weeklyGoal}</span>
              <span className="text-slate-400 text-sm">workouts</span>
            </div>
          )}
        </div>

        {/* Progress to Goal */}
        <div className="bg-slate-700/30 rounded-xl p-4">
          <div className="flex items-center gap-2 text-slate-400 mb-2">
            <TrendingDown className="w-4 h-4" />
            <span className="text-sm">Goal Progress</span>
          </div>
          <div className="flex items-baseline gap-1">
            <span className="text-2xl font-bold text-green-400">
              {Math.min(100, Math.max(0, progressToGoal)).toFixed(0)}%
            </span>
          </div>
          <div className="mt-2 h-1.5 bg-slate-600 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-green-500 to-emerald-400 rounded-full transition-all duration-500"
              style={{ width: `${Math.min(100, Math.max(0, progressToGoal))}%` }}
            />
          </div>
        </div>
      </div>

      {/* Body Measurements */}
      {latestMeasurement && (
        <div className="px-6 pb-6">
          <h4 className="text-sm font-medium text-slate-400 mb-3">Body Measurements</h4>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {latestMeasurement.bodyFat && (
              <div className="bg-slate-700/20 rounded-lg p-3 text-center">
                <span className="text-lg font-bold text-white">{latestMeasurement.bodyFat}%</span>
                <p className="text-xs text-slate-400">Body Fat</p>
              </div>
            )}
            {latestMeasurement.chest && (
              <div className="bg-slate-700/20 rounded-lg p-3 text-center">
                <span className="text-lg font-bold text-white">{latestMeasurement.chest}"</span>
                <p className="text-xs text-slate-400">Chest</p>
              </div>
            )}
            {latestMeasurement.waist && (
              <div className="bg-slate-700/20 rounded-lg p-3 text-center">
                <span className="text-lg font-bold text-white">{latestMeasurement.waist}"</span>
                <p className="text-xs text-slate-400">Waist</p>
              </div>
            )}
            {latestMeasurement.hips && (
              <div className="bg-slate-700/20 rounded-lg p-3 text-center">
                <span className="text-lg font-bold text-white">{latestMeasurement.hips}"</span>
                <p className="text-xs text-slate-400">Hips</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfileSection;
