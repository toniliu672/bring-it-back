// src/app/(with-navbar/manage/okupasi/[id]/kompetensi/page.tsx)
"use client";

import { FC, useState, useEffect, useMemo, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import { Table, Button, Modal, TextInput, SpinnerLoading, SearchBarNoButton, Pagination, Notification } from "@/components";
import { getOccupation } from "@/services/occupationService";
import {
  getCompetencies,
  createCompetency,
  updateCompetency,
  deleteCompetency,
} from "@/services/competencyService";
import { Occupation, OccupationCompetency } from "@/interfaces/occupation";
import { Column } from "@/interfaces/componentsInterface";

const OccupationCompetenciesPage: FC = () => {
  const { id } = useParams();
  const router = useRouter();
  const [occupation, setOccupation] = useState<Occupation | null>(null);
  const [competencies, setCompetencies] = useState<OccupationCompetency[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCompetency, setSelectedCompetency] = useState<OccupationCompetency | null>(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [notification, setNotification] = useState<{ type: 'success' | 'error', message: string } | null>(null);

  const itemsPerPage = 10;

  const fetchOccupationData = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const occupationData = await getOccupation(id as string);
      setOccupation(occupationData);
      const competenciesData = await getCompetencies(id as string);
      setCompetencies(competenciesData);
    } catch (err) {
      console.error("Error fetching occupation data:", err);
      setError("Failed to fetch occupation data. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  }, [id]);

  useEffect(() => {
    if (id) {
      fetchOccupationData();
    }
  }, [id, fetchOccupationData]);

  const filteredCompetencies = useMemo(() => {
    return competencies.filter(
      (competency) =>
        competency.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (competency.unitCode && competency.unitCode.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (competency.standardCompetency && competency.standardCompetency.toLowerCase().includes(searchQuery.toLowerCase()))
    );
  }, [competencies, searchQuery]);

  const totalPages = Math.ceil(filteredCompetencies.length / itemsPerPage);

  const paginatedCompetencies = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredCompetencies
      .slice(startIndex, startIndex + itemsPerPage)
      .map((item, index) => ({
        ...item,
        index: startIndex + index,
      }));
  }, [filteredCompetencies, currentPage]);

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

  const columns: Column<OccupationCompetency & { index: number }, keyof (OccupationCompetency & { index: number })>[] = [
    {
      header: "No",
      accessor: "index",
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      cell: (value, _row, _index) => (value as number) + 1,
    },
    { header: "Unit Code", accessor: "unitCode" },
    { header: "Nama", accessor: "name" },
    { header: "Kompetensi Standar", accessor: "standardCompetency" },
    {
      header: "Aksi",
      accessor: "id",
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      cell: (value, _row, _index) => (
        <div className="flex space-x-2">
          <Button size="small" onClick={() => handleEditCompetency(value as string)}>
            Edit
          </Button>
          <Button
            size="small"
            variant="danger"
            onClick={() => handleDeleteCompetency(value as string)}
          >
            Hapus
          </Button>
        </div>
      ),
    },
  ];

  const handleAddCompetency = () => {
    setSelectedCompetency(null);
    setIsEditMode(false);
    setIsModalOpen(true);
  };

  const handleEditCompetency = (id: string) => {
    const competency = competencies.find((comp) => comp.id === id);
    if (competency) {
      setSelectedCompetency(competency);
      setIsEditMode(true);
      setIsModalOpen(true);
    }
  };

  const handleDeleteCompetency = async (competencyId: string) => {
    if (window.confirm("Apakah Anda yakin ingin menghapus kompetensi ini?")) {
      try {
        await deleteCompetency(occupation!.id, competencyId);
        fetchOccupationData();
        setNotification({ type: 'success', message: 'Kompetensi berhasil dihapus' });
      } catch (err) {
        console.error("Error deleting competency:", err);
        setNotification({ type: 'error', message: 'Gagal menghapus kompetensi. Silakan coba lagi.' });
      }
    }
  };

  const handleSubmitCompetency = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const competencyData = {
      unitCode: formData.get("unitCode") as string,
      name: formData.get("name") as string,
      standardCompetency: formData.get("standardCompetency") as string,
    };

    try {
      if (isEditMode && selectedCompetency) {
        await updateCompetency(occupation!.id, selectedCompetency.id, competencyData);
        setNotification({ type: 'success', message: `Kompetensi "${competencyData.name}" berhasil diperbarui` });
      } else {
        await createCompetency(occupation!.id, competencyData);
        setNotification({ type: 'success', message: `Kompetensi "${competencyData.name}" berhasil ditambahkan` });
      }
      setIsModalOpen(false);
      fetchOccupationData();
    } catch (err) {
      console.error("Error submitting competency:", err);
      setNotification({ type: 'error', message: 'Gagal menyimpan kompetensi. Silakan coba lagi.' });
    }
  };

  const handleBack = () => {
    router.push("/manage/okupasi");
  };

  if (isLoading) {
    return <SpinnerLoading />;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="container mx-auto p-4">
      {notification && (
        <Notification
          type={notification.type}
          message={notification.message}
          onClose={() => setNotification(null)}
        />
      )}
      <Button className="my-5 bg-slate-500 hover:bg-slate-700" onClick={handleBack}>
        Kembali
      </Button>
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Kompetensi untuk Okupasi: {occupation?.name}</h1>
      </div>
      <div className="mb-4 flex justify-between items-center">
        <SearchBarNoButton
          onSearch={handleSearch}
          placeholder="Cari kompetensi..."
          initialValue={searchQuery}
        />
        <Button onClick={handleAddCompetency}>Tambah Kompetensi</Button>
      </div>

      {paginatedCompetencies.length > 0 ? (
        <Table data={paginatedCompetencies} columns={columns} />
      ) : (
        <div className="text-center py-4">Tidak ada data kompetensi</div>
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
        onClose={() => setIsModalOpen(false)}
        title={isEditMode ? "Edit Kompetensi" : "Tambah Kompetensi Baru"}
      >
        <form onSubmit={handleSubmitCompetency} className="space-y-4">
          <TextInput
            label="Unit Code"
            name="unitCode"
            defaultValue={selectedCompetency?.unitCode || ""}
            required
          />
          <TextInput
            label="Nama Kompetensi"
            name="name"
            defaultValue={selectedCompetency?.name || ""}
            required
          />
          <TextInput
            label="Kompetensi Standar"
            name="standardCompetency"
            defaultValue={selectedCompetency?.standardCompetency || ""}
          />
          <div className="flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>
              Batal
            </Button>
            <Button type="submit">{isEditMode ? "Simpan Perubahan" : "Tambah"}</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default OccupationCompetenciesPage;