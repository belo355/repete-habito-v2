import { render, type RenderResult } from '@testing-library/react';
import userEvent, { type UserEvent } from '@testing-library/user-event';
import { MemoryRouter } from 'react-router';
import { AppRoutes } from '../AppRoutes';
import { AppDataProvider } from '../hooks/AppDataProvider';

type RenderAppResult = RenderResult & { user: UserEvent };

export function renderApp(route = '/'): RenderAppResult {
  const user = userEvent.setup();
  const result = render(
    <MemoryRouter initialEntries={[route]}>
      <AppDataProvider>
        <AppRoutes />
      </AppDataProvider>
    </MemoryRouter>,
  );
  return { ...result, user };
}
