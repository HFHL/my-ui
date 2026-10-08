import { useState } from 'react';
import Navigation from './index';
export default function Preview() { const [active, setActive] = useState('项目'); return <div style={{ width: 'min(100%, 460px)' }}><Navigation brand="Studio" items={['项目', '文件', '成员']} active={active} onChange={setActive} /></div>; }
