# Dokumentasi API

## Autentikasi

### Login Pengguna

- **URL**: `/api/auth/login`
- **Metode**: `POST`
- **Deskripsi**: Endpoint untuk login pengguna

#### Contoh Input
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

#### Contoh Respons Berhasil
```json
{
  "success": true,
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": "1",
      "username": "johndoe",
      "email": "user@example.com",
      "role": "USER"
    }
  }
}
```

#### Contoh Respons Gagal
```json
{
  "success": false,
  "error": "Email atau password salah"
}
```

### Registrasi Pengguna

- **URL**: `/api/auth/register`
- **Metode**: `POST`
- **Deskripsi**: Endpoint untuk registrasi pengguna baru

#### Contoh Input
```json
{
  "username": "johndoe",
  "email": "johndoe@example.com",
  "password": "securepassword123",
  "role": "USER"
}
```

#### Contoh Respons Berhasil
```json
{
  "success": true,
  "data": {
    "id": "2",
    "username": "johndoe",
    "email": "johndoe@example.com",
    "role": "USER"
  }
}
```

#### Contoh Respons Gagal
```json
{
  "success": false,
  "error": "Email sudah terdaftar"
}
```

## Pengguna (Users)

### Daftar Pengguna

- **URL**: `/api/v1/users`
- **Metode**: `GET`
- **Deskripsi**: Mengambil daftar semua pengguna (hanya admin)

#### Contoh Respons Berhasil
```json
{
  "success": true,
  "data": [
    {
      "id": "1",
      "username": "admin",
      "email": "admin@example.com",
      "role": "ADMIN"
    },
    {
      "id": "2",
      "username": "johndoe",
      "email": "johndoe@example.com",
      "role": "USER"
    }
  ]
}
```

#### Contoh Respons Gagal
```json
{
  "success": false,
  "error": "Unauthorized access"
}
```

### Membuat Pengguna Baru

- **URL**: `/api/v1/users`
- **Metode**: `POST`
- **Deskripsi**: Membuat pengguna baru (hanya admin)

#### Contoh Input
```json
{
  "username": "newuser",
  "email": "newuser@example.com",
  "password": "newuserpassword",
  "role": "USER"
}
```

#### Contoh Respons Berhasil
```json
{
  "success": true,
  "data": {
    "id": "3",
    "username": "newuser",
    "email": "newuser@example.com",
    "role": "USER"
  }
}
```

#### Contoh Respons Gagal
```json
{
  "success": false,
  "error": "Email sudah digunakan"
}
```

## Sekolah (Schools)

### Daftar Sekolah

- **URL**: `/api/v1/schools`
- **Metode**: `GET`
- **Deskripsi**: Mengambil daftar sekolah dengan paginasi dan filter
- **Query Params**: 
  - `page`: nomor halaman (default: 1)
  - `limit`: jumlah item per halaman (default: 10)
  - `search`: kata kunci pencarian
  - `city`: filter berdasarkan kota
  - `sortBy`: field untuk pengurutan (default: name)
  - `sortOrder`: urutan ascending atau descending (default: asc)

#### Contoh Respons Berhasil
```json
{
  "success": true,
  "data": {
    "schools": [
      {
        "id": "1",
        "name": "SMK Negeri 1 Manado",
        "city": "Manado",
        "address": "Jl. Contoh No. 123",
        "studentCount": 1000,
        "graduateCount": 250
      },
      {
        "id": "2",
        "name": "SMK Swasta ABC",
        "city": "Tomohon",
        "address": "Jl. Lainnya No. 456",
        "studentCount": 800,
        "graduateCount": 200
      }
    ],
    "meta": {
      "currentPage": 1,
      "totalPages": 5,
      "totalCount": 50,
      "limit": 10
    }
  }
}
```

#### Contoh Respons Gagal
```json
{
  "success": false,
  "error": "Terjadi kesalahan saat mengambil data sekolah"
}
```

### Membuat Sekolah Baru

- **URL**: `/api/v1/schools`
- **Metode**: `POST`
- **Deskripsi**: Membuat sekolah baru

#### Contoh Input
```json
{
  "name": "SMK Baru",
  "city": "Bitung",
  "address": "Jl. Pendidikan No. 789",
  "description": "Sekolah menengah kejuruan baru di Bitung",
  "studentCount": 500,
  "graduateCount": 0,
  "externalLinks": ["https://smkbaru.sch.id"],
  "competencies": [
    { "id": "comp1" },
    { "id": "comp2" }
  ],
  "concentrations": [
    { "id": "conc1" }
  ]
}
```

#### Contoh Respons Berhasil
```json
{
  "success": true,
  "data": {
    "id": "3",
    "name": "SMK Baru",
    "city": "Bitung",
    "address": "Jl. Pendidikan No. 789",
    "description": "Sekolah menengah kejuruan baru di Bitung",
    "studentCount": 500,
    "graduateCount": 0,
    "externalLinks": ["https://smkbaru.sch.id"],
    "competencies": [
      { "id": "comp1", "name": "Kompetensi 1" },
      { "id": "comp2", "name": "Kompetensi 2" }
    ],
    "concentrations": [
      { "id": "conc1", "name": "Konsentrasi 1" }
    ]
  }
}
```

#### Contoh Respons Gagal
```json
{
  "success": false,
  "error": "Nama sekolah sudah digunakan"
}
```

## Okupasi (Occupations)

### Daftar Okupasi

- **URL**: `/api/v1/occupations`
- **Metode**: `GET`
- **Deskripsi**: Mengambil daftar okupasi dengan paginasi dan filter
- **Query Params**: 
  - `page`: nomor halaman (default: 1)
  - `limit`: jumlah item per halaman (default: 10)
  - `searchCode`: pencarian berdasarkan kode okupasi
  - `searchName`: pencarian berdasarkan nama okupasi
  - `sortBy`: field untuk pengurutan (default: code)
  - `sortOrder`: urutan ascending atau descending (default: asc)

#### Contoh Respons Berhasil
```json
{
  "success": true,
  "data": {
    "occupations": [
      {
        "id": "1",
        "code": "OCC001",
        "name": "Teknisi Komputer"
      },
      {
        "id": "2",
        "code": "OCC002",
        "name": "Desainer Grafis"
      }
    ],
    "meta": {
      "currentPage": 1,
      "totalPages": 3,
      "totalCount": 25,
      "limit": 10
    }
  }
}
```

#### Contoh Respons Gagal
```json
{
  "success": false,
  "error": "Terjadi kesalahan saat mengambil data okupasi"
}
```

### Membuat Okupasi Baru

- **URL**: `/api/v1/occupations`
- **Metode**: `POST`
- **Deskripsi**: Membuat okupasi baru

#### Contoh Input
```json
{
  "code": "OCC003",
  "name": "Programmer Web",
  "competencies": [
    {
      "unitCode": "COMP001",
      "name": "Pemrograman Frontend",
      "standardCompetency": "Mampu membuat antarmuka web yang responsif"
    },
    {
      "unitCode": "COMP002",
      "name": "Pemrograman Backend",
      "standardCompetency": "Mampu mengembangkan API RESTful"
    }
  ]
}
```

#### Contoh Respons Berhasil
```json
{
  "success": true,
  "data": {
    "id": "3",
    "code": "OCC003",
    "name": "Programmer Web",
    "competencies": [
      {
        "id": "comp1",
        "unitCode": "COMP001",
        "name": "Pemrograman Frontend",
        "standardCompetency": "Mampu membuat antarmuka web yang responsif"
      },
      {
        "id": "comp2",
        "unitCode": "COMP002",
        "name": "Pemrograman Backend",
        "standardCompetency": "Mampu mengembangkan API RESTful"
      }
    ]
  }
}
```

#### Contoh Respons Gagal
```json
{
  "success": false,
  "error": "Kode okupasi sudah digunakan"
}
```

Dokumentasi ini mencakup beberapa endpoint utama dari API Anda. Untuk endpoint lainnya, Anda dapat mengikuti pola yang sama, menyertakan URL, metode, deskripsi, contoh input (jika ada), dan contoh respons berhasil dan gagal. Ini akan memberikan gambaran yang jelas kepada pengembang tentang cara menggunakan API Anda.