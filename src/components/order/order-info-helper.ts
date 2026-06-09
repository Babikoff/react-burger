import type { TOrderStatus } from '@/services/api-types';

export function getStatusText(status: TOrderStatus): string {
  switch (status) {
    case 'created':
      return 'Создан';
    case 'pending':
      return 'Готовится';
    case 'cancelled':
      return 'Отменён';
    case 'done':
      return 'Выполнен';
    default:
      return status;
  }
}

export function getStatusTextColor(status: TOrderStatus): string {
  switch (status) {
    case 'created':
      return '#f2f2f3';
    case 'pending':
      return 'lightgreen';
    case 'cancelled':
      return 'red';
    case 'done':
      return '#0cc';
    default:
      return '#f2f2f3';
  }
}
