import cake1 from "@/assets/cake-1.jpg";
import cake2 from "@/assets/cake-2.jpg";
import cake3 from "@/assets/cake-3.jpg";
import cake4 from "@/assets/cake-4.jpg";
import cake5 from "@/assets/cake-5.jpg";
import cake6 from "@/assets/cake-6.jpg";
import hero from "@/assets/hero-cake.jpg";

export type Cake = {
  id: string;
  slug: string;
  name: string;
  price: number;
  tag?: string;
  shortDesc: string;
  description: string;
  images: string[];
  sizes?: { label: string; priceDelta: number }[];
  flavors?: string[];
  allowMessage?: boolean;
};

export const cakes: Cake[] = [
  {
    id: "1",
    slug: "vanilla-bliss-cupcake",
    name: "Vanilla Bliss Cupcake",
    price: 15,
    tag: "Bestseller",
    shortDesc: "Fluffy vanilla cupcake topped with silky buttercream swirl.",
    description:
      "Our signature vanilla cupcake — light, fluffy, and topped with a silky Madagascan vanilla buttercream swirl. Perfect for everyday treats and party boxes.",
    images: [cake1, cake5, cake3],
    sizes: [
      { label: "Single", priceDelta: 0 },
      { label: "Box of 6", priceDelta: 75 },
      { label: "Box of 12", priceDelta: 165 },
    ],
    flavors: ["Vanilla", "Chocolate", "Strawberry", "Red Velvet"],
  },
  {
    id: "2",
    slug: "chocolate-berry-drip",
    name: "Chocolate Berry Drip",
    price: 320,
    tag: "New",
    shortDesc: "Rich chocolate sponge with a glossy berry drip finish.",
    description:
      "Decadent layers of moist chocolate sponge filled with whipped ganache, finished with a glossy raspberry drip and fresh seasonal berries.",
    images: [cake2, cake6, cake4],
    sizes: [
      { label: '6"', priceDelta: 0 },
      { label: '8"', priceDelta: 120 },
      { label: '10"', priceDelta: 260 },
    ],
    flavors: ["Dark Chocolate", "Milk Chocolate", "Mocha"],
    allowMessage: true,
  },
  {
    id: "3",
    slug: "classic-red-velvet",
    name: "Classic Red Velvet",
    price: 280,
    shortDesc: "Velvety red sponge layered with cream cheese frosting.",
    description:
      "Timeless red velvet — soft, vibrant, and slow-baked. Filled and frosted with our signature tangy cream cheese frosting.",
    images: [cake3, cake1, cake6],
    sizes: [
      { label: '6"', priceDelta: 0 },
      { label: '8"', priceDelta: 100 },
      { label: '10"', priceDelta: 220 },
    ],
    flavors: ["Classic", "Strawberry Swirl"],
    allowMessage: true,
  },
  {
    id: "4",
    slug: "royal-wedding-tier",
    name: "Royal Wedding Tier",
    price: 1200,
    tag: "Custom",
    shortDesc: "Three-tier celebration cake with floral hand-piped detail.",
    description:
      "A show-stopping three-tier wedding cake with smooth fondant finish, hand-piped floral detailing, and edible gold accents. Fully customizable for your big day.",
    images: [cake4, hero, cake2],
    sizes: [
      { label: "2 tiers (40 ppl)", priceDelta: 0 },
      { label: "3 tiers (80 ppl)", priceDelta: 600 },
      { label: "4 tiers (120 ppl)", priceDelta: 1400 },
    ],
    flavors: ["Vanilla", "Chocolate", "Red Velvet", "Mixed (per tier)"],
    allowMessage: true,
  },
  {
    id: "5",
    slug: "pastel-macaron-box",
    name: "Pastel Macaron Box",
    price: 180,
    shortDesc: "Hand-piped French macarons in soft pastel shades.",
    description:
      "A curated box of delicate French macarons with crisp shells and luscious ganache fillings — assorted in dreamy pastel shades.",
    images: [cake5, cake1, cake3],
    sizes: [
      { label: "Box of 6", priceDelta: 0 },
      { label: "Box of 12", priceDelta: 140 },
      { label: "Box of 24", priceDelta: 320 },
    ],
  },
  {
    id: "6",
    slug: "strawberry-shortcake",
    name: "Strawberry Shortcake",
    price: 220,
    shortDesc: "Fresh strawberries layered with airy chantilly cream.",
    description:
      "Light vanilla sponge layered with airy chantilly cream and ripe Ghanaian strawberries. Refreshing, summery, and not too sweet.",
    images: [cake6, cake2, cake4],
    sizes: [
      { label: '6"', priceDelta: 0 },
      { label: '8"', priceDelta: 90 },
    ],
    flavors: ["Strawberry", "Strawberry & Cream"],
    allowMessage: true,
  },
];

export const getCakeBySlug = (slug: string) => cakes.find((c) => c.slug === slug);
export const formatGHS = (n: number) => `GH₵ ${n.toLocaleString()}`;
