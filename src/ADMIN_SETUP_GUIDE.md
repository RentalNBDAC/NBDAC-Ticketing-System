# Panduan Setup Admin - Sistem Permohonan Projek Web Scraping NBDAC

Panduan lengkap untuk mencipta akaun pentadbir dalam sistem ini.

## 🎯 3 Kaedah Setup Admin

### **Kaedah 1: Supabase Dashboard (Untuk Production)**

#### A. Invite dengan Email Setup (Seperti yang anda cuba)
```bash
1. Pergi ke Supabase Dashboard → Authentication → Users
2. Klik "Invite User"
3. Masukkan email: admin@nbdac.gov.my
4. Sistem hantar email jemputan
5. Pentadbir buka email dan klik link
6. Set password melalui browser
7. Akaun aktif untuk login
```

**✅ Kelebihan:** Selamat, pentadbir set password sendiri
**❌ Kelemahan:** Perlu akses email

#### B. Create User dengan Password Terus
```bash
1. Pergi ke Supabase Dashboard → Authentication → Users
2. Klik "Add User" (bukan Invite)
3. Masukkan:
   - Email: admin@nbdac.gov.my
   - Password: [set password terus]
   - Confirm Email: ✅ (tick ini untuk skip email)
4. User metadata (optional):
   - name: "Administrator NBDAC"
   - role: "admin"
5. Klik "Create User"
6. Akaun sedia untuk login terus!
```

### **Kaedah 2: Admin Setup Page (DEVELOPMENT ONLY - KESELAMATAN DIPERTINGKATKAN)**

⚠️ **NOTA KESELAMATAN PENTING:** Kaedah ini automatik DIMATIKAN dalam produksi untuk keselamatan.

**Persekitaran Development sahaja:**
```bash
1. Buka browser dan pergi ke aplikasi anda (localhost)
2. Dalam console browser, type: window.goToAdminSetup()
3. Atau navigate manual ke /admin-setup
4. Isi borang dengan keperluan keselamatan yang dipertingkatkan:
   - Email: admin@nbdac.gov.my
   - Password: [minimum 12 karakter dengan huruf besar, kecil, nombor, simbol]
   - Setup Key: nbdac-admin-setup-2025
5. Klik "Cipta Admin"
6. Akaun dicipta terus!
```

**Ciri Keselamatan Produksi:**
- ✅ **Auto-disabled** apabila deploy ke domain produksi
- ✅ **Environment detection** halang akses tanpa kebenaran
- ✅ **Password requirements** yang lebih ketat (12+ karakter)
- ✅ **Domain restrictions** untuk email admin
- ✅ **Master setup key** untuk perlindungan tambahan

**Status dalam Produksi:**
```
🔒 "Setup Tidak Tersedia"
   Setup admin dihadkan untuk keselamatan sistem
   
   Kaedah alternatif:
   • Gunakan Supabase Dashboard → Authentication → Users
   • Hubungi pentadbir sistem untuk setup akaun
```

### **Kaedah 3: Console Browser (Untuk Developer)**

```javascript
// Buka console browser (F12) di mana-mana page aplikasi
window.createAdmin("admin@nbdac.gov.my", "your-password", "Administrator");
```

## 🔧 Setup Key untuk Keselamatan

Setup key berubah setiap tahun untuk keselamatan:
- **2025:** `nbdac-admin-setup-2025`
- **2026:** `nbdac-admin-setup-2026`

Anda boleh tukar ini di environment variable `ADMIN_SETUP_KEY`

## 📋 Penyelesaian Masalah

### **❓ "Saya hantar invite tapi tak dapat email"**

**Penyelesaian:**
1. Semak spam/junk folder
2. Pastikan email address betul di Supabase
3. Cuba kaedah "Add User" instead of "Invite User"
4. Guna Admin Setup Page (Kaedah 2)

### **❓ "Setup key tidak sah"**

**Penyelesaian:**
1. Guna setup key semasa: `nbdac-admin-setup-2025`
2. Atau set environment variable `ADMIN_SETUP_KEY`
3. Restart server jika tukar environment variable

### **❓ "Gagal mencipta admin"**

**Penyelesaian:**
1. Pastikan Supabase credentials betul di `/utils/supabase/info.tsx`
2. Semak console browser untuk error
3. Pastikan server functions running
4. Cuba kaedah Supabase Dashboard terus

## 🎉 Selepas Cipta Admin

1. **Test Login:**
   ```bash
   - Pergi ke /admin-login
   - Email: admin@nbdac.gov.my  
   - Password: [password yang di-set]
   ```

2. **Verify Access:**
   ```bash
   - Login berjaya → redirect ke Portal Dalaman
   - Boleh lihat senarai submissions
   - Boleh tukar status submissions
   ```

## 🔐 Best Practices Keselamatan

### **Password Requirements:**
- Minimum 8 karakter
- Campuran huruf besar, kecil, nombor
- Jangan guna password senang diteka

### **Email Security:**
- Guna email domain rasmi (@nbdac.gov.my)
- Jangan share credentials
- Tukar password secara berkala

### **Production Security:**
- Tukar setup key annually
- Monitor login attempts
- Enable 2FA jika available

## 📞 Sokongan Teknikal

**Masalah umum dan penyelesaian:**

| Masalah | Penyelesaian |
|---------|-------------|
| Tak dapat email invite | Guna "Add User" atau Admin Setup Page |
| Setup key error | Guna `nbdac-admin-setup-2025` |
| Login gagal | Semak email/password, check console |
| Server error | Pastikan Supabase config betul |

**Console Commands untuk debugging:**
```javascript
// Semak current auth status
console.log('Auth:', window.getAuthStatus?.());

// Cipta admin terus
window.createAdmin("email", "password", "name");

// Pergi ke setup page  
window.goToAdminSetup();
```

---

**✅ RECOMMENDATION UNTUK PRODUKSI:**
- **Development:** Kaedah 2 (Admin Setup Page) - mudah dan selamat dalam localhost
- **Production:** Kaedah 1B (Supabase Dashboard "Add User") - paling selamat untuk produksi 🔒

**🔐 KESELAMATAN PRODUKSI:**
Sistem automatik matikan admin setup page dalam produksi. Gunakan Supabase Dashboard sahaja untuk keselamatan optimum!