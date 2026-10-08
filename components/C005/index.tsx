import styles from './styles.module.css';
export default function Navigation({ brand, items, active, onChange }: { brand: string; items: string[]; active: string; onChange: (item: string) => void }) {
  return <nav className={styles.nav} aria-label="项目导航"><strong className={styles.brand}>{brand}</strong><div className={styles.items}>{items.map(item => <button key={item} type="button" className={`${styles.item} ${active === item ? styles.active : ''}`} aria-current={active === item ? 'page' : undefined} onClick={() => onChange(item)}>{item}</button>)}</div></nav>;
}
