import { useEffect, useRef, type KeyboardEvent, type RefObject } from 'react';

const FOCUSABLE_SELECTOR = 'button:not([disabled]), [href], input:not([disabled]), [tabindex]:not([tabindex="-1"])';

function listFocusable(container: HTMLElement): HTMLElement[] {
  return [...container.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR)];
}

function keepFocusInside(event: KeyboardEvent<HTMLElement>, container: HTMLElement): void {
  const focusable = listFocusable(container);
  const first = focusable[0];
  const last = focusable[focusable.length - 1];
  if (event.shiftKey && document.activeElement === first) {
    event.preventDefault();
    last.focus();
  } else if (!event.shiftKey && document.activeElement === last) {
    event.preventDefault();
    first.focus();
  }
}

type DialogFocus = {
  dialogRef: RefObject<HTMLDivElement | null>;
  handleKeyDown(event: KeyboardEvent<HTMLElement>): void;
};

export function useDialogFocus(onCancel: () => void): DialogFocus {
  const dialogRef = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    const trigger = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    const container = dialogRef.current;
    if (container) {
      listFocusable(container)[0]?.focus();
    }
    return () => trigger?.focus();
  }, []);
  function handleKeyDown(event: KeyboardEvent<HTMLElement>): void {
    if (event.key === 'Escape') {
      event.preventDefault();
      onCancel();
    } else if (event.key === 'Tab' && dialogRef.current) {
      keepFocusInside(event, dialogRef.current);
    }
  }
  return { dialogRef, handleKeyDown };
}
