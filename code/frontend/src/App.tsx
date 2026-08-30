import { Route, Routes } from 'react-router-dom';
import styled from 'styled-components';

import { AppFooter } from './components/AppFooter/AppFooter';
import { AppHeader } from './components/AppHeader/AppHeader';
import { NotFound } from './components/NotFound/NotFound';
import { CommissionQuotePage } from './pages/CommissionQuotePage';

const ApplicationShell = styled.div`
  display: flex;
  min-height: 100vh;
  flex-direction: column;
  background: ${({ theme }) => theme.colors.surface};
`;

const ApplicationContent = styled.main`
  display: flex;
  min-height: 0;
  flex: 1;
`;

export function App() {
  return (
    <ApplicationShell>
      <AppHeader />
      <ApplicationContent>
        <Routes>
          <Route path="/" element={<CommissionQuotePage />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </ApplicationContent>
      <AppFooter />
    </ApplicationShell>
  );
}
