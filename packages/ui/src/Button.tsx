import type { ReactNode } from 'react';

export function Button({ children }: { children: ReactNode }) {
  return (
    <button
      style={{
        padding: '8px 16px',
        borderRadius: 8,
        border: '1px solid #0C6E63',
        background: '#0C6E63',
        color: '#fff',
        cursor: 'pointer',
      }}
    >
      {children}
    </button>
  );
}
