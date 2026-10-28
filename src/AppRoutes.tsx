import { Navigate, Route, Routes } from 'react-router';
import { AppLayout } from './components/layout/AppLayout';
import { ROUTES } from './routes';
import { ActivitiesView } from './views/ActivitiesView';
import { DashboardView } from './views/DashboardView';
import { TodayView } from './views/TodayView';

export function AppRoutes() {
  return (
    <Routes>
      <Route element={<AppLayout />}>
        <Route index element={<TodayView />} />
        <Route path={ROUTES.day} element={<TodayView />} />
        <Route path={ROUTES.dashboard} element={<DashboardView />} />
        <Route path={ROUTES.activities} element={<ActivitiesView />} />
        <Route path="*" element={<Navigate to={ROUTES.today} replace />} />
      </Route>
    </Routes>
  );
}
