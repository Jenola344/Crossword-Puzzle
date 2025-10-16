import { useState } from 'react';
import { useWeb3 } from '../../hooks/useWeb3';

const WalletConnect = () => {
  const { account, connectWallet, disconnectWallet } = useWeb3();
  const [isConnecting, setIsConnecting] = useState(false);

  const handleConnect = async () => {
    setIsConnecting(true);
    try {
      await connectWallet();
    } catch (error) {
      console.error('Connection failed:', error);
    }
    setIsConnecting(false);
  };

  const handleDisconnect = () => {
    disconnectWallet();
  };

  if (account) {
    return (
      <div className="wallet-connected">
        <span className="account-address">
          {account.slice(0, 6)}...{account.slice(-4)}
        </span>
        <button onClick={handleDisconnect} className="disconnect-btn">
          Disconnect
        </button>
      </div>
    );
  }

  return (
    <button 
      onClick={handleConnect} 
      disabled={isConnecting}
      className="connect-wallet-btn"
    >
      {isConnecting ? 'Connecting...' : 'Connect Wallet'}
    </button>
  );
};

export default WalletConnect;