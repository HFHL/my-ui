import type { InputHTMLAttributes } from 'react';
import styles from './styles.module.css';
export default function SearchField({ label = '搜索', className = '', ...props }: InputHTMLAttributes<HTMLInputElement> & { label?: string }) {
  return <label className={styles.field}><span className={styles.symbol} aria-hidden="true">⌕</span><input type="search" aria-label={label} {...props} className={`${styles.input} ${className}`} /></label>;
}
