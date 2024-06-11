import {
    ListTasksResponseModel,
    ListTasksInvalidPaginationParameterException,
} from "..";

interface ListTasksOutputBoundary {
    presentSuccess(
        responseModel: ListTasksResponseModel
    ): ListTasksResponseModel;

    presentInvalidPaginationParameter(
        exception: ListTasksInvalidPaginationParameterException
    ): ListTasksResponseModel;
}

export { ListTasksOutputBoundary };
