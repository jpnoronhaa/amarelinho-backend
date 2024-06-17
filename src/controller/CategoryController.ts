import { FastifyRequest, FastifyReply } from "fastify";
import Category from '../models/Category'
import { ICategory } from "../models/Category";

class CategoryController {
    createCategory = async (req: FastifyRequest<{ Body: ICategory }>, res: FastifyReply) => {
        try {
            const category = req.body;
            const createdCategory = await Category.create(category);
            return res.code(201).send({ message: 'Categoria criada com sucesso', category: createdCategory });
        } catch (error) {
            return res.code(400).send({ message: error.message });
        }
    }

    findAllCategories = async (req: FastifyRequest, res: FastifyReply) => {
        try {
            const categories = await Category.findAll();
            res.send(categories);
        } catch (error) {
            res.status(500).send('Erro ao recuperar as categorias');
        }
    }

    findOneCategory = async (req: FastifyRequest<{ Params: { id: number } }>, res: FastifyReply) => {
        try {
            const id = req.params.id;
            const category = await Category.findOne(id);
            if (category) {
                res.send(category);
            } else {
                res.status(404).send('Categoria não encontrada!');
            }
        } catch (error) {
            res.status(500).send('Erro ao recuperar a categoria');
        }
    }

    updateCategory = async (request: FastifyRequest<{ Params: { id: number }, Body: Partial<ICategory> }>, reply: FastifyReply) => {
        try {
            const id = request.params.id
            await Category.update(id, request.body);
            reply.send('Categoria atualizada com sucesso!');
        } catch (error) {
            reply.status(500).send('Erro ao atualizar categoria');
        }
    }
    
    deleteCategory = async (request: FastifyRequest<{ Params: { id: number } }>, reply: FastifyReply) => {
        try {
            const id = request.params.id
            await Category.delete(id);
            reply.send('Categoria deletada com sucesso');
        } catch (error) {
            reply.status(500).send('Erro ao deletar a categoria');
        }
    }
}

export default new CategoryController();