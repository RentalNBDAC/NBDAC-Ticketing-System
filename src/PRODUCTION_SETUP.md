# Panduan Pengeluaran (Production Setup)

Panduan lengkap untuk menyediakan sistem **Sistem Permohonan Projek NBDAC** untuk penggunaan pengeluaran.

## 📋 Senarai Semak Pengeluaran

### 1. Sediakan Projek Supabase

1. **Cipta Projek Supabase:**
   - Pergi ke [https://supabase.com](https://supabase.com)
   - Cipta akaun dan projek baru
   - Catat URL projek dan Anon Key

2. **Konfigurasi Pembolehubah Persekitaran:**
   ```bash
   # Kemaskini /utils/supabase/info.tsx dengan maklumat projek anda
   export const projectId = "your-project-id";
   export const publicAnonKey = "your-anon-key";
   ```

### 2. Sediakan Pangkalan Data

Pangkalan data KV sedia ada (`kv_store_764b8bb4`) sudah mencukupi untuk semua fungsi sistem:
- ✅ **Penyimpanan permohonan** - menggunakan prefix `submission:`
- ✅ **Indeks email** - menggunakan prefix `email_index:`
- ✅ **Status tracking** - disimpan dalam data permohonan
- ✅ **Metadata sistem** - menggunakan prefix lain jika diperlukan

**TIADA keperluan untuk cipta jadual tambahan!**

### 3. Sediakan Authentication

#### Kaedah 1: Gunakan Supabase Auth Dashboard (Disarankan)
1. Pergi ke Supabase Dashboard → Authentication → Users
2. Klik "Invite User" atau "Add User"
3. Masukkan email pentadbir (contoh: `admin@nbdac.gov.my`)
4. Tetapkan kata laluan atau hantar jemputan email
5. Sahkan akaun melalui email jika diperlukan

#### Kaedah 2: Cipta Akaun Melalui API
```javascript
// Contoh cipta akaun pentadbir melalui console browser di /admin-login
const supabase = createClient();
const { data, error } = await supabase.auth.admin.createUser({
  email: 'admin@nbdac.gov.my',
  password: 'your-secure-password',
  user_metadata: { 
    name: 'Administrator NBDAC',
    role: 'admin' 
  },
  email_confirm: true // Automatic confirmation
});
console.log('Admin created:', data, error);
```

### 4. Konfigurasi Keselamatan

1. **RLS (Row Level Security):**
   - Sudah diuruskan oleh KV store functions
   - Tiada keperluan konfigurasi tambahan

2. **CORS Settings:**
   - Tambah domain pengeluaran anda di Supabase Dashboard
   - Settings → API → CORS Origins

3. **Edge Functions:**
   - Server functions sudah dikonfigurasi dengan betul
   - Endpoint: `https://{project-id}.supabase.co/functions/v1/make-server-764b8bb4/`

### 5. Uji Sistem

1. **Uji Authentication:**
   ```bash
   # Log masuk dengan akaun pentadbir di /admin-login
   Email: admin@nbdac.gov.my
   Password: [kata laluan yang ditetapkan]
   ```

2. **Uji Permohonan:**
   - Hantar permohonan melalui Portal Tetamu
   - Semak dalam Portal Dalaman
   - Uji perubahan status
   - Uji carian mengikut email

3. **Uji Notifikasi:**
   - Semak toast notifications berfungsi
   - Pastikan mesej dalam Bahasa Malaysia

### 6. Buang Kod Development

Kod demo sudah dibuang dalam versi pengeluaran:
- ❌ Demo credentials dihapuskan
- ❌ Development mode flags dibuang  
- ✅ Production error messages dalam Bahasa Malaysia
- ✅ Supabase authentication sahaja

### 7. Monitoring & Maintenance

1. **Pantau Penggunaan:**
   - Supabase Dashboard → Overview
   - Lihat statistik penggunaan database dan auth

2. **Backup Data:**
   - Supabase menyediakan backup automatik
   - Download backup manual jika diperlukan

3. **Update System:**
   - Kekalkan dependencies terkini
   - Monitor Supabase feature updates

## 🚀 Perintah Pelancaran

```bash
# 1. Pastikan environment variables ditetapkan
# 2. Set REACT_APP_ALLOW_ADMIN_SETUP=false (untuk keselamatan)
# 3. Deploy ke platform pilihan anda (Vercel/Netlify/etc)
# 4. Update Supabase CORS dengan domain pengeluaran
# 5. Uji semua functionality
```

## 🔒 Environment Configuration untuk Keselamatan

Sistem ini menggunakan konfigurasi berbasis browser untuk keselamatan. Secara automatik:

### **🏠 Development (localhost):**
```javascript
// Auto-configured:
- allowAdminSetup: true
- setupKey: "nbdac-admin-setup-2025"
- No domain restrictions
```

### **🚀 Production (deployed domains):**
```javascript
// Auto-configured untuk keselamatan:
- allowAdminSetup: false (DISABLED)
- No keys set (force manual admin creation)
- Domain restrictions possible
```

### **⚙️ Manual Configuration (if needed):**

Jika anda perlu override konfigurasi automatik, tambah di awal App.tsx:

```javascript
import { initializeEnvironmentConfig } from './utils/env-config';

// In your App component useEffect:
useEffect(() => {
  initializeEnvironmentConfig({
    allowAdminSetup: false,  // Matikan setup page
    setupKey: 'your-secure-key-2025',
    allowedAdminDomains: ['nbdac.gov.my', 'admin.nbdac.gov.my'],
    masterSetupKey: 'ultra-secure-master-key'
  });
}, []);
```

### **🔐 Production Override (Advanced):**

Untuk enable admin setup di produksi (tidak disarankan):

```javascript
// WARNING: Only for emergency admin creation
window.__ALLOW_ADMIN_SETUP = true;
window.__SETUP_KEY = 'emergency-key-2025';
```

## 🔐 Pengurusan Akaun Pentadbir

### Tambah Pentadbir Baru:
1. Log masuk ke Supabase Dashboard
2. Pergi ke Authentication → Users  
3. Klik "Invite User"
4. Masukkan email dan hantar jemputan

### Reset Kata Laluan:
1. Gunakan "Forgot Password" di login page
2. Atau reset melalui Supabase Dashboard

### Buang Akses:
1. Pergi ke Authentication → Users
2. Pilih user dan klik "Delete User"

## 🔐 Keselamatan Produksi

### **Langkah Keselamatan Wajib:**

1. **Matikan Admin Setup Page:**
   ```bash
   REACT_APP_ALLOW_ADMIN_SETUP=false
   ```

2. **Gunakan HTTPS sahaja** untuk domain produksi

3. **Set domain CORS yang ketat** di Supabase Dashboard

4. **Monitor log access** untuk aktiviti mencurigakan

5. **Backup data** secara berkala

6. **Update dependencies** untuk patch keselamatan

### **Tanda Keselamatan Yang Betul:**

✅ **Admin setup page menunjukkan "Setup Tidak Tersedia"**
✅ **Console tidak menunjukkan development helpers**  
✅ **Hanya Supabase Dashboard boleh cipta admin**
✅ **Password policy yang ketat (12+ karakter)**
✅ **Domain email terhad (jika dikonfigurasi)**

## 📞 Sokongan

Untuk masalah teknikal:
- Semak console browser untuk error messages
- Rujuk dokumentasi Supabase: https://supabase.com/docs
- Hubungi pentadbir sistem: admin@nbdac.gov.my

---

**Nota Penting:** Sistem ini sudah siap untuk pengeluaran dengan keselamatan yang dipertingkatkan. Admin setup page automatik dimatikan dalam produksi untuk keselamatan optimum! 🔒🎉