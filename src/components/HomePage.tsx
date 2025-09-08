import React from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Users, UserCheck, Shield, ArrowRight, FileText, Search, Mail, Settings } from 'lucide-react';

interface HomePageProps {
  onNavigate: (page: string) => void;
  isAdminAuthenticated: boolean;
}

export default function HomePage({ onNavigate, isAdminAuthenticated }: HomePageProps) {
  return (
    <div className="space-y-12">
      {/* Hero Section */}
      <div className="text-center max-w-3xl mx-auto space-y-6">
        <div className="space-y-4">
          <h1 className="text-3xl font-bold text-gray-900">
            Sistem Permohonan Projek NBDAC
          </h1>
          <p className="text-lg text-gray-600 leading-relaxed">
            Platform digital untuk menghantar dan mengurus permohonan projek di National Big Data Analytics Centre. 
            Pilih portal yang sesuai untuk meneruskan.
          </p>
        </div>
      </div>

      {/* Portal Cards */}
      <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
        {/* Guest Portal */}
        <Card className="relative overflow-hidden border-gray-200 shadow-md hover:shadow-lg transition-shadow">
          <CardHeader className="space-y-4">
            <div className="flex items-center space-x-4">
              <div className="w-14 h-14 bg-blue-100 rounded-xl flex items-center justify-center">
                <Users className="h-7 w-7 text-blue-600" />
              </div>
              <div>
                <CardTitle className="text-xl text-gray-900">Portal Tetamu</CardTitle>
                <p className="text-gray-600 font-normal">
                  Untuk pengguna awam dan organisasi
                </p>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <h4 className="font-semibold text-gray-900">Fungsi yang tersedia:</h4>
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <FileText className="h-4 w-4 text-blue-600" />
                  <span className="text-gray-700">Hantar permohonan projek baru</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Search className="h-4 w-4 text-blue-600" />
                  <span className="text-gray-700">Semak status permohonan</span>
                </div>
                <div className="flex items-center space-x-3">
                  <FileText className="h-4 w-4 text-blue-600" />
                  <span className="text-gray-700">Lihat maklumat permohonan</span>
                </div>
              </div>
            </div>
            <Button 
              onClick={() => onNavigate('guest')} 
              className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 h-12"
            >
              Masuk Portal Tetamu
              <ArrowRight className="h-4 w-4" />
            </Button>
          </CardContent>
        </Card>

        {/* Internal Portal */}
        <Card className="relative overflow-hidden border-gray-200 shadow-md hover:shadow-lg transition-shadow">
          <CardHeader className="space-y-4">
            <div className="flex items-center space-x-4">
              <div className="w-14 h-14 bg-green-100 rounded-xl flex items-center justify-center">
                <Shield className="h-7 w-7 text-green-600" />
              </div>
              <div>
                <CardTitle className="text-xl text-gray-900">Portal Dalaman</CardTitle>
                <p className="text-gray-600 font-normal">
                  Untuk kakitangan NBDAC
                </p>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <h4 className="font-semibold text-gray-900">Fungsi yang tersedia:</h4>
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <FileText className="h-4 w-4 text-green-600" />
                  <span className="text-gray-700">Lihat semua permohonan</span>
                </div>
                <div className="flex items-center space-x-3">
                  <UserCheck className="h-4 w-4 text-green-600" />
                  <span className="text-gray-700">Kemaskini status permohonan</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Shield className="h-4 w-4 text-green-600" />
                  <span className="text-gray-700">Urus dan pantau projek</span>
                </div>
              </div>
            </div>
            
            {isAdminAuthenticated ? (
              <Button 
                onClick={() => onNavigate('internal')} 
                className="w-full flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 h-12"
              >
                <UserCheck className="h-4 w-4" />
                Masuk Portal Dalaman
                <ArrowRight className="h-4 w-4" />
              </Button>
            ) : (
              <div className="space-y-3">
                <Button 
                  onClick={() => onNavigate('admin-login')} 
                  variant="outline"
                  className="w-full flex items-center justify-center gap-2 border-green-300 text-green-700 hover:bg-green-50 h-12"
                >
                  <Shield className="h-4 w-4" />
                  Log Masuk Pentadbir
                </Button>
                <p className="text-xs text-gray-500 text-center">
                  Portal ini memerlukan pengesahan pentadbir NBDAC
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Information Section */}
      <div className="max-w-5xl mx-auto">
        <Card className="border-gray-200 shadow-sm">
          <CardHeader>
            <CardTitle className="text-xl text-gray-900">Maklumat Sistem</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-8">
              <div className="space-y-3">
                <h4 className="font-semibold text-gray-900">Untuk Pengguna Baharu</h4>
                <p className="text-gray-600 leading-relaxed">
                  Jika ini adalah kali pertama anda menggunakan sistem, sila gunakan Portal Tetamu untuk menghantar permohonan projek anda. 
                  Anda boleh semak status permohonan menggunakan alamat email yang didaftarkan.
                </p>
              </div>
              <div className="space-y-3">
                <h4 className="font-semibold text-gray-900">Untuk Kakitangan NBDAC</h4>
                <p className="text-gray-600 leading-relaxed">
                  Kakitangan dalaman perlu log masuk melalui Portal Dalaman menggunakan akaun Supabase yang berdaftar untuk mengakses fungsi pengurusan dan pentadbiran sistem.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Setup Section - Only show if not admin authenticated */}
      {!isAdminAuthenticated && (
        <div className="max-w-5xl mx-auto">
          <Card className="border-orange-200 bg-orange-50">
            <CardHeader>
              <CardTitle className="text-xl text-orange-900 flex items-center gap-2">
                <Settings className="h-5 w-5" />
                System Setup
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <p className="text-orange-800">
                  First time setting up the system? Use these tools to configure your NBDAC project request system.
                </p>
                <div className="flex flex-wrap gap-3">
                  <Button
                    variant="outline"
                    onClick={() => onNavigate('admin-setup')}
                    className="border-orange-300 text-orange-700 hover:bg-orange-100"
                  >
                    <Settings className="mr-2 h-4 w-4" />
                    Setup Admin Users
                  </Button>
                  
                  <Button
                    variant="outline"
                    onClick={() => onNavigate('email-setup')}
                    className="border-orange-300 text-orange-700 hover:bg-orange-100"
                  >
                    <Mail className="mr-2 h-4 w-4" />
                    Setup Email Notifications
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Footer Info */}
      <div className="text-center text-gray-500 text-sm">
        <p>© 2024 National Big Data Analytics Centre (NBDAC)</p>
      </div>
    </div>
  );
}