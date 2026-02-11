const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

export interface Brand {
  id: string;
  name: string;
  active: boolean;
}

export interface Car {
  id: string;
  brandId: string;
  brand: Brand;
  model: string;
  year: number;
  price: number;
  mileage?: number | null;
  description?: string | null;
  status: 'AVAILABLE' | 'SOLD';
  images: string[];
  fuel?: string | null;
  color?: string | null;
  transmission?: string | null;
  licensePlate?: string | null;
  financeable?: boolean;
  options?: Record<string, boolean> | null;
  createdAt: string;
  updatedAt: string;
}

export interface Garage {
  id: string;
  name: string;
  domain: string;
  logoUrl?: string | null;
  primaryColor?: string | null;
  secondaryColor?: string | null;
  whatsapp?: string | null;
  active: boolean;
}

async function fetchAPI(endpoint: string) {
  try {
    const response = await fetch(`${API_URL}${endpoint}`, {
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('API fetch error:', error);
    throw error;
  }
}

export async function getGarage(): Promise<Garage> {
  return fetchAPI('/public/garage-by-domain');
}

export interface ListCarsParams {
  page?: number;
  limit?: number;
  search?: string;
  brandId?: string;
  year?: number;
  orderBy?: "price_asc" | "price_desc" | "newest" | "oldest";
}

export interface PaginatedCarsResponse {
  cars: Car[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export async function listCars(params?: ListCarsParams): Promise<PaginatedCarsResponse> {
  const queryParams = new URLSearchParams();
  
  if (params?.page) queryParams.append('page', params.page.toString());
  if (params?.limit) queryParams.append('limit', params.limit.toString());
  if (params?.search) queryParams.append('search', params.search);
  if (params?.brandId) queryParams.append('brandId', params.brandId);
  if (params?.year) queryParams.append('year', params.year.toString());
  if (params?.orderBy) queryParams.append('orderBy', params.orderBy);

  const queryString = queryParams.toString();
  const endpoint = `/public/cars${queryString ? `?${queryString}` : ''}`;
  
  return fetchAPI(endpoint);
}

export async function getCar(id: string): Promise<Car> {
  return fetchAPI(`/public/cars/${id}`);
}

export async function listBrands(): Promise<Brand[]> {
  return fetchAPI('/public/brands');
}

export function formatPrice(price: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(price);
}

export function formatMileage(mileage: number | null | undefined): string {
  if (mileage === null || mileage === undefined || mileage < 0) return 'N/A';

  if (mileage === 0) {
    return 'Novo';
  }

  return new Intl.NumberFormat('pt-BR').format(mileage) + ' km';
}

export function getCarImageUrl(imagePath: string | null | undefined): string {
  if (!imagePath) return '/placeholder.svg';
  if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
    return imagePath;
  }
  else{
    return `https://${imagePath}`;
  }
}

export function getLogoUrl(logoPath: string | null | undefined): string {
  if (!logoPath) return '/placeholder-logo.svg';
  if (logoPath.startsWith('http://') || logoPath.startsWith('https://')) {
    return logoPath;
  }
  else{
    return `https://${logoPath}`;
  }
}

