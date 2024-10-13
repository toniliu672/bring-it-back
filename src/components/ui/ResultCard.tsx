import { useState } from 'react';
import { Button, Card } from '..';
import { ResultCardProps } from '@/interfaces/componentsInterface';

const ResultCard: React.FC<ResultCardProps> = ({ result, onClose }) => {
  const [isVisible, setIsVisible] = useState(true);

  const handleClose = () => {
    setIsVisible(false);
    onClose();
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-4 left-4 z-50">
      <Card className="max-w-xs relative">
        <Button
          className="absolute top-2 right-2"
          size="small"
          variant="secondary"
          onClick={handleClose}
        >
          ✕
        </Button>
        <div className="p-4">
          <h4 className="font-bold text-lg mb-2">Model Response</h4>
          <p className="text-sm">{result}</p>
        </div>
      </Card>
    </div>
  );
};

export default ResultCard;
