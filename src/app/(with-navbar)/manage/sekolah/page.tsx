"use client";

import { FC, useState, useEffect, useMemo, useCallback } from "react";
import {
  Table,
  Button,
  SearchBarNoButton,
  Pagination,
  Modal,
  TextInput,
  SpinnerLoading,
  Notification,
} from "@/components";
import {
  getSchools,
  createSchool,
  getSchool,
  updateSchool,
  deleteSchool,
  getSchoolCompetencies,
} from "@/services/schoolService";
import {
  School,
  CreateSchoolData,
  UpdateSchoolData,
} from "@/interfaces/school";
import { Column } from "@/interfaces/componentsInterface";
import { useRouter } from "next/navigation";

const SchoolPage: FC = () => {
  const [schools, setSchools] = useState<School[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSchool, setSelectedSchool] = useState<School | null>(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [notification, setNotification] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  const router = useRouter();

  const itemsPerPage = 10;

  const fetchSchools = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await getSchools({ page: 1, limit: 1000 });
      setSchools(response.schools);
    } catch (err) {
      console.error("Error fetching schools:", err);
      setError("Gagal mengambil data sekolah. Silakan coba lagi nanti.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleAddSchool = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const newSchoolData: CreateSchoolData = {
      name: formData.get("name") as string,
      city: formData.get("city") as string,
      address: formData.get("address") as string,
      description: formData.get("description") as string,
      studentCount: parseInt(formData.get("studentCount") as string),
      graduateCount: parseInt(formData.get("graduateCount") as string),
      externalLinks: (formData.get("externalLinks") as string)
        .split(",")
        .map((link) => link.trim()),
    };

    try {
      await createSchool(newSchoolData);
      setIsModalOpen(false);
      fetchSchools();
      setNotification({
        type: "success",
        message: `Sekolah "${newSchoolData.name}" berhasil ditambahkan`,
      });
    } catch (err) {
      console.error("Failed to create school:", err);
      setNotification({
        type: "error",
        message: "Gagal menambahkan sekolah. Silakan coba lagi.",
      });
    }
  };

  const handleViewSchool = async (id: string) => {
    try {
      const school = await getSchool(id);
      const competencies = await getSchoolCompetencies(id);
      setSelectedSchool({ ...school, competencies });
      setIsViewModalOpen(true);
    } catch (err) {
      console.error("Error fetching school details:", err);
      setError("Gagal mengambil detail sekolah. Silakan coba lagi.");
    }
  };

  const handleEditSchool = async (id: string) => {
    try {
      const school = await getSchool(id);
      setSelectedSchool(school);
      setIsEditModalOpen(true);
    } catch (err) {
      console.error("Error fetching school for edit:", err);
      setError("Gagal mengambil data sekolah untuk diedit. Silakan coba lagi.");
    }
  };

  const handleUpdateSchool = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!selectedSchool) {
      console.error("No school selected for update");
      setNotification({
        type: "error",
        message: "Tidak ada sekolah yang dipilih untuk diperbarui",
      });
      return;
    }

    const formData = new FormData(e.currentTarget);
    const updatedData: UpdateSchoolData = {
      name: formData.get("name") as string,
      city: formData.get("city") as string,
      address: formData.get("address") as string,
      description: formData.get("description") as string,
      studentCount: parseInt(formData.get("studentCount") as string),
      graduateCount: parseInt(formData.get("graduateCount") as string),
      externalLinks: (formData.get("externalLinks") as string)
        .split(",")
        .map((link) => link.trim()),
    };

    try {
      await updateSchool(selectedSchool.id, updatedData);
      setIsEditModalOpen(false);
      fetchSchools();
      setNotification({
        type: "success",
        message: `Sekolah "${updatedData.name}" berhasil diperbarui`,
      });
    } catch (err) {
      console.error("Failed to update school:", err);
      setNotification({
        type: "error",
        message: "Gagal memperbarui sekolah. Silakan coba lagi.",
      });
    }
  };

  const handleDeleteSchool = async (id: string) => {
    setSelectedSchool(schools.find((school) => school.id === id) || null);
    setIsDeleteModalOpen(true);
  };

  const confirmDeleteSchool = async () => {
    if (!selectedSchool) return;

    try {
      await deleteSchool(selectedSchool.id);
      setIsDeleteModalOpen(false);
      fetchSchools();
      setNotification({
        type: "success",
        message: `Sekolah "${selectedSchool.name}" berhasil dihapus`,
      });
    } catch (err) {
      console.error("Failed to delete school:", err);
      setNotification({
        type: "error",
        message: "Gagal menghapus sekolah. Silakan coba lagi.",
      });
    }
  };

  useEffect(() => {
    fetchSchools();
  }, [fetchSchools]);

  const filteredSchools = useMemo(() => {
    return schools.filter(
      (school) =>
        school.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        school.city.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [schools, searchQuery]);

  const totalPages = Math.ceil(filteredSchools.length / itemsPerPage);

  const paginatedSchools = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredSchools
      .slice(startIndex, startIndex + itemsPerPage)
      .map((item, index) => ({
        ...item,
        rowNumber: startIndex + index + 1,
      }));
  }, [filteredSchools, currentPage]);

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(1);
    }
  }, [currentPage, totalPages]);

  const handleSearch = useCallback((query: string) => {
    setSearchQuery(query);
    setCurrentPage(1);
  }, []);

  const handlePageChange = useCallback((page: number) => {
    setCurrentPage(page);
  }, []);

  const columns: Column<School & { rowNumber: number }>[] = [
    {
      header: "NO",
      accessor: "rowNumber",
    },
    { header: "Nama", accessor: "name" },
    { header: "Kota", accessor: "city" },
    {
      header: "Aksi",
      accessor: "id",
      cell: (value: string) => (
        <div className="flex space-x-2">
          <Button size="small" onClick={() => handleViewSchool(value)}>
            Lihat
          </Button>
          <Button
            size="small"
            variant="secondary"
            onClick={() => handleEditSchool(value)}
          >
            Edit
          </Button>
          <Button
            size="small"
            variant="outline"
            onClick={() => handleDeleteSchool(value)}
          >
            Hapus
          </Button>
          <Button
            size="small"
            onClick={() =>
              router.push(`/manage/sekolah/${value}/unit-kompetensi`)
            }
          >
            Unit Kompetensi
          </Button>
        </div>
      ),
    },
  ];
  

  if (isLoading) {
    return <SpinnerLoading />;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="container mx-auto p-4 min-h-full">
      {notification && (
        <Notification
          type={notification.type}
          message={notification.message}
          onClose={() => setNotification(null)}
        />
      )}
      <h1 className="text-2xl font-bold mb-4">Daftar Sekolah</h1>
      <div className="mb-4 flex justify-between items-center">
        <SearchBarNoButton
          onSearch={handleSearch}
          placeholder="Cari sekolah..."
          initialValue={searchQuery}
        />
        <Button onClick={() => setIsModalOpen(true)}>Tambah Sekolah</Button>
      </div>
      {paginatedSchools.length > 0 ? (
        <Table data={paginatedSchools} columns={columns} />
      ) : (
        <div className="text-center py-4">Tidak ada data sekolah</div>
      )}
      {totalPages > 1 && (
        <div className="mt-4">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        </div>
      )}

      {/* Add modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Tambah Sekolah Baru"
      >
        <form onSubmit={handleAddSchool} className="space-y-4">
          <TextInput
            label="Nama Sekolah"
            name="name"
            placeholder="Masukkan nama sekolah"
            required
          />
          <TextInput
            label="Kota"
            name="city"
            placeholder="Masukkan kota"
            required
          />
          <TextInput
            label="Alamat"
            name="address"
            placeholder="Masukkan alamat"
            required
          />
          <TextInput
            label="Deskripsi"
            name="description"
            placeholder="Masukkan deskripsi"
          />
          <TextInput
            label="Jumlah Siswa"
            name="studentCount"
            type="number"
            placeholder="Masukkan jumlah siswa"
            required
          />
          <TextInput
            label="Jumlah Lulusan"
            name="graduateCount"
            type="number"
            placeholder="Masukkan jumlah lulusan"
            required
          />
          <TextInput
            label="Link Eksternal"
            name="externalLinks"
            placeholder="Masukkan link eksternal (pisahkan dengan koma)"
          />
          <div className="flex justify-end space-x-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsModalOpen(false)}
            >
              Batal
            </Button>
            <Button type="submit">Simpan</Button>
          </div>
        </form>
      </Modal>

      {/* View Modal */}
      <Modal
        isOpen={isViewModalOpen}
        onClose={() => setIsViewModalOpen(false)}
        title="Detail Sekolah"
      >
        {selectedSchool && (
          <div className="space-y-4">
            <p>
              <strong>Nama:</strong> {selectedSchool.name}
            </p>
            <p>
              <strong>Kota:</strong> {selectedSchool.city}
            </p>
            <p>
              <strong>Alamat:</strong> {selectedSchool.address}
            </p>
            <p>
              <strong>Deskripsi:</strong> {selectedSchool.description}
            </p>
            <p>
              <strong>Jumlah Siswa:</strong> {selectedSchool.studentCount}
            </p>
            <p>
              <strong>Jumlah Lulusan:</strong> {selectedSchool.graduateCount}
            </p>
            <p>
              <strong>Link Eksternal:</strong>
            </p>
            <ul className="list-disc list-inside">
              {selectedSchool.externalLinks.map((link, index) => (
                <li key={index}>
                  <a
                    href={link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline"
                  >
                    {link}
                  </a>
                </li>
              ))}
            </ul>
            <p>
              <strong>Kompetensi:</strong>
            </p>
            {selectedSchool.competencies &&
            selectedSchool.competencies.length > 0 ? (
              <ul className="list-disc list-inside">
                {selectedSchool.competencies.map((comp, index) => (
                  <li key={index}>
                    {comp.competency.unitCode} - {comp.competency.name}
                  </li>
                ))}
              </ul>
            ) : (
              <p>Tidak ada data kompetensi</p>
            )}
          </div>
        )}
      </Modal>

      {/* Edit Modal */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        title="Edit Sekolah"
      >
        {selectedSchool && (
          <form onSubmit={handleUpdateSchool} className="space-y-4">
            <TextInput
              label="Nama Sekolah"
              name="name"
              defaultValue={selectedSchool.name}
              required
            />
            <TextInput
              label="Kota"
              name="city"
              defaultValue={selectedSchool.city}
              required
            />
            <TextInput
              label="Alamat"
              name="address"
              defaultValue={selectedSchool.address}
              required
            />
            <TextInput
              label="Deskripsi"
              name="description"
              defaultValue={selectedSchool.description}
            />
            <TextInput
              label="Jumlah Siswa"
              name="studentCount"
              type="number"
              defaultValue={selectedSchool.studentCount.toString()}
              required
            />
            <TextInput
              label="Jumlah Lulusan"
              name="graduateCount"
              type="number"
              defaultValue={selectedSchool.graduateCount.toString()}
              required
            />
            <TextInput
              label="Link Eksternal"
              name="externalLinks"
              defaultValue={selectedSchool.externalLinks.join(", ")}
            />
            <div className="flex justify-end space-x-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsEditModalOpen(false)}
              >
                Batal
              </Button>
              <Button type="submit">Simpan Perubahan</Button>
            </div>
          </form>
        )}
      </Modal>

      {/* Delete Modal */}
      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        title="Konfirmasi Hapus"
      >
        <p>Apakah Anda yakin ingin menghapus sekolah ini?</p>
        <div className="flex justify-end space-x-2 mt-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => setIsDeleteModalOpen(false)}
          >
            Batal
          </Button>
          <Button type="button" variant="danger" onClick={confirmDeleteSchool}>
            Hapus
          </Button>
        </div>
      </Modal>
    </div>
  );
};

export default SchoolPage;
