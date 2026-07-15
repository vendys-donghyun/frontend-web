import { useEffect, useState } from 'react';
import { Toast, type ToastProps } from './Toast';

export interface ToastOptions {
  tone?: ToastProps['tone'];
  /** 자동 소멸까지 ms. 기본 3000 */
  duration?: number;
}

type ToastEntry = {
  id: number;
  message: string;
  tone: NonNullable<ToastProps['tone']>;
  leaving: boolean;
};

const EXIT_MS = 150; // motion-fast와 맞춘 퇴장 시간

let entries: ToastEntry[] = [];
let listeners: ((v: ToastEntry[]) => void)[] = [];
let seq = 0;

function emit() {
  for (const listener of listeners) listener([...entries]);
}

/** 어디서든 호출하는 토스트. 앱 루트에 <Toaster />가 한 번 있어야 한다 */
export function toast(message: string, { tone = 'success', duration = 3000 }: ToastOptions = {}) {
  const id = ++seq;
  entries = [...entries, { id, message, tone, leaving: false }];
  emit();
  window.setTimeout(() => {
    entries = entries.map((t) => (t.id === id ? { ...t, leaving: true } : t));
    emit();
    window.setTimeout(() => {
      entries = entries.filter((t) => t.id !== id);
      emit();
    }, EXIT_MS);
  }, duration);
}

/**
 * 토스트 스택 뷰포트 - 하단 중앙 고정.
 * 새 토스트가 아래에 붙고 이전 것은 위로 밀려나며, 각자 타이머가 끝나면 페이드아웃된다
 */
export function Toaster() {
  const [list, setList] = useState<ToastEntry[]>([]);

  useEffect(() => {
    const listener = (v: ToastEntry[]) => setList(v);
    listeners.push(listener);
    setList([...entries]);
    return () => {
      listeners = listeners.filter((l) => l !== listener);
    };
  }, []);

  if (list.length === 0) return null;

  return (
    <div className="vd-toast-viewport">
      {list.map((t) => (
        <Toast key={t.id} tone={t.tone} className={t.leaving ? 'vd-toast--leaving' : undefined}>
          {t.message}
        </Toast>
      ))}
    </div>
  );
}
