import { useState } from 'react';
import EmptyState from './index';
export default function Preview() { const [created, setCreated] = useState(false); return created ? <div style={{ textAlign: 'center', color: '#146b57', fontSize: 14 }}><p>示例项目已创建</p><button type="button" onClick={() => setCreated(false)}>重新体验</button></div> : <EmptyState title="还没有项目" description="从一个想法开始，创建你的第一个项目。" action="创建示例项目" onAction={() => setCreated(true)} />; }
