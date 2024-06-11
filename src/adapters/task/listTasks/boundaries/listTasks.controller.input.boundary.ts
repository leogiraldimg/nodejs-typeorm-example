import { ListTasksRequestModel, ListTasksResponseModel } from "@/useCases/task";

interface ListTasksControllerInputBoundary {
    list(requestModel: ListTasksRequestModel): Promise<ListTasksResponseModel>;
}

export { ListTasksControllerInputBoundary };
