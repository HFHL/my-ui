import styles from './styles.module.css';

export interface UserProfileProps { name?:string;email?:string;initials?:string;avatarUrl?:string;onSelect?:()=>void; }
export default function UserProfile({name='Fred Palmer',email='fred@heroui.dev',initials='FP',avatarUrl,onSelect}:UserProfileProps){const contents=<>{avatarUrl?<img className={styles.avatar} src={avatarUrl} width={36} height={36} alt={name}/>:<span className={styles.avatar} role="img" aria-label={name}>{initials}</span>}<span className={styles.text}><strong>{name}</strong><small>{email}</small></span></>;return onSelect?<button type="button" className={`${styles.root} ${styles.profile}`} onClick={onSelect}>{contents}</button>:<div className={`${styles.root} ${styles.profile}`}>{contents}</div>;}

