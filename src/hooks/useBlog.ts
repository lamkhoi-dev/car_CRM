import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { blogApi, testimonialsApi } from '@/lib/api';
import type { BlogPost } from '@/lib/api';

export function useBlogPosts() {
  return useQuery({
    queryKey: ['blogPosts'],
    queryFn: blogApi.getAll,
  });
}

export function useBlogPost(id: string | undefined) {
  return useQuery({
    queryKey: ['blogPost', id],
    queryFn: () => blogApi.getById(id!),
    enabled: !!id,
  });
}

export function useCreateBlogPost() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: Omit<BlogPost, 'id' | 'date'>) => blogApi.create(data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['blogPosts'] }),
  });
}

export function useUpdateBlogPost() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<BlogPost> }) =>
      blogApi.update(id, data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['blogPosts'] }),
  });
}

export function useDeleteBlogPost() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => blogApi.delete(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['blogPosts'] }),
  });
}

export function useTestimonials() {
  return useQuery({
    queryKey: ['testimonials'],
    queryFn: testimonialsApi.getAll,
  });
}
