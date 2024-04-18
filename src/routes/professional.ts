import { FastifyInstance } from 'fastify';
import ProfessionalController from '../controller/ProfessionalController';

export async function professionalRoutes(app: FastifyInstance) {
  app.get(
    '/', ProfessionalController.findAllProfessionals,
  );

  app.get(
    '/:id', ProfessionalController.findOneProfessional,
  );

  app.post(
    '/', ProfessionalController.createProfessional,
  );

  app.put(
    '/:id', ProfessionalController.updateProfessional,
  );

  app.delete(
    '/:id', ProfessionalController.deleteProfessional,
  );

}
