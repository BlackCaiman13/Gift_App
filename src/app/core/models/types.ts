export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  success: boolean;
  message: string;
  access_token: string;
  refresh_token: string;
  admin: {
    id: number;
    username: string;
    created_at: string;
  };
}

// Les endpoints /participants et /gifts retournent des tableaux simples
// pas d'objets complexes

export interface Association {
  type: string;
  personne1: string;
  personne2: string;
  is_archived: boolean;
  created_at: string | null;
  updated_at: string | null;
}

export interface StatusResponse {
  success: boolean;
  timestamp: string;
  status: {
    participants: {
      total: number;
      list: string[];
    };
    gifts: {
      total: number;
      list: string[];
    };
    associations: {
      total: number;
      'H-F': number;
      'H-H': number;
      'F-F': number;
      details: Association[];
    };
  };
}

export interface ApiResponse<T> {
  message?: string;
  data?: T;
  error?: string;
}
