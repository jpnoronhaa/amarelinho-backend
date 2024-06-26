import { FastifyRequest, FastifyReply } from "fastify";
import Professional from '../models/Professional'
import { IProfessional, ICreateProfessional, IUpdateProfessional } from "../models/Professional";
import { formatProfessional } from "../utils/formatProfessional";

class ProfessionalController {
    createProfessional = async (req: FastifyRequest<{ Body: ICreateProfessional }>, res: FastifyReply) => {
        try {
            const professional = req.body;
            const createdProfessional = await Professional.create(professional);

            const stringify = JSON.stringify({
                message: 'Profissional criado com sucesso, id:' + createdProfessional.id,
                professional: createdProfessional
            });
            return res.code(201).header('Content-Type', 'application/json').send(stringify);
        } catch (error) {
            return res.code(400).send({ message: error.message });
        }
    }

    findAllProfessionals = async (req: FastifyRequest, res: FastifyReply) => {
        try {
            const professionals = await Professional.findAll();
            const formattedProfessionals = professionals.map(formatProfessional);
            return res.header('Content-Type', 'application/json').send(JSON.stringify(formattedProfessionals));
        } catch (error) {
            return res.status(500).send('Erro ao recuperar os profissionais');
        }
    }

    findBestProfessionals = async (req: FastifyRequest, res: FastifyReply) => {
        try {
            const professionals = await Professional.findSortedByRating();
            const formattedProfessionals = professionals.map(formatProfessional);
            return res.header('Content-Type', 'application/json').send(JSON.stringify(formattedProfessionals));
        } catch (error) {
            return res.status(500).send('Erro ao recuperar os profissionais');
        }
    }

    findOneProfessional = async (req: FastifyRequest<{ Params: { id: number } }>, res: FastifyReply) => {
        try {
            const id = req.params.id;
            const professional = await Professional.findOne(id);
            if (professional) {
                const response = formatProfessional(professional);
                return res.header('Content-Type', 'application/json').send(JSON.stringify(response));;
            } else {
                return res.status(404).send('Profissional não encontrado!');
            }
        } catch (error) {
            return res.status(500).send('Erro ao recuperar o profissional');
        }
    }

    updateProfessional = async (request: FastifyRequest<{ Params: { id: number }, Body: Partial<IUpdateProfessional> }>, reply: FastifyReply) => {
        try {
            const id = request.params.id
            await Professional.update(id, request.body);
            return reply.send('Profissional atualizado com sucesso!');
        } catch (error) {
            return reply.status(500).send('Erro ao atualizar profissional');
        }
    }
    
    deleteProfessional = async (request: FastifyRequest<{ Params: { id: number } }>, reply: FastifyReply) => {
        try {
            const id = request.params.id
            await Professional.delete(id);
            return reply.send('Profissional deletado com sucesso');
        } catch (error) {
            return reply.status(500).send('Erro ao deletar profissional');
        }
    }

    professionalsRecommendations = async (req: FastifyRequest<{ Params: { id: number }}>, res: FastifyReply) => {
        try {
            const id  = req.params.id;
            const recommendations = await Professional.getRecommendedProfessionalDetails(id);
            const formattedRecommendations = recommendations.map(formatProfessional);
            return res.header('Content-Type', 'application/json').send(JSON.stringify(formattedRecommendations));
        } catch (error) {
            res.status(500).send('Erro ao recomendar profissionais');
        }
    }
}

export default new ProfessionalController();