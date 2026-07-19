import cake1 from "@/assets/cake-1.jpg"; // Replace with your actual new images
import cake2 from "@/assets/cake-2.jpg";
import cake3 from "@/assets/cake-3.jpg";
import cake4 from "@/assets/cake-4.jpg";
import cake5 from "@/assets/cake-5.jpg";
// Add more imports if needed

export type SrcCake = {
  id: string;
  slug: string;
  name: string;
  price: number;
  tag?: string;
  shortDesc: string;
  description: string;
  images: string[];
};

export const knustSrcCakes: SrcCake[] = [
  {
    id: "src-1",
    slug: "mini-bliss",
    name: "Mini Bliss",
    price: 15,
    tag: "Popular",
    shortDesc: "Delightful mini cake perfect for personal indulgence.",
    description: "Our beautiful Mini Bliss cake — soft, moist, and elegantly decorated. The perfect size for one or two people to enjoy.",
    images: [cake1, cake2, cake3], // Replace with your actual images
  },
  {
    id: "src-2",
    slug: "signature-cube",
    name: "Signature Cube",
    price: 25,
    shortDesc: "Premium cube-shaped cake with signature decoration.",
    description: "Our Signature Cube cake features rich flavor and beautiful presentation. A standout choice for SRC Week celebrations.",
    images: [cake2, cake3, cake4],
  },
  {
    id: "src-3",
    slug: "elite",
    name: "Elite",
    price: 45,
    tag: "Premium",
    shortDesc: "Luxurious elite cake for special moments.",
    description: "The Elite cake — a premium creation with exquisite design and superior taste. Perfect for making a statement at SRC Week.",
    images: [cake3, cake4, cake5],
  },
  {
    id: "src-4",
    slug: "sweetheart-box",
    name: "Sweetheart Box",
    price: 65,
    shortDesc: "Romantic box perfect for sharing with your sweetheart.",
    description: "The Sweetheart Box — a stunning assortment beautifully packed. Ideal for couples and special SRC Week moments.",
    images: [cake4, cake5, cake1],
  },
  {
    id: "src-5",
    slug: "ultimate-love-affair",
    name: "Ultimate Love Affair",
    price: 95,
    tag: "Grand",
    shortDesc: "The ultimate celebration cake for love and joy.",
    description: "Our grand Ultimate Love Affair cake. A masterpiece of flavor and design created for memorable celebrations during SRC Week.",
    images: [cake5, cake1, cake2],
  },
];

export const getSrcCakeBySlug = (slug: string) => 
  knustSrcCakes.find((cake) => cake.slug === slug);