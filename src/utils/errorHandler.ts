import { ApiError } from './apiClient';

export function handleApiError(error: unknown): string {
  if (error instanceof ApiError) {
    console.error(`API Error ${error.statusCode}: ${error.message}`);
    // Anda bisa menambahkan logika khusus berdasarkan status code di sini
    switch (error.statusCode) {
      case 400:
        return 'Permintaan tidak valid. Silakan periksa input Anda.';
      case 401:
        return 'Anda tidak memiliki izin untuk melakukan tindakan ini.';
      case 404:
        return 'Data yang diminta tidak ditemukan.';
      case 500:
        return 'Terjadi kesalahan server. Silakan coba lagi nanti.';
      default:
        return 'Terjadi kesalahan. Silakan coba lagi.';
    }
  } else if (error instanceof Error) {
    console.error('Unexpected error:', error);
    return 'Terjadi kesalahan yang tidak terduga. Silakan coba lagi.';
  } else {
    console.error('Unknown error:', error);
    return 'Terjadi kesalahan yang tidak diketahui. Silakan coba lagi.';
  }
}