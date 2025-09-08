import React, { useState, useEffect } from 'react';
import AppHeader from './components/AppHeader';
import { useSubmissions } from './hooks/useSubmissions';
import { useAuth } from './hooks/useAuth';
import { getAdminDisplayName } from './utils/auth';
import { Toaster } from './components/ui/sonner';
import { initializeApp } from './utils/app-initialization';

// Import types for window extensions
import './utils/types';

// Core app utilities
import { APP_CONSTANTS } from './utils/constants';
import {
  createNavigationHandler,
  createAdminLoginHandler,
  createAdminLogoutHandler,
  createSubmissionHandler,
  createStatusUpdateHandler,
  createCleanupHandler,
} from './utils/app-handlers';
import { renderPage } from './utils/page-router';
import {
  initializeCurrentPage,
  saveCurrentPage,
  setupDevelopmentHelpers,
  logAuthenticationStatus,
  createToastConfig,
} from './utils/app-helpers';

export default function App() {
  // Initialize app - environment, health checks, window functions, and console instructions
  useEffect(() => {
    initializeApp();
  }, []);

  // Initialize currentPage from localStorage
  const [currentPage, setCurrentPage] = useState(initializeCurrentPage);

  // Authentication state
  const { isAuthenticated, admin, loading: authLoading, login, logout } = useAuth();

  // Submissions state
  const {
    submissions,
    loading,
    loadSubmissions,
    addSubmission,
    updateSubmissionStatus,
    getSubmissionsByEmail
  } = useSubmissions();

  // Save current page to localStorage whenever it changes
  useEffect(() => {
    saveCurrentPage(currentPage);
  }, [currentPage]);

  // Redirect to login if trying to access internal without auth
  useEffect(() => {
    if (!authLoading && currentPage === APP_CONSTANTS.PAGES.INTERNAL && !isAuthenticated) {
      console.log('Redirecting to admin login - no authentication');
      setCurrentPage(APP_CONSTANTS.PAGES.ADMIN_LOGIN);
    }
  }, [currentPage, isAuthenticated, authLoading]);

  // Show authentication status on load
  useEffect(() => {
    logAuthenticationStatus(authLoading);
  }, [authLoading]);

  // Auto-load submissions when authenticated (fixes refresh issue)
  useEffect(() => {
    if (!authLoading && isAuthenticated && currentPage === APP_CONSTANTS.PAGES.INTERNAL) {
      console.log('🔄 Auto-loading submissions after authentication...');
      loadSubmissions();
    }
  }, [authLoading, isAuthenticated, currentPage, loadSubmissions]);

  // Create event handlers using factory functions
  const navigateToPage = createNavigationHandler(isAuthenticated, setCurrentPage);
  const handleAdminLogin = createAdminLoginHandler(login, setCurrentPage);
  const handleAdminLogout = createAdminLogoutHandler(logout, setCurrentPage);
  const handleAddSubmission = createSubmissionHandler(addSubmission);
  const handleUpdateStatus = createStatusUpdateHandler(updateSubmissionStatus);
  const runCleanup = createCleanupHandler();

  // Setup development helpers
  useEffect(() => {
    setupDevelopmentHelpers(runCleanup, navigateToPage);
    
    // Add event listener for EmailJS navigation
    const handleNavigateToPage = (event: CustomEvent) => {
      const { page } = event.detail;
      if (page && typeof page === 'string') {
        console.log(`📱 Custom navigation to: ${page}`);
        navigateToPage(page);
      }
    };
    
    window.addEventListener('navigate-to-page', handleNavigateToPage as EventListener);
    
    // Cleanup event listener
    return () => {
      window.removeEventListener('navigate-to-page', handleNavigateToPage as EventListener);
    };
  }, [navigateToPage]);

  // Get toast configuration
  const toastConfig = createToastConfig();

  return (
    <div className="min-h-screen bg-gray-50">
      <AppHeader 
        currentPage={currentPage} 
        onNavigateHome={() => navigateToPage(APP_CONSTANTS.PAGES.HOME)}
        isAdminAuthenticated={isAuthenticated}
        adminDisplayName={getAdminDisplayName()}
        onLogout={handleAdminLogout}
      />
      <main className="max-w-7xl mx-auto px-4 py-8">
        {renderPage({
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
        })}
      </main>
      
      {/* Clean Toast notifications with custom styling */}
      <Toaster 
        position={toastConfig.position}
        closeButton={toastConfig.closeButton}
        expand={toastConfig.expand}
        visibleToasts={toastConfig.visibleToasts}
        toastOptions={toastConfig.toastOptions}
        gap={toastConfig.gap}
        offset={toastConfig.offset}
      />
    </div>
  );
}