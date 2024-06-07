import { TaskRepositoryInMemory } from "..";
import {
    ListTaskByIdDsGateway,
    ListTaskByIdDsResponseModel,
} from "@/useCases/task";

class ListTaskByIdDsInMemory implements ListTaskByIdDsGateway {
    private repository: TaskRepositoryInMemory;

    constructor(repository: TaskRepositoryInMemory) {
        this.repository = repository;
    }

    getById(id: string): Promise<ListTaskByIdDsResponseModel | null> {
        const entity = this.repository.findOneById(id);

        return Promise.resolve(
            entity && new ListTaskByIdDsResponseModel(entity)
        );
    }
}

export { ListTaskByIdDsInMemory };
