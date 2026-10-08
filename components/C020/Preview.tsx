import {useState} from 'react';
import ActionButton from './index';
export default function Preview(){const [message,setMessage]=useState('');return <div><div style={{display:'flex',gap:8,flexWrap:'wrap'}}><ActionButton action="Swap" variant="ghost" onClick={()=>setMessage('Swap')}/><ActionButton action="Receive" variant="ghost" onClick={()=>setMessage('Receive')}/><ActionButton onClick={()=>setMessage('Send')}/></div><p role="status">{message}</p></div>;}
