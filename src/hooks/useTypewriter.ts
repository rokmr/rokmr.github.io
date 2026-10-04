import { useEffect, useState } from 'react';

/**
 * Cycles through `messages`, typing each out character by character.
 * Returns the text currently on screen.
 */
export function useTypewriter(messages: readonly string[], startDelay = 1000): string {
  const [text, setText] = useState('');

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setText(messages[messages.length - 1] ?? '');
      return;
    }

    let msgIndex = 0;
    let charIndex = 0;
    let typing = true;
    let timer: number;

    const tick = () => {
      const current = messages[msgIndex] ?? '';

      if (typing) {
        if (charIndex < current.length) {
          charIndex++;
          setText(current.substring(0, charIndex));
          timer = window.setTimeout(tick, 50 + Math.random() * 30);
        } else {
          typing = false;
          timer = window.setTimeout(tick, 2000); // hold the finished line
        }
      } else {
        msgIndex = (msgIndex + 1) % messages.length;
        charIndex = 0;
        typing = true;
        setText('');
        tick();
      }
    };

    timer = window.setTimeout(tick, startDelay);
    return () => window.clearTimeout(timer);
  }, [messages, startDelay]);

  return text;
}
