import { ListTasksControllerInputBoundary } from "..";
import {
    ListTasksInputBoundary,
    ListTasksRequestModel,
    ListTasksResponseModel,
} from "@/useCases/task";

class ListTasksController implements ListTasksControllerInputBoundary {
    private inputBoundary: ListTasksInputBoundary;

    constructor(inputBoundary: ListTasksInputBoundary) {
        this.inputBoundary = inputBoundary;
    }

    async list(
        requestModel: ListTasksRequestModel
    ): Promise<ListTasksResponseModel> {
        return await this.inputBoundary.list(requestModel);
    }
}

export { ListTasksController };
