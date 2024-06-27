import { knex } from '../database';

export interface IReview {
  id?: number;
  user_id: number;
  professional_id: number;
  rating: number;
  comment: string;
  images?: string; //urls
  created_at: Date;
  updated_at: Date;
}

export interface ICreateReview {
    user_id: number;
    professional_id: number;
    images?: string;
    rating: number;
    comment: string;
}

export interface IUpdateReview {
    rating?: number;
    comment?: string;
    images?: string;
}

class Review {
    async create(review: ICreateReview): Promise<IReview> {
        const now = new Date();
        
        const newReview = {
            ...review,
            images: JSON.stringify(review.images || []), 
            created_at: now,
            updated_at: now,
        };
    
        const [createdReview] = await knex<IReview>('reviews').insert(newReview).returning('*');
        if (!createdReview) {
            throw new Error('Erro ao criar avaliação');
        }

        return createdReview;
    }

    async findOne(id: number): Promise<IReview> {
        const review = await knex<IReview>('reviews')
            .where('reviews.id', id)
            .join('users as u', 'u.id', 'reviews.user_id')
            .join('professional as p', 'p.id', 'reviews.professional_id')
            .leftJoin('users as up', 'up.id', 'p.userId')
            .orderBy('reviews.created_at', 'desc')
            .select(
              'reviews.id',
              'u.name as user_name',
              'up.name as professional_name',
              'reviews.rating',
              'reviews.comment',
              'reviews.images',
              'reviews.updated_at'
            ).first();
    
        if (!review) {
            throw new Error('Avaliação não encontrada');
        }
    
        if (typeof review.images === 'string') {
            review.images = JSON.parse(review.images);
        }
    
        return review;
    }

    async findByProfessional(professionalId: number): Promise<IReview[]> {
        const reviews = await knex<IReview>('reviews').where({ professional_id: professionalId })
        .join('users as u', 'u.id', 'reviews.user_id')
        .join('professional as p', 'p.id', 'reviews.professional_id')
        .leftJoin('users as up', 'up.id', 'p.userId')
        .orderBy('reviews.created_at', 'desc')
        .select(
          'reviews.id',
          'u.name as user_name',
          'up.name as professional_name',
          'reviews.rating',
          'reviews.comment',
          'reviews.images',
          'reviews.updated_at'
        );

        if (!reviews) {
            throw new Error('Avaliações não encontradas');
        }

        reviews.forEach(review => {
            if (typeof review.images === 'string') {
                review.images = JSON.parse(review.images);
            }
        });

        return reviews;
    }

    async findByUser(userId: number): Promise<IReview[]> {
        const reviews = await knex<IReview>('reviews').where({ user_id: userId })
        .join('users as u', 'u.id', 'reviews.user_id')
        .join('professional as p', 'p.id', 'reviews.professional_id')
        .leftJoin('users as up', 'up.id', 'p.userId')
        .orderBy('reviews.created_at', 'desc')
        .select(
          'reviews.id',
          'u.name as user_name',
          'up.name as professional_name',
          'reviews.rating',
          'reviews.comment',
          'reviews.images',
          'reviews.updated_at'
        );
        
        if (!reviews) {
            throw new Error('Avaliações não encontradas');
        }

        reviews.forEach(review => {
            if (typeof review.images === 'string') {
                review.images = JSON.parse(review.images);
            }
        });

        return reviews;
    }

    async findAll(): Promise<IReview[]> {
        const reviews = await knex<IReview>('reviews')
          .join('users as u', 'u.id', 'reviews.user_id')
          .join('professional as p', 'p.id', 'reviews.professional_id')
          .leftJoin('users as up', 'up.id', 'p.userId')
          .orderBy('reviews.created_at', 'desc')
          .select(
            'reviews.id',
            'u.name as user_name',
            'up.name as professional_name',
            'reviews.rating',
            'reviews.comment',
            'reviews.images',
            'reviews.updated_at'
          );
      
        if (!reviews || reviews.length === 0) {
          throw new Error('Avaliações não encontradas');
        }
      
        reviews.forEach(review => {
          if (typeof review.images === 'string') {
            review.images = JSON.parse(review.images);
          }
        });
      
        return reviews;
    }
      
    async update(id: number, review: IUpdateReview): Promise<IReview> {
        const now = new Date();
        const updatedReview = {
            ...review,
            updated_at: now
        };
        const [updatedReviewId] = await knex<IReview>('reviews').where({ id }).update(updatedReview).returning('id');

        if (!updatedReviewId) {
            throw new Error('Erro ao atualizar avaliação');
        }
        return this.findOne(updatedReviewId.id);
    }

    async delete(id: number): Promise<void> {
        const deletedReviewId = await knex<IReview>('reviews').where({ id }).delete();
        if (!deletedReviewId) {
            throw new Error('Erro ao deletar avaliação');
        }
    }
}

export default new Review();