"use client";

import { createRoot } from "react-dom/client";
import { useEffect, useRef, useState } from "react";
import Map from "ol/Map";
import View from "ol/View";
import TileLayer from "ol/layer/Tile";
import OSM from "ol/source/OSM";
import { fromLonLat } from "ol/proj";
import { boundingExtent } from "ol/extent";
import VectorLayer from "ol/layer/Vector";
import VectorSource from "ol/source/Vector";
import Feature from "ol/Feature";
import Point from "ol/geom/Point";
import { Icon, Style } from "ol/style";
import "ol/ol.css";
import {
  Sidebar,
  Card,
  Pagination,
  SpinnerLoading,
  AutoComplete,
  Popup,
  ResultCard,
} from "@/components";
import { fetchSchoolStats } from "@/services/schoolStatsService";
import {
  School,
  SchoolStatsResponse,
  Occupation,
} from "@/interfaces/schoolStats";
import { getGeocoding } from "@/utils/geocoding";
import { MARKER_ICON_URL } from "@/constants/images";
import Overlay from "ol/Overlay";

const ITEMS_PER_PAGE = 5;

export default function PetaPage() {
  const mapRef = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<Map | null>(null);
  const [schoolStats, setSchoolStats] = useState<School[]>([]);
  const [selectedOccupation, setSelectedOccupation] =
    useState<Occupation | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [loadingLocation, setLoadingLocation] = useState<boolean>(false);
  const [analysisResult, setAnalysisResult] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  useEffect(() => {
    if (!mapRef.current) return;

    const minahasa = fromLonLat([124.8244, 1.4588]);

    const minBound = fromLonLat([122.932839, 0.226033]);
    const maxBound = fromLonLat([127.797571, 4.834726]);
    const extent = boundingExtent([minBound, maxBound]);

    const initialMap = new Map({
      target: mapRef.current,
      layers: [
        new TileLayer({
          source: new OSM(),
        }),
      ],
      view: new View({
        center: minahasa,
        zoom: 10,
        minZoom: 7,
        maxZoom: 18,
        extent: extent,
      }),
    });

    setMap(initialMap);

    return () => initialMap.setTarget(undefined);
  }, []);

  const handleSelectOccupation = async (occupation: Occupation) => {
    setSelectedOccupation(occupation);
    setLoading(true);
    setError(null);
    setSchoolStats([]);
    setCurrentPage(1);

    try {
      const data: SchoolStatsResponse = await fetchSchoolStats(occupation.code);
      if (data && Array.isArray(data.schools)) {
        setSchoolStats(data.schools);
      } else {
        setError("Format data tidak valid dari API.");
      }
    } catch (err: unknown) {
      console.error("Error mengambil statistik sekolah:", err);
      if (err instanceof Error) {
        setError(err.message || "Gagal mengambil statistik sekolah.");
      } else {
        setError("Gagal mengambil statistik sekolah.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSelectSchool = async (school: School) => {
    setLoadingLocation(true);

    try {
      const address = `${school.name}, ${school.address}, ${school.city}`;
      const location = await getGeocoding(address);

      if (location) {
        addMarkerToMap(location.lat, location.lon, school);
      } else {
        setError("Lokasi tidak valid atau tidak ditemukan.");
      }
    } catch (err: unknown) {
      console.error("Error mencari lokasi sekolah:", err);
      if (err instanceof Error) {
        setError(err.message || "Gagal mencari lokasi sekolah.");
      } else {
        setError("Gagal mencari lokasi sekolah.");
      }
    } finally {
      setLoadingLocation(false);
    }
  };

  const handleAnalyze = async (school: School) => {
    setIsAnalyzing(true);
    setAnalysisResult(""); // Kosongkan hasil analisis sebelumnya
    
    try {
      const response = await fetch('/api/v1/gemini', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ schoolData: school }),
      });
  
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
  
      const result = await response.json();
      if (result.candidates && result.candidates[0]?.content?.parts[0]?.text) {
        setAnalysisResult(result.candidates[0].content.parts[0].text);
      } else {
        throw new Error('Unexpected response structure from Gemini API');
      }
    } catch (error) {
      console.error('Error analyzing school data:', error);
      setAnalysisResult('Gagal menganalisis data sekolah. Silakan coba lagi.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleAskQuestion = async (question: string) => {
    try {
      const response = await fetch("/api/v1/gemini", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ question }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      if (result.candidates && result.candidates[0]?.content?.parts[0]?.text) {
        return result.candidates[0].content.parts[0].text;
      } else {
        throw new Error("Unexpected response structure from Gemini API");
      }
    } catch (error) {
      console.error("Error asking question:", error);
      return "Maaf, terjadi kesalahan saat memproses pertanyaan Anda.";
    }
  };

  const addMarkerToMap = (lat: number, lon: number, school: School) => {
    if (!map) return;

    // Remove existing markers and overlays
    const layers = map.getLayers().getArray();
    const vectorLayer = layers.find((layer) => layer instanceof VectorLayer) as
      | VectorLayer<VectorSource>
      | undefined;
    if (vectorLayer) {
      map.removeLayer(vectorLayer);
    }
    map.getOverlays().clear();

    const marker = new Feature({
      geometry: new Point(fromLonLat([lon, lat])),
    });

    const markerStyle = new Style({
      image: new Icon({
        anchor: [0.5, 1],
        src: MARKER_ICON_URL,
        scale: 0.1,
      }),
    });

    marker.setStyle(markerStyle);

    const vectorSource = new VectorSource({
      features: [marker],
    });

    const newVectorLayer = new VectorLayer({
      source: vectorSource,
    });

    map.addLayer(newVectorLayer);
    map.getView().setCenter(fromLonLat([lon, lat]));
    map.getView().setZoom(15);

    // Create popup overlay
    const popupElement = document.createElement("div");
    const popup = new Overlay({
      element: popupElement,
      positioning: "bottom-center",
      stopEvent: false,
      offset: [0, -20],
    });
    map.addOverlay(popup);

    // Show popup on click
    map.on("click", (evt) => {
      const feature = map.forEachFeatureAtPixel(
        evt.pixel,
        (feature) => feature
      );
      if (feature === marker) {
        popup.setPosition(evt.coordinate);
        const root = createRoot(popupElement);
        root.render(
          <Popup
            school={school}
            onClose={() => popup.setPosition(undefined)}
            onAnalyze={() => handleAnalyze(school)}
          />
        );
      } else {
        popup.setPosition(undefined);
      }
    });
  };

  const renderSchoolCard = (school: School, index: number) => (
    <Card
      key={index}
      className="w-full cursor-pointer"
      onClick={() => handleSelectSchool(school)}
    >
      <h3 className="font-semibold text-lg mb-2">{school.name}</h3>
      <p className="text-sm">
        <strong>Kota:</strong> {school.city}
      </p>
      <p className="text-sm">
        <strong>Alamat:</strong> {school.address}
      </p>
      {/* {school.description && (
        <p className="text-sm">
          <strong>Deskripsi:</strong> {school.description}
        </p>
      )} */}
      <p className="text-sm">
        <strong>Jumlah Siswa:</strong> {school.studentCount}
      </p>
      <p className="text-sm">
        <strong>Jumlah Lulusan:</strong> {school.graduateCount}
      </p>
      <p className="text-sm">
        <strong>Link Eksternal:</strong>
      </p>
      <ul className="list-disc list-inside mb-2">
        {school.externalLinks.map((link, idx) =>
          link ? (
            <li key={idx}>
              <a
                href={link}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 dark:text-blue-400 hover:underline"
              >
                {link}
              </a>
            </li>
          ) : (
            <li key={idx} className="text-gray-500">
              Tidak ada link
            </li>
          )
        )}
      </ul>
      {/* <p className="text-sm">
        <strong>Kompetensi yang Sesuai:</strong> {school.matchingCompetencies}
      </p>
      <p className="text-sm">
        <strong>Total Kompetensi:</strong> {school.totalCompetencies}
      </p> */}
      <p className="text-sm">
        <strong>Persentase:</strong> {school.percentage}%
      </p>
    </Card>
  );

  const getTotalPages = () => Math.ceil(schoolStats.length / ITEMS_PER_PAGE);

  const getCurrentPageSchools = () => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    return schoolStats.slice(startIndex, endIndex);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <div className="w-full h-screen relative">
      <div ref={mapRef} className="w-full h-full" />
      <Sidebar className="z-40">
        <div className="space-y-4 pt-14">
          {" "}
          {/* Tambahkan padding-top di sini */}
          <AutoComplete onSelect={handleSelectOccupation} />
          {loading && <p className="text-blue-500">Memuat...</p>}
          {error && <p className="text-red-500">Error: {error}</p>}
          {selectedOccupation && (
            <div>
              <h2 className="text-lg font-semibold">
                Okupasi Terpilih: {selectedOccupation.code} -{" "}
                {selectedOccupation.name}
              </h2>
            </div>
          )}
          {!loading && !error && schoolStats.length > 0 && (
            <div className="space-y-4">
              {getCurrentPageSchools().map((school, index) =>
                renderSchoolCard(school, index)
              )}
            </div>
          )}
          {!loading &&
            !error &&
            schoolStats.length === 0 &&
            selectedOccupation && (
              <p className="text-gray-500 dark:text-gray-400">
                Tidak ada sekolah yang ditemukan untuk okupasi ini.
              </p>
            )}
          {schoolStats.length > ITEMS_PER_PAGE && (
            <Pagination
              currentPage={currentPage}
              totalPages={getTotalPages()}
              onPageChange={handlePageChange}
            />
          )}
        </div>
      </Sidebar>

      {loadingLocation && (
        <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center bg-black bg-opacity-50 z-50">
          <SpinnerLoading />
        </div>
      )}
      {(isAnalyzing || analysisResult !== null) && (
        <ResultCard
          initialResult={analysisResult || ""}
          isLoading={isAnalyzing}
          onClose={() => {
            setAnalysisResult(null);
            setIsAnalyzing(false);
          }}
          onAskQuestion={handleAskQuestion}
        />
      )}
    </div>
  );
}
