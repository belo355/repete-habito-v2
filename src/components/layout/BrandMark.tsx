import { Link } from 'react-router';
import { ROUTES } from '../../routes';
import { Icon } from '../icons/Icon';

export function BrandMark() {
  return (
    <Link to={ROUTES.today} className="flex items-center gap-2 rounded-control text-ink">
      <span className="flex size-9 items-center justify-center rounded-[10px] bg-brand-500 text-ink">
        <Icon name="check" className="size-5" />
      </span>
      <span className="text-lg font-bold tracking-[-0.02em]">Repete Hábito</span>
    </Link>
  );
}
