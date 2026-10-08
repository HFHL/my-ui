import { useEffect, useRef, useState } from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { IconArrowRight, IconBookmark, IconBookmarkFilled, IconCheck, IconCode, IconCopy, IconExternalLink, IconLayoutGrid, IconLayersIntersect, IconSearch, IconX, IconFolder, IconCommand } from '@tabler/icons-react';
import { components, filterComponents, prototypes, previewUrl } from './registry';
import type { ComponentMeta } from './types';
import './styles.css';

function loadFavorites(): string[] {
  try { const saved: unknown = JSON.parse(localStorage.getItem('my-ui:favorites') ?? '[]'); return Array.isArray(saved) ? saved.filter((id): id is string => typeof id === 'string') : []; } catch { return []; }
}

export default function App() {
  const [section, setSection] = useState<'components' | 'favorites' | 'prototypes'>('components');
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('全部');
  const [tags, setTags] = useState<string[]>([]);
  const [favorites, setFavorites] = useState(loadFavorites);
  const [selected, setSelected] = useState<ComponentMeta | null>(null);
  const [notice, setNotice] = useState('');
  const [sort, setSort] = useState('id');
  const searchRef = useRef<HTMLInputElement>(null);
  const categories = [...new Set(components.map(item => item.category))];
  const allTags = [...new Set(components.map(item => item.tags).flat())];
  const filtered = filterComponents(components, query, category, tags, section === 'favorites' ? new Set(favorites) : undefined);
  if (sort === 'newest') filtered.sort((a, b) => b.createdAt.localeCompare(a.createdAt) || Number(b.id.slice(1)) - Number(a.id.slice(1)));

  useEffect(() => { try { localStorage.setItem('my-ui:favorites', JSON.stringify(favorites)); } catch { setNotice('浏览器未允许保存收藏，当前会话仍可使用。'); } }, [favorites]);
  useEffect(() => { if (!notice) return; const timer = setTimeout(() => setNotice(''), 3500); return () => clearTimeout(timer); }, [notice]);
  useEffect(() => {
    const onKey = (event: KeyboardEvent) => { if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k' && section !== 'prototypes') { event.preventDefault(); searchRef.current?.focus(); } };
    window.addEventListener('keydown', onKey); return () => window.removeEventListener('keydown', onKey);
  }, [section]);

  const toggleFavorite = (id: string) => setFavorites(prev => prev.includes(id) ? prev.filter(value => value !== id) : [...prev, id]);
  const switchSection = (value: typeof section) => { setSection(value); setQuery(''); setCategory('全部'); setTags([]); };
  const clearFilters = () => { setQuery(''); setCategory('全部'); setTags([]); };
  const copy = async (value: string) => { try { await navigator.clipboard.writeText(value); setNotice(`已复制 ${value}`); } catch { setNotice('复制失败，请手动选择并复制。'); } };

  return <div className="workspace">
    <aside className="sidebar">
      <a className="brand" href="/" aria-label="my UI 首页"><span className="brand-mark"><IconLayersIntersect size={22} /></span><span>my UI<span className="brand-sub">我的组件工作室</span></span></a>
      <nav aria-label="工作区" className="main-nav">
        <button className={section === 'components' ? 'nav-item active' : 'nav-item'} onClick={() => switchSection('components')}><IconLayoutGrid size={19} />组件收藏库<span className="count">{components.length}</span></button>
        <button className={section === 'favorites' ? 'nav-item active' : 'nav-item'} onClick={() => switchSection('favorites')}><IconBookmark size={19} />我的收藏<span className="count">{components.filter(item => favorites.includes(item.id)).length}</span></button>
        <button className={section === 'prototypes' ? 'nav-item active' : 'nav-item'} onClick={() => switchSection('prototypes')}><IconFolder size={19} />项目原型<span className="count">{prototypes.length}</span></button>
      </nav>
      <div className="category-nav"><p className="nav-label">按分类浏览</p><button className={category === '全部' && section !== 'prototypes' ? 'category active' : 'category'} onClick={() => { if (section === 'prototypes') switchSection('components'); setCategory('全部'); }}>全部组件<span>{components.length}</span></button>{categories.map(value => <button key={value} className={category === value && section !== 'prototypes' ? 'category active' : 'category'} onClick={() => { if (section === 'prototypes') switchSection('components'); setCategory(value); }}>{value}<span>{components.filter(item => item.category === value).length}</span></button>)}</div>
      <div className="sidebar-note"><IconCode size={19} /><strong>按编号组装你的想法</strong><p>找到组件，记下编号，<br />从收藏走向原型。</p></div>
      <div className="sidebar-bottom"><span className="avatar">F</span><div>个人工作区<small>本地文件维护</small></div></div>
    </aside>
    <main className="main-content">
      <header className="topbar"><div>工作区<span>/</span>{section === 'prototypes' ? '项目原型' : section === 'favorites' ? '我的收藏' : '组件收藏库'}</div><span className="topbar-note">收集 · 查找 · 组装</span></header>
      <div className="content">
        <div className="page-heading"><div className="eyebrow">YOUR UI COLLECTION</div><h1>{section === 'prototypes' ? '让想法成为界面。' : section === 'favorites' ? '留住你常用的组件。' : '好用的组件，放在一起。'}</h1><p>{section === 'prototypes' ? '每个原型独立维护，保留所用组件的来源编号。' : '一个自己的 UI 收藏库。按分类找到灵感，用编号快速组装。'}</p></div>
        {section === 'prototypes' ? <>
          <div className="section-heading"><h2>项目原型 <span>{prototypes.length}</span></h2><code>npm run prototype:new -- 项目名 C001 C002</code></div>
          <div className="prototype-grid">{prototypes.map(item => <article key={item.slug} className="prototype-card"><div className="prototype-preview"><iframe loading="lazy" title={`${item.name}预览`} src={previewUrl('prototype', item.slug)} tabIndex={-1} /></div><div className="prototype-info"><span className="source-note">{item.slug}</span><h3>{item.name}</h3><p>{item.description}</p><div className="prototype-bottom"><span>{item.components.map(c => c.id).join(' · ')}</span><a href={previewUrl('prototype', item.slug)} target="_blank" rel="noreferrer">打开原型 <IconArrowRight size={16} /></a></div></div></article>)}</div>
          {prototypes.length === 0 && <div className="empty-results"><IconFolder size={34} /><h2>开始你的第一个原型</h2><p>在终端运行上方命令，复制组件后重新启动展示页。</p></div>}
        </> : <>
          <div className="search-row"><div className="search-box"><IconSearch size={20} /><input ref={searchRef} aria-label="搜索组件" placeholder="搜索编号、名称、标签或关键词…" value={query} onChange={event => setQuery(event.target.value)} />{query ? <button aria-label="清空搜索" onClick={() => setQuery('')}><IconX size={17} /></button> : <kbd><IconCommand size={12} /> K</kbd>}</div><label className="sort-label"><span className="sr-only">排序</span><select aria-label="排序" value={sort} onChange={event => setSort(event.target.value)}><option value="id">编号顺序</option><option value="newest">最近添加</option></select></label></div>
          <div className="filter-row"><span>标签</span>{allTags.map(tag => <button key={tag} aria-pressed={tags.includes(tag)} className={tags.includes(tag) ? 'tag-filter selected' : 'tag-filter'} onClick={() => setTags(prev => prev.includes(tag) ? prev.filter(value => value !== tag) : [...prev, tag])}>{tag}</button>)}{tags.length > 0 && <button className="reset-link" onClick={() => setTags([])}>清除标签</button>}</div>
          <div className="section-heading"><h2>{category === '全部' ? section === 'favorites' ? '已收藏组件' : '全部组件' : category}<span>{filtered.length}</span></h2><span className="section-note">{components.length} 个组件 · 点击卡片查看详情</span></div>
          <div className="component-grid">{filtered.map(item => <article key={item.id} className="component-card">
            <div className="component-stage"><iframe title={`${item.id} ${item.name}缩略预览`} src={previewUrl('component', item.id)} loading="lazy" tabIndex={-1} /><button className="stage-link" aria-label={`查看 ${item.id} ${item.name}`} onClick={() => setSelected(item)}><span>交互预览 <IconExternalLink size={15} /></span></button></div>
            <div className="component-info"><div className="component-title"><button className="id-badge" aria-label={`复制 ${item.id}`} onClick={() => copy(item.id)}>{item.id}</button><button className="component-name" onClick={() => setSelected(item)}>{item.name}</button><button className="favorite-button" aria-label={`${favorites.includes(item.id) ? '取消收藏' : '收藏'} ${item.id}`} aria-pressed={favorites.includes(item.id)} onClick={() => toggleFavorite(item.id)}>{favorites.includes(item.id) ? <IconBookmarkFilled size={18} /> : <IconBookmark size={18} />}</button></div><p>{item.description}</p><div className="component-bottom"><span>{item.category}</span><span>{item.tags.slice(0, 2).join(' / ')}</span></div></div>
          </article>)}</div>
          {filtered.length === 0 && <div className="empty-results"><IconSearch size={34} /><h2>{section === 'favorites' && favorites.length === 0 ? '收藏你想再用的组件' : '没有找到匹配的组件'}</h2><p>{section === 'favorites' && favorites.length === 0 ? '点击组件卡片右侧的书签图标，把组件留在这里。' : '试试其他关键词，或清除分类与标签筛选。'}</p><button className="plain-button" onClick={section === 'favorites' && favorites.length === 0 ? () => switchSection('components') : clearFilters}>{section === 'favorites' && favorites.length === 0 ? '浏览组件' : '清除筛选'}</button></div>}
          <div className="library-footer"><span>每个编号，都是一块可以复用的积木。</span><span>新增组件 <code>npm run component:new -- 名称 分类</code></span></div>
        </>}
      </div>
    </main>
    <Dialog.Root open={!!selected} onOpenChange={open => { if (!open) setSelected(null); }}><Dialog.Portal><Dialog.Overlay className="dialog-overlay" /><Dialog.Content className="detail-dialog">
      {selected && <><div className="dialog-header"><div><span className="id-badge">{selected.id}</span><Dialog.Title>{selected.name}</Dialog.Title></div><Dialog.Close className="icon-button" aria-label="关闭详情"><IconX size={22} /></Dialog.Close></div><Dialog.Description className="dialog-description">{selected.description}</Dialog.Description><div className="detail-stage"><iframe title={`${selected.id} 交互预览`} src={previewUrl('component', selected.id)} /></div><div className="detail-metadata"><div><span>分类</span><strong>{selected.category}</strong></div><div><span>标签</span><strong>{selected.tags.join(' / ')}</strong></div><div><span>来源</span><strong>{selected.source}</strong></div><div><span>许可</span><strong>{selected.license}</strong></div></div><div className="source-path"><IconCode size={17} /><code>components/{selected.id}/</code><button className="icon-button" aria-label="复制组件路径" onClick={() => copy(`components/${selected.id}/`)}><IconCopy size={16} /></button></div><div className="dialog-actions"><button className="plain-button" onClick={() => copy(selected.id)}><IconCopy size={16} />复制编号</button><button className="plain-button" onClick={() => toggleFavorite(selected.id)}>{favorites.includes(selected.id) ? <IconCheck size={16} /> : <IconBookmark size={16} />}{favorites.includes(selected.id) ? '已收藏' : '收藏组件'}</button><a className="primary-button" href={previewUrl('component', selected.id)} target="_blank" rel="noreferrer">单独预览<IconExternalLink size={16} /></a></div></>}
    </Dialog.Content></Dialog.Portal></Dialog.Root>
    <div className={notice ? 'toast visible' : 'toast'} role="status" aria-live="polite">{notice}</div>
  </div>;
}
