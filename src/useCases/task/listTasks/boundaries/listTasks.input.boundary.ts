import { ListTasksRequestModel, ListTasksResponseModel } from "..";

interface ListTasksInputBoundary {
    list(requestModel: ListTasksRequestModel): Promise<ListTasksResponseModel>;
}

export { ListTasksInputBoundary };
