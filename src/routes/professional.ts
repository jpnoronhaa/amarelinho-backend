import { FastifyInstance } from 'fastify';
import ProfessionalController from '../controller/ProfessionalController';

export async function professionalRoutes(app: FastifyInstance) {
  app.get('/', {
    schema: {
      summary: 'Obtém todos os profissionais',
      tags: ['Professionals'],
      response: {
        200: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              id: { type: 'number' },
              userId: { type: 'number' },
              name: { type: 'string' },
              email: { type: 'string' },
              password: { type: 'string' },
              isActive: { type: 'boolean' },
              phoneNumber: { type: 'number' },
              description: { type: 'string' },
              categories: {
                type: 'array',
                items: { type: 'object' }
              },
              created_at: { type: 'string', format: 'date-time' },
              updated_at: { type: 'string', format: 'date-time' }
            }
          }
        }
      }
    }
  }, ProfessionalController.findAllProfessionals);

  app.get(
    '/rated/', ProfessionalController.findBestProfessionals,
  );
  
  app.get('/:id', {
    schema: {
      summary: 'Obtém um profissional específico pelo ID',
      tags: ['Professionals'],
      params: {
        type: 'object',
        properties: {
          id: { type: 'number' }
        }
      },
      response: {
        200: {
          type: 'object',
          properties: {
            id: { type: 'number' },
            userId: { type: 'number' },
            name: { type: 'string' },
            email: { type: 'string' },
            password: { type: 'string' },
            isActive: { type: 'boolean' },
            phoneNumber: { type: 'number' },
            description: { type: 'string' },
            categories: {
              type: 'array',
              items: { type: 'object' }
            },
            created_at: { type: 'string', format: 'date-time' },
            updated_at: { type: 'string', format: 'date-time' }
          }
        }
      }
    }
  }, ProfessionalController.findOneProfessional);

  app.post('/', {
    schema: {
      summary: 'Cria um novo profissional',
      tags: ['Professionals'],
      body: {
        type: 'object',
        required: ['userId', 'phoneNumber', 'description'],
        properties: {
          userId: { type: 'number' },
          phoneNumber: { type: 'number' },
          description: { type: 'string' },
          categories: {
            type: 'array',
            items: { type: 'number' }
          },
          notificationToken: { type: 'string' }
        }
      },
      response: {
        201: {
          description: 'Profissional criado com sucesso',
          type: 'object',
          properties: {
            message: { type: 'string' },
            professional: { type: 'object' }
          }
        },
        400: {
          description: 'Request inválido',
          type: 'object',
          properties: {
            message: { type: 'string' }
          }
        }
      }
    }
  }, ProfessionalController.createProfessional);

  app.put('/:id', {
    schema: {
      summary: 'Atualiza um profissional existente',
      tags: ['Professionals'],
      params: {
        type: 'object',
        properties: {
          id: { type: 'number' }
        }
      },
      body: {
        type: 'object',
        properties: {
          phoneNumber: { type: 'number' },
          description: { type: 'string' },
          categories: {
            type: 'array',
            items: { type: 'number' }
          }
        }
      },
      response: {
        200: {
          description: 'Profissional atualizado com sucesso',
          type: 'object',
          properties: {
            message: { type: 'string' },
            professional: { type: 'object' }
          }
        },
        400: {
          description: 'Request inválido',
          type: 'object',
          properties: {
            message: { type: 'string' }
          }
        }
      }
    }
  }, ProfessionalController.updateProfessional);

  app.delete('/:id', {
    schema: {
      summary: 'Deleta um profissional pelo ID',
      tags: ['Professionals'],
      params: {
        type: 'object',
        properties: {
          id: { type: 'number' }
        }
      },
      response: {
        200: {
          description: 'Profissional deletado com sucesso',
          type: 'object',
          properties: {
            message: { type: 'string' }
          }
        },
        404: {
          description: 'Profissional não encontrado',
          type: 'object',
          properties: {
            message: { type: 'string' }
          }
        }
      }
    }
  }, ProfessionalController.deleteProfessional);
}
