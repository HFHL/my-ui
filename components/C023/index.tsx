import styles from './styles.module.css';
import iconAssets from './icons.json';
const icons: Record<string, string> = iconAssets;
function Icon({ name }: { name: string }) { return <span className={styles.icon} aria-hidden="true" dangerouslySetInnerHTML={{ __html: icons[name] ?? '' }} />; }

export type TransactionType = 'Contract Interaction'|'Received'|'Sent'|'Swapped';
export interface TransactionTypeBadgeProps { type?:TransactionType;showLabel?:boolean; }
export default function TransactionTypeBadge({type='Received',showLabel=true}:TransactionTypeBadgeProps){return <span className={`${styles.root} ${styles.badge}`} aria-label={!showLabel?type:undefined} role={!showLabel?'img':undefined}><Icon name={type}/>{showLabel && <span>{type}</span>}</span>;}

