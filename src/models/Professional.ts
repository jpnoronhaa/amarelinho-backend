import { knex } from '../database';
import { buildSimilarityGraph } from '../utils/recommendations';
import { ICategory } from "./Category";
import { getProfessionalDetails } from '../utils/getProfessionalDetails';

export interface ICreateProfessional {
  userId: number;
  phoneNumber: string;
  description: string;
  categories?: number[];
  notificationToken?: string;
}

export interface IProfessional {
  id: number;
  userId: number;
  name: string;
  email: string;
  password: string;
  isActive: boolean;
  phoneNumber: string;
  description: string;
  notificationToken?: string;
  categories?: ICategory[];
  averageRating?: number;
  profilePicture?: string;
  totalRatings?: number;
  created_at: Date;
  updated_at: Date;
}

export interface IUpdateProfessional {
  phoneNumber?: string;
  description?: string;
  categories?: number[];
}

class Professional {
  async create(professional: ICreateProfessional): Promise<IProfessional> {
    const now = new Date();
    const categories = professional.categories;

    delete professional.categories;
    const newProfessional = {
      ...professional,
      created_at: now,
      updated_at: now,
    };

    const [{ id }] = await knex('professional').insert(newProfessional).returning('id');

    const associations = categories?.map(categoryId => ({
      professional_id: id,
      category_id: categoryId,
    }));

    if (associations) {
      await knex('professionals_categories').insert(associations);
    }

    const [user] = await knex('users').where({ id: professional.userId }).select('name', 'email', 'password', 'isActive');

    const createdProfessional = {
      ...newProfessional,
      categories: professional.categories as unknown as ICategory[],
      id,
      name: user.name,
      email: user.email,
      password: user.password,
      isActive: user.isActive
    };

    return createdProfessional;
  }

  async findAll(): Promise<IProfessional[]> {
    const professionals = await knex('professional')
      .join('users', 'users.id', 'professional.userId')
      .select(
        'professional.id',
        'professional.phoneNumber',
        'professional.description',
        'professional.created_at',
        'professional.updated_at',
        'users.id as userId',
        'users.name',
        'users.email',
        'users.isActive'
      );

    return Promise.all(professionals.map(getProfessionalDetails));
  }

  async findOne(id: number): Promise<IProfessional | undefined> {
    const professional = await knex('professional')
      .join('users', 'users.id', 'professional.userId')
      .where({ 'professional.id': id })
      .select(
        'professional.id',
        'users.id as userId',
        'professional.phoneNumber',
        'professional.description',
        'users.name',
        'users.email'
      )
      .first();

    if (!professional) {
      return undefined;
    }

    return getProfessionalDetails(professional);
  }

  async findSortedByRating(): Promise<IProfessional[]> {
    const professionals = await knex('professional')
      .join('users', 'users.id', 'professional.userId')
      .select(
        'professional.id',
        'professional.phoneNumber',
        'professional.description',
        'professional.created_at',
        'professional.updated_at',
        'users.id as userId',
        'users.name',
        'users.email',
        'users.isActive'
      );

    const reviews = await knex('reviews')
      .select('professional_id')
      .avg('rating as average_rating')
      .groupBy('professional_id');

    const professionalRatings = {};
    reviews.forEach(review => {
      professionalRatings[review.professional_id] = review.average_rating;
    });

    const detailedProfessionals = await Promise.all(professionals.map(getProfessionalDetails));

    return detailedProfessionals.sort((a, b) => {
      const ratingA = professionalRatings[a.id] || 0;
      const ratingB = professionalRatings[b.id] || 0;
      return ratingB - ratingA;
    });
  }

  async update(id: number, professional: Partial<IUpdateProfessional>): Promise<boolean> {
    const updatedRows = await knex('professional').where({ id }).update(professional);
    if (updatedRows > 0) {
      await knex('professionals_categories')
        .where('professional_id', id)
        .del();

      const associations = professional.categories?.map(categoryId => ({
        professional_id: id,
        category_id: categoryId,
      }));

      await knex('professionals_categories').insert(associations);
      return true;
    }

    return false;
  }

  async delete(id: number): Promise<boolean> {
    const deletedRows = await knex('professional').where({ id }).del();
    if (deletedRows > 0) {
      await knex('professionals_categories')
        .where('professional_id', id)
        .del();
      return true;
    }
    return deletedRows > 0;
  }

  async getRecommendedProfessionals(professionalId: number): Promise<string[]> {
    const graph = await buildSimilarityGraph();
    const similarProfessionals = graph[professionalId.toString()];

    if (!similarProfessionals) {
      return [];
    }

    const sortedProfessionals = Object.entries(similarProfessionals)
      .sort(([, similarityA], [, similarityB]) => similarityB - similarityA)
      .map(([id]) => id);

    return sortedProfessionals;
  }

  async getRecommendedProfessionalDetails(professionalId: number): Promise<IProfessional[]> {
    const recommendedIds = await this.getRecommendedProfessionals(professionalId);

    const recommendedProfessionals = await knex('professional')
      .join('users', 'users.id', 'professional.userId')
      .whereIn('professional.id', recommendedIds)
      .select(
        'professional.id',
        'professional.phoneNumber',
        'professional.description',
        'professional.created_at',
        'professional.updated_at',
        'users.id as userId',
        'users.name',
        'users.email',
        'users.isActive'
      );

    return Promise.all(recommendedProfessionals.map(getProfessionalDetails));
  }
}

export default new Professional();