import { AppProvider, useApp } from './contexts/AppContext';
import { Layout } from './components/Layout';
import { HodlDashboard } from './components/hodl/HodlDashboard';
import { TradeDashboard } from './components/trade/TradeDashboard';
import { AccountCreation } from './components/AccountCreation';

function AppContent() {
  const { mode, isAuthenticated } = useApp();

  if (!isAuthenticated) {
    return <AccountCreation />;
  }

  return (
    <Layout>
      {mode === 'hodl' ? <HodlDashboard /> : <TradeDashboard />}
    </Layout>
  );
}

function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}

export default App;