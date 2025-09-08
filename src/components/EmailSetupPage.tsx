import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Switch } from './ui/switch';
import { Badge } from './ui/badge';
import { Separator } from './ui/separator';
import { Alert, AlertDescription } from './ui/alert';
import { 
  Mail, 
  Server, 
  Users, 
  CheckCircle, 
  XCircle, 
  AlertTriangle,
  Settings,
  Play,
  RefreshCw
} from 'lucide-react';
import { quickEmailSetup, advancedEmailSetup, verifyEmailSetup, EmailSetupResult } from '../utils/email-setup';
import EmailJSSetupPage from './EmailJSSetupPage';

export default function EmailSetupPage() {
  const [setupResult, setSetupResult] = useState<EmailSetupResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [useAdvanced, setUseAdvanced] = useState(false);
  const [showEmailJS, setShowEmailJS] = useState(false);
  
  // Advanced configuration state
  const [advancedConfig, setAdvancedConfig] = useState({
    organizationApiUrl: '',
    organizationApiKey: '',
    smtpHost: '',
    smtpPort: 587,
    smtpUsername: '',
    smtpPassword: '',
    senderEmail: ''
  });

  const handleQuickSetup = async () => {
    setLoading(true);
    try {
      const result = await quickEmailSetup();
      setSetupResult(result);
    } catch (error) {
      console.error('Quick setup failed:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAdvancedSetup = async () => {
    setLoading(true);
    try {
      const result = await advancedEmailSetup(advancedConfig);
      setSetupResult(result);
    } catch (error) {
      console.error('Advanced setup failed:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async () => {
    setLoading(true);
    try {
      await verifyEmailSetup();
      // Refresh the current setup result
      const result = await quickEmailSetup();
      setSetupResult(result);
    } catch (error) {
      console.error('Verification failed:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status: boolean) => {
    return status ? (
      <CheckCircle className="h-4 w-4 text-green-600" />
    ) : (
      <XCircle className="h-4 w-4 text-red-600" />
    );
  };

  const getConfigurationBadge = (config: string) => {
    const variants = {
      'supabase-default': { variant: 'secondary' as const, label: 'Supabase Default' },
      'supabase-smtp': { variant: 'default' as const, label: 'Organization SMTP' },
      'organization-api': { variant: 'default' as const, label: 'Organization API' }
    };

    const { variant, label } = variants[config as keyof typeof variants] || { variant: 'secondary' as const, label: config };

    return <Badge variant={variant}>{label}</Badge>;
  };

  // Show EmailJS setup page if requested
  if (showEmailJS) {
    return <EmailJSSetupPage onBack={() => setShowEmailJS(false)} />;
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold text-gray-900">Email Notification Setup</h1>
        <p className="text-gray-600">Configure email notifications for NBDAC project submissions</p>
      </div>

      {/* Quick Setup Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Mail className="h-5 w-5" />
            Quick Setup (Recommended)
          </CardTitle>
          <CardDescription>
            Set up email notifications using Supabase's built-in email service. No additional configuration required.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-4">
            <Button 
              onClick={handleQuickSetup} 
              disabled={loading}
              className="flex items-center gap-2"
            >
              {loading ? <RefreshCw className="h-4 w-4 animate-spin" /> : <Play className="h-4 w-4" />}
              Run Quick Setup
            </Button>
            
            <Button 
              variant="outline" 
              onClick={handleVerify} 
              disabled={loading}
              className="flex items-center gap-2"
            >
              <RefreshCw className="h-4 w-4" />
              Verify Current Setup
            </Button>
          </div>

          {setupResult && (
            <Alert className={setupResult.success ? 'border-green-200 bg-green-50' : 'border-yellow-200 bg-yellow-50'}>
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="font-medium">Setup Status:</span>
                    {setupResult.success ? (
                      <Badge variant="default" className="bg-green-600">✅ Complete</Badge>
                    ) : (
                      <Badge variant="destructive">⚠️ Needs Attention</Badge>
                    )}
                    {getConfigurationBadge(setupResult.configuration)}
                  </div>
                  
                  {setupResult.messages.length > 0 && (
                    <div className="text-sm">
                      <strong>Messages:</strong>
                      <ul className="mt-1 space-y-1">
                        {setupResult.messages.slice(-3).map((msg, idx) => (
                          <li key={idx} className="text-gray-600">• {msg}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>

      {/* Setup Results */}
      {setupResult && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5" />
              Configuration Status
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Test Results */}
              <div className="space-y-3">
                <h4 className="font-medium flex items-center gap-2">
                  <Server className="h-4 w-4" />
                  System Tests
                </h4>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center justify-between">
                    <span>Server Connection</span>
                    {getStatusIcon(setupResult.testResults.serverConnection)}
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Admin Users Found</span>
                    {getStatusIcon(setupResult.testResults.adminUsersFound)}
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Email Service Available</span>
                    {getStatusIcon(setupResult.testResults.emailServiceAvailable)}
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Test Email Sent</span>
                    {getStatusIcon(setupResult.testResults.testEmailSent)}
                  </div>
                </div>
              </div>

              {/* Admin Users */}
              <div className="space-y-3">
                <h4 className="font-medium flex items-center gap-2">
                  <Users className="h-4 w-4" />
                  Admin Recipients ({setupResult.adminEmails.length})
                </h4>
                <div className="space-y-1 text-sm">
                  {setupResult.adminEmails.length > 0 ? (
                    setupResult.adminEmails.map((email, idx) => (
                      <div key={idx} className="flex items-center gap-2">
                        <Mail className="h-3 w-3 text-gray-400" />
                        <span className="text-gray-600">{email}</span>
                      </div>
                    ))
                  ) : (
                    <div className="text-gray-500 italic">No admin users found</div>
                  )}
                </div>
              </div>
            </div>

            {setupResult.errors.length > 0 && (
              <div className="mt-4 pt-4 border-t">
                <h4 className="font-medium text-red-600 mb-2">Issues Found:</h4>
                <ul className="space-y-1 text-sm text-red-600">
                  {setupResult.errors.map((error, idx) => (
                    <li key={idx}>• {error}</li>
                  ))}
                </ul>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* EmailJS Setup Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Mail className="h-5 w-5" />
            EmailJS Setup
          </CardTitle>
          <CardDescription>
            Configure EmailJS for reliable email notifications with advanced features and tracking.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-4">
            <Button 
              onClick={() => setShowEmailJS(true)}
              className="flex items-center gap-2"
            >
              <Settings className="h-4 w-4" />
              Configure EmailJS
            </Button>
          </div>
          
          <div className="text-sm text-gray-600 space-y-2">
            <p><strong>Benefits:</strong></p>
            <ul className="list-disc list-inside space-y-1 ml-4">
              <li>Professional email delivery with high reliability</li>
              <li>Customizable email templates</li>
              <li>Email tracking and analytics</li>
              <li>Support for multiple email providers</li>
              <li>No server-side email configuration required</li>
            </ul>
          </div>
        </CardContent>
      </Card>

      {/* Advanced Setup Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Advanced Configuration
          </CardTitle>
          <CardDescription>
            Configure organization-specific email settings or SMTP server details.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center space-x-2">
            <Switch
              id="advanced-mode"
              checked={useAdvanced}
              onCheckedChange={setUseAdvanced}
            />
            <Label htmlFor="advanced-mode">Enable advanced configuration</Label>
          </div>

          {useAdvanced && (
            <div className="space-y-4 p-4 border rounded-lg bg-gray-50">
              <h4 className="font-medium">Organization Email API</h4>
              <div className="grid grid-cols-1 gap-4">
                <div>
                  <Label htmlFor="api-url">API Endpoint URL</Label>
                  <Input
                    id="api-url"
                    placeholder="https://email-api.yourorg.gov.my/send"
                    value={advancedConfig.organizationApiUrl}
                    onChange={(e) => setAdvancedConfig(prev => ({ 
                      ...prev, 
                      organizationApiUrl: e.target.value 
                    }))}
                  />
                </div>
                <div>
                  <Label htmlFor="api-key">API Key</Label>
                  <Input
                    id="api-key"
                    type="password"
                    placeholder="your-organization-api-key"
                    value={advancedConfig.organizationApiKey}
                    onChange={(e) => setAdvancedConfig(prev => ({ 
                      ...prev, 
                      organizationApiKey: e.target.value 
                    }))}
                  />
                </div>
              </div>

              <Separator />

              <h4 className="font-medium">SMTP Configuration</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="smtp-host">SMTP Host</Label>
                  <Input
                    id="smtp-host"
                    placeholder="mail.yourorg.gov.my"
                    value={advancedConfig.smtpHost}
                    onChange={(e) => setAdvancedConfig(prev => ({ 
                      ...prev, 
                      smtpHost: e.target.value 
                    }))}
                  />
                </div>
                <div>
                  <Label htmlFor="smtp-port">SMTP Port</Label>
                  <Input
                    id="smtp-port"
                    type="number"
                    placeholder="587"
                    value={advancedConfig.smtpPort}
                    onChange={(e) => setAdvancedConfig(prev => ({ 
                      ...prev, 
                      smtpPort: parseInt(e.target.value) || 587 
                    }))}
                  />
                </div>
                <div>
                  <Label htmlFor="smtp-username">SMTP Username</Label>
                  <Input
                    id="smtp-username"
                    placeholder="notifications@yourorg.gov.my"
                    value={advancedConfig.smtpUsername}
                    onChange={(e) => setAdvancedConfig(prev => ({ 
                      ...prev, 
                      smtpUsername: e.target.value 
                    }))}
                  />
                </div>
                <div>
                  <Label htmlFor="sender-email">Sender Email</Label>
                  <Input
                    id="sender-email"
                    placeholder="notifications@yourorg.gov.my"
                    value={advancedConfig.senderEmail}
                    onChange={(e) => setAdvancedConfig(prev => ({ 
                      ...prev, 
                      senderEmail: e.target.value 
                    }))}
                  />
                </div>
              </div>

              <Button 
                onClick={handleAdvancedSetup} 
                disabled={loading}
                className="flex items-center gap-2"
              >
                {loading ? <RefreshCw className="h-4 w-4 animate-spin" /> : <Settings className="h-4 w-4" />}
                Apply Advanced Configuration
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Help Section */}
      <Card>
        <CardHeader>
          <CardTitle>Need Help?</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm text-gray-600">
          <div>
            <strong>Quick Setup:</strong> Uses Supabase's built-in email service. Emails will come from Supabase but will work immediately.
          </div>
          <div>
            <strong>EmailJS Setup:</strong> Professional email service with advanced features. Configure EmailJS for reliable email delivery with tracking and analytics.
          </div>
          <div>
            <strong>Organization SMTP:</strong> Configure your organization's email server in Supabase dashboard (Authentication &gt; Settings &gt; SMTP Settings).
          </div>
          <div>
            <strong>API Integration:</strong> If your organization has an email API, contact your IT department for endpoint details.
          </div>
          <div>
            <strong>No Admin Users?</strong> Create admin users first using the admin setup page or run: <code>setupAdmin("email@example.com", "password", "Name")</code>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}