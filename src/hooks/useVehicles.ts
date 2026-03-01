import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { vehiclesApi } from '@/lib/api';
import type { Vehicle } from '@/lib/api';

export function useVehicles() {
  return useQuery({
    queryKey: ['vehicles'],
    queryFn: vehiclesApi.getAll,
  });
}

export function useVehicle(id: string | undefined) {
  return useQuery({
    queryKey: ['vehicle', id],
    queryFn: () => vehiclesApi.getById(id!),
    enabled: !!id,
  });
}

export function useCreateVehicle() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: Omit<Vehicle, 'id'>) => vehiclesApi.create(data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['vehicles'] }),
  });
}

export function useUpdateVehicle() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Vehicle> }) =>
      vehiclesApi.update(id, data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['vehicles'] }),
  });
}

export function useDeleteVehicle() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => vehiclesApi.delete(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['vehicles'] }),
  });
}
