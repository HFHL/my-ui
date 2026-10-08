import styles from './styles.module.css';
import iconAssets from './icons.json';
const icons: Record<string, string> = iconAssets;
function Icon({ name }: { name: string }) { return <span className={styles.icon} aria-hidden="true" dangerouslySetInnerHTML={{ __html: icons[name] ?? '' }} />; }

export interface FinanceTopbarProps { title?: string; onToggleNavigation?: () => void; onAction?: (action: 'Swap'|'Receive'|'Send'|'Notifications') => void; }
export default function FinanceTopbar({ title='Good afternoon, Fred',onToggleNavigation,onAction }: FinanceTopbarProps) { return <header className={`${styles.root} ${styles.topbar}`}><button type="button" className={styles.toggle} aria-label="Toggle navigation" onClick={onToggleNavigation}><Icon name="Toggle" /></button><h1>{title}</h1><div className={styles.actions}>{(['Swap','Receive','Send'] as const).map(action=><button key={action} type="button" className={action==='Send'?styles.primary:''} onClick={()=>onAction?.(action)}><Icon name={action}/>{action}</button>)}<button type="button" aria-label="Notifications" onClick={()=>onAction?.('Notifications')}><Icon name="Notifications"/></button></div></header>; }

