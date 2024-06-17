import admin from 'firebase-admin';

//apenas para fins de teste, não usada na realidade
async function sendReviewNotification(req, res) {
    const { deviceToken, reviewId, reviewMessage } = req.body;

    const payload = {
        data: {
            title: 'Nova Avaliação Recebida!!!',
            body: reviewMessage,
            reviewId: reviewId
        },
        token: deviceToken
    };

    try {
        const response = await admin.messaging().send(payload);
        res.status(200).send({ message: 'Notificação enviada com sucesso', response });
    } catch (error) {
        res.status(500).send({ message: 'Erro ao enviar notificação', error });
    }
}
  
export default sendReviewNotification;
  