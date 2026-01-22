interface CacheItem<T> {
  data: T;
  timestamp: number;
  expiry: number;
}

class CacheManager {
  private cache = new Map<string, CacheItem<any>>();
  private readonly defaultTTL = 30 * 60 * 1000; // 30 minutes

  set<T>(key: string, data: T, ttl?: number): void {
    const expiry = ttl || this.defaultTTL;
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      expiry: Date.now() + expiry
    });
  }

  get<T>(key: string): T | null {
    const item = this.cache.get(key);
    
    if (!item) return null;
    
    if (Date.now() > item.expiry) {
      this.cache.delete(key);
      return null;
    }
    
    return item.data;
  }

  invalidate(key: string): void {
    this.cache.delete(key);
  }

  invalidatePattern(pattern: string): void {
    const regex = new RegExp(pattern);
    for (const key of this.cache.keys()) {
      if (regex.test(key)) {
        this.cache.delete(key);
      }
    }
  }

  clear(): void {
    this.cache.clear();
  }

  getStats() {
    const now = Date.now();
    const items = Array.from(this.cache.values());
    
    return {
      totalItems: items.length,
      validItems: items.filter(item => now <= item.expiry).length,
      expiredItems: items.filter(item => now > item.expiry).length,
      memoryUsage: JSON.stringify(Array.from(this.cache.entries())).length
    };
  }

  // Cleanup expired items
  cleanup(): void {
    const now = Date.now();
    for (const [key, item] of this.cache.entries()) {
      if (now > item.expiry) {
        this.cache.delete(key);
      }
    }
  }
}

// Cache configurations for different data types
export const CACHE_KEYS = {
  USER_PROFILE: (userId: string) => `user_profile_${userId}`,
  RECOMMENDATIONS: (userId: string) => `recommendations_${userId}`,
  LEARNING_PATHS: (userId: string) => `learning_paths_${userId}`,
  PERFORMANCE: (userId: string) => `performance_${userId}`,
  SKILL_GAPS: (userId: string) => `skill_gaps_${userId}`,
  TRENDING_CONTENT: 'trending_content'
} as const;

export const CACHE_TTL = {
  USER_PROFILE: 60 * 60 * 1000, // 1 hour
  RECOMMENDATIONS: 30 * 60 * 1000, // 30 minutes
  LEARNING_PATHS: 24 * 60 * 60 * 1000, // 24 hours (until modified)
  PERFORMANCE: 15 * 60 * 1000, // 15 minutes
  SKILL_GAPS: 60 * 60 * 1000, // 1 hour
  TRENDING_CONTENT: 10 * 60 * 1000 // 10 minutes
} as const;

export const cacheManager = new CacheManager();

// Auto-cleanup every 5 minutes
setInterval(() => {
  cacheManager.cleanup();
}, 5 * 60 * 1000);
