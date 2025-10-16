import { useState, useEffect } from 'react';
import { useWeb3 } from '../hooks/useWeb3';

const Tournament = () => {
  const [tournaments, setTournaments] = useState([]);
  const [activeTournament, setActiveTournament] = useState(null);
  const { account, provider } = useWeb3();

  useEffect(() => {
    loadTournaments();
  }, []);

  const loadTournaments = async () => {
    try {
      const response = await fetch('/api/tournaments');
      const data = await response.json();
      setTournaments(data.tournaments);
    } catch (error) {
      console.error('Failed to load tournaments:', error);
    }
  };

  const joinTournament = async (tournamentId, entryFee) => {
    if (!account || !provider) {
      alert('Please connect your wallet first');
      return;
    }

    try {
      const signer = await provider.getSigner();
      const response = await fetch('/api/tournaments/join', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tournamentId, account, entryFee })
      });

      const result = await response.json();
      if (result.success) {
        alert('Successfully joined tournament!');
        loadTournaments();
      }
    } catch (error) {
      console.error('Failed to join tournament:', error);
    }
  };

  return (
    <div className="tournament-page">
      <h1>Active Tournaments</h1>
      
      <div className="tournaments-grid">
        {tournaments.map(tournament => (
          <div key={tournament.id} className="tournament-card">
            <div className="tournament-header">
              <h3>{tournament.name}</h3>
              <span className="entry-fee">Entry: {tournament.entryFee} $CROSS</span>
            </div>
            
            <div className="tournament-details">
              <p>Prize Pool: {tournament.prizePool} $CROSS</p>
              <p>Participants: {tournament.currentParticipants}/{tournament.maxParticipants}</p>
              <p>Time Left: {tournament.timeLeft}</p>
            </div>
            
            <button 
              onClick={() => joinTournament(tournament.id, tournament.entryFee)}
              disabled={!tournament.active || tournament.currentParticipants >= tournament.maxParticipants}
              className="join-tournament-btn"
            >
              {tournament.active ? 'Join Now' : 'Completed'}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Tournament;