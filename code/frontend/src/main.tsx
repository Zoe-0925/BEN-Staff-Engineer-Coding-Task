import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider } from 'styled-components';

import { App } from './App';
import { ConfigProvider } from './context/ConfigContext';
import { GlobalStyle } from './styles/GlobalStyle';
import { theme } from './styles/theme';

const rootElement = document.getElementById('root');

if (!rootElement) {
  throw new Error('Application root element not found.');
}

createRoot(rootElement).render(
  <BrowserRouter>
    <ThemeProvider theme={theme}>
      <ConfigProvider>
        <GlobalStyle />
        <App />
      </ConfigProvider>
    </ThemeProvider>
  </BrowserRouter>,
);
