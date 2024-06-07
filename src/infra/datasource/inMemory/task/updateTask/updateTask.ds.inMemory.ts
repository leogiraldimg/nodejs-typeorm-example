import { TaskRepositoryInMemory } from "..";
import {
    UpdateTaskDsGateway,
    ListTaskByIdDsResponseModel,
    UpdateTaskDsResponseModel,
    UpdateTaskDsRequestModel,
} from "@/useCases/task";

class UpdateTaskDsInMemory implements UpdateTaskDsGateway {
    private repository: TaskRepositoryInMemory;

    constructor(repository: TaskRepositoryInMemory) {
        this.repository = repository;
    }

    getById(id: string): Promise<UpdateTaskDsResponseModel | null> {
        const entity = this.repository.findOneById(id);

        return Promise.resolve(
            entity && new ListTaskByIdDsResponseModel(entity)
        );
    }

    update(
        requestModel: UpdateTaskDsRequestModel
    ): Promise<UpdateTaskDsResponseModel> {
        const entity = this.repository.findOneByOrFail(requestModel.id);

        entity.description = requestModel.description;
        entity.dueDate = requestModel.dueDate;
        entity.priority = requestModel.priority;
        entity.status = requestModel.status;
        entity.title = requestModel.title;
        entity.updatedAt = new Date();

        this.repository.save(entity);

        return Promise.resolve(new UpdateTaskDsResponseModel(entity));
    }
}

export { UpdateTaskDsInMemory };
