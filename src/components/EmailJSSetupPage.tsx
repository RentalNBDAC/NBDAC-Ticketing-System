// EmailJS Setup Page - Configure EmailJS for email notifications
import React, { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Alert, AlertDescription } from './ui/alert';
import { Badge } from './ui/badge';
import { Separator } from './ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { CheckCircle, XCircle, Mail, Settings, TestTube, ArrowLeft, ExternalLink, Zap, Eye, RefreshCw } from 'lucide-react';
import { emailjsService, testEmailConfiguration, type EmailJSConfig } from '../utils/emailjs-service';
import { toast } from 'sonner@2.0.3';

interface EmailJSSetupPageProps {
  onBack?: () => void;
}

export default function EmailJSSetupPage({ onBack }: EmailJSSetupPageProps) {
  const [config, setConfig] = useState<EmailJSConfig>({
    serviceId: '',
    templateId: '',
    publicKey: '',
    privateKey: '',
    fromName: 'Sistem NBDAC',
    fromEmail: 'noreply@nbdac.gov.my'
  });

  const [testEmail, setTestEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [testing, setTesting] = useState(false);
  const [configured, setConfigured] = useState(false);
  const [envStatus, setEnvStatus] = useState<any>(null);
  const [serverStatus, setServerStatus] = useState<any>(null);
  const [checkingEnv, setCheckingEnv] = useState(false);
  const [checkingServer, setCheckingServer] = useState(false);

  // Load existing configuration on mount
  useEffect(() => {
    const existingConfig = emailjsService.getConfig();
    if (existingConfig) {
      setConfig(prev => ({
        ...prev,
        ...existingConfig
      }));
      setConfigured(emailjsService.isConfigured());
    }
    // Auto-check environment variables on load and try to auto-load if available
    handleCheckEnvVars();
    handleCheckServerStatus();
    
    // Try to auto-load from environment variables if not already configured
    if (!existingConfig || !emailjsService.isConfigured()) {
      setTimeout(() => {
        handleAutoLoadFromEnv();
      }, 1000); // Small delay to let the environment check complete first
    }
  }, []);

  // Handle input changes
  const handleInputChange = (field: keyof EmailJSConfig, value: string) => {
    setConfig(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Save EmailJS configuration
  const handleSaveConfig = async () => {
    if (!config.serviceId || !config.templateId || !config.publicKey) {
      toast.error('Sila isi semua medan yang diperlukan');
      return;
    }

    setLoading(true);
    try {
      const success = emailjsService.updateConfig(config);
      
      if (success) {
        setConfigured(true);
        toast.success('Konfigurasi EmailJS berjaya disimpan!');
      } else {
        toast.error('Gagal menyimpan konfigurasi EmailJS');
      }
    } catch (error) {
      console.error('Error saving EmailJS config:', error);
      toast.error('Ralat semasa menyimpan konfigurasi');
    } finally {
      setLoading(false);
    }
  };

  // Test email configuration
  const handleTestEmail = async () => {
    if (!testEmail) {
      toast.error('Sila masukkan alamat email untuk ujian');
      return;
    }

    if (!configured) {
      toast.error('Sila simpan konfigurasi dahulu sebelum menguji');
      return;
    }

    setTesting(true);
    try {
      const result = await testEmailConfiguration(testEmail);
      
      if (result.success) {
        toast.success(result.message);
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      console.error('Email test error:', error);
      toast.error('Ralat semasa menguji email');
    } finally {
      setTesting(false);
    }
  };

  // Check environment variables status
  const handleCheckEnvVars = async () => {
    setCheckingEnv(true);
    try {
      const { simpleEmailJSTest } = await import('../utils/emailjs-test-simple');
      const result = simpleEmailJSTest();
      setEnvStatus(result);
      
      if (result.configured && !configured) {
        // Auto-load from environment if available
        try {
          const { getAllEmailJSEnvVars } = await import('../utils/emailjs-env-safe');
          const envResult = getAllEmailJSEnvVars();
          
          if (envResult.configured) {
            setConfig(prev => ({
              ...prev,
              serviceId: envResult.variables.serviceId.value || '',
              templateId: envResult.variables.templateId.value || '',
              publicKey: envResult.variables.publicKey.value || '',
              privateKey: envResult.variables.privateKey.value || '',
              fromName: envResult.variables.fromName.value || 'Sistem NBDAC',
              fromEmail: envResult.variables.fromEmail.value || 'noreply@nbdac.gov.my'
            }));
            toast.success('Konfigurasi dimuat dari environment variables');
          }
        } catch (error) {
          console.warn('Error loading from environment:', error);
        }
      }
    } catch (error) {
      console.error('Error checking environment variables:', error);
      setEnvStatus({ configured: false, error: 'Gagal memeriksa environment variables' });
    } finally {
      setCheckingEnv(false);
    }
  };

  // Check server status
  const handleCheckServerStatus = async () => {
    setCheckingServer(true);
    try {
      const { checkEmailJSStatus } = await import('../utils/emailjs-integration');
      const status = await checkEmailJSStatus();
      setServerStatus(status);
    } catch (error) {
      console.error('Error checking server status:', error);
      setServerStatus({ configured: false, ready: false, message: 'Gagal memeriksa status server' });
    } finally {
      setCheckingServer(false);
    }
  };

  // Quick test button
  const handleQuickTest = async () => {
    const email = prompt('Masukkan alamat email untuk ujian pantas:');
    if (email) {
      await handleTestEmailWithAddress(email);
    }
  };

  // Test email with specific address
  const handleTestEmailWithAddress = async (email: string) => {
    setTesting(true);
    try {
      const result = await testEmailConfiguration(email);
      
      if (result.success) {
        toast.success(`Test email berjaya dihantar ke ${email}!`);
      } else {
        toast.error(`Test email gagal: ${result.message}`);
      }
    } catch (error) {
      console.error('Email test error:', error);
      toast.error('Ralat semasa menguji email');
    } finally {
      setTesting(false);
    }
  };

  // Auto-load configuration from environment variables
  const handleAutoLoadFromEnv = async () => {
    setLoading(true);
    try {
      console.log('🔍 Loading EmailJS configuration from environment variables...');
      
      const { getAllEmailJSEnvVars } = await import('../utils/emailjs-env-safe');
      const envResult = getAllEmailJSEnvVars();
      
      if (envResult.configured) {
        console.log('✅ Environment variables found, loading configuration...');
        
        setConfig(prev => ({
          ...prev,
          serviceId: envResult.variables.serviceId.value || '',
          templateId: envResult.variables.templateId.value || '',
          publicKey: envResult.variables.publicKey.value || '',
          privateKey: envResult.variables.privateKey.value || '',
          fromName: envResult.variables.fromName.value || 'Sistem NBDAC',
          fromEmail: envResult.variables.fromEmail.value || 'noreply@nbdac.gov.my'
        }));
        
        // Also save the configuration
        const configToSave = {
          serviceId: envResult.variables.serviceId.value!,
          templateId: envResult.variables.templateId.value!,
          publicKey: envResult.variables.publicKey.value!,
          privateKey: envResult.variables.privateKey.value,
          fromName: envResult.variables.fromName.value || 'Sistem NBDAC',
          fromEmail: envResult.variables.fromEmail.value || 'noreply@nbdac.gov.my'
        };
        
        const success = emailjsService.updateConfig(configToSave);
        
        if (success) {
          setConfigured(true);
          toast.success('Konfigurasi berjaya dimuat dari environment variables!');
          console.log('🎉 EmailJS configuration loaded and saved successfully');
        } else {
          toast.error('Gagal menyimpan konfigurasi yang dimuat');
        }
      } else {
        console.log('❌ Environment variables not found or incomplete');
        toast.error('Environment variables tidak lengkap atau tidak dijumpai');
      }
    } catch (error) {
      console.error('Error loading from environment:', error);
      toast.error('Ralat semasa memuat dari environment variables');
    } finally {
      setLoading(false);
    }
  };

  // Clear configuration
  const handleClearConfig = () => {
    emailjsService.clearConfig();
    setConfig({
      serviceId: '',
      templateId: '',
      publicKey: '',
      privateKey: '',
      fromName: 'Sistem NBDAC',
      fromEmail: 'noreply@nbdac.gov.my'
    });
    setConfigured(false);
    toast.success('Konfigurasi EmailJS telah dibersihkan');
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        {onBack && (
          <Button variant="outline" size="sm" onClick={onBack}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Kembali
          </Button>
        )}
        <div>
          <h1 className="text-3xl font-bold">Setup EmailJS</h1>
          <p className="text-muted-foreground">
            Konfigurasikan perkhidmatan EmailJS untuk pemberitahuan email automatik
          </p>
        </div>
      </div>

      {/* Status Badges */}
      <div className="flex items-center gap-2 flex-wrap">
        <Badge variant={configured ? "default" : "secondary"} className="flex items-center gap-1">
          {configured ? (
            <CheckCircle className="h-3 w-3" />
          ) : (
            <XCircle className="h-3 w-3" />
          )}
          {configured ? 'Dikonfigurasi' : 'Belum Dikonfigurasi'}
        </Badge>
        
        {envStatus && (
          <Badge variant={envStatus.configured ? "default" : "outline"} className="flex items-center gap-1">
            <Settings className="h-3 w-3" />
            Env: {envStatus.configured ? 'Sedia' : 'Tidak Sedia'}
          </Badge>
        )}
        
        {serverStatus && (
          <Badge variant={serverStatus.ready ? "default" : "outline"} className="flex items-center gap-1">
            <Zap className="h-3 w-3" />
            Server: {serverStatus.ready ? 'Sedia' : 'Tidak Sedia'}
          </Badge>
        )}
        
        <Button variant="outline" size="sm" onClick={handleQuickTest} disabled={!configured || testing}>
          <TestTube className="h-3 w-3 mr-1" />
          {testing ? 'Testing...' : 'Quick Test'}
        </Button>
      </div>

      {/* Main Setup Tabs */}
      <Tabs defaultValue="config" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="config">Konfigurasi</TabsTrigger>
          <TabsTrigger value="status">Status</TabsTrigger>
          <TabsTrigger value="test">Test</TabsTrigger>
          <TabsTrigger value="guide">Panduan</TabsTrigger>
        </TabsList>

        {/* Configuration Tab */}
        <TabsContent value="config" className="space-y-6">
      {/* Environment Variables Auto-Load Section */}
      {envStatus && envStatus.configured && !configured && (
        <Card className="border-green-200 bg-green-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-green-700">
              <CheckCircle className="h-5 w-5" />
              Environment Variables Detected!
            </CardTitle>
            <CardDescription className="text-green-600">
              EmailJS configuration found in your Supabase environment variables. Click below to load them automatically.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button 
              onClick={handleAutoLoadFromEnv} 
              disabled={loading}
              className="bg-green-600 hover:bg-green-700"
            >
              {loading ? 'Loading...' : 'Load from Environment Variables'}
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Manual Configuration Form */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Mail className="h-5 w-5" />
            Konfigurasi EmailJS
          </CardTitle>
          <CardDescription>
            Masukkan maklumat konfigurasi EmailJS anda atau muat dari environment variables
          </CardDescription>
          <div className="flex gap-2 pt-2">
            <Button variant="outline" size="sm" onClick={handleCheckEnvVars} disabled={checkingEnv}>
              <RefreshCw className={`h-3 w-3 mr-1 ${checkingEnv ? 'animate-spin' : ''}`} />
              {checkingEnv ? 'Checking...' : 'Check Env'}
            </Button>
            <Button variant="outline" size="sm" onClick={handleCheckServerStatus} disabled={checkingServer}>
              <Eye className="h-3 w-3 mr-1" />
              {checkingServer ? 'Checking...' : 'Check Server'}
            </Button>
            <Button variant="outline" size="sm" onClick={handleAutoLoadFromEnv} disabled={loading}>
              <Zap className="h-3 w-3 mr-1" />
              {loading ? 'Loading...' : 'Load from Env'}
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Service ID */}
          <div className="space-y-2">
            <Label htmlFor="serviceId">Service ID *</Label>
            <Input
              id="serviceId"
              value={config.serviceId}
              onChange={(e) => handleInputChange('serviceId', e.target.value)}
              placeholder="Contoh: service_xxxxxxx"
            />
          </div>

          {/* Template ID */}
          <div className="space-y-2">
            <Label htmlFor="templateId">Template ID *</Label>
            <Input
              id="templateId"
              value={config.templateId}
              onChange={(e) => handleInputChange('templateId', e.target.value)}
              placeholder="Contoh: template_xxxxxxx"
            />
          </div>

          {/* Public Key */}
          <div className="space-y-2">
            <Label htmlFor="publicKey">Public Key *</Label>
            <Input
              id="publicKey"
              value={config.publicKey}
              onChange={(e) => handleInputChange('publicKey', e.target.value)}
              placeholder="Contoh: xxxxxxxxxxxxxxxxxx"
            />
          </div>

          {/* Private Key */}
          <div className="space-y-2">
            <Label htmlFor="privateKey">Private Key (Pilihan)</Label>
            <Input
              id="privateKey"
              type="password"
              value={config.privateKey || ''}
              onChange={(e) => handleInputChange('privateKey', e.target.value)}
              placeholder="Contoh: xxxxxxxxxxxxxxxxxx"
            />
            <p className="text-xs text-muted-foreground">
              Private key diperlukan untuk keselamatan tambahan (optional)
            </p>
          </div>

          <Separator />

          {/* From Name */}
          <div className="space-y-2">
            <Label htmlFor="fromName">Nama Pengirim</Label>
            <Input
              id="fromName"
              value={config.fromName}
              onChange={(e) => handleInputChange('fromName', e.target.value)}
              placeholder="Contoh: Sistem NBDAC"
            />
          </div>

          {/* From Email */}
          <div className="space-y-2">
            <Label htmlFor="fromEmail">Email Pengirim</Label>
            <Input
              id="fromEmail"
              type="email"
              value={config.fromEmail}
              onChange={(e) => handleInputChange('fromEmail', e.target.value)}
              placeholder="Contoh: noreply@nbdac.gov.my"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4">
            <Button onClick={handleSaveConfig} disabled={loading}>
              {loading ? 'Menyimpan...' : 'Simpan Konfigurasi'}
            </Button>
            
            {configured && (
              <Button variant="destructive" onClick={handleClearConfig}>
                Bersihkan Konfigurasi
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
        </TabsContent>

        {/* Status Tab */}
        <TabsContent value="status" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            {/* Environment Status */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="h-5 w-5" />
                  Environment Variables
                </CardTitle>
                <CardDescription>
                  Status pembolehubah persekitaran EmailJS
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {envStatus ? (
                  <>
                    <div className="flex justify-between items-center">
                      <span>Service ID</span>
                      <Badge variant={envStatus.variables?.serviceId ? "default" : "outline"}>
                        {envStatus.variables?.serviceId ? 'Sedia' : 'Tiada'}
                      </Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Template ID</span>
                      <Badge variant={envStatus.variables?.templateId ? "default" : "outline"}>
                        {envStatus.variables?.templateId ? 'Sedia' : 'Tiada'}
                      </Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Public Key</span>
                      <Badge variant={envStatus.variables?.publicKey ? "default" : "outline"}>
                        {envStatus.variables?.publicKey ? 'Sedia' : 'Tiada'}
                      </Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Private Key</span>
                      <Badge variant={envStatus.variables?.privateKey ? "default" : "outline"}>
                        {envStatus.variables?.privateKey ? 'Sedia' : 'Optional'}
                      </Badge>
                    </div>
                    <Separator />
                    <div className="flex justify-between items-center">
                      <span>Overall Status</span>
                      <Badge variant={envStatus.configured ? "default" : "destructive"}>
                        {envStatus.configured ? 'Dikonfigurasi' : 'Tidak Lengkap'}
                      </Badge>
                    </div>
                  </>
                ) : (
                  <p className="text-muted-foreground">Klik "Check Env" untuk memeriksa status</p>
                )}
                
                <Button variant="outline" size="sm" onClick={handleCheckEnvVars} disabled={checkingEnv} className="w-full">
                  <RefreshCw className={`h-3 w-3 mr-2 ${checkingEnv ? 'animate-spin' : ''}`} />
                  {checkingEnv ? 'Memeriksa...' : 'Semak Semula'}
                </Button>
              </CardContent>
            </Card>

            {/* Server Status */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="h-5 w-5" />
                  Server Integration
                </CardTitle>
                <CardDescription>
                  Status integrasi server EmailJS
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {serverStatus ? (
                  <>
                    <div className="flex justify-between items-center">
                      <span>Configuration</span>
                      <Badge variant={serverStatus.configured ? "default" : "outline"}>
                        {serverStatus.configured ? 'Sedia' : 'Tiada'}
                      </Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Admin Emails</span>
                      <Badge variant={serverStatus.adminEmails > 0 ? "default" : "outline"}>
                        {serverStatus.adminEmails || 0} admin(s)
                      </Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Ready for Use</span>
                      <Badge variant={serverStatus.ready ? "default" : "destructive"}>
                        {serverStatus.ready ? 'Sedia' : 'Tidak Sedia'}
                      </Badge>
                    </div>
                    <Separator />
                    <div className="text-sm text-muted-foreground">
                      {serverStatus.message || 'Status tidak diketahui'}
                    </div>
                  </>
                ) : (
                  <p className="text-muted-foreground">Klik "Check Server" untuk memeriksa status</p>
                )}
                
                <Button variant="outline" size="sm" onClick={handleCheckServerStatus} disabled={checkingServer} className="w-full">
                  <Eye className="h-3 w-3 mr-2" />
                  {checkingServer ? 'Memeriksa...' : 'Semak Semula'}
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Test Tab */}
        <TabsContent value="test" className="space-y-6">
          {configured ? (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TestTube className="h-5 w-5" />
                  Uji Email
                </CardTitle>
                <CardDescription>
                  Hantar email ujian untuk memastikan konfigurasi berfungsi dengan betul
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="testEmail">Alamat Email Ujian</Label>
                  <Input
                    id="testEmail"
                    type="email"
                    value={testEmail}
                    onChange={(e) => setTestEmail(e.target.value)}
                    placeholder="Contoh: admin@nbdac.gov.my"
                  />
                </div>
                
                <div className="flex gap-2">
                  <Button onClick={handleTestEmail} disabled={testing} variant="outline">
                    {testing ? 'Menghantar...' : 'Hantar Email Ujian'}
                  </Button>
                  
                  <Button onClick={handleQuickTest} disabled={testing}>
                    <TestTube className="h-3 w-3 mr-2" />
                    {testing ? 'Testing...' : 'Quick Test'}
                  </Button>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent className="pt-6">
                <div className="text-center space-y-3">
                  <XCircle className="h-12 w-12 mx-auto text-muted-foreground" />
                  <h3>EmailJS Belum Dikonfigurasi</h3>
                  <p className="text-muted-foreground">
                    Sila konfigurasi EmailJS terlebih dahulu dalam tab "Konfigurasi"
                  </p>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Guide Tab */}
        <TabsContent value="guide" className="space-y-6">
          {/* Setup Instructions */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                Langkah-langkah Setup EmailJS
              </CardTitle>
              <CardDescription>
                Ikuti langkah-langkah berikut untuk menyediakan EmailJS
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-3">
                <div className="flex items-start gap-3">
                  <Badge variant="outline" className="mt-0.5">1</Badge>
                  <div>
                    <p className="font-medium">Cipta Akaun EmailJS</p>
                    <p className="text-sm text-muted-foreground">
                      Lawati <a href="https://www.emailjs.com" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline inline-flex items-center gap-1">
                        emailjs.com <ExternalLink className="h-3 w-3" />
                      </a> dan daftar akaun percuma
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <Badge variant="outline" className="mt-0.5">2</Badge>
                  <div>
                    <p className="font-medium">Setup Email Service</p>
                    <p className="text-sm text-muted-foreground">
                      Tambah perkhidmatan email (Gmail, Outlook, etc.) dalam dashboard EmailJS
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <Badge variant="outline" className="mt-0.5">3</Badge>
                  <div>
                    <p className="font-medium">Cipta Template Email</p>
                    <p className="text-sm text-muted-foreground">
                      Buat template email untuk pemberitahuan permohonan projek
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <Badge variant="outline" className="mt-0.5">4</Badge>
                  <div>
                    <p className="font-medium">Dapatkan API Keys</p>
                    <p className="text-sm text-muted-foreground">
                      Salin Service ID, Template ID, dan Public Key dari dashboard EmailJS
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Template Variables Info */}
          <Card>
            <CardHeader>
              <CardTitle>Template Variables</CardTitle>
              <CardDescription>
                Pembolehubah yang boleh digunakan dalam template EmailJS anda
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
                <div>
                  <code className="bg-muted px-2 py-1 rounded text-xs">{'{{to_emails}}'}</code>
                  <p className="text-muted-foreground">Email penerima</p>
                </div>
                <div>
                  <code className="bg-muted px-2 py-1 rounded text-xs">{'{{subject}}'}</code>
                  <p className="text-muted-foreground">Subjek email</p>
                </div>
                <div>
                  <code className="bg-muted px-2 py-1 rounded text-xs">{'{{nama_projek}}'}</code>
                  <p className="text-muted-foreground">Nama projek</p>
                </div>
                <div>
                  <code className="bg-muted px-2 py-1 rounded text-xs">{'{{bahagian}}'}</code>
                  <p className="text-muted-foreground">Bahagian</p>
                </div>
                <div>
                  <code className="bg-muted px-2 py-1 rounded text-xs">{'{{nama_pegawai}}'}</code>
                  <p className="text-muted-foreground">Nama pegawai</p>
                </div>
                <div>
                  <code className="bg-muted px-2 py-1 rounded text-xs">{'{{email}}'}</code>
                  <p className="text-muted-foreground">Email pemohon</p>
                </div>
                <div>
                  <code className="bg-muted px-2 py-1 rounded text-xs">{'{{tarikh}}'}</code>
                  <p className="text-muted-foreground">Tarikh permohonan</p>
                </div>
                <div>
                  <code className="bg-muted px-2 py-1 rounded text-xs">{'{{tujuan_projek}}'}</code>
                  <p className="text-muted-foreground">Tujuan projek</p>
                </div>
                <div>
                  <code className="bg-muted px-2 py-1 rounded text-xs">{'{{status}}'}</code>
                  <p className="text-muted-foreground">Status permohonan</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>



      {/* Status Alert */}
      {configured ? (
        <Alert>
          <CheckCircle className="h-4 w-4" />
          <AlertDescription>
            EmailJS telah dikonfigurasi dengan jayanya. Sistem akan menggunakan EmailJS untuk menghantar pemberitahuan email.
          </AlertDescription>
        </Alert>
      ) : (
        <Alert>
          <XCircle className="h-4 w-4" />
          <AlertDescription>
            EmailJS belum dikonfigurasi. Sila lengkapkan konfigurasi di atas untuk mengaktifkan pemberitahuan email.
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
}