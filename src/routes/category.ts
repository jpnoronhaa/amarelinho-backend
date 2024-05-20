import { FastifyInstance } from 'fastify';
import CategoryController from '../controller/CategoryController';

export async function categoryRoutes(app: FastifyInstance) {
  app.get(
    '/', CategoryController.findAllCategories,
  );

  app.get(
    '/:id', CategoryController.findOneCategory,
  );

  app.post(
    '/', { 
      schema: {
        body: {
          type: 'object',
          properties: {
            name: { type: 'string' },
            description: { type: 'string' },
          },
          required: ['name'],
        },
      },
      handler: CategoryController.createCategory,
  });

  app.put(
    '/:id', {
      schema: {
        body: {
          type: 'object',
          properties: {
            name: { type: 'string' },
            description: { type: 'string' },
          },
        },
      },
      handler: CategoryController.updateCategory,}
  );

  app.delete(
    '/:id', CategoryController.deleteCategory,
  );

}
