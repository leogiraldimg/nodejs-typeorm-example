class TaskDataMapperInMemory {
    id: string;
    title: string;
    description: string;
    status: "todo" | "inProgress" | "done";
    priority: "low" | "medium" | "high" | "critical";
    dueDate: Date;
    createdAt: Date;
    updatedAt: Date;
}

export { TaskDataMapperInMemory };
