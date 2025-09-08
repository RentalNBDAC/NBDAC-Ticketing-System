import React, { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { ArrowLeft, Shield, Loader2, CheckCircle, AlertTriangle, Lock, Info, RefreshCw, Database, Users } from 'lucide-react';
import { Alert, AlertDescription } from './ui/alert';
import { createAdminUser, getCurrentSetupKey, validateAdminEmail, validateAdminPassword, isAdminSetupAllowed, getEnvironmentInfo } from '../utils/setup';

interface AdminSetupPageProps {
  onBack: () => void;
}

export default function AdminSetupPage({ onBack }: AdminSetupPageProps) {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    name: '',
    setupKey: getCurrentSetupKey()
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [result, setResult] = useState<{ success?: boolean; error?: string; user?: any } | null>(null);
  const [setupAllowed, setSetupAllowed] = useState(true);
  const [environmentInfo, setEnvironmentInfo] = useState(getEnvironmentInfo());
  const [systemHealth, setSystemHealth] = useState<any>(null);
  const [checkingHealth, setCheckingHealth] = useState(false);

  // Check system health
  const checkSystemHealth = async () => {
    setCheckingHealth(true);
    try {
      const response = await fetch('/functions/v1/make-server-764b8bb4/health');
      const health = await response.json();
      setSystemHealth(health);
    } catch (error) {
      console.error('Health check failed:', error);
    } finally {
      setCheckingHealth(false);
    }
  };

  // Check if setup is allowed on component mount
  useEffect(() => {
    const setupCheck = isAdminSetupAllowed();
    setSetupAllowed(setupCheck.allowed);
    
    if (!setupCheck.allowed) {
      setResult({ success: false, error: setupCheck.reason });
    }

    // Check system health
    checkSystemHealth();
  }, []);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setResult(null); // Clear previous results
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    const emailValidation = validateAdminEmail(formData.email);
    if (!emailValidation.valid) {
      setResult({ success: false, error: emailValidation.error });
      return;
    }

    const passwordValidation = validateAdminPassword(formData.password);
    if (!passwordValidation.valid) {
      setResult({ success: false, error: passwordValidation.error });
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setResult({ success: false, error: 'Kata laluan tidak sepadan' });
      return;
    }

    if (!formData.setupKey) {
      setResult({ success: false, error: 'Setup key diperlukan' });
      return;
    }

    setIsSubmitting(true);
    setResult(null);

    try {
      const creationResult = await createAdminUser({
        email: formData.email,
        password: formData.password,
        name: formData.name,
        setupKey: formData.setupKey
      });

      setResult(creationResult);

      if (creationResult.success) {
        // Clear form on success
        setFormData({
          email: '',
          password: '',
          confirmPassword: '',
          name: '',
          setupKey: getCurrentSetupKey()
        });

        // Refresh system health to show updated admin count
        setTimeout(() => {
          checkSystemHealth();
        }, 1000);
      }
    } catch (error) {
      console.error('Setup error:', error);
      setResult({ 
        success: false, 
        error: 'Ralat tidak dijangka semasa proses setup' 
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-md mx-auto space-y-8">
      <div className="flex items-center gap-4">
        <Button variant="outline" onClick={onBack} className="flex items-center gap-2">
          <ArrowLeft className="h-4 w-4" />
          Kembali
        </Button>
        <div>
          <h2 className="text-2xl font-medium text-foreground">Setup Admin</h2>
          <p className="text-muted-foreground">Cipta akaun pentadbir baharu</p>
        </div>
      </div>

      {/* System Health Status */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2">
            <RefreshCw className={`h-5 w-5 ${checkingHealth ? 'animate-spin' : ''}`} />
            System Status
            <Button 
              variant="outline" 
              size="sm" 
              onClick={checkSystemHealth}
              disabled={checkingHealth}
            >
              {checkingHealth ? 'Checking...' : 'Refresh'}
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {systemHealth ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Database Status */}
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <Database className={`h-5 w-5 ${systemHealth.database?.submissions_table_exists ? 'text-green-600' : 'text-yellow-600'}`} />
                <div>
                  <p className="font-medium text-sm">Database</p>
                  <p className="text-xs text-gray-600">
                    {systemHealth.database?.storage_mode || 'Unknown'}
                  </p>
                </div>
              </div>

              {/* Admin Users Status */}
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <Users className={`h-5 w-5 ${systemHealth.admin?.admin_users_found > 0 ? 'text-green-600' : 'text-red-600'}`} />
                <div>
                  <p className="font-medium text-sm">Admin Users</p>
                  <p className="text-xs text-gray-600">
                    {systemHealth.admin?.admin_users_found || 0} users found
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-4">
              <p className="text-sm text-gray-500">Click refresh to check system status</p>
            </div>
          )}

          {/* Issues Alert */}
          {systemHealth?.setup_required && (systemHealth.setup_required.database || systemHealth.setup_required.admin_users) && (
            <Alert variant="destructive">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                <div className="space-y-2">
                  <p className="font-medium">Setup Required:</p>
                  <ul className="text-sm space-y-1">
                    {systemHealth.setup_required.database && (
                      <li>• Database table missing - see DATABASE_SETUP.md</li>
                    )}
                    {systemHealth.setup_required.admin_users && (
                      <li>• No admin users found - create one below</li>
                    )}
                  </ul>
                </div>
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>

      {/* Environment Security Info */}
      <Alert variant={environmentInfo.securityLevel === 'production' ? 'destructive' : 'default'}>
        <Info className="h-4 w-4" />
        <AlertDescription>
          <div className="space-y-1">
            <p className="font-medium">Environment: {environmentInfo.environment}</p>
            <p className="text-sm">Security Level: {environmentInfo.securityLevel}</p>
            {environmentInfo.securityLevel === 'production' && (
              <p className="text-sm text-destructive">⚠️ Production mode: Gunakan Supabase Dashboard untuk keselamatan optimum</p>
            )}
          </div>
        </AlertDescription>
      </Alert>

      <Card>
        <CardHeader className="space-y-4">
          <div className={`w-12 h-12 rounded-lg flex items-center justify-center mx-auto ${setupAllowed ? 'bg-primary/10' : 'bg-destructive/10'}`}>
            {setupAllowed ? (
              <Shield className="h-6 w-6 text-primary" />
            ) : (
              <Lock className="h-6 w-6 text-destructive" />
            )}
          </div>
          <div className="text-center">
            <CardTitle className="text-xl">
              {setupAllowed ? 'Cipta Admin Baharu' : 'Setup Tidak Tersedia'}
            </CardTitle>
            <p className="text-sm text-muted-foreground mt-2">
              {setupAllowed 
                ? 'Gunakan borang ini untuk mencipta akaun pentadbir dengan kata laluan terus'
                : 'Setup admin dihadkan untuk keselamatan sistem'
              }
            </p>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Setup Not Allowed Message */}
          {!setupAllowed && (
            <Alert variant="destructive">
              <Lock className="h-4 w-4" />
              <AlertDescription>
                <div className="space-y-2">
                  <p className="font-medium">Setup Admin Dimatikan</p>
                  <p className="text-sm">Untuk keselamatan, setup admin melalui interface ini dimatikan dalam persekitaran ini.</p>
                  <div className="mt-3 space-y-1 text-sm">
                    <p className="font-medium">Kaedah alternatif:</p>
                    <p>• Gunakan Supabase Dashboard → Authentication → Users</p>
                    <p>• Hubungi pentadbir sistem untuk setup akaun</p>
                    <p>• Set REACT_APP_ALLOW_ADMIN_SETUP=true untuk enable (tidak disarankan)</p>
                  </div>
                </div>
              </AlertDescription>
            </Alert>
          )}

          {/* Result Display */}
          {result && (
            <Alert variant={result.success ? "default" : "destructive"}>
              {result.success ? (
                <CheckCircle className="h-4 w-4" />
              ) : (
                <AlertTriangle className="h-4 w-4" />
              )}
              <AlertDescription>
                {result.success ? (
                  <div className="space-y-2">
                    <p className="font-medium">✅ Admin berjaya dicipta!</p>
                    <div className="text-sm space-y-1">
                      <p><span className="font-medium">Email:</span> {result.user?.email}</p>
                      <p><span className="font-medium">Nama:</span> {result.user?.name || 'Tidak dinyatakan'}</p>
                      <p className="text-green-700">Anda boleh log masuk sekarang dengan kredential ini.</p>
                    </div>
                  </div>
                ) : (
                  result.error
                )}
              </AlertDescription>
            </Alert>
          )}

          {setupAllowed && (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Alamat Email Admin</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  placeholder="admin@nbdac.gov.my"
                  disabled={isSubmitting || !setupAllowed}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="name">Nama Pentadbir (Pilihan)</Label>
                <Input
                  id="name"
                  type="text"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  placeholder="Nama Pentadbir"
                  disabled={isSubmitting || !setupAllowed}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Kata Laluan</Label>
                <Input
                  id="password"
                  type="password"
                  value={formData.password}
                  onChange={(e) => handleInputChange('password', e.target.value)}
                  placeholder="Minimum 12 karakter dengan gabungan kuat"
                  disabled={isSubmitting || !setupAllowed}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Sahkan Kata Laluan</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  value={formData.confirmPassword}
                  onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                  placeholder="Masukkan kata laluan sekali lagi"
                  disabled={isSubmitting || !setupAllowed}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="setupKey">Setup Key</Label>
                <Input
                  id="setupKey"
                  type="text"
                  value={formData.setupKey}
                  onChange={(e) => handleInputChange('setupKey', e.target.value)}
                  placeholder="Setup key untuk keselamatan"
                  disabled={isSubmitting || !setupAllowed}
                  required
                />
                <p className="text-xs text-muted-foreground">
                  Setup key dijangka: <code className="bg-muted px-1 rounded">{getCurrentSetupKey()}</code>
                </p>
              </div>

              <Button 
                type="submit" 
                className="w-full" 
                disabled={isSubmitting || !setupAllowed}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    Mencipta Admin...
                  </>
                ) : (
                  'Cipta Admin'
                )}
              </Button>
            </form>
          )}



          {/* Instructions */}
          <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
            <div className="text-sm text-blue-800 space-y-2">
              <p className="font-medium text-blue-900">
                {setupAllowed ? 'Panduan Setup:' : 'Kaedah Selamat untuk Setup Admin:'}
              </p>
              {setupAllowed ? (
                <ol className="list-decimal list-inside space-y-1">
                  <li>Masukkan email yang akan digunakan untuk log masuk</li>
                  <li>Cipta kata laluan yang kuat (minimum 12 karakter)</li>
                  <li>Gunakan setup key yang betul untuk keselamatan</li>
                  <li>Akaun akan dicipta terus tanpa perlu konfirmasi email</li>
                </ol>
              ) : (
                <ol className="list-decimal list-inside space-y-1">
                  <li>Pergi ke Supabase Dashboard → Authentication → Users</li>
                  <li>Klik "Add User" untuk cipta admin dengan password terus</li>
                  <li>Atau gunakan "Invite User" untuk hantar email setup</li>
                  <li>Set user metadata: role = "admin" untuk akses penuh</li>
                </ol>
              )}
            </div>
          </div>

          {/* Security Information */}
          <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-200">
            <div className="text-sm text-yellow-800 space-y-2">
              <p className="font-medium text-yellow-900 flex items-center gap-2">
                <Shield className="h-4 w-4" />
                Nota Keselamatan:
              </p>
              <ul className="space-y-1">
                <li>• Setup page ini dimatikan automatik dalam produksi</li>
                <li>• Gunakan Supabase Dashboard untuk keselamatan optimum</li>
                <li>• Jangan kongsikan setup key dengan orang yang tidak dibenarkan</li>
                <li>• Monitor log system untuk aktiviti admin yang mencurigakan</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}