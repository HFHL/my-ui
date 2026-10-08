import { Component, lazy, Suspense } from 'react';
import type { ReactNode } from 'react';
import { getPreviewLoader } from './registry';

class PreviewBoundary extends Component<{ children: ReactNode }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() { return { failed: true }; }
  render() { return this.state.failed ? <p role="alert">组件预览失败，请检查组件实现。</p> : this.props.children; }
}

const params = new URLSearchParams(location.search);
const kind = params.get('preview');
const id = params.get('id') ?? '';
const loader = kind === 'component' || kind === 'prototype' ? getPreviewLoader(kind, id) : undefined;
const Preview = loader ? lazy(loader) : undefined;

export default function PreviewPage() {
  return <div style={{ minHeight: '100dvh', display: kind === 'component' ? 'grid' : 'block', placeItems: 'center', boxSizing: 'border-box', padding: kind === 'component' ? 24 : 0, fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif', color: '#252a30', background: '#fff' }}>
    <PreviewBoundary><Suspense fallback={<p role="status">正在加载预览…</p>}>
      {Preview ? <Preview /> : <p role="alert">没有找到这个预览。请核对编号或原型名称。</p>}
    </Suspense></PreviewBoundary>
  </div>;
}
