import type { ImageMetadata } from 'astro';
import tornado from '../assets/photos/tornado.jpg';
import highline from '../assets/photos/highline.jpg';
import stretch from '../assets/photos/stretch.jpg';
import flag from '../assets/photos/flag.jpg';
import italy from '../assets/photos/italy.jpg';
import bigSur from '../assets/photos/big-sur.jpg';
export interface Photo { id: string; image: ImageMetadata; alt: string; caption: string; objectPosition: string }
export const photos: Photo[] = [
  { id: 'tornado', image: tornado, alt: 'Reaching toward an indoor tornado at the Exploratorium', caption: 'Exploratorium, San Francisco', objectPosition: '50% 60%' },
  { id: 'highline', image: highline, alt: 'Balancing on a highline in front of a yellow building', caption: 'Highlining', objectPosition: '50% 30%' },
  { id: 'stretch', image: stretch, alt: 'Stretching beside an outdoor running track', caption: 'Stretching by the track', objectPosition: '50% 40%' },
  { id: 'flag', image: flag, alt: 'Holding a human flag on outdoor exercise equipment', caption: 'Human flag', objectPosition: '50% 50%' },
  { id: 'italy', image: italy, alt: 'Standing among the stone seats of an amphitheatre in Italy', caption: 'Amphitheatre in Italy', objectPosition: '65% 50%' },
  { id: 'big-sur', image: bigSur, alt: 'Sitting on a bench overlooking the Pacific coast at Big Sur', caption: 'Big Sur', objectPosition: '50% 75%' },
];
