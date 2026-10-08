import styles from './styles.module.css';
import iconAssets from './icons.json';
const icons: Record<string, string> = iconAssets;
function Icon({ name }: { name: string }) { return <span className={styles.icon} aria-hidden="true" dangerouslySetInnerHTML={{ __html: icons[name] ?? '' }} />; }

export interface HoldingRowProps { symbol?:string;name?:string;value?:string;change?:string;trend?:'up'|'down'|'neutral';color?:string;onSelect?:()=>void; }
export default function HoldingRow({symbol='BTC',name='Bitcoin',value='$1,283.84',change='+2.34%',trend='up',color='#F7931A',onSelect}:HoldingRowProps){return <button type="button" className={`${styles.root} ${styles.row}`} onClick={onSelect}><span className={styles.avatar} style={{background:color}} aria-hidden="true">{symbol[0]}</span><span className={styles.names}><strong>{symbol}</strong><small>{name}</small></span><span className={styles.values}><strong>{value}</strong><small className={styles[trend]}>{trend!=='neutral' && <Icon name={`trend-${trend}`}/>} {change}</small></span></button>;}

