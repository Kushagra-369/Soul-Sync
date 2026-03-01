// components/dashboard/MoodDashboard.tsx
import  { useState, useEffect } from 'react';
import { APIURL } from '../../GlobalAPIURL';
import {
  BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  AreaChart, Area
} from 'recharts';
import {
  Calendar, TrendingUp, Sun, CloudRain, Zap,
  ChevronLeft, ChevronRight, Loader2, AlertCircle
} from 'lucide-react';
import axios from 'axios';

interface MoodData {
  date: string;
  mood: 'very_bad' | 'bad' | 'average' | 'good' | 'awesome';
  value: number;
}

interface StatsResponse {
  average: number;
  bestDay: string;
  worstDay: string;
  streak: number;
  totalEntries: number;
  distribution: {
    very_bad: number;
    bad: number;
    average: number;
    good: number;
    awesome: number;
  };
}

const MoodDashboard = () => {
  const [timeRange, setTimeRange] = useState<'week' | 'month' | 'quarter'>('week');
  const [currentDate, setCurrentDate] = useState(new Date());
  const [moodData, setMoodData] = useState<MoodData[]>([]);
  const [stats, setStats] = useState<StatsResponse>({
    average: 0,
    bestDay: '',
    worstDay: '',
    streak: 0,
    totalEntries: 0,
    distribution: {
      very_bad: 0,
      bad: 0,
      average: 0,
      good: 0,
      awesome: 0
    }
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Mood mappings
  const moodEmojis = {
    very_bad: '😫',
    bad: '😞',
    average: '😐',
    good: '🙂',
    awesome: '😄'
  };

  const moodColors = {
    very_bad: '#ef4444',
    bad: '#f97316',
    average: '#eab308',
    good: '#22c55e',
    awesome: '#3b82f6'
  };

  const moodValues = {
    very_bad: 1,
    bad: 2,
    average: 3,
    good: 4,
    awesome: 5
  };

  // Fetch data from APIs
  useEffect(() => {
    fetchData();
  }, [timeRange, currentDate]);

  const fetchData = async () => {
    setLoading(true);
    setError(null);

    try {
      // Calculate date range
      const endDate = new Date(currentDate);
      const startDate = new Date(currentDate);

      if (timeRange === 'week') {
        startDate.setDate(startDate.getDate() - 7);
      } else if (timeRange === 'month') {
        startDate.setMonth(startDate.getMonth() - 1);
      } else {
        startDate.setMonth(startDate.getMonth() - 3);
      }

      // Format dates for API
      const formatDate = (date: Date) => {
        return date.toISOString().split('T')[0];
      };

      // Fetch mood data by range
      const rangeResponse = await axios.get(`${APIURL}/range`, {
        params: {
          startDate: formatDate(startDate),
          endDate: formatDate(endDate)
        },
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });

      // Fetch stats
      const statsResponse = await axios.get(`${APIURL}/stats`, {
        params: {
          startDate: formatDate(startDate),
          endDate: formatDate(endDate)
        },
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });

      // Transform range data
      const transformedData = rangeResponse.data.map((item: any) => ({
        date: new Date(item.date).toISOString().split('T')[0],
        mood: item.mood,
        value: moodValues[item.mood as keyof typeof moodValues]
      }));

      setMoodData(transformedData);
      setStats(statsResponse.data);

    } catch (err) {
      console.error('Error fetching mood data:', err);
      setError('Failed to load mood data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Prepare data for charts
  const getChartData = () => {
    return moodData.map(item => ({
      date: new Date(item.date).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric'
      }),
      mood: item.value,
      fullDate: item.date,
      moodName: item.mood
    }));
  };

  const getMoodDistribution = () => {
    return Object.entries(stats.distribution).map(([name, value]) => ({
      name: name.replace('_', ' '),
      value,
      color: moodColors[name as keyof typeof moodColors]
    }));
  };

  const getWeeklyAverage = () => {
    const weeklyData = [];
    for (let i = 0; i < moodData.length; i += 7) {
      const week = moodData.slice(i, i + 7);
      if (week.length > 0) {
        const avg = week.reduce((acc, curr) => acc + curr.value, 0) / week.length;
        weeklyData.push({
          week: `Week ${Math.floor(i / 7) + 1}`,
          average: Number(avg.toFixed(1))
        });
      }
    }
    return weeklyData;
  };

  const navigateDate = (direction: 'prev' | 'next') => {
    const newDate = new Date(currentDate);
    if (timeRange === 'week') {
      newDate.setDate(newDate.getDate() + (direction === 'prev' ? -7 : 7));
    } else if (timeRange === 'month') {
      newDate.setMonth(newDate.getMonth() + (direction === 'prev' ? -1 : 1));
    } else {
      newDate.setMonth(newDate.getMonth() + (direction === 'prev' ? -3 : 3));
    }
    setCurrentDate(newDate);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-blue-500 mx-auto mb-4" />
          <p className="text-gray-600 dark:text-gray-400">Loading your mood data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <p className="text-red-500 dark:text-red-400 mb-4">{error}</p>
          <button
            onClick={fetchData}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  const chartData = getChartData();
  const distributionData = getMoodDistribution();
  const weeklyAverageData = getWeeklyAverage();

  return (
    <div className="p-6 bg-gray-50 dark:bg-gray-900 min-h-screen transition-colors">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-4">
          Mood Tracker Dashboard
        </h1>

        {/* Controls */}
        <div className="flex flex-wrap gap-4 items-center justify-between">
          <div className="flex gap-2 bg-white dark:bg-gray-800 rounded-lg p-1 shadow-sm dark:shadow-gray-700/50">
            {(['week', 'month', 'quarter'] as const).map((range) => (
              <button
                key={range}
                onClick={() => setTimeRange(range)}
                className={`px-4 py-2 rounded-lg capitalize transition-all ${timeRange === range
                    ? 'bg-blue-500 text-white shadow-md'
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                  }`}
              >
                {range}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-4 bg-white dark:bg-gray-800 rounded-lg p-2 shadow-sm dark:shadow-gray-700/50">
            <button
              onClick={() => navigateDate('prev')}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors text-gray-700 dark:text-gray-300"
            >
              <ChevronLeft size={20} />
            </button>
            <span className="font-medium min-w-30 text-center text-gray-700 dark:text-gray-300">
              {timeRange === 'week' && `Week of ${currentDate.toLocaleDateString()}`}
              {timeRange === 'month' && currentDate.toLocaleString('default', { month: 'long', year: 'numeric' })}
              {timeRange === 'quarter' && `Q${Math.floor(currentDate.getMonth() / 3) + 1} ${currentDate.getFullYear()}`}
            </span>
            <button
              onClick={() => navigateDate('next')}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors text-gray-700 dark:text-gray-300"
            >
              <ChevronRight size={20} />
            </button>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm dark:shadow-gray-700/50 hover:shadow-md transition-shadow">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
              <TrendingUp className="text-blue-600 dark:text-blue-400" size={20} />
            </div>
            <span className="text-gray-600 dark:text-gray-400">Average Mood</span>
          </div>
          <div className="text-3xl font-bold text-gray-800 dark:text-white">{stats.average}/5</div>
          <div className="text-sm text-gray-500 dark:text-gray-500 mt-2">
            {stats.average >= 4 ? 'Great!' : stats.average >= 3 ? 'Good' : 'Needs improvement'}
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm dark:shadow-gray-700/50 hover:shadow-md transition-shadow">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-lg">
              <Sun className="text-green-600 dark:text-green-400" size={20} />
            </div>
            <span className="text-gray-600 dark:text-gray-400">Best Day</span>
          </div>
          <div className="text-xl font-bold text-gray-800 dark:text-white">{stats.bestDay || 'N/A'}</div>
          <div className="text-sm text-gray-500 dark:text-gray-500 mt-2">Feeling great!</div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm dark:shadow-gray-700/50 hover:shadow-md transition-shadow">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-3 bg-red-100 dark:bg-red-900/30 rounded-lg">
              <CloudRain className="text-red-600 dark:text-red-400" size={20} />
            </div>
            <span className="text-gray-600 dark:text-gray-400">Worst Day</span>
          </div>
          <div className="text-xl font-bold text-gray-800 dark:text-white">{stats.worstDay || 'N/A'}</div>
          <div className="text-sm text-gray-500 dark:text-gray-500 mt-2">Tough day</div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm dark:shadow-gray-700/50 hover:shadow-md transition-shadow">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-3 bg-yellow-100 dark:bg-yellow-900/30 rounded-lg">
              <Zap className="text-yellow-600 dark:text-yellow-400" size={20} />
            </div>
            <span className="text-gray-600 dark:text-gray-400">Current Streak</span>
          </div>
          <div className="text-3xl font-bold text-gray-800 dark:text-white">{stats.streak} days</div>
          <div className="text-sm text-gray-500 dark:text-gray-500 mt-2">
            {stats.streak > 0 ? 'Keep it up!' : 'Start your streak!'}
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm dark:shadow-gray-700/50 hover:shadow-md transition-shadow">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
              <Calendar className="text-purple-600 dark:text-purple-400" size={20} />
            </div>
            <span className="text-gray-600 dark:text-gray-400">Total Entries</span>
          </div>
          <div className="text-3xl font-bold text-gray-800 dark:text-white">{stats.totalEntries}</div>
          <div className="text-sm text-gray-500 dark:text-gray-500 mt-2">Days tracked</div>
        </div>
      </div>

      {/* Main Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {/* Mood Timeline */}
        <div className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm dark:shadow-gray-700/50">
          <h2 className="text-lg font-semibold mb-4 text-gray-800 dark:text-white">Mood Timeline</h2>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="moodGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.1} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="date" stroke="#6B7280" />
              <YAxis domain={[0, 5]} stroke="#6B7280" />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#1F2937',
                  border: 'none',
                  borderRadius: '0.5rem',
                  color: '#F3F4F6'
                }}
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const data = payload[0].payload;
                    return (
                      <div className="bg-white dark:bg-gray-800 p-3 shadow-lg rounded-lg border dark:border-gray-700">
                        <p className="font-medium dark:text-white">{data.fullDate}</p>
                        <p className="text-lg dark:text-gray-300">
                          {moodEmojis[data.moodName as keyof typeof moodEmojis]} {data.moodName}
                        </p>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Area
                type="monotone"
                dataKey="mood"
                stroke="#3b82f6"
                fill="url(#moodGradient)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Mood Distribution */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm dark:shadow-gray-700/50">
          <h2 className="text-lg font-semibold mb-4 text-gray-800 dark:text-white">Mood Distribution</h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={distributionData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                paddingAngle={2}
                dataKey="value"
              >
                {distributionData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: '#1F2937',
                  border: 'none',
                  borderRadius: '0.5rem',
                  color: '#F3F4F6'
                }}
              />
              <Legend
                formatter={(value) => (
                  <span className="text-gray-700 dark:text-gray-300">{value}</span>
                )}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Secondary Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Weekly Comparison */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm dark:shadow-gray-700/50">
          <h2 className="text-lg font-semibold mb-4 text-gray-800 dark:text-white">Weekly Average Comparison</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={weeklyAverageData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="week" stroke="#6B7280" />
              <YAxis domain={[0, 5]} stroke="#6B7280" />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#1F2937',
                  border: 'none',
                  borderRadius: '0.5rem',
                  color: '#F3F4F6'
                }}
              />
              <Bar dataKey="average" fill="#3b82f6" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Mood Calendar Heatmap */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm dark:shadow-gray-700/50">
          <h2 className="text-lg font-semibold mb-4 text-gray-800 dark:text-white">Mood Calendar</h2>
          <div className="grid grid-cols-7 gap-1">
            {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(day => (
              <div key={day} className="text-center text-xs text-gray-500 dark:text-gray-500 py-2">
                {day}
              </div>
            ))}
            {moodData.slice(-35).map((item, index) => (
              <div
                key={index}
                className="aspect-square rounded-lg flex items-center justify-center text-xs cursor-pointer transition-transform hover:scale-110"
                style={{
                  backgroundColor: moodColors[item.mood] + '40',
                  border: `2px solid ${moodColors[item.mood]}`
                }}
                title={`${item.date}: ${item.mood}`}
              >
                {moodEmojis[item.mood]}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Entries */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm dark:shadow-gray-700/50">
        <h2 className="text-lg font-semibold mb-4 text-gray-800 dark:text-white">Recent Entries</h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b dark:border-gray-700">
                <th className="text-left py-3 px-4 text-gray-600 dark:text-gray-400">Date</th>
                <th className="text-left py-3 px-4 text-gray-600 dark:text-gray-400">Mood</th>
                <th className="text-left py-3 px-4 text-gray-600 dark:text-gray-400">Value</th>
                <th className="text-left py-3 px-4 text-gray-600 dark:text-gray-400">Status</th>
              </tr>
            </thead>
            <tbody>
              {moodData.slice(-7).reverse().map((item, index) => (
                <tr key={index} className="border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50">
                  <td className="py-3 px-4 dark:text-gray-300">{item.date}</td>
                  <td className="py-3 px-4">
                    <span className="flex items-center gap-2 dark:text-gray-300">
                      {moodEmojis[item.mood]} {item.mood.replace('_', ' ')}
                    </span>
                  </td>
                  <td className="py-3 px-4 dark:text-gray-300">{item.value}/5</td>
                  <td className="py-3 px-4">
                    <span
                      className="px-2 py-1 rounded-full text-xs font-medium"
                      style={{
                        backgroundColor: moodColors[item.mood] + '20',
                        color: moodColors[item.mood]
                      }}
                    >
                      {item.value >= 4 ? 'Great' : item.value >= 3 ? 'Good' : 'Needs attention'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default MoodDashboard;