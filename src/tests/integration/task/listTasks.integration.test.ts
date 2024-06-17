import "dotenv/config";
import { DataSource } from "typeorm";
import { runSeeders } from "typeorm-extension";

import {
    TaskDataMapperTypeorm,
    TaskRepositoryTypeorm,
    dsTypeorm,
} from "@/infra/datasource/typeorm";

import { fastify } from "@/app";

describe("Task::listTasks::integration", () => {
    let dsConnected: DataSource;
    let repository: TaskRepositoryTypeorm;

    let existingTask1: TaskDataMapperTypeorm;
    let existingTask2: TaskDataMapperTypeorm;
    let existingTask3: TaskDataMapperTypeorm;

    beforeAll(async () => {
        dsConnected = await dsTypeorm.initialize();
    });

    beforeEach(async () => {
        await runSeeders(dsConnected);

        repository = dsConnected.getRepository(TaskDataMapperTypeorm);

        const existingTasks = await repository.find({});
        existingTask1 = existingTasks[0];
        existingTask2 = existingTasks[1];
        existingTask3 = existingTasks[2];
    });

    afterAll(async () => {
        await dsConnected.destroy();
    });

    it("should return 200, list of tasks and pagination", async () => {
        const response = await fastify.inject({
            method: "GET",
            url: "/tasks",
        });

        expect(response.statusCode).toBe(200);
        expect(response.json().timestamp).toBeDefined();
        expect(response.json().status).toBe(200);
        expect(response.json().error).toBeFalsy();
        expect(response.json().message).toBe("Tarefas encontradas com sucesso");
        expect(response.json().content.length).toBe(10);
        expect(response.json().pagination).toBeDefined();
        expect(response.json().pagination.currentPage).toBe(1);
        expect(response.json().pagination.nextPage).toBe(null);
        expect(response.json().pagination.previousPage).toBe(null);
        expect(response.json().pagination.totalCount).toBe(10);
        expect(response.json().pagination.totalPages).toBe(1);
    });

    it("should return 200, list of tasks and pagination when page is 2 and pageSize is 5", async () => {
        const response = await fastify.inject({
            method: "GET",
            url: "/tasks?page=2&pageSize=5",
        });

        expect(response.statusCode).toBe(200);
        expect(response.json().timestamp).toBeDefined();
        expect(response.json().status).toBe(200);
        expect(response.json().error).toBeFalsy();
        expect(response.json().message).toBe("Tarefas encontradas com sucesso");
        expect(response.json().content.length).toBe(5);
        expect(response.json().pagination).toBeDefined();
        expect(response.json().pagination.currentPage).toBe(2);
        expect(response.json().pagination.nextPage).toBe(null);
        expect(response.json().pagination.previousPage).toBe(1);
        expect(response.json().pagination.totalCount).toBe(10);
        expect(response.json().pagination.totalPages).toBe(2);
    });

    it("should return 200, list of tasks and pagination when sort equals 'title,ASC'", async () => {
        const response = await fastify.inject({
            method: "GET",
            url: "/tasks?sort=title,ASC",
        });

        expect(response.statusCode).toBe(200);
        expect(response.json().timestamp).toBeDefined();
        expect(response.json().status).toBe(200);
        expect(response.json().error).toBeFalsy();
        expect(response.json().message).toBe("Tarefas encontradas com sucesso");
        expect(response.json().content.length).toBe(10);
        const titles = response.json().content.map((task) => task.title);
        const sortedTitles = [...titles].sort((a, b) =>
            a.localeCompare(b, "pt-BR")
        );

        expect(titles).toEqual(sortedTitles);
    });

    it("should return 200, list of tasks and pagination when sort equals 'title,DESC'", async () => {
        const response = await fastify.inject({
            method: "GET",
            url: "/tasks?sort=title,DESC",
        });

        expect(response.statusCode).toBe(200);
        expect(response.json().timestamp).toBeDefined();
        expect(response.json().status).toBe(200);
        expect(response.json().error).toBeFalsy();
        expect(response.json().message).toBe("Tarefas encontradas com sucesso");
        expect(response.json().content.length).toBe(10);
        const titles = response.json().content.map((task) => task.title);
        const sortedTitles = [...titles].sort((a, b) =>
            b.localeCompare(a, "pt-BR")
        );

        expect(titles).toEqual(sortedTitles);
    });

    it("should return 200, list of tasks and pagination when filter by title", async () => {
        const response = await fastify.inject({
            method: "GET",
            url: `/tasks?title=${existingTask1.title}`,
        });

        expect(response.statusCode).toBe(200);
        expect(response.json().timestamp).toBeDefined();
        expect(response.json().status).toBe(200);
        expect(response.json().error).toBeFalsy();
        expect(response.json().message).toBe("Tarefas encontradas com sucesso");
        expect(response.json().content.length).toBe(1);
        expect(response.json().content[0].id).toBe(existingTask1.id);
        expect(response.json().content[0].title).toBe(existingTask1.title);
    });

    it("should return 200, list of tasks and pagination when filter by description", async () => {
        const response = await fastify.inject({
            method: "GET",
            url: `/tasks?description=${existingTask1.description}`,
        });

        expect(response.statusCode).toBe(200);
        expect(response.json().timestamp).toBeDefined();
        expect(response.json().status).toBe(200);
        expect(response.json().error).toBeFalsy();
        expect(response.json().message).toBe("Tarefas encontradas com sucesso");
        expect(response.json().content.length).toBe(1);
        expect(response.json().content[0].id).toBe(existingTask1.id);
        expect(response.json().content[0].description).toBe(
            existingTask1.description
        );
    });

    it("should return 200, list of tasks and pagination when filter by status", async () => {
        const response = await fastify.inject({
            method: "GET",
            url: "/tasks?status=todo",
        });

        expect(response.statusCode).toBe(200);
        expect(response.json().timestamp).toBeDefined();
        expect(response.json().status).toBe(200);
        expect(response.json().error).toBeFalsy();
        expect(response.json().message).toBe("Tarefas encontradas com sucesso");
        expect(
            response
                .json()
                .content.every(
                    (task: { status: string }) => task.status === "todo"
                )
        ).toBeTruthy();
    });

    it("should return 200, list of tasks and pagination when filter by priority", async () => {
        const response = await fastify.inject({
            method: "GET",
            url: "/tasks?priority=high",
        });

        expect(response.statusCode).toBe(200);
        expect(response.json().timestamp).toBeDefined();
        expect(response.json().status).toBe(200);
        expect(response.json().error).toBeFalsy();
        expect(response.json().message).toBe("Tarefas encontradas com sucesso");
        expect(
            response
                .json()
                .content.every(
                    (task: { priority: string }) => task.priority === "high"
                )
        ).toBeTruthy();
    });

    it("should return 200, list of tasks and pagination when filter by dueDate", async () => {
        const response = await fastify.inject({
            method: "GET",
            url: `/tasks?dueDate=${existingTask1.dueDate.toISOString()}`,
        });

        expect(response.statusCode).toBe(200);
        expect(response.json().timestamp).toBeDefined();
        expect(response.json().status).toBe(200);
        expect(response.json().error).toBeFalsy();
        expect(response.json().message).toBe("Tarefas encontradas com sucesso");
        expect(response.json().content.length).toBe(1);
        expect(response.json().content[0].id).toBe(existingTask1.id);
        expect(response.json().content[0].dueDate).toBe(
            existingTask1.dueDate.toISOString()
        );
    });

    it("should return 200, list of tasks and pagination when filter by dueDate_gt and dueDate_lt", async () => {
        existingTask1.dueDate = new Date("2022-01-01T00:00:00.000Z");
        existingTask2.dueDate = new Date("2022-01-02T00:00:00.000Z");
        existingTask3.dueDate = new Date("2022-01-03T00:00:00.000Z");
        await repository.save([existingTask1, existingTask2, existingTask3]);

        const response = await fastify.inject({
            method: "GET",
            url: `/tasks?dueDate_gt=${existingTask1.dueDate.toISOString()}&dueDate_lt=${existingTask3.dueDate.toISOString()}`,
        });

        expect(response.statusCode).toBe(200);
        expect(response.json().timestamp).toBeDefined();
        expect(response.json().status).toBe(200);
        expect(response.json().error).toBeFalsy();
        expect(response.json().message).toBe("Tarefas encontradas com sucesso");
        expect(response.json().content.length).toBe(1);
        expect(response.json().content[0].id).toBe(existingTask2.id);
    });

    it("should return 200, list of tasks and pagination when filter by dueDate_gte and dueDate_lte", async () => {
        existingTask1.dueDate = new Date("2022-01-01T00:00:00.000Z");
        existingTask2.dueDate = new Date("2022-01-02T00:00:00.000Z");
        existingTask3.dueDate = new Date("2022-01-03T00:00:00.000Z");
        await repository.save([existingTask1, existingTask2, existingTask3]);

        const response = await fastify.inject({
            method: "GET",
            url: `/tasks?dueDate_gte=${existingTask1.dueDate.toISOString()}&dueDate_lte=${existingTask3.dueDate.toISOString()}`,
        });

        expect(response.statusCode).toBe(200);
        expect(response.json().timestamp).toBeDefined();
        expect(response.json().status).toBe(200);
        expect(response.json().error).toBeFalsy();
        expect(response.json().message).toBe("Tarefas encontradas com sucesso");
        expect(response.json().content.length).toBe(3);
        expect(response.json().content[0].id).toBe(existingTask1.id);
        expect(response.json().content[1].id).toBe(existingTask2.id);
        expect(response.json().content[2].id).toBe(existingTask3.id);
    });

    it("should return 400 when sort is invalid", async () => {
        const response = await fastify.inject({
            method: "GET",
            url: "/tasks?sort=invalid",
        });

        expect(response.statusCode).toBe(400);
        expect(response.json().timestamp).toBeDefined();
        expect(response.json().status).toBe(400);
        expect(response.json().error).toBeTruthy();
        expect(response.json().message).toBe(
            "Parâmetro sort deve ser uma string no formato 'atributo,ASC|DESC'"
        );
        expect(response.json().content).toBeNull();
    });

    it("should return 400 when status is invalid", async () => {
        const response = await fastify.inject({
            method: "GET",
            url: "/tasks?status=invalid",
        });

        expect(response.statusCode).toBe(400);
        expect(response.json().timestamp).toBeDefined();
        expect(response.json().status).toBe(400);
        expect(response.json().error).toBeTruthy();
        expect(response.json().message).toBe(
            "Parâmetro status deve ser 'todo', 'inProgress' ou 'done'"
        );
        expect(response.json().content).toBeNull();
    });

    it("should return 400 when priority is invalid", async () => {
        const response = await fastify.inject({
            method: "GET",
            url: "/tasks?priority=invalid",
        });

        expect(response.statusCode).toBe(400);
        expect(response.json().timestamp).toBeDefined();
        expect(response.json().status).toBe(400);
        expect(response.json().error).toBeTruthy();
        expect(response.json().message).toBe(
            "Parâmetro priority deve ser 'low', 'medium', 'high' ou 'critical'"
        );
        expect(response.json().content).toBeNull();
    });

    it("should return 400 when dueDate is invalid", async () => {
        const response = await fastify.inject({
            method: "GET",
            url: "/tasks?dueDate=invalid",
        });

        expect(response.statusCode).toBe(400);
        expect(response.json().timestamp).toBeDefined();
        expect(response.json().status).toBe(400);
        expect(response.json().error).toBeTruthy();
        expect(response.json().message).toBe(
            "Data deve ser no formato YYYY-MM-DDTHH:MM:SSZ"
        );
        expect(response.json().content).toBeNull();
    });

    it("should return 400 when dueDate_gt is invalid", async () => {
        const response = await fastify.inject({
            method: "GET",
            url: "/tasks?dueDate_gt=invalid",
        });

        expect(response.statusCode).toBe(400);
        expect(response.json().timestamp).toBeDefined();
        expect(response.json().status).toBe(400);
        expect(response.json().error).toBeTruthy();
        expect(response.json().message).toBe(
            "Data deve ser no formato YYYY-MM-DDTHH:MM:SSZ"
        );
        expect(response.json().content).toBeNull();
    });

    it("should return 400 when dueDate_gte is invalid", async () => {
        const response = await fastify.inject({
            method: "GET",
            url: "/tasks?dueDate_gte=invalid",
        });

        expect(response.statusCode).toBe(400);
        expect(response.json().timestamp).toBeDefined();
        expect(response.json().status).toBe(400);
        expect(response.json().error).toBeTruthy();
        expect(response.json().message).toBe(
            "Data deve ser no formato YYYY-MM-DDTHH:MM:SSZ"
        );
        expect(response.json().content).toBeNull();
    });

    it("should return 400 when dueDate_lt is invalid", async () => {
        const response = await fastify.inject({
            method: "GET",
            url: "/tasks?dueDate_lt=invalid",
        });

        expect(response.statusCode).toBe(400);
        expect(response.json().timestamp).toBeDefined();
        expect(response.json().status).toBe(400);
        expect(response.json().error).toBeTruthy();
        expect(response.json().message).toBe(
            "Data deve ser no formato YYYY-MM-DDTHH:MM:SSZ"
        );
        expect(response.json().content).toBeNull();
    });

    it("should return 400 when dueDate_lte is invalid", async () => {
        const response = await fastify.inject({
            method: "GET",
            url: "/tasks?dueDate_lte=invalid",
        });

        expect(response.statusCode).toBe(400);
        expect(response.json().timestamp).toBeDefined();
        expect(response.json().status).toBe(400);
        expect(response.json().error).toBeTruthy();
        expect(response.json().message).toBe(
            "Data deve ser no formato YYYY-MM-DDTHH:MM:SSZ"
        );
        expect(response.json().content).toBeNull();
    });

    it("should return 400 when dueDate_gt is given but dueDate_lt or dueDate_lte is not given", async () => {
        const response = await fastify.inject({
            method: "GET",
            url: "/tasks?dueDate_gt=2022-01-01T00:00:00Z",
        });

        expect(response.statusCode).toBe(400);
        expect(response.json().timestamp).toBeDefined();
        expect(response.json().status).toBe(400);
        expect(response.json().error).toBeTruthy();
        expect(response.json().message).toBe(
            "O parametro 'dueDate.endInterval' deve ser definido quando o 'dueDate.startInterval' for definido"
        );
        expect(response.json().content).toBeNull();
    });

    it("should return 400 when dueDate_gte is given but dueDate_lt or dueDate_lte is not given", async () => {
        const response = await fastify.inject({
            method: "GET",
            url: "/tasks?dueDate_gte=2022-01-01T00:00:00Z",
        });

        expect(response.statusCode).toBe(400);
        expect(response.json().timestamp).toBeDefined();
        expect(response.json().status).toBe(400);
        expect(response.json().error).toBeTruthy();
        expect(response.json().message).toBe(
            "O parametro 'dueDate.endInterval' deve ser definido quando o 'dueDate.startInterval' for definido"
        );
        expect(response.json().content).toBeNull();
    });

    it("should return 400 when dueDate_lt is given but dueDate_gt or dueDate_gte is not given", async () => {
        const response = await fastify.inject({
            method: "GET",
            url: "/tasks?dueDate_lt=2022-01-01T00:00:00Z",
        });

        expect(response.statusCode).toBe(400);
        expect(response.json().timestamp).toBeDefined();
        expect(response.json().status).toBe(400);
        expect(response.json().error).toBeTruthy();
        expect(response.json().message).toBe(
            "O parametro 'dueDate.startInterval' deve ser definido quando o 'dueDate.endInterval' for definido"
        );
        expect(response.json().content).toBeNull();
    });

    it("should return 400 when dueDate_lte is given but dueDate_gt or dueDate_gte is not given", async () => {
        const response = await fastify.inject({
            method: "GET",
            url: "/tasks?dueDate_lte=2022-01-01T00:00:00Z",
        });

        expect(response.statusCode).toBe(400);
        expect(response.json().timestamp).toBeDefined();
        expect(response.json().status).toBe(400);
        expect(response.json().error).toBeTruthy();
        expect(response.json().message).toBe(
            "O parametro 'dueDate.startInterval' deve ser definido quando o 'dueDate.endInterval' for definido"
        );
        expect(response.json().content).toBeNull();
    });

    it("should return 400 when dueDate_gt is more recent than dueDate_lt", async () => {
        const response = await fastify.inject({
            method: "GET",
            url: "/tasks?dueDate_gt=2022-01-02T00:00:00Z&dueDate_lt=2022-01-01T00:00:00Z",
        });

        expect(response.statusCode).toBe(400);
        expect(response.json().timestamp).toBeDefined();
        expect(response.json().status).toBe(400);
        expect(response.json().error).toBeTruthy();
        expect(response.json().message).toBe(
            "O parametro 'dueDate.startInterval' deve ser menor ou igual ao 'dueDate.endInterval'"
        );
        expect(response.json().content).toBeNull();
    });

    it("should return 400 when dueDate, dueDate_gt and dueDate_lt are given", async () => {
        const response = await fastify.inject({
            method: "GET",
            url: "/tasks?dueDate=2022-01-01T00:00:00Z&dueDate_gt=2022-01-01T00:00:00Z&dueDate_lt=2022-01-01T00:00:00Z",
        });

        expect(response.statusCode).toBe(400);
        expect(response.json().timestamp).toBeDefined();
        expect(response.json().status).toBe(400);
        expect(response.json().error).toBeTruthy();
        expect(response.json().message).toBe(
            "O parametro 'dueDate.exactValue' não pode ser definido quando o 'dueDate.startInterval' ou 'dueDate.endInterval' forem definidos"
        );
        expect(response.json().content).toBeNull();
    });

    it("should return 400 when dueDate and dueDate_gte and dueDate_lte are given", async () => {
        const response = await fastify.inject({
            method: "GET",
            url: "/tasks?dueDate=2022-01-01T00:00:00Z&dueDate_gte=2022-01-01T00:00:00Z&dueDate_lte=2022-01-01T00:00:00Z",
        });

        expect(response.statusCode).toBe(400);
        expect(response.json().timestamp).toBeDefined();
        expect(response.json().status).toBe(400);
        expect(response.json().error).toBeTruthy();
        expect(response.json().message).toBe(
            "O parametro 'dueDate.exactValue' não pode ser definido quando o 'dueDate.startInterval' ou 'dueDate.endInterval' forem definidos"
        );
        expect(response.json().content).toBeNull();
    });
});
