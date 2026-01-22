import React, { memo } from 'react';
import { useLazyLoad, usePerformanceMonitor } from '../../hooks/usePerformance';

interface LazyComponentProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
  className?: string;
  componentName?: string;
}

const LazyComponent: React.FC<LazyComponentProps> = memo(({ 
  children, 
  fallback, 
  className = '',
  componentName = 'LazyComponent'
}) => {
  const { elementRef, isVisible, hasLoaded } = useLazyLoad({
    threshold: 0.1,
    rootMargin: '100px',
    triggerOnce: true
  });

  usePerformanceMonitor(componentName);

  return (
    <div ref={elementRef} className={className}>
      {hasLoaded ? children : (fallback || (
        <div className="animate-pulse bg-gray-200 rounded h-32 flex items-center justify-center">
          <span className="text-gray-500 text-sm">Loading...</span>
        </div>
      ))}
    </div>
  );
});

LazyComponent.displayName = 'LazyComponent';

export default LazyComponent;
