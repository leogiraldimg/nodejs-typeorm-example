import { v4 as uuidv4 } from "uuid";

import { EntityNotFoundException, TaskDataMapperInMemory } from ".";

class TaskRepositoryInMemory {
    private entities: TaskDataMapperInMemory[] = [];

    save(entity: TaskDataMapperInMemory): TaskDataMapperInMemory {
        this.entities.push({ ...entity, id: uuidv4() });
        return this.entities[this.entities.length - 1];
    }

    findOneById(id: string): TaskDataMapperInMemory | null {
        return this.entities.find((task) => task.id === id) || null;
    }

    findOneByOrFail(id: string): TaskDataMapperInMemory {
        const entity = this.entities.find((task) => task.id === id);

        if (!entity) {
            throw new EntityNotFoundException(
                `Tarefa com id ${id} não encontrada`
            );
        }

        return entity;
    }

    remove(id: string): void {
        this.entities = this.entities.filter((task) => task.id !== id);
    }
}

export { TaskRepositoryInMemory };
