import {
    EntityNotFoundException,
    TaskDataMapperInMemory,
    TaskFactoryInMemory,
    TaskRepositoryInMemory,
} from "@/infra/datasource/inMemory";

describe("TaskRepositoryInMemory", () => {
    let repository: TaskRepositoryInMemory;

    let task: TaskDataMapperInMemory;

    beforeEach(() => {
        repository = new TaskRepositoryInMemory();

        task = TaskFactoryInMemory.createTask({
            title: "title",
            description: "description",
            status: "todo",
            priority: "low",
            dueDate: new Date(),
            createdAt: new Date(),
        });
    });

    describe("save", () => {
        it("should return saved task", () => {
            const result = repository.save(task);

            expect(result).toEqual({ ...task, id: expect.any(String) });
        });
    });

    describe("findOneById", () => {
        it("should return null when not exists", () => {
            const result = repository.findOneById("1");

            expect(result).toBeNull();
        });

        it("should return task when exists", () => {
            const expectedTask = repository.save(task);

            const result = repository.findOneById(expectedTask.id);

            expect(result).toEqual(expectedTask);
        });
    });

    describe("findOneByOrFail", () => {
        it("should return task when exists", () => {
            const expectedTask = repository.save(task);

            const result = repository.findOneByOrFail(expectedTask.id);

            expect(result).toEqual(expectedTask);
        });

        it("should throw EntityNotFoundException when not exists", () => {
            expect(() => repository.findOneByOrFail("1")).toThrow(
                new EntityNotFoundException("Tarefa com id 1 não encontrada")
            );
        });
    });

    describe("remove", () => {
        it("should remove task", () => {
            repository.save(task);

            repository.remove(task.id);

            const result = repository.findOneById(task.id);
            expect(result).toBeNull();
        });
    });
});
