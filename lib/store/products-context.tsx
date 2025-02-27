'use client';

import { Product } from '../types';

export const defaultProducts: Product[] = [
  {
    id: '1',
    name: 'Stil Chair',
    price: 49.99,
    image: '/images/Picture-1.png',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '2',
    name: 'Eira Chair',
    price: 129.99,
    image: '/images/Picture-2.png',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '3',
    name: 'Lyng Table',
    price: 89.99,
    image: '/images/Picture-3.png',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '4',
    name: 'Lykke Sofa',
    price: 199.99,
    image: '/images/Picture.png',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '5',
    name: 'Skog Sofa',
    price: 79.99,
    image: '/images/Picture-5.png',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '6',
    name: 'Lumi table',
    price: 159.99,
    image: '/images/Picture-6.png',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '7',
    name: 'Viter sofa',
    price: 449.99,
    image: '/images/Picture-7.png',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '8',
    name: 'Klara Chair',
    price: 499.99,
    image: '/images/Picture-8.png',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }
];
