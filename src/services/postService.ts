import api from '@/lib/api';
import { Block } from './pageService';

// ─── Types ────────────────────────────────────────────────────────────────────

export interface Post {
  _id: string;
  title: string;
  slug: string;
  excerpt: string;
  coverImage: string;
  blocks: Block[];
  status: 'published' | 'draft';
  publishedAt: string | null;
  author?: { name: string; email?: string };
  tags: string[];
  views: number;
  seoTitle: string;
  seoDescription: string;
  seoImage: string;
  createdAt: string;
  updatedAt: string;
}

export interface PostInput {
  title: string;
  slug?: string;
  excerpt?: string;
  coverImage?: string;
  blocks?: Block[];
  status?: 'published' | 'draft';
  tags?: string[];
  seoTitle?: string;
  seoDescription?: string;
  seoImage?: string;
}

export interface Pagination {
  total: number;
  page: number;
  limit: number;
  pages: number;
}

// ─── Admin API ────────────────────────────────────────────────────────────────

export const fetchPosts = async (params?: { status?: string; page?: number; limit?: number }): Promise<{ data: Post[]; pagination: Pagination }> => {
  const { data } = await api.get('/posts', { params });
  return data;
};

export const fetchPostById = async (id: string): Promise<Post> => {
  const { data } = await api.get(`/posts/${id}`);
  return data.data;
};

export const createPost = async (input: PostInput): Promise<Post> => {
  const { data } = await api.post('/posts', input);
  return data.data;
};

export const updatePost = async (id: string, input: Partial<PostInput>): Promise<Post> => {
  const { data } = await api.put(`/posts/${id}`, input);
  return data.data;
};

export const deletePost = async (id: string): Promise<void> => {
  await api.delete(`/posts/${id}`);
};

// ─── Public API ───────────────────────────────────────────────────────────────

export const fetchPublicPosts = async (params?: { page?: number; limit?: number; tag?: string }): Promise<{ data: Post[]; pagination: Pagination }> => {
  const { data } = await api.get('/posts/public', { params });
  return data;
};

export const fetchPublicPostBySlug = async (slug: string): Promise<Post> => {
  const { data } = await api.get(`/posts/public/${slug}`);
  return data.data;
};
