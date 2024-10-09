// DynamicInput.tsx
import { TextInput, Button } from "@/components";
import { DynamicInputProps } from "@/interfaces/componentsInterface";

interface ExtendedDynamicInputProps<T>
  extends Omit<DynamicInputProps, "values" | "onChange"> {
  values: T[];
  onChange: (values: T[]) => void;
  fields: Array<{
    name: keyof T;
    label: string;
    placeholder?: string;
  }>;
  addButtonText?: string;
  removeButtonText?: string;
}

const DynamicInput = <T extends Record<string, string>>({
  label,
  values,
  onChange,
  fields,
  addButtonText = "Tambah Baru",
  removeButtonText = "Hapus",
}: ExtendedDynamicInputProps<T>) => {
  const handleAdd = () => {
    const newItem = fields.reduce(
      (acc, field) => ({ ...acc, [field.name]: "" }),
      {} as T
    );
    onChange([...values, newItem]);
  };

  const handleChange = (index: number, field: keyof T, value: string) => {
    const newValues = values.map((item, i) =>
      i === index ? { ...item, [field]: value } : item
    );
    onChange(newValues);
  };

  const handleRemove = (index: number) => {
    onChange(values.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-4">
      {values.map((value, index) => (
        <div key={index} className="border p-4 rounded-md">
          <h3 className="font-semibold mb-2">
            {label} {index + 1}
          </h3>
          <div className="space-y-2">
            {fields.map((field) => (
              <TextInput
                key={field.name as string}
                label={field.label}
                value={value[field.name] as string}
                onChange={(e) =>
                  handleChange(index, field.name, e.target.value)
                }
                placeholder={field.placeholder}
              />
            ))}
          </div>
          <div className="mt-2">
            <Button
              onClick={() => handleRemove(index)}
              variant="outline"
              size="small"
            >
              {removeButtonText}
            </Button>
          </div>
        </div>
      ))}
      <Button onClick={handleAdd} variant="primary">
        {addButtonText}
      </Button>
    </div>
  );
};

export default DynamicInput;
