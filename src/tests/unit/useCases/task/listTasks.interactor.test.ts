import {
    listTasksDsGatewayMock,
    listTasksOutputBoundaryMock,
} from "@/tests/unit/mocks/task";

import {
    ListTasksDsResponseModel,
    ListTasksInteractor,
    ListTasksRequestModel,
    ListTasksResponseModel,
} from "@/useCases/task";

describe("ListTasksInteractor", () => {
    let interactor: ListTasksInteractor;

    let requestModel: ListTasksRequestModel;
    let responseModel: ListTasksResponseModel;
    let dsResponseModel: ListTasksDsResponseModel;

    beforeEach(() => {
        jest.clearAllMocks();

        interactor = new ListTasksInteractor(
            listTasksDsGatewayMock,
            listTasksOutputBoundaryMock
        );

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
            },
        });
        responseModel = new ListTasksResponseModel({
            pagination: {
                currentPage: 1,
                nextPage: null,
                previousPage: null,
                totalCount: 10,
                totalPages: 1,
            },
            tasks: [
                {
                    id: "1",
                    title: "Task 1",
                    description: "Task 1 description",
                    status: "todo",
                    priority: "low",
                    dueDate: new Date("2020-01-01T00:00:00.000Z"),
                },
            ],
        });
        dsResponseModel = new ListTasksDsResponseModel({
            pagination: {
                currentPage: 1,
                nextPage: null,
                previousPage: null,
                totalCount: 10,
                totalPages: 1,
            },
            tasks: [
                {
                    id: "1",
                    title: "Task 1",
                    description: "Task 1 description",
                    status: "todo",
                    priority: "low",
                    dueDate: new Date("2020-01-01T00:00:00.000Z"),
                },
            ],
        });
    });

    describe("list", () => {
        beforeEach(() => {
            listTasksDsGatewayMock.list.mockResolvedValue(dsResponseModel);
            listTasksOutputBoundaryMock.presentSuccess.mockReturnValue(
                responseModel
            );
            listTasksOutputBoundaryMock.presentInvalidPaginationParameter.mockImplementation(
                () => {
                    throw new Error("Invalid pagination parameter");
                }
            );
        });

        it("should return success", async () => {
            const result = await interactor.list(requestModel);

            expect(result).toEqual(responseModel);
        });

        it("should return success when due date is not given", async () => {
            requestModel.filters.dueDate = undefined;

            const result = await interactor.list(requestModel);

            expect(result).toEqual(responseModel);
        });

        it("should return exception when error listing tasks", async () => {
            listTasksDsGatewayMock.list.mockRejectedValue(new Error("Error"));

            await expect(interactor.list(requestModel)).rejects.toThrow(
                "Error"
            );
        });

        it("should return exception when page is smaller than 1", async () => {
            requestModel.page = 0;

            await expect(interactor.list(requestModel)).rejects.toThrow(
                "Invalid pagination parameter"
            );
        });

        it("should return exception when pageSize is smaller than 1", async () => {
            requestModel.pageSize = 0;

            await expect(interactor.list(requestModel)).rejects.toThrow(
                "Invalid pagination parameter"
            );
        });

        it("should return exception when sortBy is empty", async () => {
            requestModel.sortBy = "";

            await expect(interactor.list(requestModel)).rejects.toThrow(
                "Invalid pagination parameter"
            );
        });

        it("should return exception when due date start interval is defined but end internal is not", async () => {
            requestModel.filters.dueDate = {
                startInterval: {
                    operator: "gt",
                    value: new Date("2020-01-01T00:00:00.000Z"),
                },
            };

            await expect(interactor.list(requestModel)).rejects.toThrow(
                "Invalid pagination parameter"
            );
        });

        it("should return exception when due date end interval is defined but start internal is not", async () => {
            requestModel.filters.dueDate = {
                endInterval: {
                    operator: "lt",
                    value: new Date("2020-01-01T00:00:00.000Z"),
                },
            };

            await expect(interactor.list(requestModel)).rejects.toThrow(
                "Invalid pagination parameter"
            );
        });

        it("should return exception when due date start interval is greater than due date end interval", async () => {
            requestModel.filters.dueDate = {
                startInterval: {
                    operator: "gt",
                    value: new Date("2020-01-02T00:00:00.000Z"),
                },
                endInterval: {
                    operator: "lt",
                    value: new Date("2020-01-01T00:00:00.000Z"),
                },
            };

            await expect(interactor.list(requestModel)).rejects.toThrow(
                "Invalid pagination parameter"
            );
        });

        it("should return exception when due date exact value is defined and start interval and end interval are too", async () => {
            requestModel.filters.dueDate = {
                exactValue: new Date("2020-01-01T00:00:00.000Z"),
                startInterval: {
                    operator: "gt",
                    value: new Date("2020-01-01T00:00:00.000Z"),
                },
                endInterval: {
                    operator: "lt",
                    value: new Date("2020-01-01T00:00:00.000Z"),
                },
            };

            await expect(interactor.list(requestModel)).rejects.toThrow(
                "Invalid pagination parameter"
            );
        });
    });
});
