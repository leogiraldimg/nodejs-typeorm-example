import {
    MoreThan,
    LessThan,
    LessThanOrEqual,
    MoreThanOrEqual,
    Like,
    And,
} from "typeorm";

import { taskRepositoryTypeormMock } from "@/tests/unit/mocks/task";

import {
    ListTasksDsTypeorm,
    TaskDataMapperTypeorm,
    TaskFactoryTypeorm,
} from "@/infra/datasource/typeorm";
import {
    ListTasksDsRequestModel,
    ListTasksDsResponseModel,
} from "@/useCases/task";

describe("ListTasksDsTypeorm", () => {
    let ds: ListTasksDsTypeorm;

    let requestModel: ListTasksDsRequestModel;
    let responseModel: ListTasksDsResponseModel;
    let dataMapper: TaskDataMapperTypeorm;

    beforeEach(() => {
        jest.clearAllMocks();

        ds = new ListTasksDsTypeorm(taskRepositoryTypeormMock);

        requestModel = new ListTasksDsRequestModel({
            page: 1,
            pageSize: 10,
            filters: {},
        });
        responseModel = new ListTasksDsResponseModel({
            pagination: {
                currentPage: 1,
                nextPage: null,
                previousPage: null,
                totalCount: 1,
                totalPages: 1,
            },
            tasks: [
                {
                    description: "Task 1 description",
                    dueDate: new Date("2020-01-01T00:00:00.000Z"),
                    id: "1",
                    priority: "low",
                    status: "todo",
                    title: "Task 1",
                },
            ],
        });
        dataMapper = TaskFactoryTypeorm.createTask({
            createdAt: new Date("2020-01-01T00:00:00.000Z"),
            description: "Task 1 description",
            dueDate: new Date("2020-01-01T00:00:00.000Z"),
            priority: "low",
            status: "todo",
            title: "Task 1",
            id: "1",
        });
    });

    describe("list", () => {
        beforeEach(() => {
            taskRepositoryTypeormMock.findAndCount.mockResolvedValue([
                [dataMapper],
                1,
            ]);
        });

        it("should return response model", async () => {
            const result = await ds.list(requestModel);

            expect(result).toEqual(responseModel);
        });

        it("should return response model with non null nextPage when page is not last", async () => {
            requestModel.pageSize = 1;
            taskRepositoryTypeormMock.findAndCount.mockResolvedValue([
                [dataMapper],
                2,
            ]);

            const result = await ds.list(requestModel);

            expect(result.pagination.nextPage).toEqual(2);
        });

        it("should return response model with non null previousPage when page is not first", async () => {
            requestModel.page = 2;

            const result = await ds.list(requestModel);

            expect(result.pagination.previousPage).toEqual(1);
        });

        it("should find and count tasks with default ASC order when sortBy is given", async () => {
            requestModel.sortBy = "title";

            await ds.list(requestModel);

            expect(taskRepositoryTypeormMock.findAndCount).toHaveBeenCalledWith(
                expect.objectContaining({
                    order: {
                        title: "ASC",
                    },
                })
            );
        });

        it("should find and count tasks with given order when sortBy and sortOrder are given", async () => {
            requestModel.sortBy = "title";
            requestModel.sortOrder = "DESC";

            await ds.list(requestModel);

            expect(taskRepositoryTypeormMock.findAndCount).toHaveBeenCalledWith(
                expect.objectContaining({
                    order: {
                        title: "DESC",
                    },
                })
            );
        });

        it("should find and count tasks with due date exact value filter when due date exact value is given", async () => {
            requestModel.filters.dueDate = {
                exactValue: new Date("2020-01-01T00:00:00.000Z"),
            };

            await ds.list(requestModel);

            expect(taskRepositoryTypeormMock.findAndCount).toHaveBeenCalledWith(
                expect.objectContaining({
                    where: expect.objectContaining({
                        dueDate: new Date("2020-01-01T00:00:00.000Z"),
                    }),
                })
            );
        });

        it("should find and count tasks with due date range filter when due date range is given", async () => {
            requestModel.filters.dueDate = {
                startInterval: {
                    operator: "gt",
                    value: new Date("2020-01-01T00:00:00.000Z"),
                },
                endInterval: {
                    operator: "lt",
                    value: new Date("2020-01-02T00:00:00.000Z"),
                },
            };

            await ds.list(requestModel);

            expect(taskRepositoryTypeormMock.findAndCount).toHaveBeenCalledWith(
                expect.objectContaining({
                    where: expect.objectContaining({
                        dueDate: And(
                            MoreThan(new Date("2020-01-01T00:00:00.000Z")),
                            LessThan(new Date("2020-01-02T00:00:00.000Z"))
                        ),
                    }),
                })
            );
        });

        it("should find and count tasks with inclusive due date range filter when inclusive due date range is given", async () => {
            requestModel.filters.dueDate = {
                startInterval: {
                    operator: "gte",
                    value: new Date("2020-01-01T00:00:00.000Z"),
                },
                endInterval: {
                    operator: "lte",
                    value: new Date("2020-01-02T00:00:00.000Z"),
                },
            };

            await ds.list(requestModel);

            expect(taskRepositoryTypeormMock.findAndCount).toHaveBeenCalledWith(
                expect.objectContaining({
                    where: expect.objectContaining({
                        dueDate: And(
                            MoreThanOrEqual(
                                new Date("2020-01-01T00:00:00.000Z")
                            ),
                            LessThanOrEqual(
                                new Date("2020-01-02T00:00:00.000Z")
                            )
                        ),
                    }),
                })
            );
        });

        it("should find and count tasks with description like filter when description is given", async () => {
            requestModel.filters.description = "Task 1 description";

            await ds.list(requestModel);

            expect(taskRepositoryTypeormMock.findAndCount).toHaveBeenCalledWith(
                expect.objectContaining({
                    where: expect.objectContaining({
                        description: Like("Task 1 description"),
                    }),
                })
            );
        });

        it("should find and count tasks with title like filter when title is given", async () => {
            requestModel.filters.title = "Task 1";

            await ds.list(requestModel);

            expect(taskRepositoryTypeormMock.findAndCount).toHaveBeenCalledWith(
                expect.objectContaining({
                    where: expect.objectContaining({
                        title: Like("Task 1"),
                    }),
                })
            );
        });
    });
});
