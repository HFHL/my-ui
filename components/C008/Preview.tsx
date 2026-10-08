import { useState } from 'react';
import SidebarNavigation from './SidebarNavigation';
import styles from './styles.module.css';

export default function Preview() {
  const [collapsed, setCollapsed] = useState(false);
  const [event, setEvent] = useState('Select a section or switch the theme.');
  return <div className={styles.preview}>
    <div className={styles.previewControls}><button type="button" aria-pressed={collapsed} onClick={() => setCollapsed(!collapsed)}>{collapsed ? '展开侧栏' : '收起侧栏'}</button><p role="status">{event}</p></div>
    <SidebarNavigation collapsed={collapsed} onCollapsedChange={setCollapsed} onNavigate={item => setEvent(`Selected: ${item.label}`)} onThemeChange={theme => setEvent(`Theme: ${theme}`)} onLogout={() => setEvent('Logout callback triggered (demo only).')} />
  </div>;
}
