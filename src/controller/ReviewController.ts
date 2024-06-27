import { FastifyRequest, FastifyReply } from 'fastify';
import * as admin from 'firebase-admin';
import sendReviewNotification from './NotificationController';
import Review, { ICreateReview, IUpdateReview } from '../models/Review';
import Professional from '../models/Professional';

class ReviewController {
    createReview = async (req: FastifyRequest<{ Body: ICreateReview }>, res: FastifyReply) => {
        try {
            const review = req.body;
            const createdReview = await Review.create(review);

            const professional = await Professional.findOne(req.body.professional_id);
            const deviceToken = professional?.notificationToken;

            if (deviceToken) {
                const payload: admin.messaging.Message = {
                    token: deviceToken,
                    notification: {
                      title: 'Nova Avaliação Recebida!!!',
                      body: createdReview.comment
                    },
                    data: {
                      reviewId: createdReview.id ? createdReview.id.toString() : ''
                    }
                };
            
                try {
                    await admin.messaging().send(payload);
                    console.log("Mensagem enviada com sucesso");
                } catch (error) {
                    console.log('Erro ao enviar notificação', error);
                }
            }

            return res.code(201).header('Content-Type', 'application/json').send(JSON.stringify({ message: 'Avaliação criada com sucesso', review: createdReview }));
        } catch (error) {
            return res.code(400).send({ message: error.message });
        }
    }

    findAllReviews = async (req: FastifyRequest, res: FastifyReply) => {
        try {
            const reviews = await Review.findAll();
            return res.send(reviews);
        } catch (error) {
            return res.status(500).send('Erro ao recuperar as avaliações');
        }
    }

    findReviewsByProfessional = async (req: FastifyRequest<{ Params: { id: number }}>, res: FastifyReply) => {
        try{
            const { id } = req.params;
            const reviews = await Review.findByProfessional(Number(id));
            if (!reviews) {
                return res.status(404).send('Avaliações não encontradas');
            }
            return res.send(reviews);
        } catch (error) {
            return res.status(500).send('Erro ao recuperar as avaliações do profissional');
        }
    }

    findReviewsByUser = async (req: FastifyRequest<{ Params: { id: number }}>, res: FastifyReply) => {
        try {
            const { id } = req.params;
            const reviews = await Review.findByUser(Number(id));
            if (!reviews) {
                return res.status(404).send('Avaliações não encontradas');
            }
            return res.send(reviews);
        } catch (error) {
            return res.status(500).send('Erro ao recuperar as avaliações do usuário');
        }
    }

    findOneReview = async (req: FastifyRequest<{ Params: { id: number }}>, res: FastifyReply) => {
        try {
            const { id } = req.params;
            const review = await Review.findOne(Number(id));
            if (!review) {
                return res.status(404).send('Avaliação não encontrada');
            }
            return res.send(review);
        } catch (error) {
            return res.status(500).send('Erro ao recuperar a avaliação');
        }
    }

    updateReview = async (req: FastifyRequest<{ Params: { id: number}, Body: Partial<IUpdateReview> }>, res: FastifyReply) => {
        try {
            const { id } = req.params;
            const review = req.body;
            const updatedReview = await Review.update(Number(id), review);

            if (!updatedReview) {
                return res.status(404).send('Avaliação não encontrada');
            }
            console.log(updatedReview);
            return res.header('Content-Type', 'application/json').send(JSON.stringify(updatedReview));
        } catch (error) {
            return res.status(500).send('Erro ao atualizar a avaliação');
        }
    }

    deleteReview = async (request: FastifyRequest<{ Params: { id: number} }>, reply: FastifyReply) => {
        try {
            const { id } = request.params;
            await Review.delete(Number(id));
            return reply.code(204).send();
        } catch (error) {
            return reply.status(500).send('Erro ao deletar a avaliação');
        }
    }
}

export default new ReviewController();