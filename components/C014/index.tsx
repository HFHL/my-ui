import styles from './styles.module.css';

import { useState } from 'react';
export type TimeRange = '1D'|'1W'|'1M'|'3M'|'1Y'|'All';
export interface TimeRangeSelectorProps { value?: TimeRange; defaultValue?: TimeRange; onChange?: (range:TimeRange)=>void; options?:TimeRange[]; }
export default function TimeRangeSelector({value,defaultValue='1M',onChange,options=['1D','1W','1M','3M','1Y','All']}:TimeRangeSelectorProps){const [local,setLocal]=useState(defaultValue);return <div className={`${styles.root} ${styles.ranges}`} role="group" aria-label="Time range">{options.map(range=><button key={range} type="button" aria-pressed={(value??local)===range} onClick={()=>{if(value===undefined)setLocal(range);onChange?.(range);}}>{range}</button>)}</div>;}

