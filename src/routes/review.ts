import { FastifyInstance } from 'fastify';
import ReviewController from '../controller/ReviewController';

export async function reviewRoutes(app: FastifyInstance) {
  app.get('/', {
    schema: {
      summary: 'Obtém todas as revisões',
      tags: ['Reviews'],
      response: {
        200: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              id: { type: 'number' },
              user_name: { type: 'string' },
              professional_name: { type: 'string' },
              rating: { type: 'number' },
              comment: { type: 'string' },
              images: { type: 'array', items: { type: 'string' } },
              created_at: { type: 'string', format: 'date-time' },
              updated_at: { type: 'string', format: 'date-time' }
            }
          }
        }
      }
    }
  }, ReviewController.findAllReviews);

  app.get('/professional/:id', {
    schema: {
      summary: 'Obtém todas as revisões de um profissional',
      tags: ['Reviews'],
      params: {
        type: 'object',
        properties: {
          id: { type: 'number' }
        }
      },
      response: {
        200: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              id: { type: 'number' },
              user_name: { type: 'string' },
              professional_name: { type: 'string' },
              rating: { type: 'number' },
              comment: { type: 'string' },
              images: { type: 'array', items: { type: 'string' } },
              created_at: { type: 'string', format: 'date-time' },
              updated_at: { type: 'string', format: 'date-time' }
            }
          }
        }
      }
    }
  }, ReviewController.findReviewsByProfessional);

  app.get('/user/:id', {
    schema: {
      summary: 'Obtém todas as revisões de um usuário',
      tags: ['Reviews'],
      params: {
        type: 'object',
        properties: {
          id: { type: 'number' }
        }
      },
      response: {
        200: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              id: { type: 'number' },
              user_name: { type: 'string' },
              professional_name: { type: 'string' },
              rating: { type: 'number' },
              comment: { type: 'string' },
              images: { type: 'array', items: { type: 'string' } },
              created_at: { type: 'string', format: 'date-time' },
              updated_at: { type: 'string', format: 'date-time' }
            }
          }
        }
      }
    }
  }, ReviewController.findReviewsByUser);

  app.get('/:id', {
    schema: {
      summary: 'Obtém uma revisão específica pelo ID',
      tags: ['Reviews'],
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
            user_name: { type: 'string' },
            professional_name: { type: 'string' },
            rating: { type: 'number' },
            comment: { type: 'string' },
            images: { type: 'array', items: { type: 'string' } },
            created_at: { type: 'string', format: 'date-time' },
            updated_at: { type: 'string', format: 'date-time' }
          }
        }
      }
    }
  }, ReviewController.findOneReview);

  app.post('/', {
    schema: {
      summary: 'Cria uma nova revisão',
      tags: ['Reviews'],
      body: {
        type: 'object',
        required: ['user_id', 'professional_id', 'rating', 'comment'],
        properties: {
          user_id: { type: 'number' },
          professional_id: { type: 'number' },
          rating: { type: 'number' },
          comment: { type: 'string' },
          images: { type: 'array', items: { type: 'string' } }
        }
      },
      response: {
        201: {
          description: 'Revisão criada com sucesso',
          type: 'object',
          properties: {
            message: { type: 'string' },
            review: { type: 'object' }
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
  }, ReviewController.createReview);

  app.put('/:id', {
    schema: {
      summary: 'Atualiza uma revisão existente',
      tags: ['Reviews'],
      params: {
        type: 'object',
        properties: {
          id: { type: 'number' }
        }
      },
      body: {
        type: 'object',
        properties: {
          rating: { type: 'number' },
          comment: { type: 'string' },
          images: { type: 'array', items: { type: 'string' } }
        }
      },
      response: {
        200: {
          description: 'Revisão atualizada com sucesso',
          type: 'object',
          properties: {
            message: { type: 'string' },
            review: { type: 'object' }
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
  }, ReviewController.updateReview);

  app.delete('/:id', {
    schema: {
      summary: 'Deleta uma revisão pelo ID',
      tags: ['Reviews'],
      params: {
        type: 'object',
        properties: {
        id: { type: 'number' }
        }
      },
      response: {
        200: {
          description: 'Revisão deletada com sucesso',
          type: 'object',
          properties: {
              message: { type: 'string' }
          }
        },
        404: {
          description: 'Revisão não encontrada',
          type: 'object',
          properties: {
              message: { type: 'string' }
          }
        }
      }
    }
  }, ReviewController.deleteReview);
}
