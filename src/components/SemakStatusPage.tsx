import React, { useState } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Badge } from './ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { ArrowLeft, Search, FileText, Loader2, Clock, CheckCircle, AlertTriangle, Eye, RefreshCw, MessageSquare } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger } from './ui/dialog';
import { ScrollArea } from './ui/scroll-area';
import { 
  formatDateSafe, 
  formatDateTimeSafe, 
  getRelativeTime, 
  isValidDate,
  formatBestAvailableDate,
  formatBestAvailableDateTime
} from '../utils/date-helpers';
import { mapDataFrequencyToMalay } from '../utils/email-helpers';

interface SemakStatusPageProps {
  onBack: () => void;
  onSearchByEmail: (email: string) => Promise<any[]>;
  loading?: boolean;
}

export default function SemakStatusPage({ onBack, onSearchByEmail, loading = false }: SemakStatusPageProps) {
  const [email, setEmail] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [hasSearched, setHasSearched] = useState(false);
  const [searching, setSearching] = useState(false);

  const handleSearch = async () => {
    if (!email) return;
    
    setSearching(true);
    setHasSearched(false);
    
    try {
      const results = await onSearchByEmail(email);
      console.log('🔍 Search results from server:', results);
      
      // Ensure results is always an array
      if (Array.isArray(results)) {
        setSearchResults(results);
      } else if (results && typeof results === 'object' && Array.isArray(results.submissions)) {
        // Handle case where results is an object with submissions property
        setSearchResults(results.submissions);
      } else {
        console.warn('Search results is not an array:', results);
        setSearchResults([]);
      }
      setHasSearched(true);
    } catch (error) {
      console.error('Search error:', error);
      setSearchResults([]);
      setHasSearched(true);
    } finally {
      setSearching(false);
    }
  };

  // Match status colors with InternalPage exactly - Updated to new status names
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Menunggu':
        return <Badge variant="secondary" className="bg-yellow-50 text-yellow-700 border-yellow-200"><Clock className="h-3 w-3 mr-1" />Menunggu</Badge>;
      case 'Sedang Diprocess':
        return <Badge variant="secondary" className="bg-blue-50 text-blue-700 border-blue-200"><RefreshCw className="h-3 w-3 mr-1" />Sedang Diproses</Badge>;
      case 'Selesai':
        return <Badge variant="secondary" className="bg-green-50 text-green-700 border-green-200"><CheckCircle className="h-3 w-3 mr-1" />Selesai</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  // Get all field values with fallbacks
  const getFieldValue = (submission: any, field: string): string => {
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
        return submission[field] || 'Tidak dinyatakan';
    }
  };

  // Enhanced Submission Detail Modal Component with bulletproof date formatting and ADMIN NOTES
  const SubmissionDetailModal = ({ submission }: { submission: any }) => (
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
            Maklumat lengkap permohonan projek yang dihantar oleh {submission.namaPegawai || submission.namaPengawai || 'Tidak dinyatakan'}
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
                <p className="text-sm text-gray-900">{submission.namaPegawai || submission.namaPengawai || 'Tidak dinyatakan'}</p>
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
            
            {/* Admin Note Section - Show if admin note exists for Selesai status */}
            {(submission.adminNote || submission.admin_note) && submission.status === 'Selesai' && (
              <div className="border-t pt-4">
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <MessageSquare className="h-4 w-4 text-green-600 flex-shrink-0" />
                    <label className="text-sm font-medium text-green-800">Maklum Balas Pentadbir</label>
                  </div>
                  <div className="bg-white/50 rounded-md p-3 border border-green-100">
                    <p className="text-sm text-green-900 leading-relaxed break-words overflow-wrap-anywhere whitespace-pre-wrap">
                      {submission.adminNote || submission.admin_note}
                    </p>
                  </div>
                  {(submission.noteAddedAt || submission.note_added_at) && (
                    <p className="text-xs text-green-600 mt-3 italic">
                      Ditambah pada: {formatDateTimeSafe(submission.noteAddedAt || submission.note_added_at)}
                    </p>
                  )}
                </div>
              </div>
            )}
            
            {/* Admin Note Section for Sedang Diprocess - Show with blue styling */}
            {(submission.adminNote || submission.admin_note) && submission.status === 'Sedang Diprocess' && (
              <div className="border-t pt-4">
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <MessageSquare className="h-4 w-4 text-blue-600 flex-shrink-0" />
                    <label className="text-sm font-medium text-blue-800">Maklum Balas Pentadbir (Sedang Diproses)</label>
                  </div>
                  <div className="bg-white/50 rounded-md p-3 border border-blue-100">
                    <p className="text-sm text-blue-900 leading-relaxed break-words overflow-wrap-anywhere whitespace-pre-wrap">
                      {submission.adminNote || submission.admin_note}
                    </p>
                  </div>
                  {(submission.noteAddedAt || submission.note_added_at) && (
                    <p className="text-xs text-blue-600 mt-3 italic">
                      Ditambah pada: {formatDateTimeSafe(submission.noteAddedAt || submission.note_added_at)}
                    </p>
                  )}
                </div>
              </div>
            )}
            
            <div className="border-t pt-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-gray-500">
                <div>
                  <label className="font-medium">Dihantar pada</label>
                  <p>{formatBestAvailableDateTime(submission)}</p>
                  {isValidDate(submission.createdAt || submission.submittedAt || submission.tarikh) && (
                    <p className="text-xs italic">{getRelativeTime(submission.createdAt || submission.submittedAt || submission.tarikh)}</p>
                  )}
                </div>
                <div>
                  <label className="font-medium">Kemaskini terakhir</label>
                  <p>{formatDateTimeSafe(submission.updatedAt || submission.submittedAt || submission.createdAt)}</p>
                  {isValidDate(submission.updatedAt) && (
                    <p className="text-xs italic">{getRelativeTime(submission.updatedAt)}</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );

  return (
    <div className="space-y-8">
      <div className="flex items-center gap-4">
        <Button variant="outline" onClick={onBack} className="flex items-center gap-2" disabled={loading || searching}>
          <ArrowLeft className="h-4 w-4" />
          Kembali
        </Button>
        <div>
          <h2 className="text-2xl font-medium text-foreground">Semak Status</h2>
          <p className="text-muted-foreground">Semak status permohonan projek anda</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="h-5 w-5" />
            Cari Mengikut Email
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-4">
            <div className="flex-1 space-y-2">
              <Label htmlFor="email">Alamat Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Masukkan alamat email anda"
                onKeyDown={(e) => e.key === 'Enter' && !searching && handleSearch()}
                disabled={searching}
              />
            </div>
            <div className="flex items-end">
              <Button 
                onClick={handleSearch} 
                disabled={!email || searching} 
                className="flex items-center gap-2"
              >
                {searching ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Search className="h-4 w-4" />
                )}
                {searching ? 'Mencari...' : 'Cari'}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {hasSearched && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Keputusan Carian ({Array.isArray(searchResults) ? searchResults.length : 0})
            </CardTitle>
          </CardHeader>
          <CardContent>
            {!Array.isArray(searchResults) || searchResults.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Tiada permohonan dijumpai untuk alamat email ini.</p>
                <p className="text-sm mt-2">Sila semak alamat email anda dan cuba lagi.</p>
              </div>
            ) : (
              <>
                {/* Desktop Table View */}
                <div className="hidden lg:block overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-[100px]">Tarikh</TableHead>
                        <TableHead className="w-[150px]">Bahagian</TableHead>
                        <TableHead className="w-[200px]">Nama Projek</TableHead>
                        <TableHead className="w-[150px]">Nama Pegawai</TableHead>
                        <TableHead className="w-[200px]">Email</TableHead>
                        <TableHead className="w-[120px]">Kutipan Data</TableHead>
                        <TableHead className="w-[100px]">Status</TableHead>
                        <TableHead className="w-[140px]">Kemaskini Terakhir</TableHead>
                        <TableHead className="w-[60px]">Butiran</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {Array.isArray(searchResults) && searchResults.map((submission) => {
                        // Safety check: ensure submission is an object
                        if (!submission || typeof submission !== 'object') {
                          console.warn('Invalid submission object:', submission);
                          return null;
                        }

                        // Debug log for each submission to see available fields
                        console.log('🔍 Rendering submission:', {
                          id: submission.id,
                          namaPegawai: submission.namaPegawai,
                          kutipanData: submission.kutipanData,
                          kekerapanPengumpulan: submission.kekerapanPengumpulan,
                          adminNote: submission.adminNote,
                          admin_note: submission.admin_note,
                          availableFields: Object.keys(submission)
                        });
                        
                        return (
                          <TableRow key={submission.id || submission.email || Math.random()}>
                            <TableCell className="text-sm">
                              {formatBestAvailableDate(submission)}
                            </TableCell>
                            <TableCell className="text-sm">
                              {submission.bahagian || 'Tidak dinyatakan'}
                            </TableCell>
                            <TableCell className="font-medium text-sm">
                              <div className="flex items-center gap-2">
                                <span className="truncate">
                                  {submission.namaProjek || 'Tidak dinyatakan'}
                                </span>
                                {/* Show admin note indicator in guest table */}
                                {(submission.adminNote || submission.admin_note) && submission.status === 'Selesai' && (
                                  <Badge variant="secondary" className="bg-green-50 text-green-700 border-green-200 text-xs flex-shrink-0">
                                    <MessageSquare className="h-3 w-3 mr-1" />
                                    Maklum Balas
                                  </Badge>
                                )}
                                {(submission.adminNote || submission.admin_note) && submission.status === 'Sedang Diprocess' && (
                                  <Badge variant="secondary" className="bg-blue-50 text-blue-700 border-blue-200 text-xs flex-shrink-0">
                                    <MessageSquare className="h-3 w-3 mr-1" />
                                    M. Proses
                                  </Badge>
                                )}
                              </div>
                            </TableCell>
                            <TableCell className="text-sm">
                              {submission.namaPegawai || submission.namaPengawai || 'Tidak dinyatakan'}
                            </TableCell>
                            <TableCell className="text-sm">
                              {submission.email || 'Tidak dinyatakan'}
                            </TableCell>
                            <TableCell className="text-sm capitalize">
                              {getFieldValue(submission, 'kekerapanPengumpulan')}
                            </TableCell>
                            <TableCell>
                              {getStatusBadge(submission.status)}
                            </TableCell>
                            <TableCell className="text-xs text-gray-500">
                              {formatDateTimeSafe(submission.updatedAt || submission.submittedAt || submission.createdAt)}
                            </TableCell>
                            <TableCell>
                              <SubmissionDetailModal submission={submission} />
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </div>

                {/* Mobile Card View */}
                <div className="lg:hidden space-y-4 p-4">
                  {Array.isArray(searchResults) && searchResults.map((submission) => {
                    // Safety check: ensure submission is an object
                    if (!submission || typeof submission !== 'object') {
                      console.warn('Invalid submission object:', submission);
                      return null;
                    }
                    
                    return (
                      <Card key={submission.id || submission.email || Math.random()} className="border border-gray-200">
                        <CardContent className="p-4 space-y-3">
                          {/* Header Row */}
                          <div className="flex items-start justify-between">
                            <div className="space-y-1 flex-1 min-w-0">
                              <div className="flex items-center gap-2">
                                <h4 className="font-medium text-sm text-gray-900 truncate">
                                  {submission.namaProjek || 'Tidak dinyatakan'}
                                </h4>
                                {/* Show admin note indicator in mobile cards */}
                                {(submission.adminNote || submission.admin_note) && submission.status === 'Selesai' && (
                                  <Badge variant="secondary" className="bg-green-50 text-green-700 border-green-200 text-xs flex-shrink-0">
                                    <MessageSquare className="h-3 w-3 mr-1" />
                                    Maklum Balas
                                  </Badge>
                                )}
                                {(submission.adminNote || submission.admin_note) && submission.status === 'Sedang Diprocess' && (
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
                              <SubmissionDetailModal submission={submission} />
                            </div>
                          </div>

                          {/* Details Grid */}
                          <div className="grid grid-cols-2 gap-2 text-xs">
                            <div>
                              <span className="text-gray-500">Pegawai:</span>
                              <p className="text-gray-900 truncate">{submission.namaPegawai || submission.namaPengawai || 'Tidak dinyatakan'}</p>
                            </div>
                            <div>
                              <span className="text-gray-500">Tarikh:</span>
                              <p className="text-gray-900">{formatBestAvailableDate(submission)}</p>
                            </div>
                            <div className="col-span-2">
                              <span className="text-gray-500">Email:</span>
                              <p className="text-gray-900 truncate">{submission.email || 'Tidak dinyatakan'}</p>
                            </div>
                            <div>
                              <span className="text-gray-500">Kutipan Data:</span>
                              <p className="text-gray-900 capitalize text-xs">{getFieldValue(submission, 'kekerapanPengumpulan')}</p>
                            </div>
                            <div>
                              <span className="text-gray-500">Kemaskini:</span>
                              <p className="text-gray-900 text-xs">{formatDateSafe(submission.updatedAt || submission.submittedAt || submission.createdAt)}</p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              </>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}