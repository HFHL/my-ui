import { useState } from 'react';
import SidebarNavigation from './components/C008';
import type { SidebarItem, SidebarTheme } from './components/C008';
import styles from './styles.module.css';

const items: SidebarItem[] = [
  { id: 'workspace', label: '工作台', icon: 'dashboard' },
  { id: 'projects', label: '项目', icon: 'inventory' },
  { id: 'recent', label: '最近使用', icon: 'revenue' },
  { id: 'notifications', label: '通知', icon: 'notifications' },
  { id: 'settings', label: '设置', icon: 'analytics' },
];

export default function App() {
  const [collapsed, setCollapsed] = useState(false);
  const [theme, setTheme] = useState<SidebarTheme>('light');
  const [activeId, setActiveId] = useState('workspace');
  return <div className={styles.shell} data-prototype="P001" data-theme={theme} data-collapsed={collapsed}>
    <SidebarNavigation
      theme={theme} onThemeChange={setTheme}
      collapsed={collapsed} onCollapsedChange={setCollapsed}
      showCollapseControl items={items}
      activeId={activeId} onNavigate={item => setActiveId(item.id)}
      profile={{ name: 'P001', email: '工作台原型' }} height="100%"
    />
    <main className={styles.workbench} aria-label="工作台" />
  </div>;
}
