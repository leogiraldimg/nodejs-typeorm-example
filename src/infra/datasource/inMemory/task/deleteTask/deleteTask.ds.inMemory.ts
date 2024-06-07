import { TaskRepositoryInMemory } from "..";
import { DeleteTaskDsGateway } from "@/useCases/task";

class DeleteTaskDsInMemory implements DeleteTaskDsGateway {
    private repository: TaskRepositoryInMemory;

    constructor(repository: TaskRepositoryInMemory) {
        this.repository = repository;
    }

    existsById(id: string): Promise<boolean> {
        const task = this.repository.findOneById(id);

        return Promise.resolve(!!task);
    }

    remove(id: string): Promise<void> {
        this.repository.remove(id);
        return Promise.resolve();
    }
}

export { DeleteTaskDsInMemory };
