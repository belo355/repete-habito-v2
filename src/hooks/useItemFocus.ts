import { useEffect, useRef } from 'react';
import type { FocusRequest } from '../types/FocusRequest';
import type { ActivityFocusTarget } from '../types/ActivityFocusTarget';

type FocusRegistration = (element: HTMLButtonElement | null) => () => void;

export function useItemFocus(focusRequest: FocusRequest | null, activityId: string) {
  const buttons = useRef(new Map<ActivityFocusTarget, HTMLButtonElement>());
  useEffect(() => {
    if (focusRequest?.kind !== 'item' || focusRequest.activityId !== activityId) {
      return;
    }
    buttons.current.get(focusRequest.target)?.focus();
  }, [focusRequest, activityId]);
  return (target: ActivityFocusTarget): FocusRegistration =>
    (element: HTMLButtonElement | null) => {
      if (element) {
        buttons.current.set(target, element);
      }
      return () => {
        buttons.current.delete(target);
      };
    };
}
