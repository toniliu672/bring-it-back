import React, { useState, useEffect, ChangeEvent, KeyboardEvent } from "react";
import { useTheme } from "next-themes";
import { Button, Card, SpinnerLoading, TextInput } from "..";

interface ResultCardProps {
  initialResult: string;
  isLoading: boolean;
  onClose: () => void;
  onAskQuestion: (question: string) => Promise<string>;
}

const ResultCard: React.FC<ResultCardProps> = ({
  initialResult,
  isLoading: externalLoading,
  onClose,
  onAskQuestion,
}) => {
  const { theme } = useTheme();
  const [chat, setChat] = useState<{ role: string; content: string }[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(externalLoading);

  useEffect(() => {
    if (initialResult && !externalLoading) {
      setChat([{ role: "assistant", content: initialResult }]);
    }
  }, [initialResult, externalLoading]);

  useEffect(() => {
    setIsLoading(externalLoading);
  }, [externalLoading]);

  const handleSendMessage = async () => {
    if (input.trim() === "" || chat.length >= 10 || isLoading) return;

    setIsLoading(true);
    setChat((prev) => [...prev, { role: "user", content: input }]);
    setInput("");

    try {
      const response = await onAskQuestion(input);
      setChat((prev) => [...prev, { role: "assistant", content: response }]);
    } catch {
      setChat((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "Maaf, terjadi kesalahan saat memproses pertanyaan Anda.",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) =>
    setInput(e.target.value);

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <Card
      className={`fixed bottom-4 left-4 w-96 max-h-[80vh] overflow-y-auto z-50 p-4 ${
        theme === "dark"
          ? "bg-gray-800 text-white"
          : "bg-gray-100 text-gray-900"
      } border ${theme === "dark" ? "border-gray-700" : "border-gray-300"}`}
    >
      <Button
        className={`absolute top-2 right-2 ${
          theme === "dark"
            ? "text-gray-300 hover:text-white"
            : "text-gray-600 hover:text-gray-900"
        }`}
        size="small"
        variant="secondary"
        onClick={onClose}
      >
        ✕
      </Button>
      <h4 className="font-bold text-lg mb-4">Analisis Sekolah</h4>
      <div className="space-y-4 mb-4 max-h-[50vh] overflow-y-auto">
        {isLoading && chat.length === 0 ? (
          <div className="flex justify-center items-center p-4">
            <SpinnerLoading />
            <span className="ml-2">Menganalisis data sekolah...</span>
          </div>
        ) : (
          chat.map((message, index) => (
            <div
              key={index}
              className={`p-3 rounded-lg ${
                message.role === "assistant"
                  ? theme === "dark"
                    ? "bg-blue-800 text-white"
                    : "bg-blue-100 text-blue-900"
                  : theme === "dark"
                  ? "bg-gray-700 text-white"
                  : "bg-white text-gray-900"
              } shadow-sm`}
            >
              <p className="text-sm">{message.content}</p>
            </div>
          ))
        )}
      </div>
      {chat.length < 10 && (
        <div className="flex space-x-2">
          <TextInput
            label=""
            value={input}
            onChange={handleInputChange}
            placeholder="Tanyakan sesuatu..."
            onKeyDown={handleKeyDown}
            disabled={isLoading}
            className={`${
              theme === "dark"
                ? "bg-gray-700 text-white"
                : "bg-white text-gray-900"
            } border ${
              theme === "dark" ? "border-gray-600" : "border-gray-300"
            }`}
          />
          <Button
            onClick={handleSendMessage}
            disabled={isLoading || input.trim() === ""}
            className={`${
              theme === "dark"
                ? "bg-blue-600 hover:bg-blue-700 text-white"
                : "bg-blue-500 hover:bg-blue-600 text-white"
            } transition-colors duration-200`}
          >
            {isLoading ? <SpinnerLoading size="small" /> : "Kirim"}
          </Button>
        </div>
      )}
      {chat.length >= 10 && (
        <p
          className={`text-sm ${
            theme === "dark" ? "text-gray-400" : "text-gray-600"
          }`}
        >
          Batas maksimum chat tercapai.
        </p>
      )}
    </Card>
  );
};

export default ResultCard;
