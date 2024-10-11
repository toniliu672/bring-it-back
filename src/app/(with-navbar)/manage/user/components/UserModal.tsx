import { useState, useEffect } from "react";
import { Modal, TextInput, Select, Button } from "@/components";
import { User } from "@/interfaces/authInterface";

interface UserModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (
    id: number | undefined,
    userData: Partial<User> & { password?: string }
  ) => void;
  user: User | null;
}

const initialFormData = {
  username: "",
  email: "",
  role: "USER" as "ADMIN" | "USER",
  password: "",
};

export default function UserModal({
  isOpen,
  onClose,
  onSave,
  user,
}: UserModalProps) {
  const [formData, setFormData] = useState(initialFormData);

  useEffect(() => {
    if (isOpen) {
      if (user) {
        // Editing existing user
        setFormData({
          username: user.username,
          email: user.email,
          role: user.role,
          password: "", // Always reset password field
        });
      } else {
        // Adding new user
        setFormData(initialFormData);
      }
    }
  }, [isOpen, user]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };
  const handleSubmit = () => {
    const dataToSave = { ...formData } as Partial<typeof formData>;
    if (!dataToSave.password) {
      delete dataToSave.password;
    }
    onSave(user?.id, dataToSave);
  };
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={user ? "Edit User" : "Add New User"}
    >
      <div className="space-y-4">
        <TextInput
          label="Username"
          name="username"
          value={formData.username}
          onChange={handleChange}
          className="dark:bg-gray-700 dark:text-white"
        />
        <TextInput
          label="Email"
          name="email"
          type="email"
          value={formData.email}
          onChange={handleChange}
          className="dark:bg-gray-700 dark:text-white"
        />
        <TextInput
          label="Password"
          name="password"
          type="password"
          value={formData.password}
          onChange={handleChange}
          className="dark:bg-gray-700 dark:text-white"
          placeholder={
            user ? "Leave blank to keep current password" : "Enter password"
          }
        />
        <Select
          label="Role"
          name="role"
          value={formData.role}
          onChange={handleChange}
          options={[
            { value: "USER", label: "User" },
            { value: "ADMIN", label: "Admin" },
          ]}
          className="dark:bg-gray-700 dark:text-white"
        />
        <div className="flex justify-end space-x-2">
          <Button onClick={onClose} variant="secondary">
            Cancel
          </Button>
          <Button onClick={handleSubmit}>Save</Button>
        </div>
      </div>
    </Modal>
  );
}
