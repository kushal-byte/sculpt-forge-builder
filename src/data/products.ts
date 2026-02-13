
export interface Product {
  id: string;
  name: string;
  price: number;
  category: "oversized" | "compression";
  type: string;
  image: string;
  hoverImage: string;
  sizes: string[];
  colors: string[];
  fit: string;
  badge?: string;
  description: string;
  features: string[];
  fabric: {
    breathability: string;
    compression?: string;
    stretch: string;
    material: string;
  };
}

import productOversizedTee from "@/assets/product-oversized-tee.jpg";
import productOversizedTeeBack from "@/assets/product-oversized-tee-back.png";
import productOversizedTeeModel from "@/assets/product-oversized-tee-model.jpg";

export const products: Product[] = [
  {
    id: "oversized-tee-black",
    name: "Oversized Training Tee",
    price: 1999,
    category: "oversized",
    type: "T-Shirt",
    image: productOversizedTee,
    hoverImage: productOversizedTeeModel,
    sizes: ["S", "M", "L", "XL", "XXL"],
    colors: ["Black", "Charcoal", "Off-White"],
    fit: "Relaxed",
    badge: "BEST SELLER",
    description: "Heavyweight oversized tee built for pump sessions and beyond. Drop-shoulder cut with thick collar structure for that dominant silhouette.",
    features: ["Heavyweight 280gsm cotton blend", "Drop-shoulder cut", "Thick ribbed collar", "Relaxed silhouette", "Streetwear aesthetic"],
    fabric: { breathability: "High", stretch: "Moderate", material: "100% Premium Cotton 280gsm" },
  },
  {
    id: "compression-tee-black",
    name: "Compression Performance Tee",
    price: 2499,
    category: "compression",
    type: "T-Shirt",
    image: "/placeholder.svg",
    hoverImage: "/placeholder.svg",
    sizes: ["S", "M", "L", "XL", "XXL"],
    colors: ["Black", "Dark Grey"],
    fit: "Tight",
    badge: "NEW DROP",
    description: "Second-skin compression tee engineered to enhance muscle definition. Contour stitching follows every curve of your physique.",
    features: ["High-elastic performance fabric", "Sweat-wicking technology", "Muscle contour stitching", "Second-skin fit", "Breathable mesh panels"],
    fabric: { breathability: "Very High", compression: "Medium", stretch: "4-way stretch", material: "85% Nylon / 15% Spandex" },
  },
  {
    id: "pump-cover-black",
    name: "Pump Cover Hoodie",
    price: 3499,
    category: "oversized",
    type: "Hoodie",
    image: "/placeholder.svg",
    hoverImage: "/placeholder.svg",
    sizes: ["S", "M", "L", "XL", "XXL"],
    colors: ["Black", "Charcoal"],
    fit: "Oversized",
    description: "The ultimate pump cover. Oversized heavyweight hoodie designed to build anticipation before the reveal. Thick cotton blend with kangaroo pocket.",
    features: ["Heavyweight 350gsm cotton blend", "Oversized drop-shoulder", "Double-lined hood", "Kangaroo pocket", "Ribbed cuffs and hem"],
    fabric: { breathability: "Moderate", stretch: "Low", material: "80% Cotton / 20% Polyester 350gsm" },
  },
  {
    id: "compression-ls-black",
    name: "Compression Long Sleeve",
    price: 2799,
    category: "compression",
    type: "Long Sleeve",
    image: "/placeholder.svg",
    hoverImage: "/placeholder.svg",
    sizes: ["S", "M", "L", "XL", "XXL"],
    colors: ["Black", "Dark Grey"],
    fit: "Tight",
    badge: "LIMITED DROP",
    description: "Full-sleeve compression engineered for maximum definition. Thumb holes and flat-lock seams for zero-distraction performance.",
    features: ["Full compression fit", "Thumb hole cuffs", "Flat-lock seams", "UV protection", "Rapid-dry technology"],
    fabric: { breathability: "Very High", compression: "High", stretch: "4-way stretch", material: "88% Nylon / 12% Spandex" },
  },
  {
    id: "relaxed-hoodie-black",
    name: "Relaxed Training Hoodie",
    price: 3999,
    category: "oversized",
    type: "Hoodie",
    image: "/placeholder.svg",
    hoverImage: "/placeholder.svg",
    sizes: ["S", "M", "L", "XL", "XXL"],
    colors: ["Black", "Charcoal", "Off-White"],
    fit: "Relaxed",
    description: "Premium relaxed-fit hoodie for training and lifestyle. Heavyweight cotton with brushed fleece interior for unmatched comfort.",
    features: ["Premium 320gsm cotton", "Brushed fleece interior", "Relaxed athletic fit", "Metal-tipped drawcords", "Reinforced pocket seams"],
    fabric: { breathability: "Moderate", stretch: "Low", material: "85% Cotton / 15% Polyester 320gsm" },
  },
  {
    id: "compression-leggings-black",
    name: "Compression Leggings",
    price: 2999,
    category: "compression",
    type: "Leggings",
    image: "/placeholder.svg",
    hoverImage: "/placeholder.svg",
    sizes: ["S", "M", "L", "XL", "XXL"],
    colors: ["Black"],
    fit: "Tight",
    description: "Performance compression leggings with muscle contour stitching. Engineered to enhance leg definition and support during heavy lifts.",
    features: ["Graduated compression", "Muscle contour stitching", "Gusseted crotch", "Hidden waistband pocket", "Squat-proof fabric"],
    fabric: { breathability: "High", compression: "High", stretch: "4-way stretch", material: "87% Nylon / 13% Spandex" },
  },
];
