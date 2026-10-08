import styles from './styles.module.css';
import iconAssets from './icons.json';
const icons: Record<string, string> = iconAssets;
function Icon({ name }: { name: string }) { return <span className={styles.icon} aria-hidden="true" dangerouslySetInnerHTML={{ __html: icons[name] ?? '' }} />; }

import {useState} from 'react';
import type {ReactNode,CSSProperties} from 'react';
export interface FinanceLayoutProps { sidebar?:ReactNode;header?:ReactNode;children?:ReactNode;collapsed?:boolean;defaultCollapsed?:boolean;onCollapsedChange?:(collapsed:boolean)=>void;height?:CSSProperties['height']; }
export default function FinanceLayout({sidebar,header,children,collapsed,defaultCollapsed=false,onCollapsedChange,height='100dvh'}:FinanceLayoutProps){const [local,setLocal]=useState(()=>defaultCollapsed || (typeof window!=='undefined' && window.matchMedia('(max-width:768px)').matches));const closed=collapsed??local;return <div className={`${styles.root} ${styles.layout}`} data-collapsed={closed} style={{height}}><aside className={styles.sidebar} hidden={closed} aria-label="Finance layout sidebar">{sidebar}</aside><div className={styles.main}><header className={styles.header}><button type="button" className={styles.toggle} aria-label="Toggle navigation" aria-expanded={!closed} onClick={()=>{if(collapsed===undefined)setLocal(!closed);onCollapsedChange?.(!closed);}}><Icon name="Toggle"/></button>{header}</header><main className={styles.content} aria-label="Finance workspace">{children}</main></div></div>;}

