import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Web3Provider } from './contexts/Web3Context';
import Navigation from './components/Layout/Navigation';
import Dashboard from './pages/Dashboard';
import Tournament from './pages/Tournament';
import Profile from './pages/Profile';
import Rewards from './pages/Rewards';
import Store from './pages/Store';
import './App.css';

function App() {
  return (
    <Web3Provider>
      <Router>
        <div className="app">
          <Navigation />
          <main className="main-content">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/tournament" element={<Tournament />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/rewards" element={<Rewards />} />
              <Route path="/store" element={<Store />} />
            </Routes>
          </main>
        </div>
      </Router>
    </Web3Provider>
  );
}

export default App;