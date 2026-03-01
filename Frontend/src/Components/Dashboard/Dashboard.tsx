// components/dashboard/MoodDashboard.tsx
import React, { useState, useEffect } from 'react';
import { 
  BarChart, Bar, LineChart, Line, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  AreaChart, Area
} from 'recharts';
import { 
  Calendar, TrendingUp, Smile, Frown, Meh, 
  Sun, Cloud, CloudRain, Zap, ChevronLeft, ChevronRight 
} from 'lucide-react';

interface MoodData {
  date: string;
  mood: 'very_bad' | 'bad' | 'average' | 'good' | 'awesome';
  value: number;
}

const MoodDashboard = () => {
  const [timeRange, setTimeRange] = useState<'week' | 'month' | 'quarter'>('week');
  const [currentDate, setCurrentDate] = useState(new Date());
  const [moodData, setMoodData] = useState<MoodData[]>([]);
  const [stats, setStats] = useState({
    average: 0,
    bestDay: '',
    worstDay: '',
    streak: 0,
    totalEntries: 0
  });

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

  // Generate dummy data (replace with API call)
  useEffect(() => {
    generateDummyData();
  }, [timeRange, currentDate]);

  const generateDummyData = () => {
    const data: MoodData[] = [];
    const days = timeRange === 'week' ? 7 : timeRange === 'month' ? 30 : 90;
    
    for (let i = 0; i < days; i++) {
      const date = new Date(currentDate);
      date.setDate(date.getDate() - (days - i - 1));
      
      const moods: MoodData['mood'][] = 
        ['very_bad', 'bad', 'average', 'good', 'awesome'];
      const randomMood = moods[Math.floor(Math.random() * moods.length)];
      
      data.push({
        date: date.toISOString().split('T')[0],
        mood: randomMood,
        value: moodValues[randomMood]
      });
    }
    
    setMoodData(data);
    calculateStats(data);
  };

  const calculateStats = (data: MoodData[]) => {
    const avg = data.reduce((acc, curr) => acc + curr.value, 0) / data.length;
    
    // Find best and worst days
    let best = { value: 0, date: '' };
    let worst = { value: 5, date: '' };
    
    data.forEach(item => {
      if (item.value > best.value) {
        best = { value: item.value, date: item.date };
      }
      if (item.value < worst.value) {
        worst = { value: item.value, date: item.date };
      }
    });

    // Calculate current streak
    let streak = 0;
    for (let i = data.length - 1; i >= 0; i--) {
      if (data[i].value >= 3) streak++;
      else break;
    }

    setStats({
      average: Number(avg.toFixed(1)),
      bestDay: best.date,
      worstDay: worst.date,
      streak,
      totalEntries: data.length
    });
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
    const distribution = {
      very_bad: 0,
      bad: 0,
      average: 0,
      good: 0,
      awesome: 0
    };

    moodData.forEach(item => {
      distribution[item.mood]++;
    });

    return Object.entries(distribution).map(([name, value]) => ({
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

  const chartData = getChartData();
  const distributionData = getMoodDistribution();
  const weeklyAverageData = getWeeklyAverage();

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-4">
          Mood Tracker Dashboard
        </h1>
        
        {/* Controls */}
        <div className="flex flex-wrap gap-4 items-center justify-between">
          <div className="flex gap-2 bg-white rounded-lg p-1 shadow-sm">
            {(['week', 'month', 'quarter'] as const).map((range) => (
              <button
                key={range}
                onClick={() => setTimeRange(range)}
                className={`px-4 py-2 rounded-lg capitalize transition-all ${
                  timeRange === range
                    ? 'bg-blue-500 text-white shadow-md'
                    : 'hover:bg-gray-100'
                }`}
              >
                {range}
              </button>
            ))}
          </div>
          
          <div className="flex items-center gap-4 bg-white rounded-lg p-2 shadow-sm">
            <button
              onClick={() => navigateDate('prev')}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ChevronLeft size={20} />
            </button>
            <span className="font-medium min-w-[120px] text-center">
              {timeRange === 'week' && `Week of ${currentDate.toLocaleDateString()}`}
              {timeRange === 'month' && currentDate.toLocaleString('default', { month: 'long', year: 'numeric' })}
              {timeRange === 'quarter' && `Q${Math.floor(currentDate.getMonth() / 3) + 1} ${currentDate.getFullYear()}`}
            </span>
            <button
              onClick={() => navigateDate('next')}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ChevronRight size={20} />
            </button>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
        <div className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-3 bg-blue-100 rounded-lg">
              <TrendingUp className="text-blue-600" size={20} />
            </div>
            <span className="text-gray-600">Average Mood</span>
          </div>
          <div className="text-3xl font-bold">{stats.average}/5</div>
          <div className="text-sm text-gray-500 mt-2">
            {stats.average >= 4 ? 'Great!' : stats.average >= 3 ? 'Good' : 'Needs improvement'}
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-3 bg-green-100 rounded-lg">
              <Sun className="text-green-600" size={20} />
            </div>
            <span className="text-gray-600">Best Day</span>
          </div>
          <div className="text-xl font-bold">{stats.bestDay || 'N/A'}</div>
          <div className="text-sm text-gray-500 mt-2">Feeling great!</div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-3 bg-red-100 rounded-lg">
              <CloudRain className="text-red-600" size={20} />
            </div>
            <span className="text-gray-600">Worst Day</span>
          </div>
          <div className="text-xl font-bold">{stats.worstDay || 'N/A'}</div>
          <div className="text-sm text-gray-500 mt-2">Tough day</div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-3 bg-yellow-100 rounded-lg">
              <Zap className="text-yellow-600" size={20} />
            </div>
            <span className="text-gray-600">Current Streak</span>
          </div>
          <div className="text-3xl font-bold">{stats.streak} days</div>
          <div className="text-sm text-gray-500 mt-2">
            {stats.streak > 0 ? 'Keep it up!' : 'Start your streak!'}
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-3 bg-purple-100 rounded-lg">
              <Calendar className="text-purple-600" size={20} />
            </div>
            <span className="text-gray-600">Total Entries</span>
          </div>
          <div className="text-3xl font-bold">{stats.totalEntries}</div>
          <div className="text-sm text-gray-500 mt-2">Days tracked</div>
        </div>
      </div>

      {/* Main Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {/* Mood Timeline */}
        <div className="lg:col-span-2 bg-white rounded-xl p-6 shadow-sm">
          <h2 className="text-lg font-semibold mb-4">Mood Timeline</h2>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="moodGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.1}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis domain={[0, 5]} />
              <Tooltip 
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const data = payload[0].payload;
                    return (
                      <div className="bg-white p-3 shadow-lg rounded-lg border">
                        <p className="font-medium">{data.fullDate}</p>
                        <p className="text-lg">
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
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <h2 className="text-lg font-semibold mb-4">Mood Distribution</h2>
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
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Secondary Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Weekly Comparison */}
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <h2 className="text-lg font-semibold mb-4">Weekly Average Comparison</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={weeklyAverageData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="week" />
              <YAxis domain={[0, 5]} />
              <Tooltip />
              <Bar dataKey="average" fill="#3b82f6" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Mood Calendar Heatmap */}
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <h2 className="text-lg font-semibold mb-4">Mood Calendar</h2>
          <div className="grid grid-cols-7 gap-1">
            {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(day => (
              <div key={day} className="text-center text-xs text-gray-500 py-2">
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
      <div className="bg-white rounded-xl p-6 shadow-sm">
        <h2 className="text-lg font-semibold mb-4">Recent Entries</h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left py-3 px-4">Date</th>
                <th className="text-left py-3 px-4">Mood</th>
                <th className="text-left py-3 px-4">Value</th>
                <th className="text-left py-3 px-4">Status</th>
              </tr>
            </thead>
            <tbody>
              {moodData.slice(-7).reverse().map((item, index) => (
                <tr key={index} className="border-b hover:bg-gray-50">
                  <td className="py-3 px-4">{item.date}</td>
                  <td className="py-3 px-4">
                    <span className="flex items-center gap-2">
                      {moodEmojis[item.mood]} {item.mood.replace('_', ' ')}
                    </span>
                  </td>
                  <td className="py-3 px-4">{item.value}/5</td>
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