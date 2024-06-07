import { TaskRepositoryInMemory, TaskFactoryInMemory } from "..";
import {
    CreateTaskDsGateway,
    CreateTaskDsRequestModel,
    CreateTaskDsResponseModel,
} from "@/useCases/task";

class CreateTaskDsInMemory implements CreateTaskDsGateway {
    private repository: TaskRepositoryInMemory;

    constructor(repository: TaskRepositoryInMemory) {
        this.repository = repository;
    }

    save(
        requestModel: CreateTaskDsRequestModel
    ): Promise<CreateTaskDsResponseModel> {
        let entity = TaskFactoryInMemory.createTask(requestModel);
        entity = this.repository.save(entity);

        return Promise.resolve(new CreateTaskDsResponseModel(entity));
    }
}

export { CreateTaskDsInMemory };
