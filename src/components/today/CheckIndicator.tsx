import { Icon } from '../icons/Icon';

type CheckIndicatorProps = {
  isDone: boolean;
};

export function CheckIndicator({ isDone }: CheckIndicatorProps) {
  const ring = isDone ? 'border-success-500 bg-success-500 text-ink' : 'border-line bg-card text-transparent';
  const mark = isDone ? 'scale-100 opacity-100' : 'scale-50 opacity-0';
  return (
    <span aria-hidden="true" className={`flex size-8 shrink-0 items-center justify-center rounded-full border-2 transition-colors duration-200 ${ring}`}>
      <Icon name="check" className={`size-5 transition-[scale,opacity] duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] ${mark}`} />
    </span>
  );
}
