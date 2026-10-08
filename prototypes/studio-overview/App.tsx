import { useState } from 'react';
import Button from './components/C001';
import MetricCard from './components/C002';
import SegmentedControl from './components/C004';
import Navigation from './components/C005';
import styles from './styles.module.css';

export default function App() {
  const [active, setActive] = useState('概览');
  const [period, setPeriod] = useState('本月');
  const [created, setCreated] = useState(false);
  return <main className={styles.root}><div className={styles.content}>
    <Navigation brand="Studio / 工作室" items={['概览', '项目', '成员']} active={active} onChange={setActive} />
    <header className={styles.header}><div><p>组件组装示例</p><h1>{active === '概览' ? '工作室概览' : active}</h1><span>由 C001、C002、C004、C005 的独立副本组装。</span></div><Button onClick={() => setCreated(true)}>{created ? '示例项目已创建 ✓' : '创建示例项目'}</Button></header>
    {active === '概览' ? <><SegmentedControl options={['本周', '本月', '全年']} value={period} onChange={setPeriod} label="统计周期" /><div className={styles.metrics}><MetricCard label={`${period}访问量`} value={period === '本周' ? '3,201' : period === '本月' ? '12,804' : '142,760'} change="↑ 18.6%" detail="示例数据" /><MetricCard label="进行中的项目" value={created ? '09' : '08'} change={created ? '+ 1 个项目' : '+ 2 个项目'} detail="示例数据" /><MetricCard label="已收藏的组件" value="06" change="+ 6 个组件" detail="初始组件库" /></div><section className={styles.note}><h2>从组件到原型</h2><p>这个页面中的组件全部复制到当前原型目录。你可以单独调整它们，收藏库中的原始组件保持独立。</p></section></> : <section className={styles.note}><h2>{active === '项目' ? created ? '示例项目' : '项目列表待组装' : '成员页面待组装'}</h2><p>{active === '项目' && created ? '已通过 C001 创建一个仅用于演示交互的项目。' : '切换导航已经生效；你可以在当前原型中继续添加真实内容。'}</p></section>}
  </div></main>;
}
