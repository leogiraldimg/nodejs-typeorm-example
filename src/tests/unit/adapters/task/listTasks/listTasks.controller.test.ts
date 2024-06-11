import { listTasksInputBoundaryMock } from "@/tests/unit/mocks/task";

import { ListTasksController } from "@/adapters/task";
import { ListTasksRequestModel, ListTasksResponseModel } from "@/useCases/task";

describe("ListTasksController", () => {
    let controller: ListTasksController;

    let requestModel: ListTasksRequestModel;
    let responseModel: ListTasksResponseModel;

    beforeEach(() => {
        jest.clearAllMocks();

        controller = new ListTasksController(listTasksInputBoundaryMock);

        requestModel = new ListTasksRequestModel({
            page: 1,
            pageSize: 10,
            sortBy: "title",
            sortOrder: "ASC",
            filters: {
                description: "Task 1 description",
                title: "Task 1",
                dueDate: {
                    exactValue: new Date("2020-01-01T00:00:00.000Z"),
                },
                priority: "low",
                status: "todo",
            },
        });

        responseModel = new ListTasksResponseModel({
            tasks: [
                {
                    id: "1",
                    description: "Task 1 description",
                    dueDate: new Date("2020-01-01T00:00:00.000Z"),
                    title: "Task 1",
                    priority: "low",
                    status: "todo",
                },
            ],
            pagination: {
                currentPage: 1,
                totalPages: 1,
                nextPage: null,
                previousPage: null,
                totalCount: 1,
            },
        });
    });

    describe("list", () => {
        it("should return response model", async () => {
            listTasksInputBoundaryMock.list.mockResolvedValue(responseModel);

            const result = await controller.list(requestModel);

            expect(result).toEqual(responseModel);
        });
    });
});
