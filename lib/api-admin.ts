const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

export interface Brand {
  id: string;
  name: string;
  active: boolean;
}

export interface AdminCar {
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
  createdAt: string;
  updatedAt: string;
}

export interface CreateCarData {
  brandId: string;
  model: string;
  year: number;
  price: number;
  mileage?: number;
  description?: string;
  images?: File[];
}

export interface UpdateCarData {
  brandId?: string;
  model?: string;
  year?: number;
  price?: number;
  mileage?: number;
  description?: string;
  status?: 'AVAILABLE' | 'SOLD';
  images?: File[];
  imagesToKeep?: string[]; // Lista de URLs de imagens existentes a manter
}

function getAuthToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('auth_token');
}

function getAuthHeaders(): HeadersInit {
  const token = getAuthToken();
  const headers: HeadersInit = {};
  
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  
  return headers;
}

async function fetchAdminAPI(endpoint: string, options: RequestInit = {}) {
  try {
    // Se o body for FormData, não adiciona Content-Type (deixa o browser definir)
    const isFormData = options.body instanceof FormData;
    const headers: HeadersInit = { ...getAuthHeaders() };
    
    // Adiciona headers customizados, mas remove Content-Type se for FormData
    if (options.headers) {
      Object.assign(headers, options.headers);
    }
    
    // Remove Content-Type se for FormData (browser vai adicionar automaticamente com boundary)
    if (isFormData && 'Content-Type' in headers) {
      delete (headers as any)['Content-Type'];
    }

    const response = await fetch(`${API_URL}${endpoint}`, {
      ...options,
      headers,
    });

    if (response.status === 401) {
      // Token inválido ou expirado
      if (typeof window !== 'undefined') {
        localStorage.removeItem('auth_token');
        localStorage.removeItem('auth_user');
        window.location.href = '/login';
      }
      throw new Error('Unauthorized');
    }

    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: `API error: ${response.status}` }));
      throw new Error(error.error || `API error: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('API fetch error:', error);
    throw error;
  }
}

// Auth
export async function login(email: string, password: string): Promise<{ token: string; user: any }> {
  const response = await fetch(`${API_URL}/auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, password }),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'Invalid credentials' }));
    throw new Error(error.error || 'Invalid credentials');
  }

  const data = await response.json();
  
  // Salvar token e usuário
  if (typeof window !== 'undefined') {
    localStorage.setItem('auth_token', data.token);
    localStorage.setItem('auth_user', JSON.stringify(data.user));
  }
  
  return data;
}

export function logout() {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('auth_user');
  }
}

export function getCurrentUser(): any | null {
  if (typeof window === 'undefined') return null;
  const userStr = localStorage.getItem('auth_user');
  return userStr ? JSON.parse(userStr) : null;
}

export function isAuthenticated(): boolean {
  return getAuthToken() !== null;
}

// Brands
export async function listBrands(): Promise<Brand[]> {
  return fetchAdminAPI('/admin/brands');
}

// Cars
export async function listCarsAdmin(status?: 'AVAILABLE' | 'SOLD'): Promise<AdminCar[]> {
  const query = status ? `?status=${status}` : '';
  return fetchAdminAPI(`/admin/cars${query}`);
}

export async function getCarAdmin(id: string): Promise<AdminCar> {
  return fetchAdminAPI(`/admin/cars/${id}`);
}

export async function createCarAdmin(data: CreateCarData): Promise<AdminCar> {
  const formData = new FormData();
  formData.append('brandId', data.brandId);
  formData.append('model', data.model);
  formData.append('year', data.year.toString());
  formData.append('price', data.price.toString());
  if (data.mileage) formData.append('mileage', data.mileage.toString());
  if (data.description) formData.append('description', data.description);
  
  if (data.images) {
    data.images.forEach((image) => {
      formData.append('images', image);
    });
  }

  return fetchAdminAPI('/admin/cars', {
    method: 'POST',
    headers: {
      // Remove Content-Type para FormData
      'Authorization': `Bearer ${getAuthToken()}`,
    },
    body: formData,
  });
}

export async function updateCarAdmin(id: string, data: UpdateCarData): Promise<AdminCar> {
  // SEMPRE usa FormData para manter consistência e evitar problemas de parsing
  const formData = new FormData();
  
  if (data.brandId) formData.append('brandId', data.brandId);
  if (data.model) formData.append('model', data.model);
  if (data.year) formData.append('year', data.year.toString());
  if (data.price) formData.append('price', data.price.toString());
  if (data.mileage !== undefined) formData.append('mileage', data.mileage.toString());
  if (data.description !== undefined) formData.append('description', data.description || '');
  if (data.status) formData.append('status', data.status);
  
  // Adiciona lista de imagens existentes a manter
  if (data.imagesToKeep) {
    formData.append('imagesToKeep', JSON.stringify(data.imagesToKeep));
  }
  
  // Adiciona novas imagens se houver
  if (data.images && data.images.length > 0) {
    data.images.forEach((image) => {
      formData.append('images', image);
    });
  }

  return fetchAdminAPI(`/admin/cars/${id}`, {
    method: 'PUT',
    headers: {
      // NÃO definir Content-Type - o browser vai definir automaticamente com boundary
      'Authorization': `Bearer ${getAuthToken()}`,
    },
    body: formData,
  });
}

export async function deleteCarAdmin(id: string): Promise<void> {
  return fetchAdminAPI(`/admin/cars/${id}`, {
    method: 'DELETE',
  });
}

// Settings
export interface GarageSettings {
  id: string;
  name: string;
  domain: string;
  logoUrl?: string | null;
  primaryColor?: string | null;
  secondaryColor?: string | null;
  whatsapp?: string | null;
  active: boolean;
}

export interface UpdateSettingsData {
  name?: string;
  logo?: File; // Arquivo de logo para upload
  logoUrl?: string | null; // URL do logo (para remover, enviar null)
  primaryColor?: string;
  secondaryColor?: string;
  whatsapp?: string;
  active?: boolean;
}

export async function getSettings(): Promise<GarageSettings> {
  return fetchAdminAPI('/admin/settings');
}

export async function updateSettings(data: UpdateSettingsData): Promise<GarageSettings> {
  const formData = new FormData();
  
  if (data.name !== undefined) formData.append('name', data.name);
  if (data.primaryColor !== undefined) formData.append('primaryColor', data.primaryColor);
  if (data.secondaryColor !== undefined) formData.append('secondaryColor', data.secondaryColor);
  if (data.whatsapp !== undefined) formData.append('whatsapp', data.whatsapp || '');
  if (data.active !== undefined) formData.append('active', data.active.toString());
  
  // Se houver novo logo para upload
  if (data.logo) {
    formData.append('logo', data.logo);
  } else if (data.logoUrl !== undefined) {
    // Se não houver upload mas logoUrl foi especificado (para remover ou manter)
    formData.append('logoUrl', data.logoUrl || '');
  }

  return fetchAdminAPI('/admin/settings', {
    method: 'PUT',
    headers: {
      'Authorization': `Bearer ${getAuthToken()}`,
    },
    body: formData,
  });
}

export function getLogoUrl(logoPath: string | null | undefined): string {
  if (!logoPath) return '/placeholder-logo.svg';
  if (logoPath.startsWith('http')) return logoPath;
  if (logoPath.startsWith('/uploads')) {
    return `${API_URL}${logoPath}`;
  }
  return `${API_URL}${logoPath.startsWith('/') ? '' : '/'}${logoPath}`;
}

// Re-export format functions
export { formatPrice, formatMileage, getCarImageUrl } from './api';

