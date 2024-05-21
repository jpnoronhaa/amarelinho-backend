import { FastifyInstance } from 'fastify';
import CategoryController from '../controller/CategoryController';

export async function categoryRoutes(app: FastifyInstance) {
  app.get('/', {
    schema: {
      summary: 'Obtém todas as categorias',
      tags: ['Categories'],
      response: {
        200: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              id: { type: 'number' },
              name: { type: 'string' },
              description: { type: 'string' },
              created_at: { type: 'string', format: 'date-time' },
              updated_at: { type: 'string', format: 'date-time' }
            }
          }
        }
      }
    }
  }, CategoryController.findAllCategories);

  app.get('/:id', {
    schema: {
      summary: 'Obtém uma categoria específica pelo ID',
      tags: ['Categories'],
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
            name: { type: 'string' },
            description: { type: 'string' },
            created_at: { type: 'string', format: 'date-time' },
            updated_at: { type: 'string', format: 'date-time' }
          }
        },
        404: {
          description: 'Categoria não encontrada',
          type: 'object',
          properties: {
            message: { type: 'string' }
          }
        }
      }
    }
  }, CategoryController.findOneCategory);

  app.post('/', {
    schema: {
      summary: 'Cria uma nova categoria',
      tags: ['Categories'],
      body: {
        type: 'object',
        properties: {
          name: { type: 'string' },
          description: { type: 'string' }
        },
        required: ['name']
      },
      response: {
        201: {
          description: 'Categoria criada com sucesso',
          type: 'object',
          properties: {
            id: { type: 'number' },
            name: { type: 'string' },
            description: { type: 'string' },
            created_at: { type: 'string', format: 'date-time' },
            updated_at: { type: 'string', format: 'date-time' }
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
    },
    handler: CategoryController.createCategory
  });

  app.put('/:id', {
    schema: {
      summary: 'Atualiza uma categoria existente',
      tags: ['Categories'],
      params: {
        type: 'object',
        properties: {
          id: { type: 'number' }
        }
      },
      body: {
        type: 'object',
        properties: {
          name: { type: 'string' },
          description: { type: 'string' }
        }
      },
      response: {
        200: {
          description: 'Categoria atualizada com sucesso',
          type: 'object',
          properties: {
            id: { type: 'number' },
            name: { type: 'string' },
            description: { type: 'string' },
            created_at: { type: 'string', format: 'date-time' },
            updated_at: { type: 'string', format: 'date-time' }
          }
        },
        400: {
          description: 'Request inválido',
          type: 'object',
          properties: {
            message: { type: 'string' }
          }
        },
        404: {
          description: 'Categoria não encontrada',
          type: 'object',
          properties: {
            message: { type: 'string' }
          }
        }
      }
    },
    handler: CategoryController.updateCategory
  });

  app.delete('/:id', {
    schema: {
      summary: 'Deleta uma categoria pelo ID',
      tags: ['Categories'],
      params: {
        type: 'object',
        properties: {
          id: { type: 'number' }
        }
      },
      response: {
        200: {
          description: 'Categoria deletada com sucesso',
          type: 'object',
          properties: {
            message: { type: 'string' }
          }
        },
        404: {
          description: 'Categoria não encontrada',
          type: 'object',
          properties: {
            message: { type: 'string' }
          }
        }
      }
    }
  }, CategoryController.deleteCategory);
}
