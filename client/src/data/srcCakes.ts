import mini1 from "@/assets/mini1.png";
import mini2 from "@/assets/mini2.png";
import sig1 from "@/assets/Signature-cube1.png";
import sig2 from "@/assets/sig2.png";
import box6 from "@/assets/6-pack-box1.png";
import box7 from "@/assets/6-pack-box3.png";
import box1 from "@/assets/4-pack-box1.png";
import box2 from "@/assets/4-pack-box2.png";
import elite1 from "@/assets/elite2.png";
import elite2 from "@/assets/elite1.png";

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
    price: 1500,
    tag: "Popular",
    shortDesc: "Delightful mini cake perfect for personal indulgence.",
    description: "Our beautiful Mini Bliss cake, soft, moist, and elegantly decorated. The perfect size for one or two people to enjoy.",
    images: [mini1, mini2], // Replace with your actual images
  },
  {
    id: "src-2",
    slug: "signature-cube",
    name: "Signature Cube",
    price: 2500,
    shortDesc: "Premium cube-shaped cake with signature decoration.",
    description: "Our Signature Cube cake features rich flavor and beautiful presentation. A standout choice for SRC Week celebrations.",
    images: [sig1, sig2],
  },
  {
    id: "src-3",
    slug: "elite",
    name: "Elite",
    price: 4500,
    tag: "Premium",
    shortDesc: "Luxurious elite cake for special moments.",
    description: "The Elite cake, a premium creation with exquisite design and superior taste. Perfect for making a statement at SRC Week.",
    images: [elite2, elite1],
  },
  {
    id: "src-4",
    slug: "sweetheart-box",
    name: "Sweetheart Box",
    price: 6500,
    shortDesc: "Romantic box perfect for sharing with your sweetheart.",
    description: "The Sweetheart Box, a stunning assortment beautifully packed. Ideal for couples and special SRC Week moments.",
    images: [box1,box2],
  },
  {
    id: "src-5",
    slug: "ultimate-love-affair",
    name: "Ultimate Love Affair",
    price: 9500,
    tag: "Grand",
    shortDesc: "The ultimate celebration cake for love and joy.",
    description: "Our grand Ultimate Love Affair cake. A masterpiece of flavor and design created for memorable celebrations during SRC Week.",
    images: [box7, box6],
  },
];

export const getSrcCakeBySlug = (slug: string) => 
  knustSrcCakes.find((cake) => cake.slug === slug);