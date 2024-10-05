import { TextInput, Button } from "@/components";
import { DynamicInputProps } from "@/interfaces/componentsInterface";

const DynamicInput: React.FC<DynamicInputProps> = ({
  label,
  values,
  onChange,
}) => {
  const handleAdd = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();
    onChange([...values, ""]);
  };

  const handleChange = (index: number, value: string) => {
    const newValues = [...values];
    newValues[index] = value;
    onChange(newValues);
  };

  const handleRemove = (index: number) => (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();
    const newValues = values.filter((_, i) => i !== index);
    onChange(newValues);
  };

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
        {label}
      </label>
      {values.map((value, index) => (
        <div key={index} className="flex items-center space-x-2 mb-2">
          <TextInput
            value={value}
            onChange={(e) => handleChange(index, e.target.value)}
            placeholder={`${label} ${index + 1}`}
            label={""}
            className="flex-grow"
          />
          <Button
            onClick={handleRemove(index)}
            variant="outline"
            size="small"
            className="shrink-0"
            type="button"
          >
            Remove
          </Button>
        </div>
      ))}
      <Button onClick={handleAdd} variant="secondary" size="small" type="button">
        Add {label}
      </Button>
    </div>
  );
};

export default DynamicInput;