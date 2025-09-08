import React, { useState } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { ArrowLeft, Send, Loader2, AlertCircle, Info } from 'lucide-react';
import { toast } from '../utils/toast';
import { validateField, getSanitizedFormData, type FormData } from '../utils/validation';
import { Alert, AlertDescription } from './ui/alert';

interface PermohonanBaruPageProps {
  onBack: () => void;
  onSubmit: (data: any) => Promise<boolean>;
  loading?: boolean;
}

export default function PermohonanBaruPage({ onBack, onSubmit, loading = false }: PermohonanBaruPageProps) {
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    tarikh: '',
    bahagian: '',
    namaProjek: '',
    tujuanProjek: '',
    websiteUrl: '',
    kutipanData: '',
    namaPegawai: '',
    email: '',
    catatan: ''
  });
  
  const [fieldErrors, setFieldErrors] = useState<Record<string, string[]>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  // Handle input change with real-time validation
  const handleInputChange = (name: string, value: string) => {
    // Update form data
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Mark field as touched
    setTouched(prev => ({ ...prev, [name]: true }));
    
    // Validate field in real-time if touched
    if (touched[name] || value.trim() !== '') {
      const errors = validateField(name, value);
      setFieldErrors(prev => ({ ...prev, [name]: errors }));
    }
  };

  // Handle field blur - validate when user leaves the field
  const handleFieldBlur = (name: string) => {
    setTouched(prev => ({ ...prev, [name]: true }));
    const errors = validateField(name, formData[name] || '');
    setFieldErrors(prev => ({ ...prev, [name]: errors }));
  };

  // Get field error message
  const getFieldError = (name: string): string | null => {
    const errors = fieldErrors[name];
    return errors && errors.length > 0 ? errors[0] : null;
  };

  // Check if field has error
  const hasFieldError = (name: string): boolean => {
    return touched[name] && fieldErrors[name] && fieldErrors[name].length > 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (submitting || loading) return;

    try {
      setSubmitting(true);
      
      console.log('��� Starting form submission...');
      console.log('📝 Current form data:', formData);
      
      // Mark all fields as touched for validation display
      const allFields = Object.keys(formData);
      const newTouched = allFields.reduce((acc, field) => ({ ...acc, [field]: true }), {});
      setTouched(newTouched);
      
      // Validate all fields
      const newErrors: Record<string, string[]> = {};
      let hasErrors = false;
      
      allFields.forEach(field => {
        const errors = validateField(field, formData[field] || '');
        newErrors[field] = errors;
        if (errors.length > 0) {
          console.log(`❌ Validation error for ${field}:`, errors);
          hasErrors = true;
        }
      });
      
      setFieldErrors(newErrors);
      
      if (hasErrors) {
        console.log('❌ Form validation failed:', newErrors);
        toast.error('❌ Sila betulkan ralat dalam borang', {
          description: 'Terdapat maklumat yang tidak lengkap atau tidak sah.'
        });
        return;
      }

      // Get sanitized data
      const sanitizedData = getSanitizedFormData(formData);
      
      console.log('✅ Form validation passed');
      console.log('📝 Sanitized form data:', sanitizedData);
      console.log('🔄 Calling onSubmit...');
      
      // Submit the form
      const success = await onSubmit(sanitizedData);
      
      console.log('📊 Submission result:', { success });
      
      if (success) {
        console.log('✅ Form submission successful');
        // Reset form on success
        setFormData({
          tarikh: '',
          bahagian: '',
          namaProjek: '',
          tujuanProjek: '',
          websiteUrl: '',
          kutipanData: '',
          namaPegawai: '',
          email: '',
          catatan: ''
        });
        setFieldErrors({});
        setTouched({});
      } else {
        console.log('❌ Form submission failed');
      }
    } catch (error) {
      console.error('💥 Error submitting form:', error);
      toast.error('❌ Ralat sistem', {
        description: 'Berlaku ralat semasa menghantar borang. Sila cuba lagi.'
      });
    } finally {
      setSubmitting(false);
    }
  };

  const isFormValid = () => {
    const requiredFields = ['tarikh', 'bahagian', 'namaProjek', 'tujuanProjek', 'websiteUrl', 'kutipanData', 'namaPegawai', 'email'];
    return requiredFields.every(field => {
      const value = formData[field] || '';
      const errors = validateField(field, value);
      return value.trim() !== '' && errors.length === 0;
    });
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center gap-4">
        <Button variant="outline" onClick={onBack} className="flex items-center gap-2" disabled={submitting || loading}>
          <ArrowLeft className="h-4 w-4" />
          Kembali
        </Button>
        <div>
          <h2 className="text-2xl font-medium text-foreground">Permohonan Baru</h2>
          <p className="text-muted-foreground">Sila isi borang permohonan projek</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Maklumat Permohonan Projek</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Date Field */}
            <div className="space-y-2">
              <Label htmlFor="tarikh">Tarikh *</Label>
              <Input
                id="tarikh"
                type="date"
                value={formData.tarikh}
                onChange={(e) => handleInputChange('tarikh', e.target.value)}
                onBlur={() => handleFieldBlur('tarikh')}
                disabled={submitting || loading}
                className={hasFieldError('tarikh') ? 'border-destructive' : ''}
              />
              {hasFieldError('tarikh') && (
                <p className="text-sm text-destructive flex items-center gap-1">
                  <AlertCircle className="h-3 w-3" />
                  {getFieldError('tarikh')}
                </p>
              )}
            </div>

            {/* Department Field */}
            <div className="space-y-2">
              <Label htmlFor="bahagian">Bahagian *</Label>
              <Input
                id="bahagian"
                value={formData.bahagian}
                onChange={(e) => handleInputChange('bahagian', e.target.value)}
                onBlur={() => handleFieldBlur('bahagian')}
                placeholder="Contoh: Bahagian Teknologi Maklumat"
                disabled={submitting || loading}
                className={hasFieldError('bahagian') ? 'border-destructive' : ''}
              />
              {hasFieldError('bahagian') && (
                <p className="text-sm text-destructive flex items-center gap-1">
                  <AlertCircle className="h-3 w-3" />
                  {getFieldError('bahagian')}
                </p>
              )}
            </div>

            {/* Project Name Field */}
            <div className="space-y-2">
              <Label htmlFor="namaProjek">Nama Projek *</Label>
              <Input
                id="namaProjek"
                value={formData.namaProjek}
                onChange={(e) => handleInputChange('namaProjek', e.target.value)}
                onBlur={() => handleFieldBlur('namaProjek')}
                placeholder="Nama projek yang dicadangkan"
                disabled={submitting || loading}
                className={hasFieldError('namaProjek') ? 'border-destructive' : ''}
              />
              {hasFieldError('namaProjek') && (
                <p className="text-sm text-destructive flex items-center gap-1">
                  <AlertCircle className="h-3 w-3" />
                  {getFieldError('namaProjek')}
                </p>
              )}
            </div>

            {/* Project Purpose Field */}
            <div className="space-y-2">
              <Label htmlFor="tujuanProjek">Tujuan Projek *</Label>
              <Textarea
                id="tujuanProjek"
                value={formData.tujuanProjek}
                onChange={(e) => handleInputChange('tujuanProjek', e.target.value)}
                onBlur={() => handleFieldBlur('tujuanProjek')}
                placeholder="Terangkan tujuan dan objektif projek ini..."
                disabled={submitting || loading}
                rows={4}
                className={hasFieldError('tujuanProjek') ? 'border-destructive' : ''}
              />
              {hasFieldError('tujuanProjek') && (
                <p className="text-sm text-destructive flex items-center gap-1">
                  <AlertCircle className="h-3 w-3" />
                  {getFieldError('tujuanProjek')}
                </p>
              )}
            </div>

            {/* Website URL Field - STRICT format requirements only */}
            <div className="space-y-3">
              <Label htmlFor="websiteUrl">Laman Web *</Label>
              
              {/* Format Instructions */}
              <Alert className="border-blue-200 bg-blue-50">
                <Info className="h-4 w-4 text-blue-600" />
                <AlertDescription className="text-blue-800">
                  <strong>Format yang diperlukan:</strong> Setiap laman web mesti mengikut format ini:<br />
                  <code className="bg-blue-100 px-1 py-0.5 rounded text-sm">
                    nombor. NamaLamanWeb: https://www.contoh.com
                  </code>
                  <br />
                  <span className="text-sm mt-1 block">
                    Contoh: <em>1. iProperty: https://www.iproperty.com.my</em>
                  </span>
                </AlertDescription>
              </Alert>

              <Textarea
                id="websiteUrl"
                value={formData.websiteUrl}
                onChange={(e) => handleInputChange('websiteUrl', e.target.value)}
                onBlur={() => handleFieldBlur('websiteUrl')}
                placeholder="1. iProperty: https://www.iproperty.com.my
2. PropertyGuru: https://www.propertyguru.com.my
3. DurianProperty: https://www.durianproperty.com.my"
                disabled={submitting || loading}
                rows={6}
                className={`font-mono text-sm ${hasFieldError('websiteUrl') ? 'border-destructive' : ''}`}
              />
              
              {hasFieldError('websiteUrl') && (
                <div className="text-sm text-destructive flex items-start gap-2">
                  <AlertCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
                  <div className="whitespace-pre-line">{getFieldError('websiteUrl')}</div>
                </div>
              )}
              
              <div className="space-y-1">
                <p className="text-xs text-muted-foreground font-medium">
                  ✅ Panduan format:
                </p>
                <ul className="text-xs text-muted-foreground space-y-0.5 ml-4">
                  <li>• Mesti bermula dengan nombor diikuti titik (1. , 2. , dst.)</li>
                  <li>• Nama laman web diikuti dengan titik bertindih (:)</li>
                  <li>• URL lengkap bermula dengan https:// atau http://</li>
                  <li>• Setiap laman web dalam baris yang berasingan</li>
                </ul>
              </div>
            </div>

            {/* Data Collection Frequency */}
            <div className="space-y-2">
              <Label htmlFor="kutipanData">Kekerapan Kutipan Data *</Label>
              <Select 
                value={formData.kutipanData} 
                onValueChange={(value) => handleInputChange('kutipanData', value)}
                disabled={submitting || loading}
              >
                <SelectTrigger className={hasFieldError('kutipanData') ? 'border-destructive' : ''}>
                  <SelectValue placeholder="Pilih kekerapan kutipan data" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="one-off">Satu kali sahaja</SelectItem>
                  <SelectItem value="daily">Harian</SelectItem>
                  <SelectItem value="weekly">Mingguan</SelectItem>
                  <SelectItem value="monthly">Bulanan</SelectItem>
                  <SelectItem value="quarterly">Suku Tahunan</SelectItem>
                  <SelectItem value="yearly">Tahunan</SelectItem>
                </SelectContent>
              </Select>
              {hasFieldError('kutipanData') && (
                <p className="text-sm text-destructive flex items-center gap-1">
                  <AlertCircle className="h-3 w-3" />
                  {getFieldError('kutipanData')}
                </p>
              )}
            </div>

            {/* Officer Name Field */}
            <div className="space-y-2">
              <Label htmlFor="namaPegawai">Nama Pegawai *</Label>
              <Input
                id="namaPegawai"
                value={formData.namaPegawai}
                onChange={(e) => handleInputChange('namaPegawai', e.target.value)}
                onBlur={() => handleFieldBlur('namaPegawai')}
                placeholder="Nama penuh pegawai yang bertanggungjawab"
                disabled={submitting || loading}
                className={hasFieldError('namaPegawai') ? 'border-destructive' : ''}
              />
              {hasFieldError('namaPegawai') && (
                <p className="text-sm text-destructive flex items-center gap-1">
                  <AlertCircle className="h-3 w-3" />
                  {getFieldError('namaPegawai')}
                </p>
              )}
            </div>

            {/* Email Field */}
            <div className="space-y-2">
              <Label htmlFor="email">Email *</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                onBlur={() => handleFieldBlur('email')}
                placeholder="alamat.email@contoh.com"
                disabled={submitting || loading}
                className={hasFieldError('email') ? 'border-destructive' : ''}
              />
              {hasFieldError('email') && (
                <p className="text-sm text-destructive flex items-center gap-1">
                  <AlertCircle className="h-3 w-3" />
                  {getFieldError('email')}
                </p>
              )}
            </div>

            {/* Notes Field */}
            <div className="space-y-2">
              <Label htmlFor="catatan">Catatan Tambahan</Label>
              <Textarea
                id="catatan"
                value={formData.catatan}
                onChange={(e) => handleInputChange('catatan', e.target.value)}
                onBlur={() => handleFieldBlur('catatan')}
                placeholder="Sebarang catatan atau maklumat tambahan..."
                disabled={submitting || loading}
                rows={3}
                className={hasFieldError('catatan') ? 'border-destructive' : ''}
              />
              {hasFieldError('catatan') && (
                <p className="text-sm text-destructive flex items-center gap-1">
                  <AlertCircle className="h-3 w-3" />
                  {getFieldError('catatan')}
                </p>
              )}
            </div>

            {/* Form validation summary */}
            {Object.keys(fieldErrors).some(key => fieldErrors[key] && fieldErrors[key].length > 0) && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  Sila semak dan betulkan maklumat yang telah dimasukkan.
                </AlertDescription>
              </Alert>
            )}

            <div className="flex gap-4">
              <Button 
                type="submit" 
                disabled={submitting || loading || !isFormValid()}
                className="flex items-center gap-2"
              >
                {submitting ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Send className="h-4 w-4" />
                )}
                {submitting ? 'Menghantar...' : 'Hantar Permohonan'}
              </Button>
              <Button 
                type="button" 
                variant="outline" 
                onClick={onBack}
                disabled={submitting || loading}
              >
                Batal
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}