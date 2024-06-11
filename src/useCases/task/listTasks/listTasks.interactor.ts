import {
    ListTasksDsGateway,
    ListTasksInputBoundary,
    ListTasksOutputBoundary,
    ListTasksRequestModel,
    ListTasksResponseModel,
    ListTasksInvalidPaginationParameterException,
} from ".";

class ListTasksInteractor implements ListTasksInputBoundary {
    private dsGateway: ListTasksDsGateway;
    private outputBoundary: ListTasksOutputBoundary;

    constructor(
        dsGateway: ListTasksDsGateway,
        outputBoundary: ListTasksOutputBoundary
    ) {
        this.dsGateway = dsGateway;
        this.outputBoundary = outputBoundary;
    }

    async list(
        requestModel: ListTasksRequestModel
    ): Promise<ListTasksResponseModel> {
        try {
            this.validateRequestModel(requestModel);
            const result = await this.dsGateway.list(requestModel);
            return this.outputBoundary.presentSuccess(
                new ListTasksResponseModel(result)
            );
        } catch (error) {
            if (error instanceof ListTasksInvalidPaginationParameterException) {
                return this.outputBoundary.presentInvalidPaginationParameter(
                    error
                );
            } else {
                throw error;
            }
        }
    }

    private validateRequestModel(requestModel: ListTasksRequestModel) {
        this.validatePagination(requestModel);
        this.validateSortBy(requestModel);
        this.validateDueDate(requestModel.filters.dueDate);
    }

    private validatePagination(requestModel: ListTasksRequestModel) {
        if (requestModel.page !== undefined && requestModel.page < 1) {
            throw new ListTasksInvalidPaginationParameterException(
                "O parametro 'page' deve ser maior ou igual a 1"
            );
        }

        if (requestModel.pageSize !== undefined && requestModel.pageSize < 1) {
            throw new ListTasksInvalidPaginationParameterException(
                "O parametro 'pageSize' deve ser maior ou igual a 1"
            );
        }
    }

    private validateSortBy(requestModel: ListTasksRequestModel) {
        if (requestModel.sortBy === "") {
            throw new ListTasksInvalidPaginationParameterException(
                "O parametro 'sortBy' não deve estar vazio"
            );
        }
    }

    private validateDueDate(
        dueDate: ListTasksRequestModel["filters"]["dueDate"]
    ) {
        if (!dueDate) return;

        this.checkStartIntervalWithoutEndInterval(dueDate);
        this.checkEndIntervalWithoutStartInterval(dueDate);
        this.checkStartGreaterThanEndInterval(dueDate);
        this.checkExactValueWithIntervals(dueDate);
    }

    private checkStartIntervalWithoutEndInterval(
        dueDate: NonNullable<ListTasksRequestModel["filters"]["dueDate"]>
    ) {
        if (dueDate.startInterval && !dueDate.endInterval) {
            throw new ListTasksInvalidPaginationParameterException(
                "O parametro 'dueDate.endInterval' deve ser definido quando o 'dueDate.startInterval' for definido"
            );
        }
    }

    private checkEndIntervalWithoutStartInterval(
        dueDate: NonNullable<ListTasksRequestModel["filters"]["dueDate"]>
    ) {
        if (!dueDate.startInterval && dueDate.endInterval) {
            throw new ListTasksInvalidPaginationParameterException(
                "O parametro 'dueDate.startInterval' deve ser definido quando o 'dueDate.endInterval' for definido"
            );
        }
    }

    private checkStartGreaterThanEndInterval(
        dueDate: NonNullable<ListTasksRequestModel["filters"]["dueDate"]>
    ) {
        if (
            dueDate.startInterval &&
            dueDate.endInterval &&
            dueDate.startInterval.value > dueDate.endInterval.value
        ) {
            throw new ListTasksInvalidPaginationParameterException(
                "O parametro 'dueDate.startInterval' deve ser menor ou igual ao 'dueDate.endInterval'"
            );
        }
    }

    private checkExactValueWithIntervals(
        dueDate: NonNullable<ListTasksRequestModel["filters"]["dueDate"]>
    ) {
        if (
            dueDate.exactValue &&
            (dueDate.startInterval || dueDate.endInterval)
        ) {
            throw new ListTasksInvalidPaginationParameterException(
                "O parametro 'dueDate.exactValue' não pode ser definido quando o 'dueDate.startInterval' ou 'dueDate.endInterval' forem definidos"
            );
        }
    }
}

export { ListTasksInteractor };
