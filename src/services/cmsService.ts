import api from '@/lib/api';

// ─── Types ────────────────────────────────────────────────────────────────────

export type BlockType =
  | 'heading'
  | 'paragraph'
  | 'image'
  | 'video'
  | 'html'
  | 'quote'
  | 'divider'
  | 'cta'
  | 'columns'
  | 'list'
  | 'stats'
  | 'cards'
  | 'testimonials'
  | 'team'
  | 'faq'
  | 'banner'
  | 'embed'
  | 'gallery'
  | 'alert'
  | 'spacer'
  | 'table'
  | 'steps';

export interface Block {
  id: string;
  type: BlockType;
  content: Record<string, any>;
  order: number;
}

export interface Page {
  _id: string;
  title: string;
  slug: string;
  type: 'page' | 'blog' | 'home';
  status: 'published' | 'draft';
  blocks: Block[];
  seoTitle?: string;
  seoDescription?: string;
  homeSettings?: Record<string, any>;
  createdAt: string;
  updatedAt: string;
}

export interface Post {
  _id: string;
  title: string;
  slug: string;
  excerpt?: string;
  coverImage?: string;
  blocks: Block[];
  status: 'published' | 'draft';
  publishedAt?: string;
  seoTitle?: string;
  seoDescription?: string;
  author?: string;
  tags?: string[];
  createdAt: string;
  updatedAt: string;
}

// ─── Pages API ────────────────────────────────────────────────────────────────

export const fetchPages = async (params?: { type?: string; status?: string }): Promise<Page[]> => {
  const { data } = await api.get('/pages', { params });
  return data.data;
};

export const fetchPageBySlug = async (slug: string): Promise<Page> => {
  const { data } = await api.get(`/pages/slug/${slug}`);
  return data.data;
};

export const fetchPageById = async (id: string): Promise<Page> => {
  const { data } = await api.get(`/pages/id/${id}`);
  return data.data;
};

export const createPage = async (page: Partial<Page>): Promise<Page> => {
  const { data } = await api.post('/pages', page);
  return data.data;
};

export const updatePage = async (id: string, page: Partial<Page>): Promise<Page> => {
  const { data } = await api.put(`/pages/${id}`, page);
  return data.data;
};

export const deletePage = async (id: string): Promise<void> => {
  await api.delete(`/pages/${id}`);
};

// ─── Posts API ────────────────────────────────────────────────────────────────

export const fetchPosts = async (params?: { status?: string; limit?: number; page?: number }): Promise<{ data: Post[]; total: number }> => {
  const { data } = await api.get('/posts', { params });
  return { data: data.data, total: data.total };
};

export const fetchPostBySlug = async (slug: string): Promise<Post> => {
  const { data } = await api.get(`/posts/slug/${slug}`);
  return data.data;
};

export const fetchPostById = async (id: string): Promise<Post> => {
  const { data } = await api.get(`/posts/id/${id}`);
  return data.data;
};

export const createPost = async (post: Partial<Post>): Promise<Post> => {
  const { data } = await api.post('/posts', post);
  return data.data;
};

export const updatePost = async (id: string, post: Partial<Post>): Promise<Post> => {
  const { data } = await api.put(`/posts/${id}`, post);
  return data.data;
};

export const deletePost = async (id: string): Promise<void> => {
  await api.delete(`/posts/${id}`);
};
