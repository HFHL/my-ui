import { useState } from 'react';
import SearchField from './index';
export default function Preview() { const [query, setQuery] = useState(''); return <div style={{ width: 'min(100%, 300px)' }}><SearchField placeholder="搜索你的项目…" value={query} onChange={e => setQuery(e.target.value)} /><p style={{ fontSize: 12, color: '#68736d' }} aria-live="polite">{query ? `正在搜索：${query}` : '输入关键词开始搜索'}</p></div>; }
