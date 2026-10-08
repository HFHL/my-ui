import styles from './styles.module.css';
import iconAssets from './icons.json';
const icons: Record<string, string> = iconAssets;
function Icon({ name }: { name: string }) { return <span className={styles.icon} aria-hidden="true" dangerouslySetInnerHTML={{ __html: icons[name] ?? '' }} />; }

import { useState } from 'react';
import day from './assets/1D.svg?raw';import week from './assets/1W.svg?raw';import month from './assets/1M.svg?raw';import quarter from './assets/3M.svg?raw';import year from './assets/1Y.svg?raw';import all from './assets/All.svg?raw';
const charts = {'1D':day,'1W':week,'1M':month,'3M':quarter,'1Y':year,All:all};
export type ChartRange = keyof typeof charts;
export interface PortfolioChartProps { title?:string; description?:string; balance?:string; value?:ChartRange; defaultValue?:ChartRange; onRangeChange?:(range:ChartRange)=>void; }
const changes:Record<ChartRange,string>={'1D':'+2.82%','1W':'+5.17%','1M':'+8.16%','3M':'+19.25%','1Y':'+74.67%',All:'+785.32%'};
export default function PortfolioChart({title='Portfolio',description='Sample holdings and historical performance',balance='$5,427.48',value,defaultValue='1M',onRangeChange}:PortfolioChartProps){const [local,setLocal]=useState(defaultValue);const selected=value??local;return <section className={`${styles.root} ${styles.card}`} aria-label={title}><header className={styles.header}><div><h3>{title}</h3><p>{description}</p><small>Total balance</small><strong className={styles.balance}>{balance}</strong><span className={styles.change}><Icon name="trend-up"/>{changes[selected]} <span className={styles.muted}>{selected}</span></span></div><div className={styles.ranges} role="group" aria-label="Time range">{(Object.keys(charts) as ChartRange[]).map(range=><button key={range} type="button" aria-pressed={selected===range} onClick={()=>{if(value===undefined)setLocal(range);onRangeChange?.(range);}}>{range}</button>)}</div></header><div className={styles.chart} data-period={selected} dangerouslySetInnerHTML={{__html:charts[selected]}}/></section>;}

