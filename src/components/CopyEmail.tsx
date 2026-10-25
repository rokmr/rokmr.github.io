import { useEffect, useRef, useState } from 'react';
import { Icon } from './Icon';
import { site } from '../data/site';

/** The visible address remains usable when clipboard permission is unavailable. */
export function CopyEmail() {
  const [status, setStatus] = useState<'idle' | 'copied' | 'error'>('idle');
  const resetTimer = useRef<ReturnType<typeof setTimeout>>();

  useEffect(() => () => clearTimeout(resetTimer.current), []);

  const copy = async () => {
    clearTimeout(resetTimer.current);
    setStatus('idle');
    try {
      await navigator.clipboard.writeText(site.email);
      setStatus('copied');
    } catch {
      setStatus('error');
    }
    resetTimer.current = setTimeout(() => setStatus('idle'), 4000);
  };

  return (
    <span className="copy-email">
      <button type="button" onClick={copy} aria-label="Copy email address" title={status === 'copied' ? 'Copied' : 'Copy email address'}>
        <Icon name={status === 'copied' ? 'check' : 'copy'} size={14} />
      </button>
      <span className={status === 'error' ? 'copy-email-error' : 'copy-email-status'} role="status" aria-atomic="true">
        {status === 'copied' ? 'Email address copied.' : status === 'error' ? 'Could not copy. Select the email address to copy it.' : ''}
      </span>
    </span>
  );
}
