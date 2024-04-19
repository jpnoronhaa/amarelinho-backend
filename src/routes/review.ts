import { FastifyInstance } from 'fastify';
import ReviewController from '../controller/ReviewController';

export async function reviewRoutes(app: FastifyInstance) {
    app.get(
        '/', ReviewController.findAllReviews,
    );

    //reviews by professional
    app.get(
        '/professional/:id', ReviewController.findReviewsByProfessional,
    );

    //reviews by user
    app.get(
        '/user/:id', ReviewController.findReviewsByUser,
    );
    
    app.get(
        '/:id', ReviewController.findOneReview,
    );
    
    app.post(
        '/', ReviewController.createReview,
    );
    
    app.put(
        '/:id', ReviewController.updateReview,
    );
    
    app.delete(
        '/:id', ReviewController.deleteReview,
    );
}