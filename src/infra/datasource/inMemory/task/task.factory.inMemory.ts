import { v4 as uuidv4 } from "uuid";

import { TaskDataMapperInMemory } from ".";

class TaskFactoryInMemory {
    static createTask(params: {
        id?: TaskDataMapperInMemory["id"];
        title: TaskDataMapperInMemory["title"];
        description: TaskDataMapperInMemory["description"];
        status: TaskDataMapperInMemory["status"];
        priority: TaskDataMapperInMemory["priority"];
        dueDate: TaskDataMapperInMemory["dueDate"];
        createdAt: TaskDataMapperInMemory["createdAt"];
    }): TaskDataMapperInMemory {
        const { id, title, description, status, priority, dueDate, createdAt } =
            params;
        const dataMapper = new TaskDataMapperInMemory();

        dataMapper.id = id || uuidv4();
        dataMapper.title = title;
        dataMapper.description = description;
        dataMapper.status = status;
        dataMapper.priority = priority;
        dataMapper.dueDate = dueDate;
        dataMapper.createdAt = createdAt;

        return dataMapper;
    }
}

export { TaskFactoryInMemory };
