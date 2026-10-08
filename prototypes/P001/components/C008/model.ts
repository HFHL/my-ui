export type SidebarTheme = 'light' | 'dark';
export type SidebarIcon = 'dashboard' | 'revenue' | 'notifications' | 'analytics' | 'inventory';
export interface SidebarItem {
  id: string;
  label: string;
  icon: SidebarIcon;
  disabled?: boolean;
}

export const defaultItems: SidebarItem[] = [
  { id: 'dashboard', label: 'Dashboard', icon: 'dashboard' },
  { id: 'revenue', label: 'Revenue', icon: 'revenue' },
  { id: 'notifications', label: 'Notifications', icon: 'notifications' },
  { id: 'analytics', label: 'Analytics', icon: 'analytics' },
  { id: 'inventory', label: 'Inventory', icon: 'inventory' },
];

export function filterNavigation(items: SidebarItem[], query: string): SidebarItem[] {
  const terms = query.trim().toLocaleLowerCase().split(/\s+/).filter(Boolean);
  return items.filter(item => terms.every(term => `${item.id} ${item.label}`.toLocaleLowerCase().includes(term)));
}
