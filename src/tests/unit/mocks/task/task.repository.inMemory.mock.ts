import { mock } from "jest-mock-extended";

import { TaskRepositoryInMemory } from "@/infra/datasource/inMemory/task";

const taskRepositoryInMemoryMock = mock<TaskRepositoryInMemory>();

export { taskRepositoryInMemoryMock };
