"use client";

import { FC, useState, useEffect, useMemo } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  Button,
  Modal,
  SpinnerLoading,
  SearchBarNoButton,
  Pagination,
  Notification,
  Select,
} from "@/components";
import {
  getSchool,
  getSchoolCompetencies,
  addSchoolCompetency,
  removeSchoolCompetency,
} from "@/services/schoolService";
import { getOccupations } from "@/services/occupationService";
import { School, GraduateCompetency } from "@/interfaces/school";
import { Occupation } from "@/interfaces/occupation";

const SchoolCompetenciesPage: FC = () => {
  const { id } = useParams();
  const router = useRouter();
  const [school, setSchool] = useState<School | null>(null);
  const [occupations, setOccupations] = useState<Occupation[]>([]);
  const [schoolCompetencies, setSchoolCompetencies] = useState<GraduateCompetency[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isCompetencyModalOpen, setIsCompetencyModalOpen] = useState(false);
  const [selectedOccupation, setSelectedOccupation] = useState<string>("");
  const [selectedCompetency, setSelectedCompetency] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [notification, setNotification] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  const itemsPerPage = 10;

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const [schoolData, occupationsData, schoolCompetenciesData] = await Promise.all([
          getSchool(id as string),
          getOccupations({}),
          getSchoolCompetencies(id as string),
        ]);
        setSchool(schoolData);
        setOccupations(occupationsData.occupations);
        setSchoolCompetencies(schoolCompetenciesData);
      } catch (err) {
        setError("Gagal mengambil data. Silakan coba lagi nanti.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const handleAddCompetency = async () => {
    try {
      if (schoolCompetencies.some(comp => comp.competencyId === selectedCompetency)) {
        setNotification({
          type: "error",
          message: "Kompetensi ini sudah ada dalam daftar sekolah.",
        });
        return;
      }

      await addSchoolCompetency(id as string, selectedCompetency);
      setIsCompetencyModalOpen(false);
      const updatedCompetencies = await getSchoolCompetencies(id as string);
      setSchoolCompetencies(updatedCompetencies);
      setNotification({
        type: "success",
        message: "Kompetensi berhasil ditambahkan",
      });
      setSelectedOccupation("");
      setSelectedCompetency("");
    } catch (err) {
      setNotification({
        type: "error",
        message: "Gagal menambahkan kompetensi. Silakan coba lagi.",
      });
    }
  };

  const handleRemoveCompetency = async (competencyId: string) => {
    try {
      await removeSchoolCompetency(id as string, competencyId);
      const updatedCompetencies = await getSchoolCompetencies(id as string);
      setSchoolCompetencies(updatedCompetencies);
      setNotification({
        type: "success",
        message: "Kompetensi berhasil dihapus",
      });
    } catch (err) {
      setNotification({
        type: "error",
        message: "Gagal menghapus kompetensi. Silakan coba lagi.",
      });
    }
  };

  const filteredCompetencies = useMemo(() => {
    return schoolCompetencies.filter(
      (comp) =>
        comp.competency.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (comp.competency.unitCode?.toLowerCase().includes(searchQuery.toLowerCase()) ?? false)
    );
  }, [schoolCompetencies, searchQuery]);

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

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setCurrentPage(1);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const availableCompetencies = useMemo(() => {
    const selectedOcc = occupations.find(occ => occ.id === selectedOccupation);
    if (!selectedOcc || !selectedOcc.competencies) return [];
    return selectedOcc.competencies.filter(
      comp => !schoolCompetencies.some(schoolComp => schoolComp.competencyId === comp.id)
    );
  }, [occupations, selectedOccupation, schoolCompetencies]);

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
      <Button
        className="my-5 bg-slate-500 hover:bg-slate-700"
        onClick={() => router.push("/manage/sekolah")}
      >
        Kembali
      </Button>
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">
          Unit Kompetensi untuk Sekolah: {school?.name}
        </h1>
        <Button onClick={() => setIsCompetencyModalOpen(true)}>
          Tambah Unit Kompetensi
        </Button>
      </div>
      <div className="mb-4">
        <SearchBarNoButton
          onSearch={handleSearch}
          placeholder="Cari unit kompetensi..."
          initialValue={searchQuery}
        />
      </div>
      {paginatedCompetencies.length > 0 ? (
        <div className="space-y-4">
          {paginatedCompetencies.map((comp, index) => (
            <div
              key={comp.competencyId}
              className="border p-4 rounded-lg shadow"
            >
              <div className="flex justify-between items-center">
                <div>
                  <span className="font-bold mr-2">{index + 1}.</span>
                  <span className="mr-2">{comp.competency?.unitCode}</span>
                  <span className="font-semibold">{comp.competency?.name}</span>
                </div>
                <Button
                  size="small"
                  variant="danger"
                  onClick={() => handleRemoveCompetency(comp.competencyId)}
                >
                  Hapus
                </Button>
              </div>
              <div className="mt-2 text-sm text-gray-600">
                Okupasi:{" "}
                {
                  occupations.find(
                    (occ) => occ.id === comp.competency.occupationId
                  )?.name
                }
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-4">Tidak ada data unit kompetensi</div>
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
        isOpen={isCompetencyModalOpen}
        onClose={() => {
          setIsCompetencyModalOpen(false);
          setSelectedOccupation("");
          setSelectedCompetency("");
        }}
        title="Tambah Unit Kompetensi"
      >
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleAddCompetency();
          }}
          className="space-y-4"
        >
          <Select
            label="Pilih Okupasi"
            options={occupations.map((occ) => ({
              value: occ.id,
              label: occ.name,
            }))}
            value={selectedOccupation}
            onChange={(e) => {
              setSelectedOccupation(e.target.value);
              setSelectedCompetency("");
            }}
          />
          {selectedOccupation && (
            <Select
              label="Pilih Unit Kompetensi"
              options={availableCompetencies.map((comp) => ({
                value: comp.id,
                label: `${comp.unitCode} - ${comp.name}`,
              }))}
              value={selectedCompetency}
              onChange={(e) => setSelectedCompetency(e.target.value)}
            />
          )}
          <div className="flex justify-end space-x-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setIsCompetencyModalOpen(false);
                setSelectedOccupation("");
                setSelectedCompetency("");
              }}
            >
              Batal
            </Button>
            <Button type="submit" disabled={!selectedCompetency}>
              Tambah
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default SchoolCompetenciesPage;