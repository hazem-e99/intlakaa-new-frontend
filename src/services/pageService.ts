import api from '@/lib/api';

// ─── Types ────────────────────────────────────────────────────────────────────

export interface Block {
  id: string;
  type:
    | 'heading'
    | 'paragraph'
    | 'image'
    | 'video'
    | 'html'
    | 'quote'
    | 'divider'
    | 'button'
    | 'columns'
    | 'list'
    | 'hero'
    | 'cta'
    | 'gallery';
  data: Record<string, any>;
  settings?: {
    textAlign?: 'right' | 'left' | 'center';
    paddingTop?: number;
    paddingBottom?: number;
    backgroundColor?: string;
    textColor?: string;
    customClass?: string;
  };
}

export interface Page {
  _id: string;
  title: string;
  slug: string;
  type: 'home' | 'blog' | 'page';
  status: 'published' | 'draft';
  blocks: Block[];
  homeSections?: any;
  seoTitle: string;
  seoDescription: string;
  seoImage: string;
  createdAt: string;
  updatedAt: string;
}

export interface PageInput {
  title: string;
  slug?: string;
  type?: 'home' | 'blog' | 'page';
  status?: 'published' | 'draft';
  blocks?: Block[];
  homeSections?: any;
  seoTitle?: string;
  seoDescription?: string;
  seoImage?: string;
}

// ─── Admin API ────────────────────────────────────────────────────────────────

export const fetchPages = async (params?: { type?: string; status?: string }): Promise<Page[]> => {
  const { data } = await api.get('/pages', { params });
  return data.data;
};

export const fetchPageById = async (id: string): Promise<Page> => {
  const { data } = await api.get(`/pages/${id}`);
  return data.data;
};

export const createPage = async (input: PageInput): Promise<Page> => {
  const { data } = await api.post('/pages', input);
  return data.data;
};

export const updatePage = async (id: string, input: Partial<PageInput>): Promise<Page> => {
  const { data } = await api.put(`/pages/${id}`, input);
  return data.data;
};

export const deletePage = async (id: string): Promise<void> => {
  await api.delete(`/pages/${id}`);
};

// ─── Public API ───────────────────────────────────────────────────────────────

export const fetchPublicPage = async (slug: string): Promise<Page> => {
  const { data } = await api.get(`/pages/public/${slug}`);
  return data.data;
};
