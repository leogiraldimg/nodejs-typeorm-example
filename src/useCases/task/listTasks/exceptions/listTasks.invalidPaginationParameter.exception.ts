class ListTasksInvalidPaginationParameterException extends Error {
    constructor(message: string) {
        super(message);
        this.name = "ListTasksInvalidPaginationParameterException";
    }
}

export { ListTasksInvalidPaginationParameterException };
