class ListTasksResponseModel {
    tasks: {
        id: string;
        title: string;
        description: string;
        status: "todo" | "inProgress" | "done";
        priority: "low" | "medium" | "high" | "critical";
        dueDate: Date;
    }[];
    pagination: {
        currentPage: number;
        totalPages: number;
        nextPage: number | null;
        previousPage: number | null;
        totalCount: number;
    };

    constructor(params: {
        tasks: {
            id: string;
            title: string;
            description: string;
            status: "todo" | "inProgress" | "done";
            priority: "low" | "medium" | "high" | "critical";
            dueDate: Date;
        }[];
        pagination: {
            currentPage: number;
            totalPages: number;
            nextPage: number | null;
            previousPage: number | null;
            totalCount: number;
        };
    }) {
        const { tasks, pagination } = params;
        this.tasks = tasks;
        this.pagination = pagination;
    }
}

export { ListTasksResponseModel };
