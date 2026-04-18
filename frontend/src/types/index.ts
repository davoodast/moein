// Auth Types
export interface User {
  id: number;
  username: string;
  email: string;
  phone?: string;
  role: 'admin' | 'accountant' | 'employee' | 'customer';
  bankAccount?: string;
  createdAt?: string;
}

export interface LoginResponse {
  token: string;
  user: User;
}

export interface AuthContextType {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
  register?: (data: any) => Promise<void>;
}

// Ceremony Types
export interface Ceremony {
  id: number;
  type: string;
  groomName: string;
  brideName: string;
  dateJalali: string;
  time: string;
  address: string;
  planDetails: string;
  totalAmount: number;
  advancePaid: number;
  status: 'booked' | 'in_progress' | 'completed' | 'cancelled';
  createdAt?: string;
}

export interface CeremonyPayment {
  id: number;
  ceremonyId: number;
  amount: number;
  type: 'cash' | 'check' | 'installment';
  checkNumber?: string;
  dueDate?: string;
  status: 'pending' | 'completed';
  createdAt?: string;
}

// Employee Types
export interface Employee {
  id: number;
  userId: number;
  position: string;
  startDate: string;
  salary: number;
  status: 'active' | 'inactive';
  user?: User;
}

export interface Payroll {
  id: number;
  employeeId: number;
  monthYear: string;
  grossSalary: number;
  deductions: number;
  total: number;
  pdfPath?: string;
  status: 'pending' | 'processed' | 'paid';
  createdAt?: string;
}

export interface Advance {
  id: number;
  employeeId: number;
  amount: number;
  dateJalali: string;
  reason: string;
  status: 'pending' | 'approved' | 'paid' | 'rejected';
  createdAt?: string;
}

// Expense Types
export interface Expense {
  id: number;
  category: string;
  amount: number;
  dateJalali: string;
  description: string;
  notes?: string;
  createdAt?: string;
}

// Settings Types
export interface SiteSettings {
  companyName: string;
  aboutUs: string;
  contactEmail: string;
  contactPhone: string;
  address: string;
  logo?: string;
}

// API Response Types
export interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  data?: T;
  error?: string;
}

export interface LoginResponse {
  token: string;
  user: User;
}
