import { TextInputProps } from "@/interfaces/componentsInterface";

const TextInput: React.FC<TextInputProps> = ({ label, error, className, ...props }) => {
  return (
    <div className="mb-4">
      {label && (
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          {label}
        </label>
      )}
      <input
        className={`w-full px-3 py-2 bg-white dark:bg-gray-700 border 
        text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400
        focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
        ${error ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'}
        rounded-md ${className || ''}`}
        {...props}
      />
      {error && <p className="mt-1 text-sm text-red-600 dark:text-red-400">{error}</p>}
    </div>
  );
};

export default TextInput;