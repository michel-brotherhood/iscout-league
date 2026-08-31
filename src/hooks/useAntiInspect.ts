import { useEffect, useState } from 'react';
import { toast } from 'sonner';

const MESSAGE = 'Vai farmar aura não, amigão!';

const showWarning = () => {
  toast(MESSAGE, {
    duration: 2500,
    closeButton: false,
    className: 'iscout-anti-inspect-toast',
  });
};

const SIZE_THRESHOLD = 160;

export const useAntiInspect = () => {
  const [isDevToolsOpen, setIsDevToolsOpen] = useState(false);

  useEffect(() => {
    const handleContextMenu = (e: MouseEvent) => {
      e.preventDefault();
      showWarning();
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      const key = e.key.toLowerCase();
      if (e.key === 'F12') {
        e.preventDefault();
        showWarning();
        return;
      }
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && ['i', 'j', 'c'].includes(key)) {
        e.preventDefault();
        showWarning();
        return;
      }
      if ((e.ctrlKey || e.metaKey) && key === 'u') {
        e.preventDefault();
        showWarning();
      }
    };

    document.addEventListener('contextmenu', handleContextMenu);
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('contextmenu', handleContextMenu);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  useEffect(() => {
    let detected = false;

    const setOpen = (open: boolean) => {
      if (open === detected) return;
      detected = open;
      setIsDevToolsOpen(open);
    };

    const checkDevTools = () => {
      // 1. Size diff (docked devtools)
      const widthDiff = window.outerWidth - window.innerWidth;
      const heightDiff = window.outerHeight - window.innerHeight;
      const sizeDetected =
        widthDiff > SIZE_THRESHOLD || heightDiff > SIZE_THRESHOLD;

      if (sizeDetected) {
        setOpen(true);
        return;
      }

      // 2. Console getter trick (undocked devtools)
      let getterTriggered = false;
      const probe: { id?: unknown } = {};
      Object.defineProperty(probe, 'id', {
        get() {
          getterTriggered = true;
          return '';
        },
      });

      // Use console.debug so it's not visually noisy if devtools IS open.
      // eslint-disable-next-line no-console
      console.debug(probe);
      // eslint-disable-next-line no-console
      console.clear();

      setOpen(getterTriggered);
    };

    checkDevTools();
    const id = window.setInterval(checkDevTools, 1000);

    return () => {
      window.clearInterval(id);
    };
  }, []);

  return { isDevToolsOpen };
};
