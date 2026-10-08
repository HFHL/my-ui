import { useState } from 'react';
import Button from './index';
export default function Preview() {
  const [saved, setSaved] = useState(false);
  return <div style={{ textAlign: 'center' }}><div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, justifyContent: 'center' }}><Button onClick={() => setSaved(!saved)}>{saved ? '已保存 ✓' : '保存更改'}</Button><Button variant="secondary" onClick={() => setSaved(false)}>重置</Button><Button variant="ghost" disabled>禁用状态</Button></div><p style={{ color: '#68736d', fontSize: 12, marginTop: 18 }} aria-live="polite">{saved ? '更改已保存' : '点击按钮试试'}</p></div>;
}
