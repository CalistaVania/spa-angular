import { CommonModule } from '@angular/common'; // Mengimpor modul Angular yang menyediakan direktif umum seperti ngIf, ngFor, dll.
import { Component, OnInit, inject } from '@angular/core'; // Mengimpor decorator Component, interface OnInit untuk inisialisasi, dan inject untuk injeksi dependency.
import { HttpClient } from '@angular/common/http'; // Mengimpor HttpClient untuk melakukan HTTP request ke server.
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms'; // Mengimpor modul dan class untuk membuat formulir reaktif.
import * as bootstrap from 'bootstrap'; // Mengimpor Bootstrap untuk manipulasi modal dan elemen lainnya.

@Component({
  selector: 'app-mahasiswa',  // Nama selector untuk komponen ini. Komponen akan digunakan di template dengan tag <app-mahasiswa></app-mahasiswa>
  standalone: true,  // Menyatakan bahwa komponen ini adalah komponen standalone dan tidak membutuhkan module tambahan
  imports: [CommonModule, ReactiveFormsModule],  // Mengimpor CommonModule untuk memungkinkan penggunaan direktif Angular standar seperti *ngIf dan *ngFor di template
  templateUrl: './mahasiswa.component.html',  // Path ke file template HTML untuk komponen ini
  styleUrl: './mahasiswa.component.css'  // Path ke file CSS untuk komponen ini
})
export class MahasiswaComponent implements OnInit {  // Deklarasi komponen dengan mengimplementasikan lifecycle hook OnInit
  mahasiswa: any[] = [];  // Mendeklarasikan properti mahasiswa yang akan menyimpan data yang diterima dari API
  prodi: any[] = []; // Menyimpan data program studi.
  fakultas: any[] = []; // Menyimpan data fakultas untuk dropdown.
  apiMahasiswaUrl = 'https://crud-express-seven.vercel.app/api/mahasiswa';
  apiProdiUrl = 'https://crud-express-seven.vercel.app/api/prodi'; // URL API untuk mengambil dan menambahkan data prodi.
  apiFakultasUrl = 'https://crud-express-seven.vercel.app/api/fakultas'; // URL API untuk mengambil data fakultas.
  isLoading = true; // Indikator loading data dari API.
  MahasiswaForm: FormGroup; // Form group untuk formulir reaktif prodi.
  isSubmitting = false; // Indikator proses pengiriman data.
  
  private http = inject(HttpClient); // Menggunakan Angular inject API untuk menyuntikkan HttpClient.
  private fb = inject(FormBuilder); // Menyuntikkan FormBuilder untuk membangun form reaktif.

  constructor() { // Konstruktor untuk inisialisasi komponen.
    this.MahasiswaForm = this.fb.group({ // Membuat grup form dengan FormBuilder.
      npm: [''], 
      nama: [''], // Field nama prodi.
      prodi: [''],
      jenis_kelamin: [''],
      asal_sekolah: [''],
      foto: [''],
      fakultas: [null] // Field fakultas_id untuk relasi dengan fakultas.
    });
  }

  ngOnInit(): void { // Lifecycle method Angular, dipanggil saat komponen diinisialisasi.
    this.getProdi(); // Memanggil fungsi untuk mengambil data prodi.
    this.getFakultas(); // Memanggil fungsi untuk mengambil data fakultas.
    this.getMahasiswa(); 
  }

  // Mengambil data mahasiswa
  getMahasiswa(): void {
    this.http.get<any[]>(this.apiMahasiswaUrl).subscribe({ // Melakukan HTTP GET ke API prodi.
      next: (data) => { // Callback jika request berhasil.
        this.mahasiswa = data; // Menyimpan data prodi ke variabel.
        this.isLoading = false; // Menonaktifkan indikator loading.
      },
      error: (err) => { // Callback jika request gagal.
        console.error('Error fetching prodi data:', err); // Log error ke konsol.
        this.isLoading = false; // Menonaktifkan indikator loading.
      },
    });
  }

  // Mengambil data fakultas untuk dropdown
  getFakultas(): void {
    this.http.get<any[]>(this.apiFakultasUrl).subscribe({ // Melakukan HTTP GET ke API fakultas.
      next: (data) => { // Callback jika request berhasil.
        this.fakultas = data; // Menyimpan data fakultas ke variabel.
      },
      error: (err) => { // Callback jika request gagal.
        console.error('Error fetching fakultas data:', err); // Log error ke konsol.
      },
    });
  }

  // Mengambil data prodi untuk dropdown
  getProdi(): void {
    this.http.get<any[]>(this.apiFakultasUrl).subscribe({ // Melakukan HTTP GET ke API fakultas.
      next: (data) => { // Callback jika request berhasil.
        this.prodi = data; // Menyimpan data fakultas ke variabel.
      },
      error: (err) => { // Callback jika request gagal.
        console.error('Error fetching prodi data:', err); // Log error ke konsol.
      },
    });
  }

  // Method untuk menambahkan mahasiswa
  addMahasiswa(): void {
    if (this.MahasiswaForm.valid) { // Memastikan form valid sebelum mengirim data.
      this.isSubmitting = true; // Mengaktifkan indikator pengiriman data.
      this.http.post(this.apiMahasiswaUrl, this.MahasiswaForm.value).subscribe({ // Melakukan HTTP POST ke API prodi.
        next: (response) => { // Callback jika request berhasil.
          console.log('Mahasiswa berhasil ditambahkan:', response); // Log respons ke konsol.
          this.getMahasiswa(); // Refresh data prodi setelah penambahan.
          this.MahasiswaForm.reset(); // Reset form setelah data dikirim.
          this.isSubmitting = false; // Menonaktifkan indikator pengiriman.

          // Tutup modal setelah data berhasil ditambahkan
          const modalElement = document.getElementById('tambahMahasiswaModal') as HTMLElement; // Ambil elemen modal berdasarkan ID.
          if (modalElement) { // Periksa jika elemen modal ada.
            const modalInstance = bootstrap.Modal.getInstance(modalElement) || new bootstrap.Modal(modalElement); // Ambil atau buat instance modal.
            modalInstance.hide(); // Sembunyikan modal.

            // Pastikan untuk menghapus atribut dan gaya pada body setelah modal ditutup
            modalElement.addEventListener('hidden.bs.modal', () => { // Tambahkan event listener untuk modal yang ditutup.
              const backdrop = document.querySelector('.modal-backdrop'); // Cari elemen backdrop modal.
              if (backdrop) { 
                backdrop.remove(); // Hapus backdrop jika ada.
              }

              // Pulihkan scroll pada body
              document.body.classList.remove('modal-open'); // Hapus class 'modal-open' dari body.
              document.body.style.overflow = ''; // Pulihkan properti overflow pada body.
              document.body.style.paddingRight = ''; // Pulihkan padding body.
            }, { once: true }); // Event listener hanya dijalankan sekali.
          }
        },
        error: (err) => { // Callback jika request gagal.
          console.error('Error menambahkan prodi:', err); // Log error ke konsol.
          this.isSubmitting = false; // Menonaktifkan indikator pengiriman.
        },
      });
    }
  }
}
