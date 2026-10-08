import styles from './styles.module.css';
import iconAssets from './icons.json';
const icons: Record<string, string> = iconAssets;
function Icon({ name }: { name: string }) { return <span className={styles.icon} aria-hidden="true" dangerouslySetInnerHTML={{ __html: icons[name] ?? '' }} />; }

import type {ButtonHTMLAttributes} from 'react';
export interface ActionButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> { action?:'Swap'|'Receive'|'Send'|'Notifications';variant?:'primary'|'secondary'|'ghost';iconOnly?:boolean; }
export default function ActionButton({action='Send',variant='secondary',iconOnly=false,children,className='',type='button',...props}:ActionButtonProps){return <button {...props} type={type} aria-label={props['aria-label'] ?? (iconOnly?action:undefined)} className={`${styles.root} ${styles.button} ${styles[variant]} ${className}`}><Icon name={action}/>{!iconOnly && (children??action)}</button>;}

