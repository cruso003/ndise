export interface Citizen {
  id: string;
  firstName: string;
  lastName: string;
  dob: string;
  gender: "M" | "F";
  address: string;
  photo: string;
  status: "Active" | "Inactive";
  enrollmentDate: string;
  sims: string[];
}

export const citizens: Citizen[] = [
  {
    id: "LBR-1990-8821-001",
    firstName: "Emmanuel",
    lastName: "Johnson",
    dob: "1990-05-12",
    gender: "M",
    address: "12 Tubman Blvd, Monrovia",
    photo: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=150&h=150",
    status: "Active",
    enrollmentDate: "2024-01-15",
    sims: ["0886123456", "0777123456"]
  },
  {
    id: "LBR-1985-3321-002",
    firstName: "Fatima",
    lastName: "Massaquoi",
    dob: "1985-11-23",
    gender: "F",
    address: "45 Paynesville Red Light",
    photo: "https://images.unsplash.com/photo-1531123897727-8f129e1688ce?auto=format&fit=crop&q=80&w=150&h=150",
    status: "Active",
    enrollmentDate: "2024-02-10",
    sims: ["0886987654"]
  },
  {
    id: "LBR-1998-1122-003",
    firstName: "Joseph",
    lastName: "Kollie",
    dob: "1998-03-15",
    gender: "M",
    address: "Sinkor 12th Street",
    photo: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=150&h=150",
    status: "Active",
    enrollmentDate: "2024-03-01",
    sims: []
  }
];

export const recentEnrollments = [
  { time: "10:42 AM", name: "Sarah Doe", location: "Monrovia HQ", type: "New Enrollment" },
  { time: "10:38 AM", name: "James T.", location: "Gbarnga Center", type: "Renewal" },
  { time: "10:35 AM", name: "Mary K.", location: "Buchanan", type: "New Enrollment" },
  { time: "10:30 AM", name: "David B.", location: "Monrovia HQ", type: "Lost ID Replacement" },
];
