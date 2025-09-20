import React, { ErrorInfo, ReactNode } from 'react'
import { AlertTriangle, RefreshCw, Home } from 'lucide-react'
import { Button } from './button'

interface ErrorBoundaryState {
  hasError: boolean
  error?: Error
  errorInfo?: ErrorInfo
}

interface ErrorBoundaryProps {
  children: ReactNode
  fallback?: ReactNode
}

export class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    // Update state so the next render will show the fallback UI
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Log error to console for debugging
    console.error('ErrorBoundary caught an error:', error, errorInfo)
    this.setState({ error, errorInfo })
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: undefined, errorInfo: undefined })
  }

  handleGoHome = () => {
    window.location.href = '/'
  }

  render() {
    if (this.state.hasError) {
      // Fallback UI with proper styling and black screen prevention
      return (
        <div
          className="min-h-screen bg-background flex items-center justify-center p-4"
          style={{ backgroundColor: '#0A0A0A', color: '#FFFFFF', minHeight: '100vh' }}
        >
          <div className="max-w-md w-full text-center space-y-6">
            <div className="mx-auto w-16 h-16 bg-error-red/10 rounded-full flex items-center justify-center">
              <AlertTriangle className="w-8 h-8 text-error-red" />
            </div>

            <div className="space-y-2">
              <h1 className="text-2xl font-bold text-text-primary">
                Coś poszło nie tak
              </h1>
              <p className="text-text-secondary">
                Przepraszamy, wystąpił nieoczekiwany błąd. Spróbuj odświeżyć stronę lub wróć do strony głównej.
              </p>
            </div>

            {process.env.NODE_ENV === 'development' && this.state.error && (
              <div className="bg-surface/50 border border-border rounded-lg p-4 text-left">
                <h3 className="text-sm font-medium text-text-primary mb-2">Szczegóły błędu (tylko w rozwoju):</h3>
                <pre className="text-xs text-text-muted overflow-auto">
                  {this.state.error.toString()}
                </pre>
              </div>
            )}

            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button
                variant="primary"
                onClick={this.handleRetry}
                className="flex items-center justify-center gap-2"
              >
                <RefreshCw className="w-4 h-4" />
                Spróbuj ponownie
              </Button>

              <Button
                variant="secondary"
                onClick={this.handleGoHome}
                className="flex items-center justify-center gap-2"
              >
                <Home className="w-4 h-4" />
                Strona główna
              </Button>
            </div>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}

// Functional component version for specific use cases
export function ErrorFallback({ error, resetError }: { error: Error; resetError: () => void }) {
  return (
    <div
      className="min-h-screen bg-background flex items-center justify-center p-4"
      style={{ backgroundColor: '#0A0A0A', color: '#FFFFFF', minHeight: '100vh' }}
    >
      <div className="max-w-md w-full text-center space-y-6">
        <div className="mx-auto w-16 h-16 bg-error-red/10 rounded-full flex items-center justify-center">
          <AlertTriangle className="w-8 h-8 text-error-red" />
        </div>

        <div className="space-y-2">
          <h1 className="text-2xl font-bold text-text-primary">
            Wystąpił błąd
          </h1>
          <p className="text-text-secondary">
            {error.message || 'Nieoczekiwany błąd aplikacji'}
          </p>
        </div>

        <Button variant="primary" onClick={resetError}>
          Spróbuj ponownie
        </Button>
      </div>
    </div>
  )
}