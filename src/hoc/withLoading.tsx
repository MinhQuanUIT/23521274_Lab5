import type { ComponentType } from 'react';

interface WithLoadingProps {
  loading: boolean;
}

export function withLoading<P extends object>(
  Component: ComponentType<P>,
  LoadingComponent?: ComponentType
): ComponentType<P & WithLoadingProps> {
  return function LoadingWrapper({ loading, ...props }: WithLoadingProps & P) {
    if (loading) {
      if (LoadingComponent) {
        return <LoadingComponent />;
      }
      return (
        <div className="loading-container">
          <div className="spinner"></div>
          <p>Loading...</p>
        </div>
      );
    }

    return <Component {...(props as P)} />;
  };
}
