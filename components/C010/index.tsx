import styles from './styles.module.css';
import iconAssets from './icons.json';
const icons: Record<string, string> = iconAssets;
function Icon({ name }: { name: string }) { return <span className={styles.icon} aria-hidden="true" dangerouslySetInnerHTML={{ __html: icons[name] ?? '' }} />; }

import { useState } from 'react';
import type { CSSProperties } from 'react';
export interface FinanceMenuItem { id: string; label: string; icon?: string; badge?: string; }
export interface FinanceSidebarProps { items?: FinanceMenuItem[]; activeId?: string; defaultActiveId?: string; onNavigate?: (item: FinanceMenuItem) => void; onLogout?: () => void; profile?: { name: string; email: string; initials: string }; height?: CSSProperties['height']; }
const defaultItems: FinanceMenuItem[] = ['Dashboard','Portfolio','Spending','Transactions','Earn','Settings'].map(label => ({ id: label.toLowerCase(), label, icon: label, badge: label === 'Earn' ? 'New' : undefined }));
export default function FinanceSidebar({ items = defaultItems, activeId, defaultActiveId = 'dashboard', onNavigate, onLogout, profile = { name: 'Fred Palmer', email: 'fred@heroui.dev', initials: 'FP' }, height = 620 }: FinanceSidebarProps) {
 const [selected,setSelected] = useState(defaultActiveId);
 return <aside className={`${styles.root} ${styles.sidebar}`} style={{ height }} aria-label="Finance sidebar"><div className={styles.profile}><span className={styles.avatar}>{profile.initials}</span><div><strong>{profile.name}</strong><small>{profile.email}</small></div></div><nav className={styles.nav} aria-label="Finances navigation">{items.map(item => <button key={item.id} type="button" aria-current={(activeId ?? selected) === item.id ? 'page' : undefined} onClick={() => { if (activeId === undefined) setSelected(item.id); onNavigate?.(item); }}><Icon name={item.icon ?? item.label} /><span>{item.label}</span>{item.badge && <small className={styles.badge}>{item.badge}</small>}</button>)}</nav><div className={styles.footer}><button type="button" onClick={() => onNavigate?.({ id:'help',label:'Help & Information' })}><Icon name="Help & Information" />Help & Information</button><button type="button" onClick={onLogout}><Icon name="Log out" />Log out</button></div></aside>;
}

