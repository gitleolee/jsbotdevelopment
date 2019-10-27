import React, { memo, useEffect, useMemo, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import MainFeeds from './MainFeeds';
import ChatFeeds from './ChatFeeds';
import { defaultChatSubject } from 'constants/defaultValues';
import ErrorBoundary from 'components/Wrappers/ErrorBoundary';
import { container } from './Styles';
import FilterBar from 'components/FilterBar';
import request from 'axios';
import { socket } from 'constants/io';
import { css } from 'emotion';
import { useMyState } from 'helpers/hooks';
import { useAppContext, useNotiContext } from 'contexts';
import URL from 'constants/URL';

const API_URL = `${URL}/user`;

Notification.propTypes = {
  children: PropTypes.oneOfType([PropTypes.object, PropTypes.bool]),
  className: PropTypes.string,
  location: PropTypes.string,
  style: PropTypes.object
};

function Notification({ children, className, location, style }) {
  const {
    requestHelpers: { auth, fetchNotifications }
  } = useAppContext();
  const { userId, twinkleXP } = useMyState();
  const {
    state: {
      loadMore,
      notifications,
      numNewNotis,
      rewards,
      totalRewardAmount,
      currentChatSubject,
      currentChatSubject: { content = defaultChatSubject, loaded, ...subject }
    },
    actions: { onFetchNotifications, onGetRanks, onClearNotifications }
  } = useNotiContext();
  const [activeTab, setActiveTab] = useState('rankings');
  const [rewardTabShown, setRewardTabShown] = useState(false);
  const userChangedTab = useRef(false);
  const mounted = useRef(true);
  const prevUserId = useRef(userId);
  const prevTwinkleXP = useRef(twinkleXP);
  useEffect(() => {
    mounted.current = true;
    return function cleanUp() {
      mounted.current = false;
    };
  }, []);
  useEffect(() => {
    userChangedTab.current = false;
    handleFetchNotifications();
  }, [userId]);

  useEffect(() => {
    if (!userChangedTab.current) {
      if (!userId) {
        setActiveTab('rankings');
      } else {
        const tab =
          activeTab === 'reward' || rewards.length > 0
            ? 'reward'
            : activeTab === 'notification' ||
              (location === 'home' && notifications.length > 0) ||
              numNewNotis > 0
            ? 'notification'
            : 'rankings';
        setActiveTab(tab);
      }
    }
    setRewardTabShown(rewards.length > 0);
  }, [userId, notifications]);

  useEffect(() => {
    if (userId !== prevUserId.current) {
      onClearNotifications();
    }
    prevUserId.current = userId;
  }, [userId]);

  useEffect(() => {
    if (
      typeof twinkleXP === 'number' &&
      twinkleXP > (prevTwinkleXP.current || 0)
    ) {
      fetchRankings();
    }
    prevTwinkleXP.current = twinkleXP;
  }, [twinkleXP]);

  useEffect(() => {
    socket.on('new_reward', handleFetchNotifications);
    return function cleanUp() {
      socket.removeListener('new_reward', handleFetchNotifications);
    };
  });

  return useMemo(
    () => (
      <ErrorBoundary>
        <div style={style} className={`${container} ${className}`}>
          <section style={{ marginBottom: '0.5rem' }}>
            <div
              className={css`
                display: flex;
                flex-direction: column;
                align-items: center;
              `}
            >
              {children && children}
            </div>
            {loaded && location === 'home' && (
              <ChatFeeds
                myId={userId}
                content={content}
                style={{
                  marginTop: children ? '1rem' : '0',
                  marginBottom: '1rem'
                }}
                {...subject}
              />
            )}
            {notifications.length > 0 && userId && (
              <FilterBar
                bordered
                style={{
                  fontSize: '1.6rem',
                  height: '5rem'
                }}
              >
                <nav
                  className={`${activeTab === 'notification' &&
                    'active'} ${numNewNotis > 0 && 'alert'}`}
                  onClick={() => {
                    userChangedTab.current = true;
                    setActiveTab('notification');
                  }}
                >
                  News
                </nav>
                <nav
                  className={activeTab === 'rankings' ? 'active' : undefined}
                  onClick={() => {
                    userChangedTab.current = true;
                    setActiveTab('rankings');
                  }}
                >
                  Rankings
                </nav>
                {rewardTabShown && (
                  <nav
                    className={`${activeTab === 'reward' &&
                      'active'} ${totalRewardAmount > 0 && 'alert'}`}
                    onClick={() => {
                      userChangedTab.current = true;
                      setActiveTab('reward');
                    }}
                  >
                    Rewards
                  </nav>
                )}
              </FilterBar>
            )}
            <MainFeeds
              loadMore={loadMore}
              activeTab={activeTab}
              notifications={notifications}
              rewards={rewards}
              selectNotiTab={() => {
                userChangedTab.current = true;
                setActiveTab('notification');
              }}
              style={{
                marginTop:
                  loaded && userId && notifications.length > 0 && '1rem'
              }}
            />
          </section>
        </div>
      </ErrorBoundary>
    ),
    [
      activeTab,
      children,
      currentChatSubject,
      loadMore,
      notifications,
      numNewNotis,
      rewards,
      totalRewardAmount,
      location,
      rewardTabShown,
      userId
    ]
  );

  function handleFetchNotifications() {
    fetchNews();
    fetchRankings();
  }
  async function fetchNews() {
    const data = await fetchNotifications();
    if (mounted.current) {
      onFetchNotifications(data);
    }
  }
  async function fetchRankings() {
    const {
      data: { all, rankModifier: modifier, top30s }
    } = await request.get(`${API_URL}/leaderBoard`, auth());
    if (mounted.current) {
      onGetRanks({ all, top30s, rankModifier: modifier });
    }
  }
}

export default memo(Notification);
