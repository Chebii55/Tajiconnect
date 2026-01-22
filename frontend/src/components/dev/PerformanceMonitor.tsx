import React, { useState, useEffect } from 'react';
import { cacheManager } from '../../utils/cache';
import { useMemoryMonitor } from '../../hooks/usePerformance';
import { BarChart3, Database, Zap, Trash2 } from 'lucide-react';

const PerformanceMonitor: React.FC = () => {
  const [cacheStats, setCacheStats] = useState(cacheManager.getStats());
  const memoryInfo = useMemoryMonitor();
  const [showDetails, setShowDetails] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setCacheStats(cacheManager.getStats());
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const clearCache = () => {
    cacheManager.clear();
    setCacheStats(cacheManager.getStats());
  };

  if (process.env.REACT_APP_ENV !== 'development') {
    return null;
  }

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <button
        onClick={() => setShowDetails(!showDetails)}
        className="bg-gray-800 text-white p-2 rounded-full shadow-lg hover:bg-gray-700"
      >
        <BarChart3 className="w-5 h-5" />
      </button>

      {showDetails && (
        <div className="absolute bottom-12 right-0 bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 p-4 w-80">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-800 dark:text-gray-200">Performance Monitor</h3>
            <button
              onClick={clearCache}
              className="text-red-500 hover:text-red-700 p-1"
              title="Clear Cache"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>

          {/* Cache Stats */}
          <div className="mb-4">
            <div className="flex items-center gap-2 mb-2">
              <Database className="w-4 h-4 text-blue-500" />
              <span className="text-sm font-medium">Cache Statistics</span>
            </div>
            <div className="text-xs space-y-1 text-gray-600 dark:text-gray-400">
              <div className="flex justify-between">
                <span>Total Items:</span>
                <span>{cacheStats.totalItems}</span>
              </div>
              <div className="flex justify-between">
                <span>Valid Items:</span>
                <span className="text-green-600">{cacheStats.validItems}</span>
              </div>
              <div className="flex justify-between">
                <span>Expired Items:</span>
                <span className="text-red-600">{cacheStats.expiredItems}</span>
              </div>
              <div className="flex justify-between">
                <span>Memory Usage:</span>
                <span>{formatBytes(cacheStats.memoryUsage)}</span>
              </div>
            </div>
          </div>

          {/* Memory Stats */}
          {memoryInfo && (
            <div className="mb-4">
              <div className="flex items-center gap-2 mb-2">
                <Zap className="w-4 h-4 text-yellow-500" />
                <span className="text-sm font-medium">Memory Usage</span>
              </div>
              <div className="text-xs space-y-1 text-gray-600 dark:text-gray-400">
                <div className="flex justify-between">
                  <span>Used Heap:</span>
                  <span>{formatBytes(memoryInfo.usedJSHeapSize)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Total Heap:</span>
                  <span>{formatBytes(memoryInfo.totalJSHeapSize)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Heap Limit:</span>
                  <span>{formatBytes(memoryInfo.jsHeapSizeLimit)}</span>
                </div>
              </div>
            </div>
          )}

          {/* Cache Hit Rate */}
          <div className="text-xs text-gray-500 dark:text-gray-400">
            Cache Hit Rate: {cacheStats.totalItems > 0 ? 
              Math.round((cacheStats.validItems / cacheStats.totalItems) * 100) : 0}%
          </div>
        </div>
      )}
    </div>
  );
};

export default PerformanceMonitor;
