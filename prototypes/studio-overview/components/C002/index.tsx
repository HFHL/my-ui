import styles from './styles.module.css';
export default function MetricCard({ label, value, change, detail }: { label: string; value: string; change: string; detail: string }) {
  return <section className={styles.card} aria-label={label}><span className={styles.label}>{label}</span><strong className={styles.value}>{value}</strong><div className={styles.bottom}><span className={styles.change}>{change}</span><span>{detail}</span></div></section>;
}
