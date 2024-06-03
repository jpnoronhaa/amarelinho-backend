import { knex } from '../database';

function calculateCosineSimilarity (vectorA: number[], vectorB: number[]): number {
  const dotProduct = vectorA.reduce((acc, val, i) => acc + val * vectorB[i], 0);
  const magnitudeA = Math.sqrt(vectorA.reduce((acc, val) => acc + val * val, 0));
  const magnitudeB = Math.sqrt(vectorB.reduce((acc, val) => acc + val * val, 0));
  return dotProduct / (magnitudeA * magnitudeB);
};

async function buildProfessionalVectors (): Promise<{ [key: string]: number[] }> {
  const reviews = await knex('reviews').select('*');
  const professionalRatings: { [key: string]: number[] } = {};

  reviews.forEach(review => {
    if (!professionalRatings[review.professional_id]) {
      professionalRatings[review.professional_id] = [];
    }
    professionalRatings[review.professional_id].push(review.rating);
  });

  return professionalRatings;
};

export async function buildSimilarityGraph (): Promise<{ [key: string]: { [key: string]: number } }> {
  const vectors = await buildProfessionalVectors();
  const similarityGraph: { [key: string]: { [key: string]: number } } = {};

  const professionals = Object.keys(vectors);
  for (let i = 0; i < professionals.length; i++) {
    for (let j = i + 1; j < professionals.length; j++) {
      const professionalA = professionals[i];
      const professionalB = professionals[j];
      const similarity = calculateCosineSimilarity(vectors[professionalA], vectors[professionalB]);

      if (!similarityGraph[professionalA]) {
        similarityGraph[professionalA] = {};
      }
      if (!similarityGraph[professionalB]) {
        similarityGraph[professionalB] = {};
      }
      similarityGraph[professionalA][professionalB] = similarity;
      similarityGraph[professionalB][professionalA] = similarity;
    }
  }

  return similarityGraph;
};