import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { bookingsApi } from '@/lib/api';
import type { Booking } from '@/lib/api';
import { getDeviceId } from '@/lib/utils';

export function useBookings() {
  return useQuery({
    queryKey: ['bookings'],
    queryFn: bookingsApi.getAll,
  });
}

export function useMyBookings() {
  const deviceId = getDeviceId();
  return useQuery({
    queryKey: ['bookings', 'device', deviceId],
    queryFn: () => bookingsApi.getByDevice(deviceId),
  });
}

export function useCreateBooking() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: Omit<Booking, 'id' | 'status' | 'createdAt'>) =>
      bookingsApi.create(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['bookings'] });
    },
  });
}

export function useUpdateBookingStatus() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: Booking['status'] }) =>
      bookingsApi.updateStatus(id, status),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['bookings'] }),
  });
}

export function useDeleteBooking() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => bookingsApi.delete(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['bookings'] }),
  });
}
