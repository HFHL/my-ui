import { useState } from 'react';
import SidebarNavigation from './components/C008';
import type { SidebarItem, SidebarTheme } from './components/C008';
import styles from './styles.module.css';

const initialProjects: SidebarItem[] = [
  { id: 'project-001', label: '项目 01', icon: 'inventory' },
  { id: 'project-002', label: '项目 02', icon: 'inventory' },
  { id: 'project-003', label: '项目 03', icon: 'inventory' },
];

export default function App() {
  const [collapsed, setCollapsed] = useState(false);
  const [theme, setTheme] = useState<SidebarTheme>('light');
  const [projects, setProjects] = useState(initialProjects);
  const [activeId, setActiveId] = useState('project-001');
  const createProject = () => {
    const number = projects.length + 1;
    const project: SidebarItem = { id: `project-${String(number).padStart(3, '0')}`, label: `项目 ${String(number).padStart(2, '0')}`, icon: 'inventory' };
    setProjects(previous => [...previous, project]);
    setActiveId(project.id);
  };
  return <div className={styles.shell} data-prototype="P001" data-theme={theme} data-collapsed={collapsed}>
    <SidebarNavigation
      theme={theme} onThemeChange={setTheme}
      collapsed={collapsed} onCollapsedChange={setCollapsed}
      showCollapseControl items={projects} onCreateProject={createProject}
      activeId={activeId} onNavigate={item => setActiveId(item.id)}
      profile={{ name: 'P001', email: '工作台原型' }} height="100%"
    />
    <main className={styles.workbench} aria-label="工作台" />
  </div>;
}
