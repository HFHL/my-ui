import styles from './styles.module.css';

import type {CSSProperties} from 'react';
export interface AssetAvatarProps { symbol?:string;label?:string;color?:string;size?:number; }
export default function AssetAvatar({symbol='BTC',label='Bitcoin',color='#F7931A',size=32}:AssetAvatarProps){return <span className={`${styles.root} ${styles.avatar}`} style={{'--avatar-color':color,width:size,height:size,fontSize:Math.max(10,size*.375)} as CSSProperties} role="img" aria-label={label}>{symbol.slice(0,1)}</span>;}

