import { useState, useEffect, useCallback } from 'react';
import { ethers } from 'ethers';

export const useWeb3 = () => {
  const [account, setAccount] = useState('');
  const [provider, setProvider] = useState(null);
  const [chainId, setChainId] = useState(null);

  const connectWallet = useCallback(async () => {
    if (!window.ethereum) throw new Error('No crypto wallet found');
    
    try {
      const accounts = await window.ethereum.request({
        method: 'eth_requestAccounts'
      });
      
      const web3Provider = new ethers.BrowserProvider(window.ethereum);
      const network = await web3Provider.getNetwork();
      
      setAccount(accounts[0]);
      setProvider(web3Provider);
      setChainId(Number(network.chainId));
      
      return accounts[0];
    } catch (error) {
      throw new Error(`Wallet connection failed: ${error.message}`);
    }
  }, []);

  const disconnectWallet = useCallback(() => {
    setAccount('');
    setProvider(null);
    setChainId(null);
  }, []);

  useEffect(() => {
    if (window.ethereum) {
      window.ethereum.on('accountsChanged', (accounts) => {
        setAccount(accounts[0] || '');
      });
      
      window.ethereum.on('chainChanged', (chainId) => {
        setChainId(Number(chainId));
      });
    }
  }, []);

  return { account, provider, chainId, connectWallet, disconnectWallet };
};