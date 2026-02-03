'use client';

import React from 'react';

interface ErrorBoundaryState {
    hasError: boolean;
    error?: Error;
}

interface ErrorBoundaryProps {
    children: React.ReactNode;
    fallback?: React.ComponentType<{ error?: Error; resetError: () => void }>;
}

class ErrorBoundary extends React.Component<
    ErrorBoundaryProps,
    ErrorBoundaryState
> {
    constructor(props: ErrorBoundaryProps) {
        super(props);
        this.state = { hasError: false };
    }

    static getDerivedStateFromError(error: Error): ErrorBoundaryState {
        return { hasError: true, error };
    }

    componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
        console.error('[v0] Error caught by boundary:', error, errorInfo);
    }

    resetError = () => {
        this.setState({ hasError: false, error: undefined });
    };

    render() {
        if (this.state.hasError) {
            const FallbackComponent =
                this.props.fallback || DefaultErrorFallback;
            return (
                <FallbackComponent
                    error={this.state.error}
                    resetError={this.resetError}
                />
            );
        }

        return this.props.children;
    }
}

const DefaultErrorFallback: React.FC<{
    error?: Error;
    resetError: () => void;
}> = ({ error, resetError }) => (
    <div className='min-h-screen bg-[#3c3d3f] flex items-center justify-center p-4'>
        <div className='bg-white rounded-lg p-8 max-w-md w-full text-center'>
            <h2 className='text-2xl font-bold text-red-600 mb-4'>
                Something went wrong
            </h2>
            <p className='text-gray-600 mb-4'>
                {error?.message ||
                    'An unexpected error occurred while loading the booking page.'}
            </p>
            <button
                onClick={resetError}
                className='bg-[#fbbf24] hover:bg-[#f59e0b] text-black font-semibold px-6 py-2 rounded-full'
            >
                Try Again
            </button>
        </div>
    </div>
);

export default ErrorBoundary;
