import { Branch } from './types';

export const BRANCHES: Branch[] = [
  { id: 'binan-main', name: 'Bun & Bite – Biñan Main Branch', address: 'Barangay Langkiwa, Biñan City, Laguna', hours: '9:00 AM – 10:00 PM', contact: '+63 912 345 6789', prepTime: '15–25 minutes', delivery: 'Available' },
  { id: 'pavilion', name: 'Bun & Bite – Pavilion Branch', address: 'Pavilion Mall Area, Biñan City, Laguna', hours: '10:00 AM – 9:00 PM', contact: '+63 917 222 3344', prepTime: '20–30 minutes', delivery: 'Limited nearby areas' },
  { id: 'sta-rosa', name: 'Bun & Bite – Sta. Rosa Branch', address: 'Sta. Rosa, Laguna', hours: '10:00 AM – 10:00 PM', contact: '+63 918 555 7788', prepTime: '20–35 minutes', delivery: 'Available' },
];

export const getBranch = (id?: string) => BRANCHES.find((branch) => branch.id === id);