import { z } from "zod";

const listTasksSchema = z.object({
    page: z
        .string()
        .optional()
        .transform((page) => Number(page)),
    pageSize: z
        .string()
        .optional()
        .transform((pageSize) => Number(pageSize)),
    sort: z
        .string()
        .regex(/^[a-zA-Z]+,ASC|DESC$/, {
            message:
                "Parâmetro sort deve ser uma string no formato 'atributo,ASC|DESC'",
        })
        .optional()
        .transform((sort) => {
            if (!sort) return undefined;
            const [sortBy, sortOrder] = sort.split(",");
            return { sortBy, sortOrder: sortOrder as "ASC" | "DESC" };
        }),
    title: z.string().optional(),
    description: z.string().optional(),
    status: z
        .enum(["todo", "inProgress", "done"], {
            message: "Parâmetro status deve ser 'todo', 'inProgress' ou 'done'",
        })
        .optional(),
    priority: z
        .enum(["low", "medium", "high", "critical"], {
            message:
                "Parâmetro priority deve ser 'low', 'medium', 'high' ou 'critical'",
        })
        .optional(),
    dueDate: z
        .string()
        .datetime("Data deve ser no formato YYYY-MM-DDTHH:MM:SSZ")
        .transform((date) => new Date(date))
        .optional(),
    dueDate_gt: z
        .string()
        .datetime("Data deve ser no formato YYYY-MM-DDTHH:MM:SSZ")
        .transform((date) => new Date(date))
        .optional(),
    dueDate_gte: z
        .string()
        .datetime("Data deve ser no formato YYYY-MM-DDTHH:MM:SSZ")
        .transform((date) => new Date(date))
        .optional(),
    dueDate_lt: z
        .string()
        .datetime("Data deve ser no formato YYYY-MM-DDTHH:MM:SSZ")
        .transform((date) => new Date(date))
        .optional(),
    dueDate_lte: z
        .string()
        .datetime("Data deve ser no formato YYYY-MM-DDTHH:MM:SSZ")
        .transform((date) => new Date(date))
        .optional(),
});

export { listTasksSchema };
