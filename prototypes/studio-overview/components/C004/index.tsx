import styles from './styles.module.css';
export default function SegmentedControl({ options, value, onChange, label = '选择视图' }: { options: string[]; value: string; onChange: (value: string) => void; label?: string }) {
  return <div className={styles.group} role="group" aria-label={label}>{options.map(option => <button type="button" key={option} className={`${styles.option} ${option === value ? styles.selected : ''}`} aria-pressed={option === value} onClick={() => onChange(option)}>{option}</button>)}</div>;
}
