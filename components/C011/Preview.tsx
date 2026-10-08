import { useState } from 'react';
import FinanceTopbar from './index';
export default function Preview(){const [message,setMessage]=useState('');return <div style={{width:'100%'}}><FinanceTopbar onToggleNavigation={()=>setMessage('Navigation toggled')} onAction={setMessage}/><p role="status">{message}</p></div>;}
