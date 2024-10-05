import {
  ReactNode,
  ButtonHTMLAttributes,
  InputHTMLAttributes,
  SelectHTMLAttributes,
  TextareaHTMLAttributes,
} from "react";
import { MotionProps } from 'framer-motion'

// Animations
export interface BaseAnimationProps extends MotionProps {
  children: React.ReactNode
  duration?: number
  delay?: number
}

export type Direction = 'left' | 'right' | 'up' | 'down'

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
  variant?: "primary" | "secondary" | "outline";
  size?: "small" | "medium" | "large";
  fullWidth?: boolean;
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
  children: React.ReactNode;
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
  size?: 'small' | 'medium' | 'large';
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
export interface Column {
  header: string;
  accessor: string;
  cell?: (value: any, index: number) => React.ReactNode;
}

export interface TableProps {
  data: any[];
  columns: Column[];
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
export interface Option {
  value: string;
  label: string;
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

export interface DropdownItem {
  [key: string]: any;
}

export interface DropdownSearchProps {
  fetchData: (searchTerm: string) => Promise<DropdownItem[]>;
  onSelect: (item: DropdownItem) => void;
  placeholder?: string;
  labelKey?: string;
  valueKey?: string;
  debounceTime?: number;
}