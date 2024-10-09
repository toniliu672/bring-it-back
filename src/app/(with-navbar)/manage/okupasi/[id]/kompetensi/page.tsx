"use client";

import { FC, useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Table, Button, Modal, TextInput, SpinnerLoading } from "@/components";
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
  const [selectedCompetency, setSelectedCompetency] =
    useState<OccupationCompetency | null>(null);
  const [isEditMode, setIsEditMode] = useState(false);

  useEffect(() => {
    if (id) {
      fetchOccupationData();
    }
  }, [id]);

  const fetchOccupationData = async () => {
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
  };

  const columns: Column<OccupationCompetency & { index: number }>[] = [
    {
      header: "No",
      accessor: "index",
      cell: (value: number) => value + 1,
    },
    { header: "Unit Code", accessor: "unitCode" },
    { header: "Nama", accessor: "name" },
    { header: "Kompetensi Standar", accessor: "standardCompetency" },
    {
      header: "Aksi",
      accessor: "id",
      cell: (value: string) => (
        <div className="flex space-x-2">
          <Button size="small" onClick={() => handleEditCompetency(value)}>
            Edit
          </Button>
          <Button
            size="small"
            variant="danger"
            onClick={() => handleDeleteCompetency(value)}
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
      } catch (err) {
        console.error("Error deleting competency:", err);
        setError("Failed to delete competency. Please try again.");
      }
    }
  };

  const handleSubmitCompetency = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const competencyData = {
      unitCode: formData.get("unitCode") as string,
      name: formData.get("name") as string,
      standardCompetency: formData.get("standardCompetency") as string,
    };

    try {
      if (isEditMode && selectedCompetency) {
        await updateCompetency(
          occupation!.id,
          selectedCompetency.id,
          competencyData
        );
      } else {
        await createCompetency(occupation!.id, competencyData);
      }
      setIsModalOpen(false);
      fetchOccupationData();
    } catch (err) {
      console.error("Error submitting competency:", err);
      setError("Failed to submit competency. Please try again.");
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
      <Button className="my-5 bg-slate-500 hover:bg-slate-700" onClick={handleBack}>Kembali</Button>
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">
          Kompetensi untuk Okupasi: {occupation?.name}
        </h1>
      </div>
      <Button onClick={handleAddCompetency} className="mb-4">
        Tambah Kompetensi
      </Button>

      <Table
        data={competencies.map((comp, index) => ({ ...comp, index }))}
        columns={columns}
      />

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
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsModalOpen(false)}
            >
              Batal
            </Button>
            <Button type="submit">
              {isEditMode ? "Simpan Perubahan" : "Tambah"}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default OccupationCompetenciesPage;
