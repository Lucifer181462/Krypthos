import { useState } from 'react';
import { Layout } from './components/Layout';
import { LandingPage } from './pages/LandingPage';
import { DashboardPage } from './pages/DashboardPage';
import { RepositoriesPage } from './pages/RepositoriesPage';
import { IssueTriagePage } from './pages/IssueTriagePage';
import { ModerationPage } from './pages/ModerationPage';
import { RecommenderPage } from './pages/RecommenderPage';
import { ReadmeGeneratorPage } from './pages/ReadmeGeneratorPage';
import { MOCK_USER } from './data/mockData';
import type { Page } from './types';

export default function App() {
  const [page, setPage] = useState<Page>('landing');
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const navigate = (p: Page) => setPage(p);

  const login = () => {
    setIsAuthenticated(true);
    setPage('dashboard');
  };

  const logout = () => {
    setIsAuthenticated(false);
    setPage('landing');
  };

  if (!isAuthenticated || page === 'landing') {
    return <LandingPage onLogin={login} />;
  }

  return (
    <Layout
      currentPage={page}
      navigate={navigate}
      onLogout={logout}
      user={{ login: MOCK_USER.login, avatarUrl: MOCK_USER.avatarUrl }}
    >
      {page === 'dashboard' && <DashboardPage navigate={navigate} />}
      {page === 'repositories' && <RepositoriesPage />}
      {page === 'triage' && <IssueTriagePage />}
      {page === 'moderation' && <ModerationPage />}
      {page === 'recommender' && <RecommenderPage />}
      {page === 'readme' && <ReadmeGeneratorPage />}
    </Layout>
  );
}
