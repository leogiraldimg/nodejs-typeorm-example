import { DataSource } from "typeorm";
import { Seeder, SeederFactoryManager, runSeeder } from "typeorm-extension";
import { TaskSeederTypeorm, taskSeederFactoryTypeorm } from "./task";

class SeederTypeorm implements Seeder {
    async run(ds: DataSource, _factoryManager: SeederFactoryManager) {
        await runSeeder(ds, TaskSeederTypeorm, {
            factories: [taskSeederFactoryTypeorm],
        });
    }
}

export { SeederTypeorm };
