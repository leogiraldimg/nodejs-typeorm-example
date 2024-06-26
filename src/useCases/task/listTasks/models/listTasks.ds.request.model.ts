class ListTasksDsRequestModel {
    page?: number;
    pageSize?: number;
    sortBy?: string;
    sortOrder?: "ASC" | "DESC";
    filters: {
        title?: string;
        description?: string;
        status?: "todo" | "inProgress" | "done";
        priority?: "low" | "medium" | "high" | "critical";
        dueDate?: {
            startInterval?: {
                value: Date;
                operator: "gt" | "gte";
            };
            endInterval?: {
                value: Date;
                operator: "lt" | "lte";
            };
            exactValue?: Date;
        };
    };

    constructor(params: {
        page?: number;
        pageSize?: number;
        sortBy?: string;
        sortOrder?: "ASC" | "DESC";
        filters: {
            title?: string;
            description?: string;
            status?: "todo" | "inProgress" | "done";
            priority?: "low" | "medium" | "high" | "critical";
            dueDate?: {
                startInterval?: {
                    value: Date;
                    operator: "gt" | "gte";
                };
                endInterval?: {
                    value: Date;
                    operator: "lt" | "lte";
                };
                exactValue?: Date;
            };
        };
    }) {
        const { page, pageSize, sortBy, sortOrder, filters } = params;
        this.page = page;
        this.pageSize = pageSize;
        this.sortBy = sortBy;
        this.sortOrder = sortOrder;
        this.filters = filters;
    }
}

export { ListTasksDsRequestModel };
