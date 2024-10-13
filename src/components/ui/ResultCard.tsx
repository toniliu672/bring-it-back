import React, { useState, useEffect, ChangeEvent, KeyboardEvent } from "react";
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
      // console.error("Error asking question:", error);
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
    <Card className="fixed bottom-4 left-4 w-96 max-h-[80vh] overflow-y-auto z-50 p-4">
      <Button
        className="absolute top-2 right-2"
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
              className={`p-2 rounded-lg ${
                message.role === "assistant" ? "bg-blue-100" : "bg-gray-100"
              }`}
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
          />
          <Button onClick={handleSendMessage} disabled={isLoading || input.trim() === ""}>
            {isLoading ? <SpinnerLoading size="small" /> : "Kirim"}
          </Button>
        </div>
      )}
      {chat.length >= 10 && (
        <p className="text-sm text-gray-500">Batas maksimum chat tercapai.</p>
      )}
    </Card>
  );
};

export default ResultCard;