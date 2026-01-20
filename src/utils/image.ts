/**
 * Optimizes Cloudinary image URLs by injecting transformations.
 *
 * @param url The original image URL.
 * @param width The desired width for the image.
 * @returns The optimized image URL.
 */
export function getOptimizedImageUrl(url: string, width?: number): string {
  if (!url || typeof url !== 'string' || !url.includes('res.cloudinary.com')) {
    return url
  }

  // Check if it's a Cloudinary URL and insert transformations
  // Standard Cloudinary URL format: https://res.cloudinary.com/<cloud_name>/image/upload/<version>/<public_id>
  // We want to insert transformations after "upload/"

  const parts = url.split('/upload/')
  if (parts.length !== 2) {
    return url
  }

  const transformations = ['f_auto', 'q_auto']
  if (width) {
    transformations.push(`w_${width}`)
  }

  return `${parts[0]}/upload/${transformations.join(',')}/${parts[1]}`
}
