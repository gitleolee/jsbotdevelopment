import React, { useEffect, useMemo, useRef, useState } from 'react';
import Loading from 'components/Loading';
import UsernameText from 'components/Texts/UsernameText';
import ProfilePic from 'components/ProfilePic';
import ErrorBoundary from 'components/Wrappers/ErrorBoundary';
import FilterBar from 'components/FilterBar';
import RoundList from 'components/RoundList';
import MyRank from './MyRank';
import { Color, borderRadius } from 'constants/css';
import { addCommasToNumber } from 'helpers/stringHelpers';
import { useMyState } from 'helpers/hooks';
import { useNotiContext } from 'contexts';

export default function Rankings() {
  const { rank, twinkleXP, userId } = useMyState();
  const {
    state: { allRanks, rankModifier, top30s, rankingsLoaded }
  } = useNotiContext();
  const [allSelected, setAllSelected] = useState(true);
  const userChangedTab = useRef(false);
  const mounted = useRef(true);
  const prevId = useRef(userId);

  useEffect(() => {
    mounted.current = true;
    userChangedTab.current = false;
    if (!rankingsLoaded && mounted.current) {
      setAllSelected(!!userId);
    }
    prevId.current = userId;
  }, [userId, rankingsLoaded]);

  useEffect(() => {
    setAllSelected(!!userId);
  }, [userId]);

  const users = allSelected ? allRanks : top30s;
  const modifier = allSelected ? rankModifier : 0;

  return useMemo(
    () => (
      <ErrorBoundary>
        {!!userId && (
          <FilterBar
            bordered
            style={{
              height: '4.5rem',
              fontSize: '1.6rem'
            }}
          >
            <nav
              className={allSelected ? 'active' : ''}
              onClick={() => {
                userChangedTab.current = true;
                setAllSelected(true);
              }}
            >
              My Ranking
            </nav>
            <nav
              className={allSelected ? '' : 'active'}
              onClick={() => {
                userChangedTab.current = true;
                setAllSelected(false);
              }}
            >
              Top 30
            </nav>
          </FilterBar>
        )}
        {rankingsLoaded === false && <Loading />}
        {!!rankingsLoaded && allSelected && !!userId && (
          <MyRank myId={userId} rank={rank} twinkleXP={twinkleXP} />
        )}
        {rankingsLoaded && allSelected && users.length === 0 && !!userId && (
          <div
            style={{
              background: '#fff',
              borderRadius,
              padding: '1rem',
              border: `1px solid ${Color.borderGray()}`
            }}
          >
            You are not ranked. To get ranked, earn XP by watching a starred
            video or leaving comments
          </div>
        )}
        {rankingsLoaded && users.length > 0 && (
          <RoundList style={{ marginTop: 0 }}>
            {users.map(user => {
              const rank = !user.twinkleXP
                ? undefined
                : users.filter(
                    otherUser => otherUser.twinkleXP > user.twinkleXP
                  ).length +
                  1 +
                  modifier;
              const rankColor =
                rank === 1
                  ? Color.gold()
                  : rank === 2
                  ? Color.lighterGray()
                  : rank === 3
                  ? Color.orange()
                  : undefined;
              return (
                <li
                  key={user.id}
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    background:
                      user.id === userId && rank > 3
                        ? Color.highlightGray()
                        : '#fff'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <span
                      style={{
                        fontWeight: 'bold',
                        fontSize: rank < 100 ? '2rem' : '1.5rem',
                        width: '3rem',
                        marginRight: '1rem',
                        textAlign: 'center',
                        color:
                          rankColor ||
                          (rank <= 10 ? Color.logoBlue() : Color.darkGray())
                      }}
                    >
                      {rank ? `#${rank}` : '--'}
                    </span>
                    <div
                      style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center'
                      }}
                    >
                      <ProfilePic
                        style={{ width: '6rem', height: '6rem' }}
                        profilePicId={user.profilePicId}
                        userId={user.id}
                      />
                      <UsernameText
                        color={
                          rankColor ||
                          (rank <= 10 ? Color.logoBlue() : Color.darkGray())
                        }
                        user={{ ...user, username: user.username }}
                        userId={userId}
                        style={{ display: 'block', marginTop: '0.5rem' }}
                      />
                    </div>
                  </div>
                  <div style={{ fontWeight: 'bold' }}>
                    <span style={{ color: Color.logoGreen() }}>
                      {addCommasToNumber(user.twinkleXP || 0)}
                    </span>{' '}
                    <span style={{ color: Color.gold() }}>XP</span>
                  </div>
                </li>
              );
            })}
          </RoundList>
        )}
      </ErrorBoundary>
    ),
    [users, allSelected, rankModifier, rankingsLoaded, rank, twinkleXP, userId]
  );
}
