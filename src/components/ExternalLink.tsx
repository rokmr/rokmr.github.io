import type { AnchorHTMLAttributes, ReactNode } from 'react';

type Props = AnchorHTMLAttributes<HTMLAnchorElement> & {
  href: string;
  children: ReactNode;
  /** Adds rel="me" for identity verification on social profiles. */
  me?: boolean;
};

export function ExternalLink({ href, children, me, ...rest }: Props) {
  return (
    <a
      href={href}
      target="_blank"
      rel={me ? 'me noopener noreferrer' : 'noopener noreferrer'}
      {...rest}
    >
      {children}
    </a>
  );
}
