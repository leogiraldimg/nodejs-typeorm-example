import { ListTasksPresenter } from "@/adapters/task";
import {
    ListTasksInvalidPaginationParameterException,
    ListTasksResponseModel,
} from "@/useCases/task";

describe("ListTasksPresenter", () => {
    let presenter: ListTasksPresenter;

    let responseModel: ListTasksResponseModel;

    beforeEach(() => {
        jest.clearAllMocks();

        presenter = new ListTasksPresenter();
        responseModel = new ListTasksResponseModel({
            tasks: [
                {
                    id: "1",
                    description: "Task 1 description",
                    dueDate: new Date("2022-01-01T00:00:00.000Z"),
                    title: "Task 1 title",
                    priority: "low",
                    status: "todo",
                },
            ],
            pagination: {
                currentPage: 1,
                nextPage: 2,
                previousPage: null,
                totalCount: 1,
                totalPages: 1,
            },
        });
    });

    describe("presentSuccess", () => {
        it("should return response model", async () => {
            expect(presenter.presentSuccess(responseModel)).toEqual(
                responseModel
            );
        });
    });

    describe("presentInvalidPaginationParameter", () => {
        it("should throw InvalidPaginationParameterException", async () => {
            const error = new ListTasksInvalidPaginationParameterException(
                "Invalid pagination parameter"
            );

            expect(() =>
                presenter.presentInvalidPaginationParameter(error)
            ).toThrow(
                new ListTasksInvalidPaginationParameterException(error.message)
            );
        });
    });
});
