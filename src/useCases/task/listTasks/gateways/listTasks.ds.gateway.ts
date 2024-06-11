import { ListTasksDsRequestModel, ListTasksDsResponseModel } from "..";

interface ListTasksDsGateway {
    list(
        requestModel: ListTasksDsRequestModel
    ): Promise<ListTasksDsResponseModel>;
}

export { ListTasksDsGateway };
