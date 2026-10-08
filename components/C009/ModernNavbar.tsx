import { useState } from 'react';
import '@fontsource/inter/latin-500.css';
import styles from './styles.module.css';

export interface NavbarItem {
  id: string;
  label: string;
  disabled?: boolean;
}

export interface ModernNavbarProps {
  items?: NavbarItem[];
  activeId?: string;
  defaultActiveId?: string;
  onNavigate?: (item: NavbarItem) => void;
  contactLabel?: string;
  onContact?: () => void;
  className?: string;
  label?: string;
}

export const defaultItems: NavbarItem[] = [
  { id: 'home', label: 'Home' },
  { id: 'work', label: 'Work' },
  { id: 'awards', label: 'Awards' },
  { id: 'team', label: 'Team' },
  { id: 'prices', label: 'Prices' },
];

/** Figma 1:14: pill navigation, default Awards selection and Contact action.
 * The preview's dark canvas is separate from the reusable navigation itself.
 * Navigation callbacks let the consuming prototype supply its own routing.
 */
export function ModernNavbar({
  items = defaultItems, activeId, defaultActiveId = 'awards', onNavigate,
  contactLabel = 'Contact', onContact, className = '', label = 'Main navigation',
}: ModernNavbarProps) {
  const [localActive, setLocalActive] = useState(defaultActiveId);
  const selectedId = activeId ?? localActive;
  return <nav className={`${styles.navbar} ${className}`} aria-label={label}>
    {items.map(item => <button type="button" key={item.id} className={styles.item} aria-current={selectedId === item.id ? 'page' : undefined} disabled={item.disabled} onClick={() => { if (activeId === undefined) setLocalActive(item.id); onNavigate?.(item); }}>{item.label}</button>)}
    <button type="button" className={styles.contact} onClick={onContact}>{contactLabel}</button>
  </nav>;
}

export default ModernNavbar;
