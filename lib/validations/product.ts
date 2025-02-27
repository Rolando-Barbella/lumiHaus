import * as z from 'zod';

export const createProductSchema = z.object({
  name: z
    .string()
    .min(1, 'Product name is required')
    .max(100, 'Product name must be less than 100 characters'),
  price: z
    .string()
    .min(1, 'Price is required')
    .refine((val) => !isNaN(parseFloat(val)) && parseFloat(val) >= 0, {
      message: 'Price must be a valid number greater than or equal to 0',
    }),
  image: z
    .string()
    .min(1, 'Image is required')
    .refine(
      (val) => {
        // Accept data URLs for uploaded images
        if (val.startsWith('data:image/')) {
          return true;
        }
        // Accept URLs from trusted domains (unsplash in this case)
        if (val.startsWith('https://images.unsplash.com/')) {
          return true;
        }
        // For other URLs, check if they have an image extension
        const extension = val.split('.').pop()?.toLowerCase();
        return extension === 'jpg' || extension === 'jpeg' || extension === 'png';
      },
      {
        message: 'Please provide a valid image URL or upload a JPG/PNG file',
      }
    ),
});