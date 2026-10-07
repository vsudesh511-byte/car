import bmw3 from "@/assets/cars/bmw-3-series.jpg";
import mercedesC from "@/assets/cars/mercedes-c-class.jpg";
import audiA4 from "@/assets/cars/audi-a4.jpg";
import fortuner from "@/assets/cars/toyota-fortuner.jpg";
import hondaCity from "@/assets/cars/honda-city.jpg";
import creta from "@/assets/cars/hyundai-creta.jpg";
import nexon from "@/assets/cars/tata-nexon.jpg";
import xuv700 from "@/assets/cars/mahindra-xuv700.jpg";
import seltos from "@/assets/cars/kia-seltos.jpg";
import virtus from "@/assets/cars/vw-virtus.jpg";
import harrier from "@/assets/cars/tata-harrier.jpg";
import thar from "@/assets/cars/mahindra-thar.jpg";

export type Car = {
  id: string;
  name: string;
  brand: string;
  /** Price in lakh rupees, e.g. 45.9 -> "₹45.9L" */
  price: number;
  mileage: string;
  fuel: string;
  transmission: string;
  engine: string;
  seating: number;
  horsepower: string;
  description: string;
  features: string[];
  image: string;
};

export const FUEL_TYPES = ["Petrol", "Diesel", "Electric", "Hybrid", "CNG"];
export const TRANSMISSIONS = ["Manual", "Automatic", "AMT", "CVT", "DCT"];

export function formatPrice(price: number): string {
  return `₹${price}L`;
}

export const defaultCars: Car[] = [
  {
    id: "bmw-3-series",
    name: "BMW 3 Series 320i",
    brand: "BMW",
    price: 45.9,
    mileage: "18.5 kmpl",
    fuel: "Petrol",
    transmission: "Automatic",
    engine: "1998 cc Turbo",
    seating: 5,
    horsepower: "184 hp",
    description:
      "A sporty luxury sedan with sharp handling, a refined turbo-petrol engine and a driver-focused cabin.",
    features: ["Sunroof", "Wireless CarPlay", "Ambient lighting", "Parking sensors"],
    image: bmw3,
  },
  {
    id: "mercedes-c-class",
    name: "Mercedes-Benz C-Class",
    brand: "Mercedes-Benz",
    price: 61.0,
    mileage: "16.8 kmpl",
    fuel: "Petrol",
    transmission: "Automatic",
    engine: "1496 cc Turbo",
    seating: 5,
    horsepower: "204 hp",
    description:
      "Comfort-first luxury sedan with a large touchscreen, plush rear seats and a very quiet ride.",
    features: ["Digital cockpit", "Burmester audio", "360° camera", "Panoramic roof"],
    image: mercedesC,
  },
  {
    id: "audi-a4",
    name: "Audi A4 45 TFSI",
    brand: "Audi",
    price: 50.2,
    mileage: "17.1 kmpl",
    fuel: "Petrol",
    transmission: "Automatic",
    engine: "1984 cc Turbo",
    seating: 5,
    horsepower: "245 hp",
    description:
      "Understated executive sedan with quattro-inspired poise, a crisp interior and strong straight-line pace.",
    features: ["Virtual cockpit", "Matrix LED lights", "Bang & Olufsen audio", "Cruise control"],
    image: audiA4,
  },
  {
    id: "toyota-fortuner",
    name: "Toyota Fortuner 4x4",
    brand: "Toyota",
    price: 42.5,
    mileage: "14.2 kmpl",
    fuel: "Diesel",
    transmission: "Automatic",
    engine: "2755 cc",
    seating: 7,
    horsepower: "204 hp",
    description:
      "A big, tough seven-seat SUV built for highways and rough roads, with proven reliability.",
    features: ["4x4 drive", "7 seats", "Hill assist", "Leather upholstery"],
    image: fortuner,
  },
  {
    id: "honda-city",
    name: "Honda City VX",
    brand: "Honda",
    price: 13.4,
    mileage: "18.9 kmpl",
    fuel: "Petrol",
    transmission: "CVT",
    engine: "1498 cc",
    seating: 5,
    horsepower: "121 hp",
    description:
      "Smooth, spacious family sedan with a comfortable rear seat and low running costs.",
    features: ["Sunroof", "Lane watch camera", "6 airbags", "Cruise control"],
    image: hondaCity,
  },
  {
    id: "hyundai-creta",
    name: "Hyundai Creta SX",
    brand: "Hyundai",
    price: 17.2,
    mileage: "17.4 kmpl",
    fuel: "Petrol",
    transmission: "DCT",
    engine: "1482 cc Turbo",
    seating: 5,
    horsepower: "160 hp",
    description:
      "Feature-packed mid-size SUV with a soft ride, big screens and plenty of comfort kit.",
    features: ["Panoramic sunroof", "Ventilated seats", "ADAS", "Bose audio"],
    image: creta,
  },
  {
    id: "tata-nexon",
    name: "Tata Nexon Fearless",
    brand: "Tata",
    price: 12.8,
    mileage: "17.4 kmpl",
    fuel: "Petrol",
    transmission: "AMT",
    engine: "1199 cc Turbo",
    seating: 5,
    horsepower: "120 hp",
    description:
      "A safe, well-built compact SUV with a bold design and a 5-star crash rating.",
    features: ["5-star safety", "Voice sunroof", "360° camera", "JBL audio"],
    image: nexon,
  },
  {
    id: "mahindra-xuv700",
    name: "Mahindra XUV700 AX7",
    brand: "Mahindra",
    price: 24.6,
    mileage: "16.1 kmpl",
    fuel: "Diesel",
    transmission: "Automatic",
    engine: "2184 cc",
    seating: 7,
    horsepower: "185 hp",
    description:
      "Powerful seven-seater with big dual screens, ADAS and one of the best value packages around.",
    features: ["ADAS", "7 seats", "Dual 10-inch screens", "Sony 3D audio"],
    image: xuv700,
  },
  {
    id: "kia-seltos",
    name: "Kia Seltos GTX+",
    brand: "Kia",
    price: 19.9,
    mileage: "17.7 kmpl",
    fuel: "Petrol",
    transmission: "DCT",
    engine: "1482 cc Turbo",
    seating: 5,
    horsepower: "158 hp",
    description:
      "Sharp-looking SUV with a punchy turbo engine and a long list of connected-car features.",
    features: ["Panoramic sunroof", "Ventilated seats", "ADAS", "Connected car tech"],
    image: seltos,
  },
  {
    id: "vw-virtus",
    name: "Volkswagen Virtus GT",
    brand: "Volkswagen",
    price: 18.4,
    mileage: "18.1 kmpl",
    fuel: "Petrol",
    transmission: "DCT",
    engine: "1498 cc Turbo",
    seating: 5,
    horsepower: "150 hp",
    description:
      "German-engineered sedan with a solid feel, strong performance and confident high-speed manners.",
    features: ["Electric sunroof", "Ventilated seats", "6 airbags", "Digital cockpit"],
    image: virtus,
  },
  {
    id: "tata-harrier",
    name: "Tata Harrier Fearless",
    brand: "Tata",
    price: 24.2,
    mileage: "16.8 kmpl",
    fuel: "Diesel",
    transmission: "Automatic",
    engine: "1956 cc",
    seating: 5,
    horsepower: "170 hp",
    description:
      "Road-presence-heavy SUV with a plush cabin, big alloys and a comfortable diesel automatic setup.",
    features: ["Panoramic sunroof", "ADAS", "JBL audio", "Terrain modes"],
    image: harrier,
  },
  {
    id: "mahindra-thar",
    name: "Mahindra Thar 4x4",
    brand: "Mahindra",
    price: 14.4,
    mileage: "15.2 kmpl",
    fuel: "Diesel",
    transmission: "Manual",
    engine: "2179 cc",
    seating: 4,
    horsepower: "131 hp",
    description:
      "An honest off-roader with low-range 4x4, short overhangs and a lifestyle-first attitude.",
    features: ["4x4 low range", "Washable interior", "Brake locking diff", "Removable roof"],
    image: thar,
  },
];
