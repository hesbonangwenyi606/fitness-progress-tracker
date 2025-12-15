import React, { useState, useMemo } from 'react';
import { 
  Activity, 
  Plus, 
  Filter, 
  Calendar,
  ChevronDown,
  Search,
  LayoutDashboard,
  History,
  Trophy,
  User,
  BarChart3,
  Menu,
  X,
  Award,
  LogOut,
  Loader2,
  Cloud,
  CloudOff
} from 'lucide-react';
import { Workout, WorkoutType, UserProfile } from '@/types/fitness';
import { 
  workoutCategories, 
  initialWorkouts, 
  initialUserStats, 
  weeklyData,
  initialUserProfile,
  monthlyProgress
} from '@/data/fitnessData';
import StatCard from './fitness/StatCard';
import WorkoutCategoryCard from './fitness/WorkoutCategoryCard';
import WorkoutHistoryCard from './fitness/WorkoutHistoryCard';
import ProgressChart from './fitness/ProgressChart';
import CircularProgress from './fitness/CircularProgress';
import PersonalRecordCard from './fitness/PersonalRecordCard';
import AddWorkoutModal from './fitness/AddWorkoutModal';
import ProfileSection from './fitness/ProfileSection';
import WeightProgressChart from './fitness/WeightProgressChart';
import AchievementBadge, { achievements } from './fitness/AchievementBadge';
import AuthModal from './fitness/AuthModal';
import { useAuth } from '@/hooks/useAuth';
import { useFitnessData } from '@/hooks/useFitnessData';

type TabType = 'dashboard' | 'history' | 'progress' | 'profile';

const AppLayout: React.FC = () => {
  const { user, loading: authLoading, signIn, signUp, signOut } = useAuth();
  const { 
    workouts: dbWorkouts, 
    userProfile: dbProfile, 
    userStats: dbStats,
    personalRecords,
    loading: dataLoading,
    addWorkout,
    deleteWorkout,
    updateProfile
  } = useFitnessData({ userId: user?.id });

  const [activeTab, setActiveTab] = useState<TabType>('dashboard');
  const [localWorkouts, setLocalWorkouts] = useState<Workout[]>(initialWorkouts);
  const [localUserStats, setLocalUserStats] = useState(initialUserStats);
  const [localUserProfile, setLocalUserProfile] = useState<UserProfile>(initialUserProfile);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [filterType, setFilterType] = useState<WorkoutType | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

  const heroImage = 'https://d64gsuwffb70l.cloudfront.net/693ff08f4422210386ffdfea_1765798126787_1e653b3a.jpg';

  // Use database data if logged in, otherwise use local data
  const workouts = user ? dbWorkouts : localWorkouts;
  const userStats = user ? dbStats : localUserStats;
  const userProfile = user && dbProfile ? dbProfile : localUserProfile;

  const filteredWorkouts = useMemo(() => {
    return workouts.filter(workout => {
      const matchesType = filterType === 'all' || workout.type === filterType;
      const matchesSearch = workout.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        workout.type.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesType && matchesSearch;
    });
  }, [workouts, filterType, searchQuery]);

  const handleAddWorkout = async (newWorkout: Omit<Workout, 'id'>) => {
    if (user) {
      // Save to database
      await addWorkout(newWorkout);
    } else {
      // Save locally
      const workout: Workout = {
        ...newWorkout,
        id: `workout-${Date.now()}`
      };
      setLocalWorkouts([workout, ...localWorkouts]);
      setLocalUserStats({
        ...localUserStats,
        totalWorkouts: localUserStats.totalWorkouts + 1,
        totalCalories: localUserStats.totalCalories + workout.calories,
        totalMinutes: localUserStats.totalMinutes + workout.duration,
        currentStreak: localUserStats.currentStreak + 1
      });
    }
  };

  const handleDeleteWorkout = async (id: string) => {
    if (user) {
      await deleteWorkout(id);
    } else {
      const workout = localWorkouts.find(w => w.id === id);
      if (workout) {
        setLocalWorkouts(localWorkouts.filter(w => w.id !== id));
        setLocalUserStats({
          ...localUserStats,
          totalWorkouts: localUserStats.totalWorkouts - 1,
          totalCalories: localUserStats.totalCalories - workout.calories,
          totalMinutes: localUserStats.totalMinutes - workout.duration
        });
      }
    }
  };

  const handleUpdateProfile = async (profile: UserProfile) => {
    if (user) {
      await updateProfile(profile);
    } else {
      setLocalUserProfile(profile);
    }
  };

  const handleSignOut = async () => {
    await signOut();
    setShowUserMenu(false);
  };

  const tabs = [
    { id: 'dashboard' as TabType, label: 'Dashboard', icon: LayoutDashboard },
    { id: 'history' as TabType, label: 'History', icon: History },
    { id: 'progress' as TabType, label: 'Progress', icon: BarChart3 },
    { id: 'profile' as TabType, label: 'Profile', icon: User }
  ];

  if (authLoading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-12 h-12 text-indigo-500 animate-spin" />
          <p className="text-slate-400">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-slate-900/80 backdrop-blur-xl border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center">
                <Activity className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl font-bold text-white hidden sm:block">FitTrack</span>
              
              {/* Sync Status */}
              {user && (
                <div className="hidden sm:flex items-center gap-1.5 ml-2 px-2 py-1 rounded-full bg-green-500/10 text-green-400 text-xs">
                  <Cloud className="w-3 h-3" />
                  <span>Synced</span>
                </div>
              )}
              {!user && (
                <div className="hidden sm:flex items-center gap-1.5 ml-2 px-2 py-1 rounded-full bg-slate-700/50 text-slate-400 text-xs">
                  <CloudOff className="w-3 h-3" />
                  <span>Local</span>
                </div>
              )}
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-1">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${
                    activeTab === tab.id
                      ? 'bg-indigo-500/20 text-indigo-400'
                      : 'text-slate-400 hover:text-white hover:bg-slate-800'
                  }`}
                >
                  <tab.icon className="w-4 h-4" />
                  {tab.label}
                </button>
              ))}
            </nav>

            {/* Actions */}
            <div className="flex items-center gap-3">
              <button
                onClick={() => setIsAddModalOpen(true)}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-medium hover:from-indigo-600 hover:to-purple-600 transition-all shadow-lg shadow-indigo-500/25"
              >
                <Plus className="w-5 h-5" />
                <span className="hidden sm:inline">Log Workout</span>
              </button>

              {/* User Menu */}
              {user ? (
                <div className="relative">
                  <button
                    onClick={() => setShowUserMenu(!showUserMenu)}
                    className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-slate-800 transition-colors"
                  >
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center">
                      <User className="w-4 h-4 text-white" />
                    </div>
                    <ChevronDown className="w-4 h-4 text-slate-400 hidden sm:block" />
                  </button>

                  {showUserMenu && (
                    <div className="absolute right-0 mt-2 w-56 bg-slate-800 border border-slate-700 rounded-xl shadow-xl overflow-hidden">
                      <div className="px-4 py-3 border-b border-slate-700">
                        <p className="text-sm text-white font-medium truncate">{user.email}</p>
                        <p className="text-xs text-slate-400">Signed in</p>
                      </div>
                      <button
                        onClick={handleSignOut}
                        className="w-full flex items-center gap-2 px-4 py-3 text-left text-slate-300 hover:bg-slate-700 transition-colors"
                      >
                        <LogOut className="w-4 h-4" />
                        Sign Out
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <button
                  onClick={() => setIsAuthModalOpen(true)}
                  className="px-4 py-2 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800 transition-colors font-medium"
                >
                  Sign In
                </button>
              )}
              
              {/* Mobile Menu Button */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden p-2 rounded-lg hover:bg-slate-800 text-slate-400"
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>

          {/* Mobile Navigation */}
          {mobileMenuOpen && (
            <nav className="md:hidden py-4 border-t border-slate-800">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => {
                    setActiveTab(tab.id);
                    setMobileMenuOpen(false);
                  }}
                  className={`flex items-center gap-3 w-full px-4 py-3 rounded-lg font-medium transition-all ${
                    activeTab === tab.id
                      ? 'bg-indigo-500/20 text-indigo-400'
                      : 'text-slate-400 hover:text-white hover:bg-slate-800'
                  }`}
                >
                  <tab.icon className="w-5 h-5" />
                  {tab.label}
                </button>
              ))}
            </nav>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Loading State */}
        {user && dataLoading && (
          <div className="flex items-center justify-center py-12">
            <div className="flex flex-col items-center gap-4">
              <Loader2 className="w-8 h-8 text-indigo-500 animate-spin" />
              <p className="text-slate-400">Loading your fitness data...</p>
            </div>
          </div>
        )}

        {/* Dashboard Tab */}
        {activeTab === 'dashboard' && (!user || !dataLoading) && (
          <div className="space-y-8">
            {/* Hero Section */}
            <section className="relative rounded-3xl overflow-hidden">
              <div className="absolute inset-0">
                <img 
                  src={heroImage} 
                  alt="Fitness Hero"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-slate-900 via-slate-900/80 to-transparent" />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent" />
              </div>
              
              <div className="relative px-8 py-12 md:py-16">
                <div className="max-w-xl">
                  <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
                    {user ? `Welcome back, ${userProfile?.name?.split(' ')[0] || 'Champion'}!` : 'Track Your'}
                    <span className="block bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
                      {user ? 'Keep crushing it!' : 'Fitness Journey'}
                    </span>
                  </h1>
                  <p className="text-slate-300 text-lg mb-6">
                    {user 
                      ? 'Your data is synced across all devices. Log your workouts and track your progress.'
                      : 'Sign in to sync your data across devices and never lose your progress.'}
                  </p>
                  <div className="flex flex-wrap gap-4">
                    <button 
                      onClick={() => setIsAddModalOpen(true)}
                      className="px-6 py-3 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-semibold hover:from-indigo-600 hover:to-purple-600 transition-all shadow-lg shadow-indigo-500/25"
                    >
                      Start Workout
                    </button>
                    {!user && (
                      <button 
                        onClick={() => setIsAuthModalOpen(true)}
                        className="px-6 py-3 rounded-xl bg-white/10 backdrop-blur-sm text-white font-semibold hover:bg-white/20 transition-all border border-white/20"
                      >
                        Sign In to Sync
                      </button>
                    )}
                    {user && (
                      <button 
                        onClick={() => setActiveTab('progress')}
                        className="px-6 py-3 rounded-xl bg-white/10 backdrop-blur-sm text-white font-semibold hover:bg-white/20 transition-all border border-white/20"
                      >
                        View Progress
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </section>

            {/* Stats Grid */}
            <section>
              <h2 className="text-xl font-bold text-white mb-4">Your Stats</h2>
              <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
                <StatCard 
                  title="Total Workouts" 
                  value={userStats.totalWorkouts} 
                  icon="activity" 
                  color="#6366F1" 
                />
                <StatCard 
                  title="Calories Burned" 
                  value={userStats.totalCalories} 
                  unit="kcal"
                  icon="flame" 
                  color="#F97316" 
                />
                <StatCard 
                  title="Active Minutes" 
                  value={userStats.totalMinutes} 
                  unit="min"
                  icon="clock" 
                  color="#10B981" 
                />
                <StatCard 
                  title="Current Streak" 
                  value={userStats.currentStreak} 
                  unit="days"
                  icon="zap" 
                  color="#EF4444" 
                />
                <StatCard 
                  title="Weekly Goal" 
                  value={userStats.weeklyGoalProgress} 
                  unit="%"
                  icon="target" 
                  color="#8B5CF6" 
                  progress={userStats.weeklyGoalProgress}
                />
                <StatCard 
                  title="Personal Records" 
                  value={userStats.personalRecords.length} 
                  icon="trophy" 
                  color="#F59E0B" 
                />
              </div>
            </section>

            {/* Workout Categories */}
            <section>
              <h2 className="text-xl font-bold text-white mb-4">Quick Start</h2>
              <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
                {workoutCategories.map((category) => (
                  <WorkoutCategoryCard
                    key={category.id}
                    category={category}
                    onClick={() => setIsAddModalOpen(true)}
                  />
                ))}
              </div>
            </section>

            {/* Recent Workouts & Charts */}
            <div className="grid lg:grid-cols-2 gap-6">
              {/* Recent Workouts */}
              <section>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-bold text-white">Recent Workouts</h2>
                  <button 
                    onClick={() => setActiveTab('history')}
                    className="text-indigo-400 hover:text-indigo-300 text-sm font-medium"
                  >
                    View All
                  </button>
                </div>
                <div className="space-y-3">
                  {workouts.length > 0 ? (
                    workouts.slice(0, 5).map((workout) => (
                      <WorkoutHistoryCard 
                        key={workout.id} 
                        workout={workout}
                        onDelete={handleDeleteWorkout}
                      />
                    ))
                  ) : (
                    <div className="text-center py-8 bg-slate-800/30 rounded-xl border border-slate-700/50">
                      <Calendar className="w-10 h-10 text-slate-600 mx-auto mb-3" />
                      <p className="text-slate-400">No workouts yet</p>
                      <button
                        onClick={() => setIsAddModalOpen(true)}
                        className="mt-3 text-indigo-400 hover:text-indigo-300 text-sm font-medium"
                      >
                        Log your first workout
                      </button>
                    </div>
                  )}
                </div>
              </section>

              {/* Weekly Charts */}
              <section className="space-y-4">
                <ProgressChart 
                  data={weeklyData} 
                  type="bar" 
                  dataKey="calories" 
                  color="#F97316" 
                  title="Calories This Week"
                />
                <ProgressChart 
                  data={weeklyData} 
                  type="line" 
                  dataKey="minutes" 
                  color="#6366F1" 
                  title="Active Minutes"
                />
              </section>
            </div>

            {/* Monthly Goals */}
            <section>
              <h2 className="text-xl font-bold text-white mb-4">Monthly Goals</h2>
              <div className="bg-slate-800/50 backdrop-blur-xl rounded-2xl p-6 border border-slate-700/50">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-8 justify-items-center">
                  <CircularProgress 
                    value={userStats.totalWorkouts} 
                    max={50} 
                    color="#6366F1" 
                    label="Workouts"
                    unit="sessions"
                  />
                  <CircularProgress 
                    value={userStats.totalCalories} 
                    max={20000} 
                    color="#F97316" 
                    label="Calories"
                    unit="kcal"
                  />
                  <CircularProgress 
                    value={userStats.totalMinutes} 
                    max={3000} 
                    color="#10B981" 
                    label="Active Time"
                    unit="min"
                  />
                  <CircularProgress 
                    value={userStats.currentStreak} 
                    max={30} 
                    color="#8B5CF6" 
                    label="Streak"
                    unit="days"
                  />
                </div>
              </div>
            </section>
          </div>
        )}

        {/* History Tab */}
        {activeTab === 'history' && (!user || !dataLoading) && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <h2 className="text-2xl font-bold text-white">Workout History</h2>
              
              {/* Filters */}
              <div className="flex items-center gap-3">
                {/* Search */}
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Search workouts..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 pr-4 py-2 bg-slate-800 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 w-full sm:w-64"
                  />
                </div>

                {/* Filter Dropdown */}
                <div className="relative">
                  <button
                    onClick={() => setShowFilterDropdown(!showFilterDropdown)}
                    className="flex items-center gap-2 px-4 py-2 bg-slate-800 border border-slate-700 rounded-xl text-slate-300 hover:text-white hover:border-slate-600 transition-colors"
                  >
                    <Filter className="w-4 h-4" />
                    <span className="hidden sm:inline">
                      {filterType === 'all' ? 'All Types' : filterType.charAt(0).toUpperCase() + filterType.slice(1)}
                    </span>
                    <ChevronDown className="w-4 h-4" />
                  </button>

                  {showFilterDropdown && (
                    <div className="absolute right-0 mt-2 w-48 bg-slate-800 border border-slate-700 rounded-xl shadow-xl z-10 overflow-hidden">
                      <button
                        onClick={() => {
                          setFilterType('all');
                          setShowFilterDropdown(false);
                        }}
                        className={`w-full px-4 py-2 text-left hover:bg-slate-700 transition-colors ${
                          filterType === 'all' ? 'text-indigo-400' : 'text-slate-300'
                        }`}
                      >
                        All Types
                      </button>
                      {workoutCategories.map((category) => (
                        <button
                          key={category.id}
                          onClick={() => {
                            setFilterType(category.id);
                            setShowFilterDropdown(false);
                          }}
                          className={`w-full px-4 py-2 text-left hover:bg-slate-700 transition-colors ${
                            filterType === category.id ? 'text-indigo-400' : 'text-slate-300'
                          }`}
                        >
                          {category.name}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Results Count */}
            <p className="text-slate-400 text-sm">
              Showing {filteredWorkouts.length} of {workouts.length} workouts
            </p>

            {/* Workout List */}
            <div className="space-y-3">
              {filteredWorkouts.length > 0 ? (
                filteredWorkouts.map((workout) => (
                  <WorkoutHistoryCard 
                    key={workout.id} 
                    workout={workout}
                    onDelete={handleDeleteWorkout}
                  />
                ))
              ) : (
                <div className="text-center py-12">
                  <Calendar className="w-12 h-12 text-slate-600 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-slate-400">No workouts found</h3>
                  <p className="text-slate-500 text-sm mt-1">
                    {searchQuery || filterType !== 'all' 
                      ? 'Try adjusting your filters' 
                      : 'Start logging your workouts!'}
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Progress Tab */}
        {activeTab === 'progress' && (!user || !dataLoading) && (
          <div className="space-y-8">
            <h2 className="text-2xl font-bold text-white">Progress & Analytics</h2>

            {/* Weight Progress */}
            <WeightProgressChart 
              data={monthlyProgress} 
              targetWeight={userProfile?.targetWeight || 165} 
            />

            {/* Charts Grid */}
            <div className="grid md:grid-cols-2 gap-6">
              <ProgressChart 
                data={weeklyData} 
                type="bar" 
                dataKey="workouts" 
                color="#6366F1" 
                title="Workouts Per Day"
              />
              <ProgressChart 
                data={weeklyData} 
                type="bar" 
                dataKey="calories" 
                color="#F97316" 
                title="Calories Burned"
              />
            </div>

            {/* Personal Records */}
            <section>
              <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                <Trophy className="w-5 h-5 text-yellow-400" />
                Personal Records
              </h3>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
                {userStats.personalRecords.length > 0 ? (
                  userStats.personalRecords.map((record, index) => (
                    <PersonalRecordCard 
                      key={record.id} 
                      record={record} 
                      rank={index + 1} 
                    />
                  ))
                ) : (
                  <div className="col-span-full text-center py-8 bg-slate-800/30 rounded-xl border border-slate-700/50">
                    <Trophy className="w-10 h-10 text-slate-600 mx-auto mb-3" />
                    <p className="text-slate-400">No personal records yet</p>
                    <p className="text-slate-500 text-sm mt-1">Keep working out to set new records!</p>
                  </div>
                )}
              </div>
            </section>

            {/* Achievements */}
            <section>
              <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                <Award className="w-5 h-5 text-purple-400" />
                Achievements
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
                {achievements.map((achievement) => (
                  <AchievementBadge key={achievement.id} achievement={achievement} />
                ))}
              </div>
            </section>
          </div>
        )}

        {/* Profile Tab */}
        {activeTab === 'profile' && (!user || !dataLoading) && (
          <div className="space-y-8">
            <h2 className="text-2xl font-bold text-white">Your Profile</h2>
            
            {!user && (
              <div className="bg-indigo-500/10 border border-indigo-500/20 rounded-xl p-6 text-center">
                <User className="w-12 h-12 text-indigo-400 mx-auto mb-3" />
                <h3 className="text-lg font-semibold text-white mb-2">Sign in to save your profile</h3>
                <p className="text-slate-400 text-sm mb-4">
                  Create an account to sync your profile, workouts, and progress across all your devices.
                </p>
                <button
                  onClick={() => setIsAuthModalOpen(true)}
                  className="px-6 py-2 rounded-xl bg-indigo-500 text-white font-medium hover:bg-indigo-600 transition-colors"
                >
                  Sign In or Sign Up
                </button>
              </div>
            )}
            
            <ProfileSection 
              profile={userProfile || initialUserProfile} 
              onUpdateProfile={handleUpdateProfile} 
            />

            {/* Achievements Section */}
            <section>
              <h3 className="text-xl font-bold text-white mb-4">Your Achievements</h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {achievements.filter(a => a.unlocked).map((achievement) => (
                  <AchievementBadge key={achievement.id} achievement={achievement} />
                ))}
              </div>
            </section>

            {/* Activity Summary */}
            <section className="bg-slate-800/50 backdrop-blur-xl rounded-2xl p-6 border border-slate-700/50">
              <h3 className="text-lg font-semibold text-white mb-4">Activity Summary</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center">
                  <span className="text-3xl font-bold text-indigo-400">{userStats.totalWorkouts}</span>
                  <p className="text-slate-400 text-sm">Total Workouts</p>
                </div>
                <div className="text-center">
                  <span className="text-3xl font-bold text-orange-400">{(userStats.totalCalories / 1000).toFixed(1)}k</span>
                  <p className="text-slate-400 text-sm">Calories Burned</p>
                </div>
                <div className="text-center">
                  <span className="text-3xl font-bold text-green-400">{Math.round(userStats.totalMinutes / 60)}h</span>
                  <p className="text-slate-400 text-sm">Hours Active</p>
                </div>
                <div className="text-center">
                  <span className="text-3xl font-bold text-purple-400">{userStats.currentStreak}</span>
                  <p className="text-slate-400 text-sm">Day Streak</p>
                </div>
              </div>
            </section>
          </div>
        )}
      </main>

      {/* Add Workout Modal */}
      <AddWorkoutModal 
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAdd={handleAddWorkout}
      />

      {/* Auth Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onSignIn={signIn}
        onSignUp={signUp}
      />

      {/* Footer */}
      <footer className="border-t border-slate-800 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center">
                <Activity className="w-4 h-4 text-white" />
              </div>
              <span className="text-slate-400">FitTrack - Your Personal Fitness Companion</span>
            </div>
            <div className="flex items-center gap-6 text-sm text-slate-500">
              <button className="hover:text-slate-300 transition-colors">Privacy</button>
              <button className="hover:text-slate-300 transition-colors">Terms</button>
              <button className="hover:text-slate-300 transition-colors">Support</button>
            </div>
          </div>
        </div>
      </footer>

      {/* Click outside to close dropdowns */}
      {(showFilterDropdown || showUserMenu) && (
        <div 
          className="fixed inset-0 z-30" 
          onClick={() => {
            setShowFilterDropdown(false);
            setShowUserMenu(false);
          }}
        />
      )}
    </div>
  );
};

export default AppLayout;
