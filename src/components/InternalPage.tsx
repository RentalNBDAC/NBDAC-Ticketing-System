import React, { useState, useMemo } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { ArrowLeft, Plus, RefreshCw, Search, FileText, Users, Clock, CheckCircle, AlertTriangle, AlertCircle, Eye, MessageSquare, Mail } from 'lucide-react';
import EmailTestButton from './EmailTestButton';
import { Alert, AlertDescription } from './ui/alert';
import { Skeleton } from './ui/skeleton';
import { toast } from '../utils/toast';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger } from './ui/dialog';
import { ScrollArea } from './ui/scroll-area';
import { Textarea } from './ui/textarea';
import { Label } from './ui/label';
import { 
  formatDateSafe, 
  formatDateTimeSafe, 
  getRelativeTime, 
  isValidDate,
  formatBestAvailableDate,
  formatBestAvailableDateTime
} from '../utils/date-helpers';
import { mapDataFrequencyToMalay } from '../utils/email-helpers';

interface Submission {
  id: string;
  tarikh: string;
  bahagian: string;
  namaProjek: string;
  tujuan: string;
  lamanWeb: string;
  kekerapanPengumpulan: string;
  namaPegawai: string;
  email: string;
  nota?: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  tujuanProjek?: string;
  websiteUrl?: string;
  kutipanData?: string;
  catatan?: string;
  adminNote?: string;
  noteAddedAt?: string;
}

interface InternalPageProps {
  onNavigate: (page: string) => void;
  onBack: () => void;
  submissions: Submission[];
  onAddSubmission: (data: any) => Promise<boolean>;
  onUpdateStatus: (id: string, status: string, adminNote?: string) => Promise<void>;
  onRefreshSubmissions: () => Promise<void>;
  loading: boolean;
}

export default function InternalPage({ 
  onNavigate, 
  onBack, 
  submissions, 
  onAddSubmission, 
  onUpdateStatus, 
  onRefreshSubmissions, 
  loading 
}: InternalPageProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [refreshing, setRefreshing] = useState(false);
  const [adminNotes, setAdminNotes] = useState<Record<string, string>>({});
  const [showNoteDialog, setShowNoteDialog] = useState<Record<string, boolean>>({});
  const [noteDialogId, setNoteDialogId] = useState<string | null>(null);
  const [noteDialogStatus, setNoteDialogStatus] = useState<string | null>(null);


  // Safe submissions array
  const safeSubmissions = Array.isArray(submissions) ? submissions : [];

  // Filter and sort submissions based on search, status, and custom sorting
  const filteredSubmissions = useMemo(() => {
    const filtered = safeSubmissions.filter(submission => {
      // Safety check for submission object
      if (!submission || typeof submission !== 'object') {
        return false;
      }

      const matchesSearch = searchTerm === '' || [
        submission.bahagian,
        submission.namaProjek,
        submission.namaPegawai,
        submission.email,
        submission.tujuan || submission.tujuanProjek
      ].some(field => 
        field && field.toLowerCase().includes(searchTerm.toLowerCase())
      );

      const matchesStatus = statusFilter === 'all' || submission.status === statusFilter;

      return matchesSearch && matchesStatus;
    });

    // Custom sorting: oldest to latest for date, with "Selesai" at bottom
    return filtered.sort((a, b) => {
      // First sort by status priority (Selesai goes to bottom)
      const getStatusPriority = (status: string) => {
        switch (status) {
          case 'Menunggu': return 1;
          case 'Sedang Diprocess': 
          case 'Sedang Diproses': return 2;
          case 'Selesai': return 3;
          default: return 4;
        }
      };

      const statusComparison = getStatusPriority(a.status) - getStatusPriority(b.status);
      
      // If statuses are the same priority, sort by date (oldest first)
      if (statusComparison === 0) {
        const dateA = new Date(a.tarikh || a.createdAt || '').getTime() || 0;
        const dateB = new Date(b.tarikh || b.createdAt || '').getTime() || 0;
        return dateA - dateB; // Ascending order (oldest first)
      }
      
      return statusComparison;
    });
  }, [safeSubmissions, searchTerm, statusFilter]);

  // Calculate statistics with new status names
  const stats = useMemo(() => {
    const total = safeSubmissions.length;
    const menunggu = safeSubmissions.filter(s => s?.status === 'Menunggu').length;
    const sedangDiproses = safeSubmissions.filter(s => s?.status === 'Sedang Diprocess' || s?.status === 'Sedang Diproses').length;
    const selesai = safeSubmissions.filter(s => s?.status === 'Selesai').length;

    return { total, menunggu, sedangDiproses, selesai };
  }, [safeSubmissions]);

  const handleRefresh = async () => {
    try {
      setRefreshing(true);
      await onRefreshSubmissions();
      toast.success('Data berjaya dikemaskini', 'Senarai permohonan telah dikemaskini.');
    } catch (error) {
      console.error('Refresh error:', error);
      toast.error('Gagal mengemaskini data', 'Sila cuba lagi atau hubungi pentadbir sistem.');
    } finally {
      setRefreshing(false);
    }
  };

  const handleStatusUpdate = async (id: string, newStatus: string) => {
    try {
      // If changing to "Selesai" or "Sedang Diprocess", check if admin note should be added
      if (newStatus === 'Selesai' || newStatus === 'Sedang Diprocess') {
        const adminNote = adminNotes[id]?.trim();
        if (adminNote) {
          await onUpdateStatus(id, newStatus, adminNote);
          // Clear the note from state after successful update
          setAdminNotes(prev => ({ ...prev, [id]: '' }));
          setShowNoteDialog(prev => ({ ...prev, [id]: false }));
          setNoteDialogId(null);
          setNoteDialogStatus(null);
        } else {
          await onUpdateStatus(id, newStatus);
          setShowNoteDialog(prev => ({ ...prev, [id]: false }));
          setNoteDialogId(null);
          setNoteDialogStatus(null);
        }
      } else {
        await onUpdateStatus(id, newStatus);
        // Clear any pending notes if status is changed to other statuses
        setAdminNotes(prev => ({ ...prev, [id]: '' }));
        setShowNoteDialog(prev => ({ ...prev, [id]: false }));
        setNoteDialogId(null);
        setNoteDialogStatus(null);
      }
    } catch (error) {
      console.error('Status update error:', error);
      // Error handling is done in the parent component
    }
  };

  const handleNoteChange = (id: string, note: string) => {
    setAdminNotes(prev => ({ ...prev, [id]: note }));
  };

  const toggleNoteDialog = (id: string, status?: string) => {
    setShowNoteDialog(prev => ({ ...prev, [id]: !prev[id] }));
    setNoteDialogId(prev => prev === id ? null : id);
    setNoteDialogStatus(prev => prev === id ? null : (status || null));
  };



  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Menunggu':
        return <Badge variant="secondary" className="bg-yellow-50 text-yellow-700 border-yellow-200"><Clock className="h-3 w-3 mr-1" />Menunggu</Badge>;
      case 'Sedang Diprocess':
      case 'Sedang Diproses':
        return <Badge variant="secondary" className="bg-blue-50 text-blue-700 border-blue-200"><RefreshCw className="h-3 w-3 mr-1" />Sedang Diproses</Badge>;
      case 'Selesai':
        return <Badge variant="secondary" className="bg-green-50 text-green-700 border-green-200"><CheckCircle className="h-3 w-3 mr-1" />Selesai</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  // Get all field values with fallbacks
  const getFieldValue = (submission: Submission, field: string): string => {
    switch (field) {
      case 'tujuan':
        return submission.tujuan || submission.tujuanProjek || 'Tidak dinyatakan';
      case 'lamanWeb':
        return submission.lamanWeb || submission.websiteUrl || 'Tidak dinyatakan';
      case 'kekerapanPengumpulan':
        const rawFrequency = submission.kekerapanPengumpulan || submission.kutipanData || 'Tidak dinyatakan';
        return mapDataFrequencyToMalay(rawFrequency);
      case 'catatan':
        return submission.nota || submission.catatan || '-';
      default:
        return submission[field as keyof Submission] as string || 'Tidak dinyatakan';
    }
  };

  // Show error state if there's an issue with submissions
  const hasDataIssue = !loading && !Array.isArray(submissions);

  // Enhanced Submission Detail Modal Component with bulletproof date formatting
  const SubmissionDetailModal = ({ submission }: { submission: Submission }) => (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="h-8 w-8 p-0">
          <Eye className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[80vh] w-full overflow-hidden">
        <DialogHeader>
          <DialogTitle>Butiran Permohonan - {submission.namaProjek}</DialogTitle>
          <DialogDescription>
            Maklumat lengkap permohonan projek yang dihantar oleh {submission.namaPegawai || 'Tidak dinyatakan'}
          </DialogDescription>
        </DialogHeader>
        <ScrollArea className="max-h-[60vh] pr-4 overflow-x-auto">
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-600">Tarikh</label>
                <p className="text-sm text-gray-900">{formatBestAvailableDate(submission)}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">Status</label>
                <div className="mt-1">{getStatusBadge(submission.status)}</div>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">Bahagian</label>
                <p className="text-sm text-gray-900">{submission.bahagian || 'Tidak dinyatakan'}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">Nama Pegawai</label>
                <p className="text-sm text-gray-900">{submission.namaPegawai || 'Tidak dinyatakan'}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">Email</label>
                <p className="text-sm text-gray-900">{submission.email || 'Tidak dinyatakan'}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">Kekerapan Kutipan Data</label>
                <p className="text-sm text-gray-900 capitalize">{getFieldValue(submission, 'kekerapanPengumpulan')}</p>
              </div>
            </div>
            
            <div>
              <label className="text-sm font-medium text-gray-600">Nama Projek</label>
              <p className="text-sm text-gray-900">{submission.namaProjek || 'Tidak dinyatakan'}</p>
            </div>
            
            <div>
              <label className="text-sm font-medium text-gray-600">Tujuan Projek</label>
              <p className="text-sm text-gray-900 whitespace-pre-wrap">{getFieldValue(submission, 'tujuan')}</p>
            </div>
            
            <div>
              <label className="text-sm font-medium text-gray-600">Laman Web</label>
              <p className="text-sm text-gray-900 whitespace-pre-wrap font-mono">{getFieldValue(submission, 'lamanWeb')}</p>
            </div>
            
            <div>
              <label className="text-sm font-medium text-gray-600">Catatan</label>
              <p className="text-sm text-gray-900 whitespace-pre-wrap">{getFieldValue(submission, 'catatan')}</p>
            </div>
            
            {/* Admin Note Section - Show if admin note exists */}
            {submission.adminNote && submission.status === 'Selesai' && (
              <div className="border-t pt-4">
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <MessageSquare className="h-4 w-4 text-green-600 flex-shrink-0" />
                    <label className="text-sm font-medium text-green-800">Maklum Balas Pentadbir</label>
                  </div>
                  <div className="bg-white/50 rounded-md p-3 border border-green-100">
                    <p className="text-sm text-green-900 leading-relaxed break-words overflow-wrap-anywhere whitespace-pre-wrap">
                      {submission.adminNote}
                    </p>
                  </div>
                  {submission.noteAddedAt && (
                    <p className="text-xs text-green-600 mt-3 italic">
                      Ditambah pada: {formatDateTimeSafe(submission.noteAddedAt)}
                    </p>
                  )}
                </div>
              </div>
            )}
            
            {/* Admin Note Section for Sedang Diprocess - Show with blue styling */}
            {submission.adminNote && submission.status === 'Sedang Diprocess' && (
              <div className="border-t pt-4">
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <MessageSquare className="h-4 w-4 text-blue-600 flex-shrink-0" />
                    <label className="text-sm font-medium text-blue-800">Maklum Balas Pentadbir (Sedang Diproses)</label>
                  </div>
                  <div className="bg-white/50 rounded-md p-3 border border-blue-100">
                    <p className="text-sm text-blue-900 leading-relaxed break-words overflow-wrap-anywhere whitespace-pre-wrap">
                      {submission.adminNote}
                    </p>
                  </div>
                  {submission.noteAddedAt && (
                    <p className="text-xs text-blue-600 mt-3 italic">
                      Ditambah pada: {formatDateTimeSafe(submission.noteAddedAt)}
                    </p>
                  )}
                </div>
              </div>
            )}
            
            <div className="border-t pt-4">
              <div className="grid grid-cols-1 gap-4 text-xs text-gray-500">
                <div>
                  <label className="font-medium">Dihantar pada</label>
                  <p>{formatBestAvailableDateTime(submission)}</p>
                  {isValidDate(submission.createdAt || submission.tarikh) && (
                    <p className="text-xs italic">{getRelativeTime(submission.createdAt || submission.tarikh)}</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );

  // Admin Note Dialog Component - UPDATED to handle both Selesai and Sedang Diproses
  const AdminNoteDialog = ({ submissionId }: { submissionId: string }) => {
    if (!showNoteDialog[submissionId]) return null;
    
    const currentStatus = noteDialogStatus || 'Selesai';
    const statusLabel = currentStatus === 'Selesai' ? 'Selesai' : 'Sedang Diproses';
    const placeholderText = currentStatus === 'Selesai' 
      ? 'Masukkan maklum balas untuk status selesai...' 
      : 'Masukkan maklum balas untuk status sedang diproses...';
    
    return (
      <div className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-lg shadow-xl w-full max-w-lg max-h-[80vh] overflow-hidden border">
          <div className="p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Maklum Balas Pentadbir (Pilihan)
            </h3>
            <div className="mb-4">
              <input 
                type="text"
                key={`admin-note-input-${submissionId}`}
                placeholder={placeholderText}
                value={adminNotes[submissionId] || ''}
                onChange={(e) => handleNoteChange(submissionId, e.target.value)}
                style={{
                  width: '100%',
                  minHeight: '120px',
                  padding: '12px',
                  border: '1px solid #d1d5db',
                  borderRadius: '6px',
                  fontSize: '14px',
                  resize: 'none',
                  fontFamily: 'inherit',
                  direction: 'ltr !important',
                  textAlign: 'left !important',
                  unicodeBidi: 'embed !important',
                  writingMode: 'lr-tb !important'
                }}
                dir="ltr"
                autoFocus
                className="focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <p className="text-xs text-gray-500 mt-2">
                Catatan ini akan disimpan dan boleh dilihat oleh pemohon dan pentadbir.
              </p>
            </div>
            <div className="flex gap-3 justify-end">
              <Button
                variant="outline"
                onClick={() => toggleNoteDialog(submissionId)}
                className="text-sm"
              >
                Batal
              </Button>
              <Button
                onClick={() => handleStatusUpdate(submissionId, currentStatus)}
                className="text-sm"
              >
                {statusLabel}
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-8">
      {/* Header - Mobile Responsive */}
      <div className="space-y-4 lg:space-y-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3 sm:gap-4 min-w-0 flex-1">
            <Button variant="outline" onClick={onBack} className="flex items-center gap-2 shrink-0">
              <ArrowLeft className="h-4 w-4" />
              <span className="hidden sm:inline">Kembali</span>
            </Button>
            <div className="min-w-0">
              <h2 className="text-xl sm:text-2xl font-medium text-gray-900">Portal Dalaman</h2>
              <p className="text-sm sm:text-base text-gray-600 hidden sm:block">Urus dan pantau semua permohonan projek</p>
              <p className="text-xs text-gray-600 sm:hidden">Urus permohonan projek</p>
            </div>
          </div>
          
          {/* Action Buttons - Desktop */}
          <div className="hidden sm:flex items-center gap-3">
            <Button
              variant="outline"
              onClick={handleRefresh}
              disabled={loading || refreshing}
              className="flex items-center gap-2"
            >
              <RefreshCw className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
              Kemaskini
            </Button>
            <Button onClick={() => onNavigate('permohonan-baru')} className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Permohonan Baru
            </Button>
          </div>
        </div>
        
        {/* Mobile Action Buttons */}
        <div className="flex sm:hidden items-center gap-2">
          <Button
            variant="outline"
            onClick={handleRefresh}
            disabled={loading || refreshing}
            className="flex items-center gap-2 flex-1"
            size="sm"
          >
            <RefreshCw className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
            Kemaskini
          </Button>
          <Button 
            onClick={() => onNavigate('permohonan-baru')} 
            className="flex items-center gap-2 flex-1"
            size="sm"
          >
            <Plus className="h-4 w-4" />
            Permohonan Baru
          </Button>
        </div>
      </div>

      {/* Error Alert */}
      {hasDataIssue && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Terdapat masalah dengan data permohonan. Sila cuba kemaskini data atau hubungi pentadbir sistem.
          </AlertDescription>
        </Alert>
      )}

      {/* Statistics Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs sm:text-sm font-medium text-gray-600">Jumlah</CardTitle>
            <FileText className="h-4 w-4 text-gray-400" />
          </CardHeader>
          <CardContent>
            {loading ? (
              <Skeleton className="h-6 sm:h-8 w-12 sm:w-16" />
            ) : (
              <div className="text-xl sm:text-2xl font-bold text-gray-900">{stats.total}</div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs sm:text-sm font-medium text-gray-600">Menunggu</CardTitle>
            <Clock className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            {loading ? (
              <Skeleton className="h-6 sm:h-8 w-12 sm:w-16" />
            ) : (
              <div className="text-xl sm:text-2xl font-bold text-yellow-600">{stats.menunggu}</div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs sm:text-sm font-medium text-gray-600">Sedang Diproses</CardTitle>
            <RefreshCw className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            {loading ? (
              <Skeleton className="h-6 sm:h-8 w-12 sm:w-16" />
            ) : (
              <div className="text-xl sm:text-2xl font-bold text-blue-600">{stats.sedangDiproses}</div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs sm:text-sm font-medium text-gray-600">Selesai</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            {loading ? (
              <Skeleton className="h-6 sm:h-8 w-12 sm:w-16" />
            ) : (
              <div className="text-xl sm:text-2xl font-bold text-green-600">{stats.selesai}</div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Users className="h-5 w-5" />
            Urus Permohonan
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Cari bahagian, projek, pegawai, email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 text-sm"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder="Filter status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Semua Status</SelectItem>
                <SelectItem value="Menunggu">Menunggu</SelectItem>
                <SelectItem value="Sedang Diprocess">Sedang Diproses</SelectItem>
                <SelectItem value="Selesai">Selesai</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Submissions - Responsive Layout */}
      <Card>
        <CardContent className="p-0">
          {loading && safeSubmissions.length === 0 ? (
            <div className="p-8">
              <div className="space-y-4">
                {[...Array(5)].map((_, i) => (
                  <Skeleton key={i} className="h-16 w-full" />
                ))}
              </div>
            </div>
          ) : filteredSubmissions.length === 0 ? (
            <div className="p-8 text-center">
              <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                {searchTerm || statusFilter !== 'all' ? 'Tiada permohonan dijumpai' : 'Tiada permohonan lagi'}
              </h3>
              <p className="text-gray-600">
                {searchTerm || statusFilter !== 'all' 
                  ? 'Cuba tukar kriteria carian anda.' 
                  : 'Permohonan akan muncul di sini setelah dihantar.'}
              </p>
            </div>
          ) : (
            <>
              {/* Desktop Table View */}
              <div className="hidden lg:block">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-20">Tarikh</TableHead>
                      <TableHead className="w-24">Bahagian</TableHead>
                      <TableHead className="min-w-32 max-w-48">Nama Projek</TableHead>
                      <TableHead className="w-28">Nama Pegawai</TableHead>
                      <TableHead className="min-w-32 max-w-40">Email</TableHead>
                      <TableHead className="w-24">Kutipan Data</TableHead>
                      <TableHead className="w-20">Status</TableHead>
                      <TableHead className="w-28">Tindakan</TableHead>
                      <TableHead className="w-16">Butiran</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredSubmissions.map((submission) => (
                      <TableRow key={submission.id}>
                        <TableCell className="text-xs">{formatBestAvailableDate(submission)}</TableCell>
                        <TableCell className="text-xs">
                          <div className="truncate max-w-24" title={submission.bahagian || 'Tidak dinyatakan'}>
                            {submission.bahagian || 'Tidak dinyatakan'}
                          </div>
                        </TableCell>
                        <TableCell className="font-medium text-xs">
                          <div className="flex items-center gap-2">
                            <div className="truncate max-w-48" title={submission.namaProjek || 'Tidak dinyatakan'}>
                              {submission.namaProjek || 'Tidak dinyatakan'}
                            </div>
                            {submission.adminNote && submission.status === 'Selesai' && (
                              <Badge variant="secondary" className="bg-green-50 text-green-700 border-green-200 text-xs flex-shrink-0">
                                <MessageSquare className="h-3 w-3 mr-1" />
                                Maklum Balas
                              </Badge>
                            )}
                            {submission.adminNote && submission.status === 'Sedang Diprocess' && (
                              <Badge variant="secondary" className="bg-blue-50 text-blue-700 border-blue-200 text-xs flex-shrink-0">
                                <MessageSquare className="h-3 w-3 mr-1" />
                                M. Proses
                              </Badge>
                            )}
                          </div>
                        </TableCell>
                        <TableCell className="text-xs">
                          <div className="truncate max-w-28" title={submission.namaPegawai || 'Tidak dinyatakan'}>
                            {submission.namaPegawai || 'Tidak dinyatakan'}
                          </div>
                        </TableCell>
                        <TableCell className="text-xs">
                          <div className="truncate max-w-40" title={submission.email || 'Tidak dinyatakan'}>
                            {submission.email || 'Tidak dinyatakan'}
                          </div>
                        </TableCell>
                        <TableCell className="text-xs">
                          <div className="truncate max-w-24" title={getFieldValue(submission, 'kekerapanPengumpulan')}>
                            {getFieldValue(submission, 'kekerapanPengumpulan')}
                          </div>
                        </TableCell>
                        <TableCell>{getStatusBadge(submission.status)}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            <Select
                              value={submission.status}
                              onValueChange={(newStatus) => {
                                if (newStatus === 'Selesai' || newStatus === 'Sedang Diprocess') {
                                  toggleNoteDialog(submission.id, newStatus);
                                } else {
                                  handleStatusUpdate(submission.id, newStatus);
                                }
                              }}
                            >
                              <SelectTrigger className="h-8 w-24 text-xs">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="Menunggu">Menunggu</SelectItem>
                                <SelectItem value="Sedang Diprocess">Sedang Diproses</SelectItem>
                                <SelectItem value="Selesai">Selesai</SelectItem>
                              </SelectContent>
                            </Select>
                            {showNoteDialog[submission.id] && (
                              <AdminNoteDialog submissionId={submission.id} />
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <SubmissionDetailModal submission={submission} />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              {/* Mobile Card View */}
              <div className="lg:hidden space-y-4 p-4">
                {filteredSubmissions.map((submission) => (
                  <Card key={submission.id} className="border border-gray-200 shadow-sm">
                    <CardContent className="p-4">
                      <div className="space-y-3">
                        <div className="flex items-start justify-between">
                          <div className="space-y-1 flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                              <h4 className="font-medium text-sm text-gray-900 truncate">
                                {submission.namaProjek || 'Tidak dinyatakan'}
                              </h4>
                              {submission.adminNote && submission.status === 'Selesai' && (
                                <Badge variant="secondary" className="bg-green-50 text-green-700 border-green-200 text-xs flex-shrink-0">
                                  <MessageSquare className="h-3 w-3 mr-1" />
                                  Maklum Balas
                                </Badge>
                              )}
                              {submission.adminNote && submission.status === 'Sedang Diprocess' && (
                                <Badge variant="secondary" className="bg-blue-50 text-blue-700 border-blue-200 text-xs flex-shrink-0">
                                  <MessageSquare className="h-3 w-3 mr-1" />
                                  M. Proses
                                </Badge>
                              )}
                            </div>
                            <p className="text-xs text-gray-600 truncate">
                              {submission.bahagian || 'Tidak dinyatakan'}
                            </p>
                          </div>
                          <div className="flex items-center space-x-2 ml-2">
                            {getStatusBadge(submission.status)}
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-2 text-xs text-gray-600">
                          <div>
                            <span className="font-medium">Pegawai:</span> {submission.namaPegawai || 'Tidak dinyatakan'}
                          </div>
                          <div>
                            <span className="font-medium">Tarikh:</span> {formatBestAvailableDate(submission)}
                          </div>
                          <div className="col-span-2">
                            <span className="font-medium">Email:</span> {submission.email || 'Tidak dinyatakan'}
                          </div>
                        </div>
                        
                        <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                          <div className="flex items-center gap-2">
                            <Select
                              value={submission.status}
                              onValueChange={(newStatus) => {
                                if (newStatus === 'Selesai' || newStatus === 'Sedang Diprocess') {
                                  toggleNoteDialog(submission.id, newStatus);
                                } else {
                                  handleStatusUpdate(submission.id, newStatus);
                                }
                              }}
                            >
                              <SelectTrigger className="h-8 w-28 text-xs">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="Menunggu">Menunggu</SelectItem>
                                <SelectItem value="Sedang Diprocess">Sedang Diproses</SelectItem>
                                <SelectItem value="Selesai">Selesai</SelectItem>
                              </SelectContent>
                            </Select>
                            {showNoteDialog[submission.id] && (
                              <AdminNoteDialog submissionId={submission.id} />
                            )}
                          </div>
                          <SubmissionDetailModal submission={submission} />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {/* Email Test Button - Development Helper */}
      {/* <div className="flex justify-center">
        <EmailTestButton />
      </div> */}
    </div>
  );
}