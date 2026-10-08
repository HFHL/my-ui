import styles from './styles.module.css';
import iconAssets from './icons.json';
const icons: Record<string, string> = iconAssets;
function Icon({ name }: { name: string }) { return <span className={styles.icon} aria-hidden="true" dangerouslySetInnerHTML={{ __html: icons[name] ?? '' }} />; }

import data from './data.json';
export interface Holding { symbol:string;name:string;value:string;change:string;trend:'up'|'down'|'neutral';color:string; }
export interface HoldingsListProps { items?:Holding[]; totalCount?:number; onSelect?:(item:Holding)=>void; onSeeAll?:()=>void; }
export default function HoldingsList({items=data as Holding[],totalCount=8,onSelect,onSeeAll}:HoldingsListProps){return <section className={`${styles.root} ${styles.card}`} aria-label="Holdings"><header><h3>Holdings</h3><span className={styles.count}>{totalCount}</span></header><div className={styles.list}>{items.map(item=><button type="button" key={item.symbol} className={styles.row} onClick={()=>onSelect?.(item)}><span className={styles.avatar} style={{background:item.color}} aria-hidden="true">{item.symbol[0]}</span><span className={styles.names}><strong>{item.symbol}</strong><small>{item.name}</small></span><span className={styles.values}><strong>{item.value}</strong><small className={styles[item.trend]}>{item.trend!=='neutral' && <Icon name={`trend-${item.trend}`}/>} {item.change}</small></span></button>)}</div>{items.length===0 && <p className={styles.empty}>No holdings yet</p>}<button type="button" className={styles.seeAll} onClick={onSeeAll}>See all holdings</button></section>;}

