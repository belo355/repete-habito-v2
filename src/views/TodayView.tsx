import { Navigate, useParams } from 'react-router';
import { DayHeader } from '../components/today/DayHeader';
import { DayActivityList } from '../components/today/DayActivityList';
import { ROUTES } from '../routes';
import { fromDateKey, getTodayKey, isFutureDateKey, isValidDateKey } from '../services/dateKeys';
import type { DateKey } from '../types/DateKey';

function isRegistrableDay(dateKey: string, todayKey: DateKey): boolean {
  return isValidDateKey(dateKey) && !isFutureDateKey(dateKey, fromDateKey(todayKey));
}

export function TodayView() {
  const { dateKey: requestedKey } = useParams();
  const todayKey = getTodayKey();
  if (requestedKey !== undefined && !isRegistrableDay(requestedKey, todayKey)) {
    return <Navigate to={ROUTES.today} replace />;
  }
  const dateKey = requestedKey ?? todayKey;
  return (
    <div className="flex flex-col gap-6">
      <DayHeader dateKey={dateKey} todayKey={todayKey} />
      <DayActivityList key={dateKey} dateKey={dateKey} />
    </div>
  );
}
