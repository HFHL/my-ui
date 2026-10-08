import styles from './styles.module.css';
import iconAssets from './icons.json';
const icons: Record<string, string> = iconAssets;
function Icon({ name }: { name: string }) { return <span className={styles.icon} aria-hidden="true" dangerouslySetInnerHTML={{ __html: icons[name] ?? '' }} />; }

export interface MetricCardProps { label?: string; value?: string|number; change?: string; trend?: 'up'|'down'|'neutral'; }
export default function MetricCard({label='Total balance',value='$5,427.48',change='5.32%',trend='up'}:MetricCardProps){return <dl className={`${styles.root} ${styles.card}`}><dt>{label}</dt><div className={styles.values}><dd>{value}</dd>{change && <span className={styles[trend]}>{trend!=='neutral' && <Icon name={`trend-${trend}`}/>} {change}</span>}</div></dl>;}

