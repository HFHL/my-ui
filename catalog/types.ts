export interface ComponentMeta {
  id: string;
  name: string;
  category: string;
  tags: string[];
  description: string;
  createdAt: string;
  source: string;
  license: string;
}

export interface PrototypeMeta {
  slug: string;
  name: string;
  description: string;
  createdAt: string;
  components: { id: string; copiedAt: string; source: string; modified: boolean }[];
}
