import {
    And,
    FindOptionsWhere,
    LessThan,
    LessThanOrEqual,
    Like,
    MoreThan,
    MoreThanOrEqual,
} from "typeorm";
import { TaskDataMapperTypeorm, TaskRepositoryTypeorm } from "..";
import {
    ListTasksDsGateway,
    ListTasksDsRequestModel,
    ListTasksDsResponseModel,
} from "@/useCases/task";

class ListTasksDsTypeorm implements ListTasksDsGateway {
    private repository: TaskRepositoryTypeorm;

    constructor(repository: TaskRepositoryTypeorm) {
        this.repository = repository;
    }

    async list(
        requestModel: ListTasksDsRequestModel
    ): Promise<ListTasksDsResponseModel> {
        const { page, pageSize, sortBy, sortOrder, filters } = requestModel;
        const { dueDate } = filters;

        const [tasks, totalCount] = await this.repository.findAndCount({
            skip: (page - 1) * pageSize,
            take: pageSize,
            /* eslint-disable indent */
            order: sortBy
                ? {
                      [sortBy]: sortOrder || "ASC",
                  }
                : undefined,
            /* eslint-disable indent */
            where: {
                ...this.buildFiltersQuery(filters),
                ...this.buildDateQuery(dueDate),
            },
        });

        return new ListTasksDsResponseModel({
            pagination: {
                currentPage: page,
                nextPage:
                    page < Math.ceil(totalCount / pageSize) ? page + 1 : null,
                previousPage: page === 1 ? null : page - 1,
                totalCount,
                totalPages: Math.ceil(totalCount / pageSize),
            },
            tasks: tasks.map((task) => ({
                description: task.description,
                dueDate: task.dueDate,
                id: task.id,
                priority: task.priority,
                status: task.status,
                title: task.title,
            })),
        });
    }

    private buildFiltersQuery(
        filters: ListTasksDsRequestModel["filters"]
    ): FindOptionsWhere<TaskDataMapperTypeorm> {
        const { title, description, status, priority } = filters;

        return {
            description: description ? Like(description) : undefined,
            priority: priority,
            status: status,
            title: title ? Like(title) : undefined,
        };
    }

    private buildDateQuery(
        dueDate: ListTasksDsRequestModel["filters"]["dueDate"]
    ): FindOptionsWhere<TaskDataMapperTypeorm> {
        if (dueDate) {
            const { startInterval, endInterval, exactValue } = dueDate;
            if (exactValue) {
                return { dueDate: exactValue };
            } else if (startInterval && endInterval) {
                return {
                    dueDate: And(
                        startInterval.operator === "gt"
                            ? MoreThan(startInterval.value)
                            : MoreThanOrEqual(startInterval.value),
                        endInterval.operator === "lt"
                            ? LessThan(endInterval.value)
                            : LessThanOrEqual(endInterval.value)
                    ),
                };
            }
        }

        return {
            dueDate: undefined,
        };
    }
}

export { ListTasksDsTypeorm };
