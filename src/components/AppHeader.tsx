import React from 'react';
import { Button } from './ui/button';
import { Home, LogOut, Shield } from 'lucide-react';
import { Badge } from './ui/badge';
import { Separator } from './ui/separator';
import { toast } from '../utils/toast';

interface AppHeaderProps {
  currentPage: string;
  onNavigateHome: () => void;
  isAdminAuthenticated: boolean;
  adminDisplayName: string;
  onLogout: () => void;
}

export default function AppHeader({ 
  currentPage, 
  onNavigateHome, 
  isAdminAuthenticated, 
  adminDisplayName,
  onLogout 
}: AppHeaderProps) {
  const getPageTitle = () => {
    switch (currentPage) {
      case 'home':
        return 'Laman Utama';
      case 'guest':
        return 'Portal Tetamu';
      case 'internal':
        return 'Portal Dalaman';
      case 'admin-login':
        return 'Log Masuk Pentadbir';
      case 'admin-setup':
        return 'Setup Pentadbir';
      case 'email-setup':
        return 'Setup Email';
      case 'emailjs-setup':
        return 'Setup EmailJS';
      case 'permohonan-baru':
        return 'Permohonan Baru';
      case 'semak-status':
        return 'Semak Status';
      default:
        return 'Sistem Permohonan Projek Web Scraping NBDAC';
    }
  };

  // Mobile-friendly system title
  const getSystemTitle = () => {
    return {
      full: 'Sistem Permohonan Projek Web Scraping NBDAC',
      short: 'SPPN'  // Sistem Permohonan Projek Web Scraping NBDAC abbreviated
    };
  };

  const handleLogout = () => {
    onLogout();
    toast.success('Berjaya log keluar', 'Anda telah log keluar dengan selamat.');
  };

  return (
    <header className="bg-white border-b border-gray-200/80 shadow-sm">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between h-16 px-4 sm:px-6">
          {/* Left Section - System Name & Navigation */}
          <div className="flex items-center space-x-3 sm:space-x-6 min-w-0 flex-1">
            <div className="flex items-center space-x-2 sm:space-x-3 min-w-0">
              {/* System Logo/Icon */}
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center shrink-0">
                <span className="text-primary-foreground font-bold text-sm">N</span>
              </div>
              <div className="min-w-0">
                {/* Mobile: Show short title, Desktop: Show full title */}
                <h1 className="font-semibold text-gray-900 truncate text-base sm:text-lg">
                  <span className="hidden sm:inline">{getSystemTitle().full}</span>
                  <span className="sm:hidden">{getSystemTitle().short}</span>
                </h1>
              </div>
            </div>

            {/* Navigation Breadcrumb - Hidden on small screens when authenticated */}
            {currentPage !== 'home' && (
              <>
                <Separator orientation="vertical" className="h-6 hidden sm:block" />
                <div className="hidden sm:flex items-center space-x-2 text-sm min-w-0">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={onNavigateHome}
                    className="text-gray-600 hover:text-gray-900 px-2 py-1 h-auto shrink-0"
                  >
                    <Home className="h-4 w-4 mr-1" />
                    Utama
                  </Button>
                  <span className="text-gray-400">/</span>
                  <span className="text-gray-900 font-medium truncate">{getPageTitle()}</span>
                </div>
              </>
            )}
          </div>

          {/* Right Section - Admin Status & Actions */}
          <div className="flex items-center space-x-2 sm:space-x-4 shrink-0">
            {isAdminAuthenticated ? (
              <>
                {/* Desktop Layout */}
                <div className="hidden md:flex items-center space-x-3">
                  <Badge 
                    variant="secondary" 
                    className="bg-green-50 text-green-700 border-green-200 px-3 py-1"
                  >
                    <Shield className="h-3 w-3 mr-1" />
                    Pentadbir
                  </Badge>

                </div>
                
                {/* Mobile Layout - Compact */}
                <div className="flex md:hidden items-center">
                  <Badge 
                    variant="secondary" 
                    className="bg-green-50 text-green-700 border-green-200 px-2 py-1 text-xs"
                  >
                    <Shield className="h-3 w-3" />
                  </Badge>
                </div>

                <Separator orientation="vertical" className="h-6 hidden sm:block" />
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleLogout}
                  className="text-gray-600 hover:text-gray-900 border-gray-300"
                >
                  <LogOut className="h-4 w-4 sm:mr-2" />
                  <span className="hidden sm:inline">Log Keluar</span>
                </Button>
              </>
            ) : currentPage === 'internal' ? (
              <Badge variant="destructive" className="px-2 sm:px-3 py-1 text-xs sm:text-sm">
                <Shield className="h-3 w-3 mr-1" />
                <span className="hidden sm:inline">Akses Ditolak</span>
                <span className="sm:hidden">Ditolak</span>
              </Badge>
            ) : null}
          </div>
        </div>
      </div>
    </header>
  );
}