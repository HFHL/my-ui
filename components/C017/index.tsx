import styles from './styles.module.css';
import iconAssets from './icons.json';
const icons: Record<string, string> = iconAssets;
function Icon({ name }: { name: string }) { return <span className={styles.icon} aria-hidden="true" dangerouslySetInnerHTML={{ __html: icons[name] ?? '' }} />; }

import {useState} from 'react';
import data from './data.json';
export interface Transaction { id:string;hash:string;type:string;asset:string;quantity:string;value:string;date:string;timestamp:string; }
const assetColors:Record<string,string>={BTC:'#F7931A',USDC:'#2775CA',ETH:'#627EEA',BNB:'#F0B90B',SOL:'#14F195'};
export interface TransactionTableProps { rows?:Transaction[];totalCount?:number;onSelect?:(row:Transaction)=>void;onSortChange?:(order:'ascending'|'descending')=>void; }
export default function TransactionTable({rows=data,totalCount=8,onSelect,onSortChange}:TransactionTableProps){const [order,setOrder]=useState<'ascending'|'descending'>('descending');const sorted=[...rows].sort((a,b)=>order==='ascending'?a.timestamp.localeCompare(b.timestamp):b.timestamp.localeCompare(a.timestamp));return <section className={`${styles.root} ${styles.card}`}><header><h3>Recent activity</h3><span>{totalCount}</span></header><div className={styles.scroll}><table aria-label="Recent activity"><thead><tr><th>Txn #</th><th>Type</th><th>Asset</th><th>Value</th><th aria-sort={order}><button type="button" onClick={()=>{const next=order==='ascending'?'descending':'ascending';setOrder(next);onSortChange?.(next);}}>Date</button></th></tr></thead><tbody>{sorted.map(row=><tr key={row.id}><td><button className={styles.hash} type="button" onClick={()=>onSelect?.(row)}>{row.hash}</button></td><td><span className={styles.type}><Icon name={row.type}/>{row.type}</span></td><td><span className={styles.asset}><span className={styles.avatar} style={{background:assetColors[row.asset]??'#a1a1aa'}}>{row.asset[0]}</span>{row.asset}</span></td><td><span className={styles.quantity}>{row.quantity} {row.asset}</span><small>{row.value}</small></td><td className={styles.date}>{row.date}</td></tr>)}</tbody></table></div>{rows.length===0 && <p className={styles.empty}>No recent activity</p>}</section>;}

