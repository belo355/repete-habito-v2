import { Outlet } from 'react-router';
import { BottomNav } from './BottomNav';
import { BrandMark } from './BrandMark';
import { SaveErrorNotice } from './SaveErrorNotice';

export function AppLayout() {
  return (
    <div className="min-h-dvh">
      <header className="sticky top-0 z-10 bg-surface">
        <div className="mx-auto flex h-16 max-w-3xl items-center justify-between px-4">
          <BrandMark />
          <BottomNav />
        </div>
      </header>
      <main className="mx-auto max-w-3xl px-4 pt-2 pb-32 md:pb-16">
        <Outlet />
      </main>
      <SaveErrorNotice />
    </div>
  );
}
