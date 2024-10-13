import {
  ReactNode,
  ButtonHTMLAttributes,
  InputHTMLAttributes,
  SelectHTMLAttributes,
  TextareaHTMLAttributes,
} from "react";
import { MotionProps } from "framer-motion";
import { School } from "./schoolStats";

// Animations
export interface BaseAnimationProps extends MotionProps {
  children: React.ReactNode;
  duration?: number;
  delay?: number;
}

export type Direction = "left" | "right" | "up" | "down";

// Navbar
export interface NavItem {
  href?: string;
  label: string;
  dropdown?: DropdownItem[];
}

export interface NavbarProps {
  logo?: string;
  navItems: NavItem[];
}

// Button
export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: "primary" | "secondary" | "outline" | "danger";
  size?: "small" | "medium" | "large";
  fullWidth?: boolean;
  isLoading?: boolean;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
}

// Dropdown
export interface DropdownItem {
  href: string;
  label: string;
}

export interface DropdownProps {
  label: string;
  items: DropdownItem[];
  isMobile?: boolean;
}

// Modal
export interface ModalButton {
  text: string;
  onClick: (e?: React.MouseEvent<HTMLButtonElement> | React.FormEvent) => void;
  className?: string;
}

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  size?: "small" | "medium" | "large";
  closeOnOverlayClick?: boolean;
  closeOnEsc?: boolean;
  footer?: ReactNode;
  buttons?: ModalButton[];
  isDirty?: boolean;
}

// Loading
export interface LoadingProps {
  size?: number;
  className?: string;
}

// SpinnerLoading
export interface SpinnerLoadingProps {
  size?: "small" | "medium" | "large";
  color?: string;
}

// ProgressBar
export interface ProgressBarProps {
  progress: number;
  className?: string;
}

// Notification
export type NotificationType = "success" | "error" | "info";
export interface NotificationProps {
  type: "success" | "error" | "info";
  message: string;
  duration?: number;
  onClose?: () => void;
}

// Pagination
export interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  className?: string;
}

// Table
export interface Column<T, K extends keyof T> {
  header: string;
  accessor: K | ((row: T, index: number) => React.ReactNode);
  cell?: (value: T[K], row: T, index: number) => React.ReactNode;
}

export interface TableProps<T> {
  data: T[];
  columns: Column<T, keyof T>[];
  className?: string;
}

// SearchBar
export interface SearchBarProps {
  onSearch: (query: string) => void;
  placeholder?: string;
  className?: string;
}

// SearchBarNoButton
export interface SearchBarNoButtonProps {
  onSearch: (query: string) => void;
  placeholder?: string;
  className?: string;
  initialValue?: string;
}

// SearchableMultiSelect
export interface SearchableMultiSelectProps {
  options: Option[];
  selectedValues: string[];
  onChange: (selectedValues: string[]) => void;
  placeholder?: string;
  label: string;
  error?: string;
  isLoading?: boolean;
  onSearch?: (query: string) => void;
  noOptionsMessage?: string;
}

export interface Option {
  value: string;
  label: string;
}

// MultiLevelSelector
export interface MultiLevelSelectorProps<T, U> {
  data: T[];
  renderItem: (item: T) => React.ReactNode;
  renderSubItem: (subItem: U) => React.ReactNode;
  getSubItems: (item: T) => U[];
  onSelectionChange: (selection: {[key: string]: string[]}) => void;
  excludeItems?: U[];
  itemIdKey: keyof T;
  subItemIdKey: keyof U;
}

export interface SelectionGroupProps<T, U> {
  item: T;
  renderItem: (item: T) => React.ReactNode;
  renderSubItem: (subItem: U) => React.ReactNode;
  subItems: U[];
  selectedSubItems: string[];
  onSelectionChange: (itemId: string, selectedSubItemIds: string[]) => void;
  itemIdKey: keyof T;
  subItemIdKey: keyof U;
}

// Sidebar
export interface SidebarProps {
  children?: React.ReactNode;
  className?: string;
  height?: string;
}

// ThemeToggle
export interface ThemeToggleProps {
  className?: string;
}

// DataPanel
export interface DataPanelProps<T> {
  data: T[];
  renderItem: (item: T, index: number) => ReactNode;
  className?: string;
  orientation?: "vertical" | "horizontal";
}

// Card
export interface CardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}

// Skeleton
export interface SkeletonProps {
  className?: string;
  width?: string | number;
  height?: string | number;
  isCircle?: boolean;
}

// MapsContainer
export interface MapContainerProps {
  center: [number, number];
  zoom: number;
  children?: React.ReactNode;
}

// HOC
export interface ErrorBoundaryProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export interface State {
  hasError: boolean;
}

export interface SEOProps {
  title: string;
  description: string;
  canonical?: string;
  ogImage?: string;
}

// Form
export interface TextInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
}

export interface TextAreaProps
  extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string;
  error?: string;
}

export interface Option {
  value: string;
  label: string;
}

export interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label: string;
  options: Option[];
  error?: string;
}

export interface CheckboxProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
}

export interface DynamicInputProps {
  label: string;
  values: string[];
  onChange: (newValues: string[]) => void;
}

export interface DropdownItem extends Record<string, unknown> {
  // Tambahkan properti spesifik jika diperlukan
  label: string;
  value: string;
}

export interface DropdownSearchProps<T> {
  fetchData: (searchTerm: string) => Promise<T[]>;
  onSelect: (item: T) => void;
  placeholder?: string;
  labelKey?: keyof T;
  valueKey?: keyof T;
  debounceTime?: number;
  renderOption?: (item: T) => ReactNode;
  isLoading?: boolean;
}

// ResultCard 
export interface ResultCardProps {
  result: string;
  onClose: () => void;
}