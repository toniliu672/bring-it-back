"use client";

import { useState, useEffect, useMemo } from "react";
import { Button, Skeleton } from "@/components";
import UserTable from "./components/UserTable";
import UserModal from "./components/UserModal";
import {
  fetchUsers,
  createUser,
  updateUser,
  deleteUser,
} from "@/services/users";
import { User } from "@/interfaces/authInterface";

export default function ManageUserPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    setIsLoading(true);
    try {
      const fetchedUsers = await fetchUsers();
      setUsers(fetchedUsers);
      setError(null);
    } catch (error) {
      console.error("Error loading users:", error);
      setError("Failed to load users. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const sortedUsers = useMemo(() => {
    return [...users].sort((a, b) => a.id - b.id);
  }, [users]);

  const handleSaveUser = async (
    id: number | undefined,
    userData: Partial<User> & { password?: string }
  ) => {
    try {
      if (id) {
        await updateUser(id, userData);
      } else {
        if (!userData.password) {
          throw new Error("Password is required for new users");
        }
        await createUser(userData as Omit<User, "id"> & { password: string });
      }
      await loadUsers();
      setIsModalOpen(false);
    } catch (error) {
      console.error("Error saving user:", error);
      setError("Failed to save user. Please try again.");
    }
  };

  const handleDeleteUser = async (id: number) => {
    try {
      await deleteUser(id);
      await loadUsers();
    } catch (error) {
      console.error("Error deleting user:", error);
      setError("Failed to delete user. Please try again.");
    }
  };

  const openModal = (user: User | null = null) => {
    setCurrentUser(user);
    setIsModalOpen(true);
  };

  const TableSkeleton = () => (
    <div className="space-y-4">
      <div className="h-10 bg-gray-200 rounded dark:bg-gray-700" />
      {[...Array(5)].map((_, index) => (
        <div key={index} className="flex space-x-4">
          <Skeleton className="h-10 w-1/6" />
          <Skeleton className="h-10 w-1/4" />
          <Skeleton className="h-10 w-1/4" />
          <Skeleton className="h-10 w-1/6" />
          <Skeleton className="h-10 w-1/6" />
        </div>
      ))}
    </div>
  );

  return (
    <div className="container mx-auto p-4 dark:bg-gray-800 min-h-screen">
      <h1 className="text-2xl font-bold mb-4 dark:text-white">Manage Users</h1>
      {error && <p className="text-red-500 mb-4 dark:text-red-400">{error}</p>}
      <Button onClick={() => openModal()} className="mb-4">
        Add New User
      </Button>
      {isLoading ? (
        <TableSkeleton />
      ) : (
        <UserTable
          users={sortedUsers}
          onEdit={openModal}
          onDelete={handleDeleteUser}
        />
      )}
      <UserModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveUser}
        user={currentUser}
      />
    </div>
  );
}