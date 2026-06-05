import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import AdminSetupWizard from '@/components/AdminSetupWizard';

const SetupPage: React.FC = () => {
  const router = useRouter();
  const [isActivated, setIsActivated] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    // Check if already activated
    if (typeof window !== 'undefined') {
      if (typeof window !== "undefined") { const activated = localStorage.getItem('mia_activated') === 'true';
      setIsActivated(activated);
      setIsLoading(false);

      // If activated, redirect to admin dashboard
      if (activated) {
        router.push('/admin');
      }
    }
  }, [router]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gunmetal to-dark-gunmetal flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin text-4xl mb-4">⚙️</div>
          <p className="text-gray-400">Loading setup...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gunmetal via-dark-gunmetal to-gunmetal py-12 px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="max-w-2xl mx-auto mb-12 text-center">
        <div className="mb-4">
          <div className="text-5xl mb-2">🤖</div>
          <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-electric-turquoise to-baby-blue mb-2">
            Welcome to MIA
          </h1>
          <p className="text-gray-400 text-lg">
            Motor Intelligence Assistant - Initial Setup
          </p>
        </div>
      </div>

      {/* Setup Wizard */}
      <div className="max-w-2xl mx-auto mb-12">
        <AdminSetupWizard />
      </div>

      {/* Info Cards */}
      <div className="max-w-2xl mx-auto grid md:grid-cols-2 gap-4 mt-12">
        <div className="rounded-lg bg-dark-gunmetal/50 border border-electric-turquoise/20 p-4">
          <h3 className="text-electric-turquoise font-semibold mb-2">🔧 What You Need</h3>
          <ul className="text-sm text-gray-400 space-y-1">
            <li>✓ Supabase Project (Database)</li>
            <li>✓ Google Cloud Project (APIs)</li>
            <li>✓ OAuth Providers (Google, Apple, X)</li>
          </ul>
        </div>

        <div className="rounded-lg bg-dark-gunmetal/50 border border-baby-blue/20 p-4">
          <h3 className="text-baby-blue font-semibold mb-2">📋 Getting Keys</h3>
          <ul className="text-sm text-gray-400 space-y-1">
            <li>✓ Check DEPLOYMENT_AND_INFRASTRUCTURE_SETUP.md</li>
            <li>✓ See .env.example for key formats</li>
            <li>✓ Keys are auto-validated as you enter</li>
          </ul>
        </div>
      </div>

      {/* Footer */}
      <div className="max-w-2xl mx-auto mt-12 text-center text-sm text-gray-500">
        <p>
          This setup wizard securely stores your API keys in browser localStorage.
          In production, they will be encrypted and stored server-side.
        </p>
      </div>
    </div>
  );
};

export default SetupPage;
