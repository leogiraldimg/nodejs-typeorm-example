class InvalidPaginationParameterException extends Error {
    constructor(message: string) {
        super(message);
        this.name = "InvalidPaginationParameterException";
    }
}

export { InvalidPaginationParameterException };
