import {useState} from 'react';
import UserProfile from './index';
export default function Preview(){const [message,setMessage]=useState('');return <div><UserProfile onSelect={()=>setMessage('Profile selected')}/><p role="status">{message}</p></div>;}
