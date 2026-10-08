import { useState } from 'react';
import ModernNavbar from './ModernNavbar';
import styles from './styles.module.css';

export default function Preview() {
  const [message, setMessage] = useState('');
  return <div className={styles.preview}>
    <ModernNavbar onNavigate={item => setMessage(`Selected: ${item.label}`)} onContact={() => setMessage('Contact action triggered.')} />
    <p className={styles.feedback} role="status">{message}</p>
  </div>;
}
