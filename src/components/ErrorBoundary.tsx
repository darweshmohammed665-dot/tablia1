import * as React from 'react';
import { ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export default class ErrorBoundary extends React.Component<Props, State> {
  props: Props;
  state: State;

  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null
    };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-brand-cream p-4 text-center" dir="rtl">
          <div className="max-w-md w-full food-card p-[20px]">
            <div className="w-20 h-20 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-8">
              <AlertTriangle size={40} />
            </div>
            <h1 className="text-2xl font-bold text-brand-accent mb-4">عذراً، حدث خطأ ما</h1>
            <p className="text-stone-500 mb-8 leading-relaxed">
              نواجه مشكلة في تحميل هذه الصفحة. يرجى المحاولة مرة أخرى أو العودة للرئيسية.
            </p>
            <div className="flex flex-col gap-3">
              <button 
                onClick={() => window.location.reload()}
                className="btn-primary flex items-center justify-center gap-2 py-4"
              >
                <RefreshCw size={20} /> تحديث الصفحة
              </button>
              <a 
                href="/" 
                className="text-stone-400 hover:text-stone-600 font-medium transition-colors"
              >
                العودة للرئيسية
              </a>
            </div>
            {process.env.NODE_ENV === 'development' && (
              <div className="mt-8 p-4 bg-stone-50 rounded-xl text-left overflow-auto max-h-40">
                <pre className="text-xs text-red-400">{this.state.error?.toString()}</pre>
              </div>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
