import { knex } from '../database';
import { IProfessional } from '../models/Professional';

async function getProfessionalDetails(professional: any): Promise<IProfessional> {
  const categories = await knex('category')
    .join('professionals_categories', 'category.id', 'professionals_categories.category_id')
    .where('professionals_categories.professional_id', professional.id)
    .select('category.name');

  const reviews = await knex('reviews')
    .where('professional_id', professional.id)
    .avg('rating as average_rating')
    .first();

  // I want to round the average rating to the nearest 1 decimal place
  const averageRating = reviews?.average_rating;
  if (averageRating) {
    reviews.average_rating = Math.round(averageRating * 10) / 10;
  }

  const profilePicture = await knex('user_images')
    .where('user_id', professional.userId)
    .select('image_path')
    .first();

  const totalRatings = await knex('reviews')
    .where('professional_id', professional.id)
    .count('id', { as: 'total' })
    .first();
  
  return {
    ...professional,
    categories: categories.map(category => category.name),
    averageRating: reviews?.average_rating || 0,
    profilePicture: profilePicture?.image_path,
    totalRatings: totalRatings?.total
  };
}

export { getProfessionalDetails };