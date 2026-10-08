import { useEffect, useRef, useState } from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import dashboard from './assets/dashboard.html?raw';
import ranges from './assets/ranges.json';
import dayChart from './assets/1D.svg?raw';
import weekChart from './assets/1W.svg?raw';
import monthChart from './assets/1M.svg?raw';
import quarterChart from './assets/3M.svg?raw';
import yearChart from './assets/1Y.svg?raw';
import allChart from './assets/All.svg?raw';
import './assets/source.css';
import './prototype.css';

const charts = { '1D': dayChart, '1W': weekChart, '1M': monthChart, '3M': quarterChart, '1Y': yearChart, All: allChart };
type Range = keyof typeof charts;
const periodNames = Object.keys(charts) as Range[];

/** Public dashboard markup/styles are the source baseline, not remote scripts.
 * Adapters below supply local navigation, chart switching and demo actions.
 * No credentials, wallet integration or transaction requests are present.
 */
export default function App() {
  const rootRef = useRef<HTMLDivElement>(null);
  const [period, setPeriod] = useState<Range>('1M');
  const [action, setAction] = useState<string | null>(null);
  const [feedback, setFeedback] = useState('');

  useEffect(() => {
    const root = rootRef.current!;
    const provider = root.querySelector<HTMLElement>('[data-app-layout]')!;
    const wrapper = root.querySelector<HTMLElement>('.sidebar__offcanvas-wrapper')!;
    const sidebar = root.querySelector<HTMLElement>('[data-slot="sidebar"]')!;
    root.querySelector('[data-slot="sidebar-trigger"]')?.setAttribute('aria-label', 'Toggle navigation');
    for (const menu of root.querySelectorAll('[data-sidebar="menu"]')) menu.setAttribute('role', 'navigation');
    for (const item of root.querySelectorAll<HTMLElement>('[data-slot="sidebar-menu-item"]')) {
      item.setAttribute('role', 'button'); item.tabIndex = 0;
      item.removeAttribute('aria-labelledby');
      if (item.getAttribute('data-current') === 'true') item.setAttribute('aria-current', 'page');
    }

    const toggleSidebar = () => {
      const collapsed = window.matchMedia('(max-width: 768px)').matches
        ? provider.dataset.mobileOpen === 'true'
        : provider.dataset.state !== 'collapsed';
      for (const node of [provider, wrapper, sidebar]) node.dataset.state = collapsed ? 'collapsed' : 'expanded';
      provider.dataset.mobileOpen = String(!collapsed);
      for (const toggle of root.querySelectorAll('[data-slot="sidebar-trigger"], [data-slot="app-layout-menu-toggle"]')) toggle.setAttribute('aria-expanded', String(!collapsed));
    };

    const activate = (target: HTMLElement) => {
      const menu = target.closest<HTMLElement>('[data-slot="sidebar-menu-item"]');
      if (menu) {
        const name = menu.getAttribute('aria-label') ?? '';
        if (name === 'Log out') { setAction('Log out'); return; }
        for (const item of root.querySelectorAll('[data-slot="sidebar-menu-item"]')) {
          item.removeAttribute('data-current'); item.removeAttribute('aria-current');
        }
        menu.dataset.current = 'true'; menu.setAttribute('aria-current', 'page');
        if (name === 'Dashboard') window.scrollTo({ top: 0, behavior: 'auto' });
        else if (name === 'Portfolio') root.querySelector('.line-chart')?.scrollIntoView({ block: 'center', behavior: 'auto' });
        else if (name === 'Transactions') root.querySelector('table[aria-label="Recent activity"]')?.scrollIntoView({ block: 'center', behavior: 'auto' });
        else setAction(name);
        return;
      }
      const button = target.closest<HTMLButtonElement>('button');
      if (button) {
        const slot = button.dataset.slot;
        const text = button.textContent?.trim() ?? '';
        if (slot === 'sidebar-trigger' || slot === 'app-layout-menu-toggle') { toggleSidebar(); return; }
        if (periodNames.includes(text as Range)) { setPeriod(text as Range); return; }
        if (text === 'See all holdings') { setAction('Holdings'); return; }
        setFeedback(''); setAction(button.getAttribute('aria-label') ?? text);
        return;
      }
      const column = target.closest<HTMLElement>('[role="columnheader"]');
      if (column?.textContent?.trim() === 'Date') {
        const tbody = root.querySelector('table[aria-label="Recent activity"] tbody');
        if (tbody) {
          const rows = Array.from(tbody.querySelectorAll('tr'));
          rows.reverse().forEach(row => tbody.appendChild(row));
          column.setAttribute('aria-sort', column.getAttribute('aria-sort') === 'ascending' ? 'descending' : 'ascending');
        }
      }
    };
    const click = (event: MouseEvent) => { if (event.target instanceof HTMLElement || event.target instanceof SVGElement) { event.preventDefault(); activate(event.target as HTMLElement); } };
    const keydown = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement;
      if ((event.key === 'Enter' || event.key === ' ') && target.closest('[data-slot="sidebar-menu-item"], [role="columnheader"]')) { event.preventDefault(); activate(target); }
    };
    root.addEventListener('click', click); root.addEventListener('keydown', keydown);
    return () => { root.removeEventListener('click', click); root.removeEventListener('keydown', keydown); };
  }, []);

  useEffect(() => {
    const root = rootRef.current!;
    const chart = root.querySelector<HTMLElement>('.line-chart')!;
    chart.innerHTML = charts[period]; chart.dataset.period = period;
    for (const button of root.querySelectorAll('button[aria-pressed]')) {
      const selected = button.textContent?.trim() === period;
      button.setAttribute('aria-pressed', String(selected));
      button.classList.toggle('text-accent', selected); button.classList.toggle('text-muted', !selected);
    }
    const header = chart.closest('[data-slot="card"]')?.querySelector('.card__header');
    const value = header?.querySelector('[data-slot="trend-chip-value"]');
    if (value) {
      value.textContent = ranges[period].summary.match(/\+\d+\.\d+%/)?.[0] ?? '';
      const label = value.closest('[data-slot="chip"]')?.nextElementSibling;
      if (label) label.textContent = period;
    }
  }, [period]);

  return <>
    <div ref={rootRef} className="p002-root bg-background text-foreground font-sans antialiased" data-prototype="P002" dangerouslySetInnerHTML={{ __html: dashboard }} />
    <Dialog.Root open={!!action} onOpenChange={open => { if (!open) { setAction(null); setFeedback(''); } }}>
      <Dialog.Portal><Dialog.Overlay className="p002-overlay" /><Dialog.Content className="p002-dialog">
        <Dialog.Title>{action}</Dialog.Title>
        <Dialog.Description>{action === 'Holdings' ? 'Sample portfolio holdings from this dashboard.' : 'Explore this action in the local finance prototype. No account or wallet is connected.'}</Dialog.Description>
        {['Swap', 'Send', 'Receive'].includes(action ?? '') && <form onSubmit={event => { event.preventDefault(); setFeedback('Demo complete. No transaction was sent.'); }}>
          <label>Asset<select aria-label="Asset"><option>ETH</option><option>BTC</option><option>USDC</option><option>SOL</option></select></label>
          {action !== 'Receive' && <label>Amount<input aria-label="Amount" type="number" min="0.000001" step="any" required placeholder="0.00" /></label>}
          {action === 'Send' && <label>Recipient<input aria-label="Recipient" required placeholder="Wallet address" /></label>}
          {action === 'Receive' && <p className="p002-demo-address">Demo wallet · not a real receiving address</p>}
          <button className="button button--primary" type="submit">Preview {action?.toLowerCase()}</button>
        </form>}
        {action === 'Holdings' && <ul className="p002-holdings"><li>BTC · Bitcoin · $1,283.84</li><li>USDC · $2,087.25</li><li>ETH · Ethereum · $1,087.25</li><li>BNB · BNB Chain · $165.20</li><li>SOL · Solana · $195.54</li></ul>}
        {action === 'Settings' && <label className="p002-preference"><input type="checkbox" /> Show portfolio notifications</label>}
        <p role="status" className="p002-feedback">{feedback}</p>
        <Dialog.Close className="button button--secondary">Close</Dialog.Close>
      </Dialog.Content></Dialog.Portal>
    </Dialog.Root>
  </>;
}
