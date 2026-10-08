import { useState } from 'react';
import type { CSSProperties } from 'react';
import { IconLayoutSidebarLeftCollapse, IconLayoutSidebarLeftExpand, IconPlus } from '@tabler/icons-react';
import '@fontsource/open-sans/400.css';
import '@fontsource/open-sans/700.css';
import { assets, menuIcons } from './assets';
import { defaultItems } from './model';
import type { SidebarItem, SidebarTheme } from './model';
import styles from './styles.module.css';

export interface SidebarNavigationProps {
  theme?: SidebarTheme;
  defaultTheme?: SidebarTheme;
  onThemeChange?: (theme: SidebarTheme) => void;
  collapsed?: boolean;
  defaultCollapsed?: boolean;
  onCollapsedChange?: (collapsed: boolean) => void;
  showCollapseControl?: boolean;
  activeId?: string;
  defaultActiveId?: string;
  items?: SidebarItem[];
  onNavigate?: (item: SidebarItem) => void;
  onCreateProject?: () => void;
  onLogout?: () => void;
  profile?: { name: string; email: string; avatar?: string };
  height?: CSSProperties['height'];
  className?: string;
}

/** Figma 429:783: dark/light and expanded/small variants of one sidebar.
 * All assets are stored locally; theme tokens affect this root only.
 * Callbacks let the consuming prototype supply navigation and logout behavior.
 */
export function SidebarNavigation({
  theme: controlledTheme, defaultTheme = 'dark', onThemeChange,
  collapsed: controlledCollapsed, defaultCollapsed = false, onCollapsedChange, showCollapseControl = false,
  activeId: controlledActive, defaultActiveId, items = defaultItems,
  onNavigate, onCreateProject, onLogout,
  profile = { name: 'Duck UI', email: 'Duckui@demo.com' },
  height = 1024, className = '',
}: SidebarNavigationProps) {
  const [localTheme, setLocalTheme] = useState(defaultTheme);
  const [localCollapsed, setLocalCollapsed] = useState(defaultCollapsed);
  const [localActive, setLocalActive] = useState(defaultActiveId);
  const theme = controlledTheme ?? localTheme;
  const collapsed = controlledCollapsed ?? localCollapsed;
  const activeId = controlledActive ?? localActive;
  const isLight = theme === 'light';

  const toggleTheme = () => {
    const next = isLight ? 'dark' : 'light';
    if (controlledTheme === undefined) setLocalTheme(next);
    onThemeChange?.(next);
  };
  const toggleCollapsed = () => {
    if (controlledCollapsed === undefined) setLocalCollapsed(!collapsed);
    onCollapsedChange?.(!collapsed);
  };

  return <aside className={`${styles.sidebar} ${className}`} data-theme={theme} data-collapsed={collapsed} style={{ height }} aria-label="Dashboard sidebar navigation">
    <div className={styles.top}>
      <div className={styles.profile}>
        <img className={styles.avatar} src={profile.avatar ?? assets.avatar} width={56} height={56} alt={`${profile.name} avatar`} />
        {!collapsed && <div className={styles.profileText}><strong>{profile.name}</strong><span>{profile.email}</span></div>}
        {showCollapseControl && <button className={styles.collapseButton} type="button" aria-label={collapsed ? '展开侧栏' : '收起侧栏'} title={collapsed ? '展开侧栏' : '收起侧栏'} aria-expanded={!collapsed} onClick={toggleCollapsed}>{collapsed ? <IconLayoutSidebarLeftExpand size={20} stroke={1.5} /> : <IconLayoutSidebarLeftCollapse size={20} stroke={1.5} />}</button>}
      </div>
      <button className={styles.menuItem} type="button" aria-label="新建项目" title={collapsed ? '新建项目' : undefined} onClick={onCreateProject}><IconPlus size={18} stroke={1.5} aria-hidden="true" />{!collapsed && <span>新建项目</span>}</button>
      <section className={styles.projects} aria-label="Projects">
        {!collapsed && <h2 className={styles.sectionTitle}>Projects</h2>}
        <nav className={styles.menu} aria-label="项目列表">
          {items.map(item => <button key={item.id} type="button" className={styles.menuItem} disabled={item.disabled} aria-label={item.label} title={collapsed ? item.label : undefined} aria-current={activeId === item.id ? 'page' : undefined} onClick={() => { if (controlledActive === undefined) setLocalActive(item.id); onNavigate?.(item); }}><img src={menuIcons[item.icon][theme]} alt="" />{!collapsed && <span>{item.label}</span>}</button>)}
        </nav>
      </section>
    </div>
    <div className={styles.bottom}>
      <button className={styles.menuItem} type="button" aria-label="Logout" title={collapsed ? 'Logout' : undefined} onClick={onLogout}><img src={isLight ? assets.logoutLight : assets.logoutDark} alt="" />{!collapsed && <span>Logout</span>}</button>
      <div className={styles.themeControl}>
        {!collapsed && <span className={styles.themeLabel}><img src={isLight ? assets.sunLight : assets.sun} alt="" /><span>Light mode</span></span>}
        <button type="button" className={styles.themeSwitch} role="switch" aria-label="Light mode" aria-checked={isLight} onClick={toggleTheme}><span className={styles.knob}><img src={isLight ? assets.moon : assets.toggleSun} alt="" /></span></button>
      </div>
    </div>
  </aside>;
}

export default SidebarNavigation;
