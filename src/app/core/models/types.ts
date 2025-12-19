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
  participant: string;
  gift: number;
}

export interface StatusResponse {
  success: boolean;
  timestamp: string;
  status: {
    participants: {
      total: number;
      associated: number;
      unassociated: number;
      list_associated: string[];
      list_unassociated: string[];
    };
    gifts: {
      total: number;
      associated: number;
      unassociated: number;
      list_associated: number[];
      list_unassociated: number[];
    };
    associations: {
      total: number;
      details: { [key: string]: number };
    };
  };
}

export interface ApiResponse<T> {
  message?: string;
  data?: T;
  error?: string;
}
