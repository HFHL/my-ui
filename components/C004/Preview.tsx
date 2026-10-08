import { useState } from 'react';
import SegmentedControl from './index';
export default function Preview() { const [value, setValue] = useState('概览'); return <div style={{ textAlign: 'center' }}><SegmentedControl options={['概览', '分析', '记录']} value={value} onChange={setValue} /><p style={{ fontSize: 12, color: '#68736d' }} aria-live="polite">当前视图：{value}</p></div>; }
