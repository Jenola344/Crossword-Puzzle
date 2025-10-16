import { useState, useEffect } from 'react';
import { useWeb3 } from '../../hooks/useWeb3';

const DailyRewards = () => {
  const [rewards, setRewards] = useState([]);
  const [currentStreak, setCurrentStreak] = useState(0);
  const { account } = useWeb3();

  useEffect(() => {
    if (account) {
      loadRewardsData();
    }
  }, [account]);

  const loadRewardsData = async () => {
    try {
      const response = await fetch(`/api/rewards/${account}`);
      const data = await response.json();
      setRewards(data.rewards);
      setCurrentStreak(data.currentStreak);
    } catch (error) {
      console.error('Failed to load rewards:', error);
    }
  };

  const claimDailyReward = async (day) => {
    try {
      const response = await fetch('/api/rewards/claim', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ account, day })
      });
      
      const result = await response.json();
      if (result.success) {
        loadRewardsData();
      }
    } catch (error) {
      console.error('Failed to claim reward:', error);
    }
  };

  return (
    <div className="daily-rewards">
      <div className="streak-counter">
        <h3>Current Streak: {currentStreak} days</h3>
        <p>Keep going for bigger rewards!</p>
      </div>
      
      <div className="rewards-calendar">
        {rewards.map((reward, index) => (
          <div 
            key={index} 
            className={`reward-day ${reward.claimed ? 'claimed' : ''} ${reward.available ? 'available' : ''}`}
            onClick={() => reward.available && !reward.claimed && claimDailyReward(index + 1)}
          >
            <div className="day-number">Day {index + 1}</div>
            <div className="reward-amount">{reward.amount} $CROSS</div>
            {reward.nft && <div className="nft-badge">+ NFT</div>}
          </div>
        ))}
      </div>
    </div>
  );
};

export default DailyRewards;