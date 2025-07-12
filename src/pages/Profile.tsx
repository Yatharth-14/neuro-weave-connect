
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useTypedSelector } from '../hooks/useTypedSelector';
import Layout from '../components/Layout/Layout';
import ProfileHeader from '../components/Profile/ProfileHeader';
import ProfileTabs from '../components/Profile/ProfileTabs';
import ActivityStats from '../components/Home/ActivityStats';
import AnalyticsDashboard from '../components/Analytics/AnalyticsDashboard';
import AIAnalysis from '../components/AI/AIAnalysis';

const Profile: React.FC = () => {
  const { user } = useTypedSelector(state => state.auth);
  const { userThreads } = useTypedSelector(state => state.threads);
  const [activeTab, setActiveTab] = useState<'profile' | 'analytics' | 'ai'>('profile');

  if (!user) return null;

  const renderTabContent = () => {
    switch (activeTab) {
      case 'profile':
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
            <div className="space-y-4 md:space-y-6">
              <ActivityStats userThreadsCount={userThreads.length} />
            </div>
          </div>
        );
      case 'analytics':
        return <AnalyticsDashboard />;
      case 'ai':
        return (
          <AIAnalysis
            content="Sample content for AI analysis demonstration."
            onSummaryGenerated={(summary) => console.log('Generated summary:', summary)}
          />
        );
      default:
        return null;
    }
  };

  return (
    <Layout>
      <div className="w-full px-4 sm:px-6 lg:px-8">
        <ProfileHeader user={user} />
        <ProfileTabs activeTab={activeTab} onTabChange={setActiveTab} />
        
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          {renderTabContent()}
        </motion.div>
      </div>
    </Layout>
  );
};

export default Profile;
