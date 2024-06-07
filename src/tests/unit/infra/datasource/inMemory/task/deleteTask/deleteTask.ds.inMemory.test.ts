import { taskRepositoryInMemoryMock } from "@/tests/unit/mocks/task";

import {
    DeleteTaskDsInMemory,
    TaskDataMapperInMemory,
    TaskFactoryInMemory,
} from "@/infra/datasource/inMemory";

describe("DeleteTaskDsInMemory", () => {
    let ds: DeleteTaskDsInMemory;

    let dataMapper: TaskDataMapperInMemory;

    beforeEach(() => {
        jest.clearAllMocks();

        ds = new DeleteTaskDsInMemory(taskRepositoryInMemoryMock);

        dataMapper = TaskFactoryInMemory.createTask({
            id: "1",
            title: "Task 1",
            description: "Task 1 description",
            dueDate: new Date("2020-01-01T00:00:00.000Z"),
            priority: "low",
            status: "todo",
            createdAt: new Date("2020-01-01T00:00:00.000Z"),
        });
    });

    describe("existsById", () => {
        it("should return true when exists", async () => {
            taskRepositoryInMemoryMock.findOneById.mockReturnValue(dataMapper);

            const result = await ds.existsById("1");

            expect(result).toBeTruthy();
        });

        it("should return false when not exists", async () => {
            taskRepositoryInMemoryMock.findOneById.mockReturnValue(null);

            const result = await ds.existsById("1");

            expect(result).toBeFalsy();
        });
    });

    describe("remove", () => {
        it("should return undefined", async () => {
            taskRepositoryInMemoryMock.findOneByOrFail.mockReturnValue(
                dataMapper
            );

            const result = await ds.remove("1");

            expect(result).toBeUndefined();
        });
    });
});
