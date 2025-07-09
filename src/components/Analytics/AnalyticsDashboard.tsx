
import React from 'react';
import { motion } from 'framer-motion';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  Area,
  AreaChart
} from 'recharts';
import { TrendingUp, Users, Eye, MessageSquare } from 'lucide-react';

interface AnalyticsData {
  threadViews: Array<{ date: string; views: number; interactions: number }>;
  topTags: Array<{ tag: string; count: number; growth: number }>;
  userEngagement: Array<{ name: string; value: number }>;
  monthlyStats: {
    totalThreads: number;
    totalViews: number;
    totalUsers: number;
    totalCollaborations: number;
  };
}

const mockAnalyticsData: AnalyticsData = {
  threadViews: [
    { date: '2024-01', views: 1200, interactions: 89 },
    { date: '2024-02', views: 1800, interactions: 142 },
    { date: '2024-03', views: 2400, interactions: 198 },
    { date: '2024-04', views: 3200, interactions: 267 },
    { date: '2024-05', views: 2800, interactions: 223 },
    { date: '2024-06', views: 3600, interactions: 312 },
  ],
  topTags: [
    { tag: 'React', count: 45, growth: 12 },
    { tag: 'AI', count: 38, growth: 25 },
    { tag: 'JavaScript', count: 32, growth: 8 },
    { tag: 'Python', count: 28, growth: 15 },
    { tag: 'Machine Learning', count: 22, growth: 32 }
  ],
  userEngagement: [
    { name: 'Active Users', value: 65 },
    { name: 'Casual Users', value: 25 },
    { name: 'New Users', value: 10 }
  ],
  monthlyStats: {
    totalThreads: 324,
    totalViews: 15600,
    totalUsers: 1250,
    totalCollaborations: 847
  }
};

const COLORS = ['#3B82F6', '#8B5CF6', '#10B981', '#F59E0B', '#EF4444'];

const AnalyticsDashboard: React.FC = () => {
  const data = mockAnalyticsData;

  const StatCard: React.FC<{
    title: string;
    value: string | number;
    icon: React.ReactNode;
    trend?: number;
  }> = ({ title, value, icon, trend }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white dark:bg-gray-800 rounded-lg p-4 md:p-6 border border-gray-200 dark:border-gray-700 shadow-sm"
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-600 dark:text-gray-400">{title}</p>
          <p className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white mt-1">
            {typeof value === 'number' ? value.toLocaleString() : value}
          </p>
          {trend && (
            <p className={`text-sm mt-1 ${trend > 0 ? 'text-green-600' : 'text-red-600'}`}>
              {trend > 0 ? '+' : ''}{trend}% from last month
            </p>
          )}
        </div>
        <div className="text-blue-500">{icon}</div>
      </div>
    </motion.div>
  );

  return (
    <div className="space-y-6 md:space-y-8">
      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        <StatCard
          title="Total Threads"
          value={data.monthlyStats.totalThreads}
          icon={<MessageSquare className="h-6 w-6 md:h-8 md:w-8" />}
          trend={15}
        />
        <StatCard
          title="Total Views"
          value={data.monthlyStats.totalViews}
          icon={<Eye className="h-6 w-6 md:h-8 md:w-8" />}
          trend={23}
        />
        <StatCard
          title="Active Users"
          value={data.monthlyStats.totalUsers}
          icon={<Users className="h-6 w-6 md:h-8 md:w-8" />}
          trend={8}
        />
        <StatCard
          title="Collaborations"
          value={data.monthlyStats.totalCollaborations}
          icon={<TrendingUp className="h-6 w-6 md:h-8 md:w-8" />}
          trend={31}
        />
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
        {/* Thread Views Over Time */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white dark:bg-gray-800 rounded-lg p-4 md:p-6 border border-gray-200 dark:border-gray-700"
        >
          <h3 className="text-base md:text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Thread Views & Interactions
          </h3>
          <ResponsiveContainer width="100%" height={250}>
            <AreaChart data={data.threadViews}>
              <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
              <XAxis dataKey="date" className="text-xs" />
              <YAxis className="text-xs" />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'rgba(255, 255, 255, 0.95)',
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px'
                }}
              />
              <Area
                type="monotone"
                dataKey="views"
                stackId="1"
                stroke="#3B82F6"
                fill="#3B82F6"
                fillOpacity={0.6}
              />
              <Area
                type="monotone"
                dataKey="interactions"
                stackId="1"
                stroke="#8B5CF6"
                fill="#8B5CF6"
                fillOpacity={0.6}
              />
            </AreaChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Top Tags */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white dark:bg-gray-800 rounded-lg p-4 md:p-6 border border-gray-200 dark:border-gray-700"
        >
          <h3 className="text-base md:text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Top Tags Performance
          </h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={data.topTags} layout="horizontal">
              <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
              <XAxis type="number" className="text-xs" />
              <YAxis dataKey="tag" type="category" width={80} className="text-xs" />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'rgba(255, 255, 255, 0.95)',
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px'
                }}
              />
              <Bar dataKey="count" fill="#10B981" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>

        {/* User Engagement Pie Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white dark:bg-gray-800 rounded-lg p-4 md:p-6 border border-gray-200 dark:border-gray-700"
        >
          <h3 className="text-base md:text-lg font-semibold text-gray-900 dark:text-white mb-4">
            User Engagement Distribution
          </h3>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={data.userEngagement}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {data.userEngagement.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Growth Trends */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-white dark:bg-gray-800 rounded-lg p-4 md:p-6 border border-gray-200 dark:border-gray-700"
        >
          <h3 className="text-base md:text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Tag Growth Trends
          </h3>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={data.topTags}>
              <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
              <XAxis dataKey="tag" className="text-xs" />
              <YAxis className="text-xs" />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'rgba(255, 255, 255, 0.95)',
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px'
                }}
              />
              <Line
                type="monotone"
                dataKey="growth"
                stroke="#F59E0B"
                strokeWidth={3}
                dot={{ fill: '#F59E0B', strokeWidth: 2, r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </motion.div>
      </div>
    </div>
  );
};

export default AnalyticsDashboard;
