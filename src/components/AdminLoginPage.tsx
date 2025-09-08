import React, { useState } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { ArrowLeft, Loader2, Shield, AlertTriangle } from 'lucide-react';
import { Alert, AlertDescription } from './ui/alert';
import { validateSupabaseConfig } from '../utils/auth';

interface AdminLoginPageProps {
  onBack: () => void;
  onLogin: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  onNavigateToSetup?: () => void;
  loading?: boolean;
}

export default function AdminLoginPage({ onBack, onLogin, onNavigateToSetup, loading = false }: AdminLoginPageProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  // Check Supabase configuration
  const configStatus = validateSupabaseConfig();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      setError('Sila masukkan email dan kata laluan');
      return;
    }

    if (!email.includes('@')) {
      setError('Sila masukkan alamat email yang sah');
      return;
    }

    setIsSubmitting(true);
    setError('');

    try {
      const result = await onLogin(email, password);
      
      if (!result.success) {
        setError(result.error || 'Gagal log masuk');
      }
      // Success handling is done in the parent component
      
    } catch (error) {
      console.error('Login form error:', error);
      setError('Ralat tidak dijangka. Sila cuba lagi.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-md mx-auto space-y-8">
      <div className="flex items-center gap-4">
        <Button variant="outline" onClick={onBack} className="flex items-center gap-2" disabled={loading || isSubmitting}>
          <ArrowLeft className="h-4 w-4" />
          Kembali
        </Button>
        <div>
          <h2 className="text-2xl font-medium text-foreground">Portal Dalaman</h2>
          <p className="text-muted-foreground">Log masuk untuk akses pentadbir</p>
        </div>
      </div>

      {/* Configuration Warning for Development */}
      {!configStatus.isValid && (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            <div className="space-y-1">
              <p className="font-medium">Konfigurasi Supabase Tidak Lengkap:</p>
              {configStatus.errors.map((error, index) => (
                <p key={index} className="text-sm">• {error}</p>
              ))}
            </div>
          </AlertDescription>
        </Alert>
      )}

      <Card>
        <CardHeader className="space-y-4">
          <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto">
            <Shield className="h-6 w-6 text-primary" />
          </div>
          <div className="text-center">
            <CardTitle className="text-xl">Pengesahan Pentadbir</CardTitle>
            <p className="text-sm text-muted-foreground mt-2">
              Gunakan akaun Supabase yang berdaftar untuk log masuk
            </p>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <Alert variant="destructive">
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <div className="space-y-2">
              <Label htmlFor="email">Alamat Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@nbdac.gov.my"
                disabled={isSubmitting || loading}
                autoComplete="username"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Kata Laluan</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Masukkan kata laluan"
                disabled={isSubmitting || loading}
                autoComplete="current-password"
                required
              />
            </div>

            <Button 
              type="submit" 
              className="w-full" 
              disabled={isSubmitting || loading || !configStatus.isValid}
            >
              {isSubmitting || loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  Mengesahkan...
                </>
              ) : (
                'Log Masuk'
              )}
            </Button>
          </form>

          {/* Production Setup Information */}
          <div className="mt-6 space-y-4">
            <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
              <div className="text-sm text-blue-800 space-y-2">
                <p className="font-medium text-blue-900">Maklumat Pengeluaran:</p>
                <p>• Sistem menggunakan pengesahan Supabase sahaja</p>
                <p>• Akaun pentadbir mesti dicipta di dashboard Supabase Auth</p>
                <p>• Hubungi pentadbir sistem untuk akses akaun baharu</p>
              </div>
            </div>
            
            {/* Quick Admin Setup Link */}
            {onNavigateToSetup && (
              <div className="text-center">
                <Button 
                  variant="outline" 
                  onClick={onNavigateToSetup}
                  className="text-sm"
                  disabled={isSubmitting || loading}
                >
                  Cipta Admin Baharu
                </Button>
                <p className="text-xs text-muted-foreground mt-2">
                  Untuk mencipta akaun pentadbir baharu terus
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}