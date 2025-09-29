export type ProgramStatus = "active" | "inactive";

export interface Program {
  id: number;
  slug: string;
  title: string;
  description: string;
  program_type: "education" | "social";
  status: ProgramStatus;
  flyer: string;
  valid_from: string;
  valid_to: string;
  vendor_name?: string;
  applied?: boolean;
  required_checks: { id: number; code: string; label: string }[];
  required_reports: {
    id: number;
    report_type: string;
    label: string;
    min_files: number;
  }[];
  is_open: boolean;
  applied?: boolean;
}

export type LPQ = {
  id: number;
  name: string;
  address: string;
  email: string;
  phone: string;
};

export type Application = {
  id: number;
  program: Program;
  lpq: LPQ;
  status: "pending" | "approved" | "rejected";
  report_uploaded: boolean;
};

export interface InstitutionAssessment {
  institution: number;
  required_check: {
    id: number;
    program: number;
    code: string;
  };
  value: boolean;
}

export interface Institution {
  id: number;
  nama_lembaga: string;
  alamat: string;
  kecamatan: number;
  kabkota: number;
  provinsi: number;
  status: string;
}
