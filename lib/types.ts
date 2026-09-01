export type Branch = {
  id: string;
  name: string;
  address: string;
  hours: string;
  contact: string;
  prepTime: string;
  delivery: string;
};
export type CartItem = { id: string; productId: number; name: string; image: any; badge: string; size: string; addOns: string[]; quantity: number; unitPrice: number };