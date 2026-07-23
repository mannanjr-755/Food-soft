import { Component } from "react";
import { AlertCircle } from "lucide-react";

export default class ErrorBoundary extends Component {
  state = { hasError: false, message: "" };

  static getDerivedStateFromError(error) {
    return {
      hasError: true,
      message: error?.message || "An unexpected error occurred.",
    };
  }

  handleReset = () => {
    this.setState({ hasError: false, message: "" });
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4">
          <div
            role="alert"
            className="w-full max-w-md rounded-2xl border border-red-100 bg-white p-8 text-center shadow-sm"
          >
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-50 text-red-600">
              <AlertCircle size={24} />
            </div>
            <h1 className="text-xl font-bold text-gray-900">
              Something went wrong
            </h1>
            <p className="mt-2 text-sm text-gray-600">{this.state.message}</p>
            <div className="mt-6 flex flex-wrap justify-center gap-3">
              <button
                type="button"
                onClick={this.handleReset}
                className="rounded-lg bg-yellow-500 px-5 py-2.5 text-sm font-semibold text-white hover:bg-yellow-600"
              >
                Try again
              </button>
              <button
                type="button"
                onClick={() => window.location.assign("/admin/dashboard")}
                className="rounded-lg border border-gray-200 px-5 py-2.5 text-sm font-medium hover:bg-gray-50"
              >
                Go to dashboard
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
