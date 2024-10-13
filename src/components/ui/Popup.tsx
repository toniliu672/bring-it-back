import { useTheme } from "next-themes";
import { School } from "@/interfaces/schoolStats";
import { Button } from "..";

interface PopupProps {
  school: School;
  onClose: () => void;
  onAnalyze: (school: School) => Promise<void>;
}

const Popup: React.FC<PopupProps> = ({ school, onClose, onAnalyze }) => {
  const { theme } = useTheme();

  const handleAnalyzeClick = () => {
    onAnalyze(school);
  };

  return (
    <div
      className={`${
        theme === "dark" ? "bg-gray-800 text-white" : "bg-white text-gray-900"
      } 
      rounded-lg shadow-lg p-4 max-w-sm w-full max-h-[80vh] overflow-y-auto`}
    >
      <button
        onClick={onClose}
        className={`float-right ${
          theme === "dark"
            ? "text-gray-400 hover:text-gray-200"
            : "text-gray-500 hover:text-gray-700"
        }`}
      >
        ✕
      </button>
      <h3 className="font-semibold text-lg mb-2">{school.name}</h3>
      <p className="text-sm mb-1">
        <strong>Kota:</strong> {school.city}
      </p>
      <p className="text-sm mb-1">
        <strong>Alamat:</strong> {school.address}
      </p>
      <p className="text-sm mb-1">
        <strong>Jumlah Siswa:</strong> {school.studentCount}
      </p>
      <p className="text-sm mb-1">
        <strong>Jumlah Lulusan:</strong> {school.graduateCount}
      </p>
      <p className="text-sm mb-1">
        <strong>Kompetensi sesuai Okupasi:</strong> {school.matchingCompetencies}
      </p>

      <p className="text-sm mb-1">
        <strong>List Kompetensi:</strong>
      </p>
      <ul className="list-disc list-inside ml-4">
        {school.competencies.map((competency, index) => (
          <li key={index} className="text-sm">
            <strong>{competency.competency.name}</strong> -{" "}
            {competency.competency.unitCode || "No Unit Code"}
          </li>
        ))}
      </ul>

      <div className="mt-2">
        <strong className="text-sm">Persentase Kecocokan:</strong>
        <div
          className={`w-full ${
            theme === "dark" ? "bg-gray-700" : "bg-gray-200"
          } rounded-full h-2.5 mt-1`}
        >
          <div
            className="bg-blue-600 h-2.5 rounded-full"
            style={{ width: `${school.percentage}%` }}
          ></div>
        </div>
        <p className="text-sm text-right mt-1">{school.percentage}%</p>
      </div>
      {school.description && (
        <p className="text-sm mt-2">
          <strong>Deskripsi:</strong> {school.description}
        </p>
      )}
      <div className="mt-2">
        <strong className="text-sm">Link Eksternal:</strong>
        <ul className="list-disc list-inside mt-1">
          {school.externalLinks.map((link, idx) => (
            <li key={idx} className="text-sm">
              {link ? (
                <a
                  href={link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`${
                    theme === "dark"
                      ? "text-blue-400 hover:text-blue-300"
                      : "text-blue-600 hover:text-blue-800"
                  } hover:underline`}
                >
                  {link}
                </a>
              ) : (
                <span
                  className={
                    theme === "dark" ? "text-gray-400" : "text-gray-500"
                  }
                >
                  Tidak ada link
                </span>
              )}
            </li>
          ))}
        </ul>
        <Button onClick={handleAnalyzeClick}>Analisis</Button>
      </div>
    </div>
  );
};

export default Popup;
