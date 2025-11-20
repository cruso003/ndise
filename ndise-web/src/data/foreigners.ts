export interface Foreigner {
  id: string;
  passportNumber: string;
  nationality: string;
  firstName: string;
  lastName: string;
  entryDate: string;
  visaType: string;
  visaExpiry: string;
  status: "Active" | "Overstayed";
  overstayDays: number;
  photo: string;
}

export const foreigners: Foreigner[] = [
  {
    id: "FIR-2024-001",
    passportNumber: "A12345678",
    nationality: "Nigeria",
    firstName: "Adeola",
    lastName: "Ogunleye",
    entryDate: "2024-01-10",
    visaType: "ECOWAS-90",
    visaExpiry: "2024-04-10",
    status: "Active",
    overstayDays: 0,
    photo: "https://images.unsplash.com/photo-1531384441138-2736e62e0919?auto=format&fit=crop&q=80&w=150&h=150"
  },
  {
    id: "FIR-2023-882",
    passportNumber: "C98765432",
    nationality: "China",
    firstName: "Wei",
    lastName: "Zhang",
    entryDate: "2023-11-15",
    visaType: "Business-90",
    visaExpiry: "2024-02-13",
    status: "Overstayed",
    overstayDays: 65,
    photo: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=150&h=150"
  },
  {
    id: "FIR-2024-045",
    passportNumber: "B55443322",
    nationality: "USA",
    firstName: "John",
    lastName: "Smith",
    entryDate: "2024-03-01",
    visaType: "Tourist-30",
    visaExpiry: "2024-03-31",
    status: "Active",
    overstayDays: 0,
    photo: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=150&h=150"
  }
];

export const overstayStats = {
  totalOverstays: 87,
  critical: 12, // > 90 days
  warning: 25, // > 30 days
  recent: 50 // < 30 days
};
