"use client";

import { FC, useState, useEffect, useMemo } from "react";
import {
  Table,
  Button,
  SearchBarNoButton,
  Pagination,
  Modal,
  TextInput,
  SearchableMultiSelect,
  SpinnerLoading,
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
} from "@/interfaces/occupation";
import { Option, Column } from "@/interfaces/componentsInterface";
import { useRouter } from "next/navigation";

const OccupationPage: FC = () => {
  const [occupations, setOccupations] = useState<Occupation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCompetencies, setSelectedCompetencies] = useState<string[]>(
    []
  );
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [competencyOptions, setCompetencyOptions] = useState<Option[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedOccupation, setSelectedOccupation] =
    useState<Occupation | null>(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const router = useRouter();

  const addRowNumbers = (
    data: Occupation[],
    page: number,
    limit: number
  ): (Occupation & { rowNumber: number })[] => {
    return data.map((item, index) => ({
      ...item,
      rowNumber: (page - 1) * limit + index + 1,
    }));
  };

  const fetchOccupations = async (page: number) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await getOccupations({ page, limit: 10 });
      console.log("Fetched occupations:", response);
      const processedOccupations = addRowNumbers(
        response.occupations,
        page,
        10
      );
      setOccupations(processedOccupations);
      setCurrentPage(response.meta.currentPage);
      setTotalPages(response.meta.totalPages);
    } catch (err) {
      console.error("Error fetching occupations:", err);
      setError("Failed to fetch occupations. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  const fetchCompetencies = async () => {
    // Implement this function in occupationService if available
    // For now, we'll use an empty array
    setCompetencyOptions([]);
  };

  const handleViewOccupation = async (id: string) => {
    try {
      const occupation = await getOccupation(id);
      console.log("Fetched occupation:", occupation); // Tambahkan log ini
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

  const handleUpdateOccupation = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();
    if (!selectedOccupation) {
      console.error("No occupation selected for update");
      setError("No occupation selected for update");
      return;
    }

    const formData = new FormData(e.currentTarget);
    const updatedData: UpdateOccupationData = {
      code: formData.get("code") as string,
      name: formData.get("name") as string,
      competencies: [], // Tambahkan ini jika diperlukan
    };

    try {
      console.log("Updating occupation with ID:", selectedOccupation.id);
      if (!selectedOccupation.id) {
        throw new Error("Invalid occupation ID");
      }
      const result = await updateOccupation(selectedOccupation.id, updatedData);
      console.log("Update result:", result);
      setIsEditModalOpen(false);
      fetchOccupations(currentPage);
    } catch (err) {
      console.error("Failed to update occupation:", err);
      setError("Failed to update occupation. Please try again.");
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
      fetchOccupations(currentPage);
    } catch (err) {
      console.error("Failed to delete occupation:", err);
      setError("Failed to delete occupation. Please try again.");
    }
  };

  useEffect(() => {
    fetchOccupations(currentPage);
    fetchCompetencies();
  }, [currentPage]);

  const filteredAndNumberedOccupations = useMemo(() => {
    const filtered = occupations.filter(
      (occupation) =>
        occupation.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        occupation.code.toLowerCase().includes(searchQuery.toLowerCase())
    );
    return filtered.map((item, index) => ({
      ...item,
      rowNumber: index + 1,
    }));
  }, [occupations, searchQuery]);

  const columns: Column<
    Occupation & { rowNumber: number; displayNumber: number }
  >[] = [
    {
      header: "NO",
      accessor: "rowNumber",
    },
    { header: "Kode", accessor: "code" },
    { header: "Nama", accessor: "name" },
    {
      header: "Aksi",
      accessor: "id",
      cell: (value: string, row: Occupation) => (
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

  const handleAddOccupation = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const newOccupationData: CreateOccupationData = {
      code: formData.get("code") as string,
      name: formData.get("name") as string,
      competencies: selectedCompetencies.map((value) => {
        const option = competencyOptions.find((opt) => opt.value === value);
        return {
          name: option ? option.label : "",
          unitCode: value,
        };
      }),
    };

    try {
      await createOccupation(newOccupationData);
      setIsModalOpen(false);
      setSelectedCompetencies([]);
      fetchOccupations(currentPage); // Refresh the list
    } catch (err) {
      console.error("Failed to create occupation:", err);
      setError("Failed to create occupation. Please try again.");
    }
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setCurrentPage(1);
  };

  if (isLoading) {
    return <SpinnerLoading />;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Daftar Okupasi</h1>
      <div className="mb-4 flex justify-between items-center">
        <SearchBarNoButton
          onSearch={handleSearch}
          placeholder="Cari okupasi..."
          initialValue={searchQuery}
        />
        <Button onClick={() => setIsModalOpen(true)}>Tambah Okupasi</Button>
      </div>
      {isLoading ? (
        <SpinnerLoading />
      ) : filteredAndNumberedOccupations.length > 0 ? (
        <Table data={filteredAndNumberedOccupations} columns={columns} />
      ) : (
        <div className="text-center py-4">Tidak ada data okupasi</div>
      )}
      {totalPages > 1 && (
        <div className="mt-4">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={(page) => {
              setCurrentPage(page);
              fetchOccupations(page);
            }}
          />
        </div>
      )}

      <Modal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedCompetencies([]);
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
          <SearchableMultiSelect
            options={competencyOptions}
            selectedValues={selectedCompetencies}
            onChange={setSelectedCompetencies}
            placeholder="Pilih kompetensi"
            label="Kompetensi"
          />
          <div className="flex justify-end space-x-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setIsModalOpen(false);
                setSelectedCompetencies([]);
              }}
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

      {/* Edit Modal */}
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
            {/* Tambahkan field lain sesuai kebutuhan */}
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

      {/* Delete Confirmation Modal */}
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
