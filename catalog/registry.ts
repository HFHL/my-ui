import type { ComponentType } from 'react';
import type { ComponentMeta, PrototypeMeta } from './types';

const metadata = import.meta.glob<ComponentMeta>('../components/C*/meta.json', { eager: true, import: 'default' });
export const components = Object.values(metadata).sort((a, b) => Number(a.id.slice(1)) - Number(b.id.slice(1)));
const componentPreviews = import.meta.glob<{ default: ComponentType }>('../components/C*/Preview.tsx');
const prototypeMetadata = import.meta.glob<PrototypeMeta>('../prototypes/*/meta.json', { eager: true, import: 'default' });
export const prototypes = Object.values(prototypeMetadata).sort((a, b) => a.slug.localeCompare(b.slug));
const prototypePreviews = import.meta.glob<{ default: ComponentType }>('../prototypes/*/App.tsx');

export function getPreviewLoader(kind: 'component' | 'prototype', id: string) {
  return kind === 'component'
    ? componentPreviews[`../components/${id}/Preview.tsx`]
    : prototypePreviews[`../prototypes/${id}/App.tsx`];
}

export function filterComponents(items: ComponentMeta[], query: string, category: string, tags: string[], favorites?: Set<string>) {
  const terms = query.trim().toLocaleLowerCase().split(/\s+/).filter(Boolean);
  return items.filter(item => {
    const text = [item.id, item.name, item.description, item.category, ...item.tags].join(' ').toLocaleLowerCase();
    return (category === '全部' || item.category === category)
      && tags.every(tag => item.tags.includes(tag))
      && terms.every(term => text.includes(term))
      && (!favorites || favorites.has(item.id));
  });
}

export const previewUrl = (kind: 'component' | 'prototype', id: string) => `/?preview=${kind}&id=${encodeURIComponent(id)}`;
