import type { ButtonHTMLAttributes } from 'react';
import styles from './styles.module.css';

export default function Button({ variant = 'primary', className = '', ...props }: ButtonHTMLAttributes<HTMLButtonElement> & { variant?: 'primary' | 'secondary' | 'ghost' }) {
  return <button type="button" {...props} className={`${styles.button} ${styles[variant]} ${className}`} />;
}
