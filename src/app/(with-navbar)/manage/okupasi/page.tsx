// src/app/(with-navbar/manage/okupasi/page.tsx)
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
  DynamicInput,
  Notification
} from "@/components";
import {
  getOccupations,
  createOccupation,
  getOccupation,
  updateOccupation,
  deleteOccupation,
} from "@/services/occupationService";
import {
  Occupation,
  CreateOccupationData,
  UpdateOccupationData,
  CompetencyInput,
} from "@/interfaces/occupation";
import { Column } from "@/interfaces/componentsInterface";
import { useRouter } from "next/navigation";

const OccupationPage: FC = () => {
  const [occupations, setOccupations] = useState<Occupation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [newCompetencies, setNewCompetencies] = useState<CompetencyInput[]>([]);
  const [selectedOccupation, setSelectedOccupation] = useState<Occupation | null>(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [notification, setNotification] = useState<{ type: 'success' | 'error', message: string } | null>(null);

  const router = useRouter();

  const itemsPerPage = 10;

  const fetchOccupations = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await getOccupations({ page: 1, limit: 1000 });
      setOccupations(response.occupations);
    } catch (err) {
      console.error("Error fetching occupations:", err);
      setError("Failed to fetch occupations. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleAddOccupation = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const filteredCompetencies = filterEmptyCompetencies(newCompetencies);

    const newOccupationData: CreateOccupationData = {
      code: formData.get("code") as string,
      name: formData.get("name") as string,
      competencies: filteredCompetencies,
    };

    try {
      await createOccupation(newOccupationData);
      setIsModalOpen(false);
      setNewCompetencies([]);
      fetchOccupations();
      setNotification({ type: 'success', message: `Okupasi "${newOccupationData.name}" berhasil ditambahkan` });
    } catch (err) {
      console.error("Failed to create occupation:", err);
      setNotification({ type: 'error', message: "Gagal menambahkan okupasi. Silakan coba lagi." });
    }
  };

  const handleViewOccupation = async (id: string) => {
    try {
      const occupation = await getOccupation(id);
      console.log("Fetched occupation:", occupation);
      setSelectedOccupation(occupation);
      setIsViewModalOpen(true);
    } catch (err) {
      console.error("Error fetching occupation details:", err);
      setError("Failed to fetch occupation details. Please try again.");
    }
  };

  const handleEditOccupation = async (id: string) => {
    try {
      const occupation = await getOccupation(id);
      setSelectedOccupation(occupation);
      setIsEditModalOpen(true);
    } catch (err) {
      console.error("Error fetching occupation for edit:", err);
      setError("Failed to fetch occupation for edit. Please try again.");
    }
  };

  const handleUpdateOccupation = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!selectedOccupation) {
      console.error("No occupation selected for update");
      setNotification({ type: 'error', message: "Tidak ada okupasi yang dipilih untuk diperbarui" });
      return;
    }

    const formData = new FormData(e.currentTarget);
    const updatedData: UpdateOccupationData = {
      code: formData.get("code") as string,
      name: formData.get("name") as string,
      competencies: [],
    };

    try {
      console.log("Updating occupation with ID:", selectedOccupation.id);
      if (!selectedOccupation.id) {
        throw new Error("Invalid occupation ID");
      }
      await updateOccupation(selectedOccupation.id, updatedData);
      setIsEditModalOpen(false);
      fetchOccupations();
      setNotification({ type: 'success', message: `Okupasi "${updatedData.name}" berhasil diperbarui` });
    } catch (err) {
      console.error("Failed to update occupation:", err);
      setNotification({ type: 'error', message: "Gagal memperbarui okupasi. Silakan coba lagi." });
    }
  };

  const handleDeleteOccupation = async (id: string) => {
    setSelectedOccupation(occupations.find((occ) => occ.id === id) || null);
    setIsDeleteModalOpen(true);
  };

  const confirmDeleteOccupation = async () => {
    if (!selectedOccupation) return;

    try {
      await deleteOccupation(selectedOccupation.id);
      setIsDeleteModalOpen(false);
      fetchOccupations();
      setNotification({ type: 'success', message: `Okupasi "${selectedOccupation.name}" berhasil dihapus` });
    } catch (err) {
      console.error("Failed to delete occupation:", err);
      setNotification({ type: 'error', message: "Gagal menghapus okupasi. Silakan coba lagi." });
    }
  };

  useEffect(() => {
    fetchOccupations();
  }, [fetchOccupations]);

  const filteredOccupations = useMemo(() => {
    return occupations.filter(
      (occupation) =>
        occupation.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        occupation.code.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [occupations, searchQuery]);

  const totalPages = Math.ceil(filteredOccupations.length / itemsPerPage);

  const paginatedOccupations = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredOccupations
      .slice(startIndex, startIndex + itemsPerPage)
      .map((item, index) => ({
        ...item,
        rowNumber: startIndex + index + 1,
      }));
  }, [filteredOccupations, currentPage]);

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

  const columns: Column<Occupation & { rowNumber: number }>[] = [
    {
      header: "NO",
      accessor: "rowNumber",
    },
    { header: "Kode", accessor: "code" },
    { header: "Nama", accessor: "name" },
    {
      header: "Aksi",
      accessor: "id",
      cell: (value: string) => (
        <div className="flex space-x-2">
          <Button size="small" onClick={() => handleViewOccupation(value)}>
            View
          </Button>
          <Button
            size="small"
            variant="secondary"
            onClick={() => handleEditOccupation(value)}
          >
            Edit
          </Button>
          <Button
            size="small"
            variant="outline"
            onClick={() => handleDeleteOccupation(value)}
          >
            Delete
          </Button>
          <Button
            size="small"
            onClick={() => router.push(`/manage/okupasi/${value}/kompetensi`)}
          >
            Unit Kompetensi
          </Button>
        </div>
      ),
    },
  ];
  
  const filterEmptyCompetencies = (competencies: CompetencyInput[]): CompetencyInput[] => {
    return competencies.filter(
      (comp) =>
        comp.unitCode.trim() !== "" ||
        comp.name.trim() !== "" ||
        (comp.standardCompetency && comp.standardCompetency.trim() !== "")
    );
  };

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
      <h1 className="text-2xl font-bold mb-4">Daftar Okupasi</h1>
      <div className="mb-4 flex justify-between items-center">
        <SearchBarNoButton
          onSearch={handleSearch}
          placeholder="Cari okupasi..."
          initialValue={searchQuery}
        />
        <Button onClick={() => setIsModalOpen(true)}>Tambah Okupasi</Button>
      </div>
      {paginatedOccupations.length > 0 ? (
        <Table data={paginatedOccupations} columns={columns} />
      ) : (
        <div className="text-center py-4">Tidak ada data okupasi</div>
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

      <Modal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setNewCompetencies([]);
        }}
        title="Tambah Okupasi Baru"
      >
        <form onSubmit={handleAddOccupation} className="space-y-4">
          <TextInput
            label="Kode Okupasi"
            name="code"
            placeholder="Masukkan kode okupasi"
            required
          />
          <TextInput
            label="Nama Okupasi"
            name="name"
            placeholder="Masukkan nama okupasi"
            required
          />
          <DynamicInput<CompetencyInput>
            label="Kompetensi"
            values={newCompetencies}
            onChange={setNewCompetencies}
            fields={[
              {
                name: "unitCode",
                label: "Unit Code",
                placeholder: "Masukkan unit code",
              },
              {
                name: "name",
                label: "Nama Kompetensi",
                placeholder: "Masukkan nama kompetensi",
              },
              {
                name: "standardCompetency",
                label: "Kompetensi Standar",
                placeholder: "Masukkan kompetensi standar",
              },
            ]}
            addButtonText="Tambah Kompetensi Baru"
            removeButtonText="Hapus"
          />
          <div className="flex justify-end space-x-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setIsModalOpen(false);
                setNewCompetencies([]);
              }}
            >
              Batal
            </Button>
            <Button type="submit">Simpan</Button>
          </div>
        </form>
      </Modal>

      <Modal
        isOpen={isViewModalOpen}
        onClose={() => setIsViewModalOpen(false)}
        title="Detail Okupasi"
      >
        {selectedOccupation && (
          <div>
            <p>
              <strong>Kode:</strong> {selectedOccupation.code}
            </p>
            <p>
              <strong>Nama:</strong> {selectedOccupation.name}
            </p>
            <div className="mt-4">
              <h3 className="font-semibold">Unit Kompetensi:</h3>
              {selectedOccupation.competencies &&
              selectedOccupation.competencies.length > 0 ? (
                <ul className="list-disc list-inside">
                  {selectedOccupation.competencies.map((comp) => (
                    <li key={comp.id}>
                      {comp.unitCode}: {comp.name}
                    </li>
                  ))}
                </ul>
              ) : (
                <p>Tidak ada unit kompetensi</p>
              )}
            </div>
          </div>
        )}
      </Modal>

      <Modal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        title="Edit Okupasi"
      >
        {selectedOccupation && (
          <form onSubmit={handleUpdateOccupation} className="space-y-4">
            <TextInput
              label="Kode Okupasi"
              name="code"
              defaultValue={selectedOccupation.code}
              required
            />
            <TextInput
              label="Nama Okupasi"
              name="name"
              defaultValue={selectedOccupation.name}
              required
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

      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        title="Konfirmasi Hapus"
      >
        <p>Apakah Anda yakin ingin menghapus okupasi ini?</p>
        <div className="flex justify-end space-x-2 mt-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => setIsDeleteModalOpen(false)}
          >
            Batal
          </Button>
          <Button
            type="button"
            variant="danger"
            onClick={confirmDeleteOccupation}
          >
            Hapus
          </Button>
        </div>
      </Modal>
    </div>
  );
};

export default OccupationPage;