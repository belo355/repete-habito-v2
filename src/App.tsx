import { BrowserRouter } from 'react-router';
import { AppRoutes } from './AppRoutes';
import { AppDataProvider } from './hooks/AppDataProvider';

function App() {
  return (
    <BrowserRouter>
      <AppDataProvider>
        <AppRoutes />
      </AppDataProvider>
    </BrowserRouter>
  );
}

export default App;
