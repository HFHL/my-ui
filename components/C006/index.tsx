import styles from './styles.module.css';
export default function EmptyState({ title, description, action, onAction }: { title: string; description: string; action: string; onAction: () => void }) {
  return <section className={styles.empty}><span className={styles.symbol} aria-hidden="true">＋</span><h3>{title}</h3><p>{description}</p><button type="button" onClick={onAction}>{action}</button></section>;
}
