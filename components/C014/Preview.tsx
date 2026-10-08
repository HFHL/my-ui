import {useState} from 'react';
import TimeRangeSelector from './index';
export default function Preview(){const [value,setValue]=useState('1M');return <div><TimeRangeSelector onChange={setValue}/><p role="status">{value}</p></div>;}
