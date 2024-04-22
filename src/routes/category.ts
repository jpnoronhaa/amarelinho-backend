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
    '/', CategoryController.createCategory,
  );

  app.put(
    '/:id', CategoryController.updateCategory,
  );

  app.delete(
    '/:id', CategoryController.deleteCategory,
  );

}
