import {useState} from 'react';
import TransactionTable from './index';
export default function Preview(){const [message,setMessage]=useState('');return <div style={{width:'100%'}}><TransactionTable onSelect={row=>setMessage(row.hash)} onSortChange={setMessage}/><p role="status">{message}</p></div>;}
