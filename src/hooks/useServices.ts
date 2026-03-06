import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { serviceTypesApi, routesApi, pricingPackagesApi } from '@/lib/api';
import type { ServiceType, Route, PricingPackage } from '@/lib/api';

// ─── Service Types ──────────────────────────────────────

export function useServiceTypes() {
  return useQuery({
    queryKey: ['serviceTypes'],
    queryFn: serviceTypesApi.getAll,
  });
}

export function useCreateServiceType() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: Omit<ServiceType, 'id'>) => serviceTypesApi.create(data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['serviceTypes'] }),
  });
}

export function useUpdateServiceType() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<ServiceType> }) =>
      serviceTypesApi.update(id, data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['serviceTypes'] }),
  });
}

export function useDeleteServiceType() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => serviceTypesApi.delete(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['serviceTypes'] }),
  });
}

// ─── Routes ─────────────────────────────────────────────

export function useRoutes(province?: string) {
  return useQuery({
    queryKey: ['routes', province],
    queryFn: () => routesApi.getAll(province),
  });
}

export function useAllRoutes() {
  return useQuery({
    queryKey: ['routes', 'all'],
    queryFn: routesApi.getAllAdmin,
  });
}

export function useCreateRoute() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: Omit<Route, 'id'>) => routesApi.create(data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['routes'] }),
  });
}

export function useUpdateRoute() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Route> }) =>
      routesApi.update(id, data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['routes'] }),
  });
}

export function useDeleteRoute() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => routesApi.delete(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['routes'] }),
  });
}

// ─── Pricing Packages ───────────────────────────────────

export function usePricingPackages(serviceType?: string) {
  return useQuery({
    queryKey: ['pricingPackages', serviceType],
    queryFn: () => pricingPackagesApi.getAll(serviceType),
  });
}

export function useAllPricingPackages() {
  return useQuery({
    queryKey: ['pricingPackages', 'all'],
    queryFn: pricingPackagesApi.getAllAdmin,
  });
}

export function useCreatePricingPackage() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: Omit<PricingPackage, 'id'>) => pricingPackagesApi.create(data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['pricingPackages'] }),
  });
}

export function useUpdatePricingPackage() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<PricingPackage> }) =>
      pricingPackagesApi.update(id, data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['pricingPackages'] }),
  });
}

export function useDeletePricingPackage() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => pricingPackagesApi.delete(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['pricingPackages'] }),
  });
}
