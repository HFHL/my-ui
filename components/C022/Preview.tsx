import {useState} from 'react';
import HoldingRow from './index';
export default function Preview(){const [message,setMessage]=useState('');return <div style={{width:330,maxWidth:'100%'}}><HoldingRow onSelect={()=>setMessage('BTC selected')}/><p role="status">{message}</p></div>;}
