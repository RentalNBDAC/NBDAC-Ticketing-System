import React from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { ArrowLeft, FileText, Plus, Search } from 'lucide-react';

interface GuestPageProps {
  onNavigate: (page: string) => void;
  onBack: () => void;
}

export default function GuestPage({ onNavigate, onBack }: GuestPageProps) {
  return (
    <div className="space-y-8">
      <div className="flex items-center gap-4">
        <Button variant="outline" onClick={onBack} className="flex items-center gap-2">
          <ArrowLeft className="h-4 w-4" />
          Kembali
        </Button>
        <div>
          <h2 className="text-2xl font-medium text-foreground">Portal Tetamu</h2>
          <p className="text-muted-foreground">Hantar permohonan baru atau semak status permohonan sedia ada</p>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => onNavigate('permohonan-baru')}>
          <CardHeader className="space-y-4">
            <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
              <Plus className="h-6 w-6 text-primary" />
            </div>
            <div>
              <CardTitle className="text-xl mb-2">Permohonan Baru</CardTitle>
              <p className="text-muted-foreground">
                Hantar permohonan projek baru dengan semua butiran yang diperlukan
              </p>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-sm text-muted-foreground">
              <p className="mb-3">Lengkapkan borang permohonan projek termasuk:</p>
              <ul className="space-y-2 pl-4">
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 bg-primary rounded-full mt-2 shrink-0"></span>
                  <span>Butiran projek dan tujuan</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 bg-primary rounded-full mt-2 shrink-0"></span>
                  <span>Keperluan pengumpulan data</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 bg-primary rounded-full mt-2 shrink-0"></span>
                  <span>Maklumat pegawai dan hubungan</span>
                </li>
              </ul>
            </div>
            <Button className="w-full" onClick={(e) => {
              e.stopPropagation();
              onNavigate('permohonan-baru');
            }}>
              Mula Permohonan Baru
            </Button>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => onNavigate('semak-status')}>
          <CardHeader className="space-y-4">
            <div className="w-12 h-12 bg-secondary/50 rounded-lg flex items-center justify-center">
              <Search className="h-6 w-6 text-secondary-foreground" />
            </div>
            <div>
              <CardTitle className="text-xl mb-2">Semak Status</CardTitle>
              <p className="text-muted-foreground">
                Semak status permohonan projek anda yang sedia ada
              </p>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-sm text-muted-foreground">
              <p className="mb-3">Lihat status semasa permohonan anda:</p>
              <ul className="space-y-2 pl-4">
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 bg-yellow-500 rounded-full mt-2 shrink-0"></span>
                  <span>Menunggu semakan</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 shrink-0"></span>
                  <span>Dalam penilaian</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 bg-green-500 rounded-full mt-2 shrink-0"></span>
                  <span>Diluluskan atau ditolak</span>
                </li>
              </ul>
            </div>
            <Button variant="outline" className="w-full" onClick={(e) => {
              e.stopPropagation();
              onNavigate('semak-status');
            }}>
              Semak Status
            </Button>
          </CardContent>
        </Card>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
        <div className="flex items-start gap-3">
          <FileText className="h-5 w-5 text-blue-600 mt-0.5 shrink-0" />
          <div className="space-y-2">
            <h3 className="font-medium text-blue-900">Maklumat Penting</h3>
            <div className="text-sm text-blue-800 space-y-1">
              <p>• Pastikan semua maklumat yang diperlukan dilengkapkan dengan tepat</p>
              <p>• Permohonan akan disemak dalam tempoh 3-5 hari bekerja</p>
              <p>• Anda akan menerima notifikasi email mengenai status permohonan</p>
              <p>• Untuk pertanyaan lanjut, hubungi pentadbir sistem di <span className="font-medium">admin@nbdac.gov.my</span></p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}