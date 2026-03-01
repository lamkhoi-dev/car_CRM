export interface Vehicle {
  id: string;
  name: string;
  type: 'car' | 'bike' | 'suv' | 'luxury';
  description: string;
  pricePerDay: number;
  pricePerHour: number;
  images: string[];
  features: string[];
  seats: number;
  transmission: string;
  fuel: string;
  rating: number;
  available: boolean;
}

export interface Booking {
  id: string;
  vehicleId: string;
  vehicleName: string;
  customerName: string;
  customerPhone: string;
  startDate: string;
  endDate: string;
  status: 'pending' | 'confirmed' | 'cancelled';
  totalPrice: number;
  createdAt: string;
}

export interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  image: string;
  author: string;
  date: string;
  readTime: string;
  category: string;
}

export const vehicles: Vehicle[] = [
  {
    id: '1',
    name: 'Tesla Model S',
    type: 'luxury',
    description: 'Experience the future of driving with the Tesla Model S. Silent, powerful, and packed with cutting-edge technology.',
    pricePerDay: 250,
    pricePerHour: 35,
    images: [
      'https://images.unsplash.com/photo-1617788138017-80ad40651399?w=800&q=80',
      'https://images.unsplash.com/photo-1560958089-b8a1929cea89?w=800&q=80',
    ],
    features: ['Autopilot', 'Premium Sound', 'Heated Seats', 'Glass Roof'],
    seats: 5,
    transmission: 'Automatic',
    fuel: 'Electric',
    rating: 4.9,
    available: true,
  },
  {
    id: '2',
    name: 'BMW M4 Competition',
    type: 'car',
    description: 'Pure driving excitement with the BMW M4 Competition. Raw power meets refined luxury.',
    pricePerDay: 200,
    pricePerHour: 30,
    images: [
      'https://images.unsplash.com/photo-1555215695-3004980ad54e?w=800&q=80',
      'https://images.unsplash.com/photo-1617531653332-bd46c24f2068?w=800&q=80',
    ],
    features: ['M Sport Exhaust', 'Carbon Fiber', 'Head-Up Display', 'Harman Kardon'],
    seats: 4,
    transmission: 'Automatic',
    fuel: 'Petrol',
    rating: 4.8,
    available: true,
  },
  {
    id: '3',
    name: 'Mercedes-AMG GT',
    type: 'luxury',
    description: 'The Mercedes-AMG GT combines breathtaking design with mind-blowing performance.',
    pricePerDay: 350,
    pricePerHour: 50,
    images: [
      'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?w=800&q=80',
      'https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?w=800&q=80',
    ],
    features: ['AMG Performance', 'Burmester Sound', 'Active Aero', 'Race Mode'],
    seats: 2,
    transmission: 'Automatic',
    fuel: 'Petrol',
    rating: 4.9,
    available: true,
  },
  {
    id: '4',
    name: 'Range Rover Sport',
    type: 'suv',
    description: 'Conquer any terrain in style with the Range Rover Sport. Luxury meets capability.',
    pricePerDay: 280,
    pricePerHour: 40,
    images: [
      'https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=800&q=80',
      'https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?w=800&q=80',
    ],
    features: ['Terrain Response', 'Meridian Sound', 'Air Suspension', 'Panoramic Roof'],
    seats: 5,
    transmission: 'Automatic',
    fuel: 'Hybrid',
    rating: 4.7,
    available: true,
  },
  {
    id: '5',
    name: 'Porsche 911 Turbo',
    type: 'luxury',
    description: 'The icon of sports cars. The Porsche 911 Turbo delivers unmatched driving thrills.',
    pricePerDay: 400,
    pricePerHour: 60,
    images: [
      'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=800&q=80',
      'https://images.unsplash.com/photo-1544636331-e26879cd4d9b?w=800&q=80',
    ],
    features: ['Sport Chrono', 'PASM', 'PDK Gearbox', 'Sport Exhaust'],
    seats: 2,
    transmission: 'Automatic',
    fuel: 'Petrol',
    rating: 5.0,
    available: true,
  },
  {
    id: '6',
    name: 'Kawasaki Ninja ZX-10R',
    type: 'bike',
    description: 'Feel the adrenaline rush with the Kawasaki Ninja ZX-10R. Track-bred performance for the road.',
    pricePerDay: 120,
    pricePerHour: 18,
    images: [
      'https://images.unsplash.com/photo-1558981806-ec527fa84c39?w=800&q=80',
      'https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?w=800&q=80',
    ],
    features: ['Quick Shifter', 'Traction Control', 'ABS', 'Riding Modes'],
    seats: 2,
    transmission: 'Manual',
    fuel: 'Petrol',
    rating: 4.6,
    available: true,
  },
];

export const bookings: Booking[] = [
  {
    id: 'BK001',
    vehicleId: '1',
    vehicleName: 'Tesla Model S',
    customerName: 'John Doe',
    customerPhone: '+1 234 567 890',
    startDate: '2026-03-01',
    endDate: '2026-03-03',
    status: 'confirmed',
    totalPrice: 500,
    createdAt: '2026-02-25',
  },
  {
    id: 'BK002',
    vehicleId: '3',
    vehicleName: 'Mercedes-AMG GT',
    customerName: 'Jane Smith',
    customerPhone: '+1 345 678 901',
    startDate: '2026-03-05',
    endDate: '2026-03-07',
    status: 'pending',
    totalPrice: 700,
    createdAt: '2026-02-26',
  },
  {
    id: 'BK003',
    vehicleId: '5',
    vehicleName: 'Porsche 911 Turbo',
    customerName: 'Alex Johnson',
    customerPhone: '+1 456 789 012',
    startDate: '2026-03-10',
    endDate: '2026-03-12',
    status: 'pending',
    totalPrice: 800,
    createdAt: '2026-02-27',
  },
  {
    id: 'BK004',
    vehicleId: '2',
    vehicleName: 'BMW M4 Competition',
    customerName: 'Sarah Williams',
    customerPhone: '+1 567 890 123',
    startDate: '2026-02-20',
    endDate: '2026-02-22',
    status: 'cancelled',
    totalPrice: 400,
    createdAt: '2026-02-18',
  },
];

export const blogPosts: BlogPost[] = [
  {
    id: '1',
    title: 'The Future of Electric Vehicles in 2026',
    excerpt: 'Explore how electric vehicles are reshaping the automotive industry and what to expect in the coming years.',
    content: `The electric vehicle revolution is no longer a distant dream — it's happening right now. With major manufacturers committing to all-electric lineups and battery technology advancing rapidly, the landscape of personal transportation is changing dramatically.\n\nIn 2026, we're seeing unprecedented adoption rates across the globe. Charging infrastructure has expanded significantly, making long-distance EV travel more practical than ever. The latest models offer ranges exceeding 500 miles on a single charge, effectively eliminating range anxiety for most drivers.\n\nThe economic benefits are becoming increasingly clear. With lower maintenance costs, reduced fuel expenses, and government incentives, EVs are now more affordable to own than their combustion counterparts over a five-year period.\n\nAt our rental fleet, we've seen a 300% increase in EV bookings over the past year. Customers consistently rate their EV rental experience as superior, citing the smooth, quiet ride and instant torque as standout features.`,
    image: 'https://images.unsplash.com/photo-1593941707882-a5bba14938c7?w=800&q=80',
    author: 'Michael Chen',
    date: '2026-02-15',
    readTime: '5 min read',
    category: 'Electric Vehicles',
  },
  {
    id: '2',
    title: 'Top 5 Road Trip Routes for Luxury Car Enthusiasts',
    excerpt: 'Discover the most scenic driving routes that are perfect for experiencing a luxury vehicle at its finest.',
    content: `There's nothing quite like the open road in a luxury vehicle. The combination of comfort, performance, and stunning scenery creates memories that last a lifetime.\n\nWe've curated five of the most breathtaking driving routes around the world that truly showcase what a premium vehicle can offer. From the winding coastal roads of the Pacific Coast Highway to the dramatic mountain passes of the Swiss Alps, these routes are designed to thrill.\n\n1. Pacific Coast Highway, California\n2. Stelvio Pass, Italy\n3. Great Ocean Road, Australia\n4. Route 66, USA\n5. Transfăgărășan Highway, Romania\n\nEach route offers its own unique blend of natural beauty and driving challenges that will put your rental vehicle through its paces while providing an unforgettable experience.`,
    image: 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=800&q=80',
    author: 'Emma Rodriguez',
    date: '2026-02-10',
    readTime: '7 min read',
    category: 'Travel',
  },
  {
    id: '3',
    title: 'How to Choose the Right Rental Vehicle',
    excerpt: 'A comprehensive guide to selecting the perfect vehicle for your next adventure or business trip.',
    content: `Choosing the right rental vehicle can make or break your trip. Whether you're planning a family vacation, a romantic getaway, or a business trip, the vehicle you select plays a crucial role in your overall experience.\n\nConsider these key factors:\n\n**Purpose**: Are you driving through cities or off-road? A compact car works great for urban environments, while an SUV is better for rough terrain.\n\n**Passengers**: Count your travelers and their luggage. Don't forget to account for comfort on longer drives.\n\n**Budget**: While it's tempting to go all-out, choose a vehicle that fits comfortably within your budget. Remember to factor in fuel costs.\n\n**Features**: Consider what matters most to you — advanced safety features, entertainment systems, or fuel efficiency.\n\nAt our service, we make it easy to compare vehicles side by side, helping you find the perfect match for your needs.`,
    image: 'https://images.unsplash.com/photo-1449965408869-ebd13bc9e5a8?w=800&q=80',
    author: 'David Park',
    date: '2026-02-05',
    readTime: '4 min read',
    category: 'Tips',
  },
];

export const testimonials = [
  {
    id: '1',
    name: 'Sarah M.',
    role: 'Business Executive',
    content: 'Absolutely incredible service. The Tesla Model S was immaculate, and the booking process was seamless. Will definitely use again!',
    rating: 5,
    avatar: 'SM',
  },
  {
    id: '2',
    name: 'James K.',
    role: 'Travel Blogger',
    content: 'Best car rental experience ever. The vehicles are top-notch, and the customer service is unmatched. Highly recommended!',
    rating: 5,
    avatar: 'JK',
  },
  {
    id: '3',
    name: 'Lisa T.',
    role: 'Photographer',
    content: 'Rented the AMG GT for a photoshoot and it was perfect. Clean, powerful, and absolutely stunning. 10/10 experience.',
    rating: 5,
    avatar: 'LT',
  },
];
