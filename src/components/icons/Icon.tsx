import { ICON_PATHS } from './iconPaths';
import type { IconName } from '../../types/IconName';

type IconProps = {
  name: IconName;
  className?: string;
};

export function Icon({ name, className = 'size-5' }: IconProps) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      {ICON_PATHS[name].map((path: string) => (
        <path key={path} d={path} />
      ))}
    </svg>
  );
}
