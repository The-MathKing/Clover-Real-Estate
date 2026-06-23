export interface Property {
  id: string;
  address: string;
  price: string;
  beds: string;
  baths: string;
  sqft: string;
  coverImage: string;
  status: 'Ready' | 'Processing' | 'Needs Images';
  description: string;
  features: string[];
  script?: string;
  images?: { id: string, url: string }[];
}

export const mockProperties: Property[] = [
  {
    id: 'prop-1',
    address: '124 Bellevue Ave, Newport, RI',
    price: '$2,450,000',
    beds: '5',
    baths: '4.5',
    sqft: '4,800',
    coverImage: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=800&q=80',
    status: 'Ready',
    description: 'This architectural masterpiece blends classic coastal shingle design with state-of-the-art luxury features. Located on the coveted Bellevue Avenue, it offers unmatched elegance.',
    features: ['Chef\'s Kitchen', 'Heated Pool', 'Ocean View Master Suite'],
    script: 'Welcome to this classic shingle-style masterpiece on Bellevue Avenue. Step inside to discover a grand foyer leading to a chef\'s kitchen and a stunning ocean-view master suite.',
  },
  {
    id: 'prop-2',
    address: '890 Orchid Trail, Coral Gables, FL',
    price: '$3,890,000',
    beds: '6',
    baths: '6.5',
    sqft: '6,200',
    coverImage: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80',
    status: 'Processing',
    description: 'Modern Mediterranean estate tucked away in Coral Gables. Designed with massive glass walls, seamless indoor-outdoor living, and a private dock.',
    features: ['Private Dock', 'Smart Home Integration', '150-Bottle Wine Cellar'],
  },
  {
    id: 'prop-3',
    address: '42 Pinecrest Lane, Aspen, CO',
    price: '$5,150,000',
    beds: '4',
    baths: '4',
    sqft: '3,900',
    coverImage: 'https://images.unsplash.com/photo-1518780664697-55e3ad937233?auto=format&fit=crop&w=800&q=80',
    status: 'Needs Images',
    description: 'A cozy but highly luxurious mountain retreat. Floor-to-ceiling windows look out over the ski slopes, complemented by beautiful rustic timber framing.',
    features: ['Ski-in/Ski-out Access', 'Stone Fireplace', 'Outdoor Hot Tub'],
  },
];
