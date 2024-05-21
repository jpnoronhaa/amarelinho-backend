import { FastifyRequest, FastifyReply } from "fastify";
import Professional from '../models/Professional'
import { IProfessional, ICreateProfessional, IUpdateProfessional } from "../models/Professional";

class ProfessionalController {
    createProfessional = async (req: FastifyRequest<{ Body: ICreateProfessional }>, res: FastifyReply) => {
        try {
            const professional = req.body;
            const createdProfessional = await Professional.create(professional);
            return res.code(201).send({ message: 'Profissional com sucesso', professional: createdProfessional });
        } catch (error) {
            return res.code(400).send({ message: error.message });
        }
    }

    findAllProfessionals = async (req: FastifyRequest, res: FastifyReply) => {
        try {
            const professionals = await Professional.findSortedByRating();
            res.send(professionals);
        } catch (error) {
            res.status(500).send('Erro ao recuperar os profissionais');
        }
    }

    findBestProfessionals = async (req: FastifyRequest, res: FastifyReply) => {
        try {
            const professionals = await Professional.findAll();
            
            res.send(professionals);
        } catch (error) {
            res.status(500).send('Erro ao recuperar os profissionais');
        }
    }

    findOneProfessional = async (req: FastifyRequest<{ Params: { id: number } }>, res: FastifyReply) => {
        try {
            const id = req.params.id;
            const professional = await Professional.findOne(id);
            if (professional) {
                res.send(professional);
            } else {
                res.status(404).send('Profissional não encontrado!');
            }
        } catch (error) {
            res.status(500).send('Erro ao recuperar o profissional');
        }
    }

    updateProfessional = async (request: FastifyRequest<{ Params: { id: number }, Body: Partial<IUpdateProfessional> }>, reply: FastifyReply) => {
        try {
            const id = request.params.id
            await Professional.update(id, request.body);
            reply.send('Profissional atualizado com sucesso!');
        } catch (error) {
            reply.status(500).send('Erro ao atualizar profissional');
        }
    }
    
    deleteProfessional = async (request: FastifyRequest<{ Params: { id: number } }>, reply: FastifyReply) => {
        try {
            const id = request.params.id
            await Professional.delete(id);
            reply.send('Profissional deletado com sucesso');
        } catch (error) {
            reply.status(500).send('Erro ao deletar profissional');
        }
    }
}

export default new ProfessionalController();