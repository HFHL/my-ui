import FinanceLayout from './index';
import styles from './styles.module.css';
export default function Preview(){return <div style={{width:'100%'}}><FinanceLayout height={420} sidebar={<><div className={styles.demoProfile}>Fred Palmer</div><nav className={styles.demoNav}>Dashboard<span>Portfolio</span><span>Transactions</span></nav></>} header={<strong>Good afternoon, Fred</strong>}><section className={styles.demoPanel}><h3>Workspace</h3><p>Place your own components in the content slot.</p></section></FinanceLayout></div>;}
