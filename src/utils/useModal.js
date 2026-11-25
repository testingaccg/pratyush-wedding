import { useEffect, useRef } from 'react';

const FOCUSABLE =
  'a[href], button:not([disabled]), input:not([disabled]), textarea:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])';

/**
 * Accessible modal behaviour: Esc to close, Tab focus-trap, body scroll-lock,
 * initial focus inside the dialog and focus restoration on close.
 * Returns a ref to attach to the dialog container.
 */
export function useModal(open, onClose, { onKey } = {}) {
  const ref = useRef(null);
  const onCloseRef = useRef(onClose);
  const onKeyRef = useRef(onKey);
  onCloseRef.current = onClose;
  onKeyRef.current = onKey;

  useEffect(() => {
    if (!open) return undefined;
    const previouslyFocused = document.activeElement;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const focusFirst = () => {
      const el = ref.current;
      if (!el) return;
      const target = el.querySelector('[data-autofocus]') || el.querySelector(FOCUSABLE);
      (target || el).focus({ preventScroll: true });
    };
    const raf = requestAnimationFrame(focusFirst);

    const handler = (e) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        onCloseRef.current?.();
        return;
      }
      onKeyRef.current?.(e);
      if (e.key !== 'Tab' || !ref.current) return;
      const nodes = [...ref.current.querySelectorAll(FOCUSABLE)].filter(
        (n) => n.offsetParent !== null || n === document.activeElement
      );
      if (!nodes.length) return;
      const first = nodes[0];
      const last = nodes[nodes.length - 1];
      if (e.shiftKey && (document.activeElement === first || !ref.current.contains(document.activeElement))) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && (document.activeElement === last || !ref.current.contains(document.activeElement))) {
        e.preventDefault();
        first.focus();
      }
    };
    document.addEventListener('keydown', handler);

    return () => {
      cancelAnimationFrame(raf);
      document.removeEventListener('keydown', handler);
      document.body.style.overflow = prevOverflow;
      if (previouslyFocused && typeof previouslyFocused.focus === 'function') {
        previouslyFocused.focus({ preventScroll: true });
      }
    };
  }, [open]);

  return ref;
}
