
import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useTypedSelector } from '../hooks/useTypedSelector';
import { setThreads, setTrendingThreads, setUserThreads } from '../store/slices/threadsSlice';
import { mockThreads } from '../services/mockData';
import Layout from '../components/Layout/Layout';
import WelcomeSection from '../components/Home/WelcomeSection';
import ThreadSection from '../components/Home/ThreadSection';
import ActivityStats from '../components/Home/ActivityStats';
import PopularTags from '../components/Home/PopularTags';

const Home: React.FC = () => {
  const dispatch = useDispatch();
  const { threads, trendingThreads, userThreads } = useTypedSelector(state => state.threads);
  const { user } = useTypedSelector(state => state.auth);

  useEffect(() => {
    dispatch(setThreads(mockThreads));
    dispatch(setTrendingThreads(mockThreads.slice(0, 2)));
    dispatch(setUserThreads(mockThreads.filter(t => t.author.id === user?.id)));
  }, [dispatch, user?.id]);

  return (
    <Layout>
      <div className="w-full px-4 sm:px-6 lg:px-8">
        <WelcomeSection userName={user?.name} />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8 w-full">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <ThreadSection
              title="Trending Threads"
              threads={trendingThreads}
              icon="trending"
              delay={0.2}
            />
            
            <ThreadSection
              title="Recent Threads"
              threads={threads}
              icon="recent"
              delay={0.4}
            />
          </div>

          {/* Sidebar */}
          <div className="space-y-4 md:space-y-6">
            <ActivityStats 
              userThreadsCount={userThreads.length} 
              delay={0.3} 
            />
            <PopularTags delay={0.5} />
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Home;
