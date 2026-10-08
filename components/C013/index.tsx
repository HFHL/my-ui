import styles from './styles.module.css';
import iconAssets from './icons.json';
const icons: Record<string, string> = iconAssets;
function Icon({ name }: { name: string }) { return <span className={styles.icon} aria-hidden="true" dangerouslySetInnerHTML={{ __html: icons[name] ?? '' }} />; }

export interface TrendChipProps { value?: string; trend?: 'up'|'down'|'neutral'; soft?: boolean; }
export default function TrendChip({value='+2.34%',trend='up',soft=false}:TrendChipProps){return <span className={`${styles.root} ${styles.chip} ${styles[trend]} ${soft?styles.soft:''}`} data-trend={trend}>{trend!=='neutral' && <Icon name={`trend-${trend}`}/>}<span>{value}</span></span>;}

