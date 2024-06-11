import { InvalidPaginationParameterException } from "@/adapters/exceptions";
import {
    ListTasksInvalidPaginationParameterException,
    ListTasksOutputBoundary,
    ListTasksResponseModel,
} from "@/useCases/task";

class ListTasksPresenter implements ListTasksOutputBoundary {
    presentSuccess(
        responseModel: ListTasksResponseModel
    ): ListTasksResponseModel {
        return responseModel;
    }

    presentInvalidPaginationParameter(
        exception: ListTasksInvalidPaginationParameterException
    ): ListTasksResponseModel {
        throw new InvalidPaginationParameterException(exception.message);
    }
}

export { ListTasksPresenter };
