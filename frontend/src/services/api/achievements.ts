/**
 * Achievement catalog API service
 */

import { apiClient } from './client';
import { API_ENDPOINTS } from './endpoints';

export interface AchievementDefinition {
  id: string;
  code: string;
  title: string;
  description?: string;
  category?: string;
  achievement_type?: string;
  issuer?: string;
  icon_url?: string;
  criteria?: Record<string, unknown>;
  metadata?: Record<string, unknown>;
  is_active: boolean;
  is_public: boolean;
  created_at: string;
  updated_at: string;
}

export interface AchievementCatalogParams {
  category?: string;
  achievement_type?: string;
  include_inactive?: boolean;
  include_private?: boolean;
  skip?: number;
  limit?: number;
}

class AchievementCatalogService {
  async list(params?: AchievementCatalogParams): Promise<AchievementDefinition[]> {
    return apiClient.get<AchievementDefinition[]>(API_ENDPOINTS.ACHIEVEMENTS.LIST, params);
  }

  async getById(id: string): Promise<AchievementDefinition> {
    return apiClient.get<AchievementDefinition>(API_ENDPOINTS.ACHIEVEMENTS.BY_ID(id));
  }
}

export const achievementCatalogService = new AchievementCatalogService();
