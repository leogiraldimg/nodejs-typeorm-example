import { ZodError } from "zod";
import { FastifyReply, FastifyRequest } from "fastify";

import {
    StandardResponseError,
    StandardResponseSuccess,
    insertTaskSchema,
    updateTaskSchema,
    taskIdSchema,
    listTasksSchema,
    RequestParamsId,
} from "..";
import {
    CreateTaskControllerInputBoundary,
    DeleteTaskControllerInputBoundary,
    ListTaskByIdControllerInputBoundary,
    ListTasksControllerInputBoundary,
    UpdateTaskControllerInputBoundary,
} from "@/adapters/task";
import {
    InvalidAttributeException,
    ResourceNotFoundException,
    InvalidPaginationParameterException,
} from "@/adapters/exceptions";
import { ListTasksRequestModel } from "@/useCases/task";

class TaskController {
    private createTaskInputBoundary: CreateTaskControllerInputBoundary;
    private updateTaskInputBoundary: UpdateTaskControllerInputBoundary;
    private deleteTaskInputBoundary: DeleteTaskControllerInputBoundary;
    private listTaskByIdInputBoundary: ListTaskByIdControllerInputBoundary;
    private listTasksInputBoundary: ListTasksControllerInputBoundary;

    constructor(
        createTaskInputBoundary: CreateTaskControllerInputBoundary,
        updateTaskInputBoundary: UpdateTaskControllerInputBoundary,
        deleteTaskInputBoundary: DeleteTaskControllerInputBoundary,
        listTaskByIdInputBoundary: ListTaskByIdControllerInputBoundary,
        listTasksInputBoundary: ListTasksControllerInputBoundary
    ) {
        this.createTaskInputBoundary = createTaskInputBoundary;
        this.updateTaskInputBoundary = updateTaskInputBoundary;
        this.deleteTaskInputBoundary = deleteTaskInputBoundary;
        this.listTaskByIdInputBoundary = listTaskByIdInputBoundary;
        this.listTasksInputBoundary = listTasksInputBoundary;
    }

    async insert(request: FastifyRequest, reply: FastifyReply) {
        try {
            const task = await this.createTaskInputBoundary.create(
                insertTaskSchema.parse(request.body)
            );

            reply.status(201).send(
                new StandardResponseSuccess({
                    content: task,
                    status: 201,
                    message: "Tarefa criada com sucesso",
                })
            );
        } catch (error) {
            const { message, status } = this.formatError(error);
            reply.status(status).send(
                new StandardResponseError({
                    message,
                    status,
                })
            );
        }
    }

    async update(
        request: FastifyRequest<{
            Params: RequestParamsId;
        }>,
        reply: FastifyReply
    ) {
        try {
            const { id } = request.params;
            const task = await this.updateTaskInputBoundary.update({
                ...updateTaskSchema.parse(request.body),
                id: taskIdSchema.parse(id),
            });

            reply.status(200).send(
                new StandardResponseSuccess({
                    content: task,
                    status: 200,
                    message: "Tarefa alterada com sucesso",
                })
            );
        } catch (error) {
            const { message, status } = this.formatError(error);
            reply.status(status).send(
                new StandardResponseError({
                    message,
                    status,
                })
            );
        }
    }

    async findAllPaged(request: FastifyRequest, reply: FastifyReply) {
        try {
            const {
                page,
                pageSize,
                sort,
                dueDate,
                description,
                dueDate_gt,
                dueDate_gte,
                dueDate_lt,
                dueDate_lte,
                priority,
                status,
                title,
            } = listTasksSchema.parse(request.query);
            const result = await this.listTasksInputBoundary.list(
                new ListTasksRequestModel({
                    page,
                    pageSize,
                    sortBy: sort && sort.sortBy,
                    sortOrder: sort && sort.sortOrder,
                    filters: {
                        dueDate: {
                            exactValue: dueDate,
                            startInterval:
                                (dueDate_gt && {
                                    value: dueDate_gt,
                                    operator: "gt",
                                }) ||
                                (dueDate_gte && {
                                    value: dueDate_gte,
                                    operator: "gte",
                                }),
                            endInterval:
                                (dueDate_lt && {
                                    value: dueDate_lt,
                                    operator: "lt",
                                }) ||
                                (dueDate_lte && {
                                    value: dueDate_lte,
                                    operator: "lte",
                                }),
                        },
                        description,
                        priority,
                        status,
                        title,
                    },
                })
            );

            reply.status(200).send(
                new StandardResponseSuccess({
                    content: result.tasks,
                    status: 200,
                    message: "Tarefas encontradas com sucesso",
                    pagination: result.pagination,
                })
            );
        } catch (error) {
            const { message, status } = this.formatError(error);
            reply.status(status).send(
                new StandardResponseError({
                    message,
                    status,
                })
            );
        }
    }

    async findById(
        request: FastifyRequest<{ Params: RequestParamsId }>,
        reply: FastifyReply
    ) {
        try {
            const { id } = request.params;
            const task = await this.listTaskByIdInputBoundary.listById(
                taskIdSchema.parse(id)
            );

            reply.status(200).send(
                new StandardResponseSuccess({
                    content: task,
                    status: 200,
                    message: "Tarefa encontrada com sucesso",
                })
            );
        } catch (error) {
            const { message, status } = this.formatError(error);
            reply.status(status).send(
                new StandardResponseError({
                    message,
                    status,
                })
            );
        }
    }

    async delete(
        request: FastifyRequest<{ Params: RequestParamsId }>,
        reply: FastifyReply
    ) {
        try {
            const { id } = request.params;
            await this.deleteTaskInputBoundary.delete(taskIdSchema.parse(id));

            reply.status(204).send();
        } catch (error) {
            const { message, status } = this.formatError(error);
            reply.status(status).send(
                new StandardResponseError({
                    message,
                    status,
                })
            );
        }
    }

    private formatError(error: unknown): { message: string; status: number } {
        if (error instanceof InvalidAttributeException) {
            return {
                message: error.message,
                status: 400,
            };
        }

        if (error instanceof ResourceNotFoundException) {
            return {
                message: error.message,
                status: 404,
            };
        }

        if (error instanceof ZodError) {
            return {
                message: error.issues[0].message,
                status: 400,
            };
        }

        if (error instanceof InvalidPaginationParameterException) {
            return {
                message: error.message,
                status: 400,
            };
        }

        return {
            message: `Erro interno: ${JSON.stringify(error)}`,
            status: 500,
        };
    }
}

export { TaskController };
