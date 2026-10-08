import {useState} from 'react';
import HoldingsList from './index';
export default function Preview(){const [message,setMessage]=useState('');return <div style={{width:330,maxWidth:'100%'}}><HoldingsList onSelect={item=>setMessage(item.symbol)} onSeeAll={()=>setMessage('See all holdings callback')}/><p role="status">{message}</p></div>;}
