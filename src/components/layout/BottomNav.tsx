import { NavLink } from 'react-router';
import { ROUTES } from '../../routes';
import { Icon } from '../icons/Icon';
import type { IconName } from '../../types/IconName';

type NavItem = {
  to: string;
  label: string;
  icon: IconName;
};

const NAV_ITEMS: readonly NavItem[] = [
  { to: ROUTES.today, label: 'Hoje', icon: 'today' },
  { to: ROUTES.dashboard, label: 'Dashboard', icon: 'heatmap' },
  { to: ROUTES.activities, label: 'Atividades', icon: 'list' },
];

function navLinkClassName({ isActive }: { isActive: boolean }): string {
  const state = isActive ? 'bg-brand-50 text-brand-700' : 'text-ink-muted hover:text-ink';
  return `flex min-h-14 flex-1 flex-col items-center justify-center gap-1 rounded-control px-3 text-xs font-semibold transition-colors duration-150 md:min-h-11 md:flex-none md:flex-row md:gap-2 md:text-sm ${state}`;
}

export function BottomNav() {
  return (
    <nav aria-label="Principal" className="fixed inset-x-0 bottom-0 z-20 bg-card/95 px-2 pt-2 pb-[max(0.5rem,env(safe-area-inset-bottom))] shadow-[0_-8px_24px_-16px_rgb(43_38_34/0.25)] backdrop-blur md:static md:bg-transparent md:p-0 md:shadow-none md:backdrop-blur-none">
      <ul className="mx-auto flex max-w-md gap-1 md:max-w-none">
        {NAV_ITEMS.map((item: NavItem) => (
          <li key={item.to} className="flex flex-1 md:flex-none">
            <NavLink to={item.to} end className={navLinkClassName}>
              <Icon name={item.icon} />
              {item.label}
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  );
}
