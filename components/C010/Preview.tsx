import { useState } from 'react';
import FinanceSidebar from './index';
export default function Preview() { const [message,setMessage]=useState('');return <div><FinanceSidebar onNavigate={item=>setMessage(item.label)} onLogout={()=>setMessage('Log out callback')} /><p role="status" style={{fontSize:12}}>{message}</p></div>; }
