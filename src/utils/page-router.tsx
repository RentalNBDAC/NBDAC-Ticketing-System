// Page Router Utility
import React from 'react';
import HomePage from '../components/HomePage';
import GuestPage from '../components/GuestPage';
import InternalPage from '../components/InternalPage';
import AdminLoginPage from '../components/AdminLoginPage';
import AdminSetupPage from '../components/AdminSetupPage';
import EmailSetupPage from '../components/EmailSetupPage';
import EmailJSSetupPage from '../components/EmailJSSetupPage';
import PermohonanBaruPage from '../components/PermohonanBaruPage';
import SemakStatusPage from '../components/SemakStatusPage';
import { handlePermohonanBaruBack, handlePermohonanBaruSubmit } from './navigation';
import { APP_CONSTANTS, PageType } from './constants';

interface PageRouterProps {
  currentPage: string;
  authLoading: boolean;
  isAuthenticated: boolean;
  navigateToPage: (page: string) => void;
  setCurrentPage: (page: string) => void;
  submissions: any[];
  loading: boolean;
  handleAddSubmission: (data: any) => Promise<boolean>;
  handleUpdateStatus: (id: string, status: string) => Promise<void>;
  loadSubmissions: () => Promise<void>;
  handleAdminLogin: (email: string, password: string) => Promise<any>;
  getSubmissionsByEmail: (email: string) => Promise<{ success: boolean; submissions: any[]; total: number; source: string; error?: string }>;
}

/**
 * Render loading state while checking authentication
 */
export function renderLoadingState() {
  return (
    <div className="min-h-[400px] flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
        <p className="text-gray-600">{APP_CONSTANTS.AUTH_CHECK_MESSAGE}</p>
      </div>
    </div>
  );
}

/**
 * Main page router function
 */
export function renderPage({
  currentPage,
  authLoading,
  isAuthenticated,
  navigateToPage,
  setCurrentPage,
  submissions,
  loading,
  handleAddSubmission,
  handleUpdateStatus,
  loadSubmissions,
  handleAdminLogin,
  getSubmissionsByEmail,
}: PageRouterProps): React.ReactNode {
  // Show loading state while checking authentication
  if (authLoading) {
    return renderLoadingState();
  }

  switch (currentPage) {
    case APP_CONSTANTS.PAGES.HOME:
      return (
        <HomePage 
          onNavigate={navigateToPage} 
          isAdminAuthenticated={isAuthenticated}
        />
      );
      
    case APP_CONSTANTS.PAGES.GUEST:
      return (
        <GuestPage 
          onNavigate={navigateToPage} 
          onBack={() => navigateToPage(APP_CONSTANTS.PAGES.HOME)} 
        />
      );
      
    case APP_CONSTANTS.PAGES.INTERNAL:
      // Double-check authentication for internal page
      if (!isAuthenticated) {
        navigateToPage(APP_CONSTANTS.PAGES.ADMIN_LOGIN);
        return null;
      }
      return (
        <InternalPage 
          onNavigate={navigateToPage} 
          onBack={() => navigateToPage(APP_CONSTANTS.PAGES.HOME)}
          submissions={submissions}
          onAddSubmission={handleAddSubmission}
          onUpdateStatus={handleUpdateStatus}
          onRefreshSubmissions={loadSubmissions}
          loading={loading}
        />
      );
      
    case APP_CONSTANTS.PAGES.ADMIN_LOGIN:
      // Redirect to internal if already authenticated
      if (isAuthenticated) {
        setCurrentPage(APP_CONSTANTS.PAGES.INTERNAL);
        return null;
      }
      return (
        <AdminLoginPage 
          onBack={() => navigateToPage(APP_CONSTANTS.PAGES.HOME)}
          onLogin={handleAdminLogin}
          onNavigateToSetup={() => navigateToPage(APP_CONSTANTS.PAGES.ADMIN_SETUP)}
          loading={authLoading}
        />
      );
      
    case APP_CONSTANTS.PAGES.ADMIN_SETUP:
      return (
        <AdminSetupPage 
          onBack={() => navigateToPage(APP_CONSTANTS.PAGES.HOME)}
        />
      );
      
    case APP_CONSTANTS.PAGES.EMAIL_SETUP:
      return (
        <EmailSetupPage />
      );
      
    case APP_CONSTANTS.PAGES.EMAILJS_SETUP:
      return (
        <EmailJSSetupPage onBack={() => navigateToPage(APP_CONSTANTS.PAGES.HOME)} />
      );
      
    case APP_CONSTANTS.PAGES.PERMOHONAN_BARU:
      return (
        <PermohonanBaruPage 
          onBack={() => handlePermohonanBaruBack(navigateToPage)}
          onSubmit={(data) => handlePermohonanBaruSubmit(data, handleAddSubmission, navigateToPage)}
          loading={loading}
        />
      );
      
    case APP_CONSTANTS.PAGES.SEMAK_STATUS:
      return (
        <SemakStatusPage 
          onBack={() => navigateToPage(APP_CONSTANTS.PAGES.GUEST)}
          onSearchByEmail={async (email: string) => {
            const result = await getSubmissionsByEmail(email);
            // Extract submissions array from the result object
            return result.submissions || [];
          }}
          loading={loading}
        />
      );
      
    default:
      return (
        <HomePage 
          onNavigate={navigateToPage} 
          isAdminAuthenticated={isAuthenticated}
        />
      );
  }
}