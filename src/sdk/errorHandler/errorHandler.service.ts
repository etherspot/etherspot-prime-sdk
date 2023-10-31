import { errorMsg } from "./constants";

export class ErrorHandler extends Error {
    public possibleSolution: string = null;
    constructor(public error: string, public code?: number) {
        super(error);
        this.error = error;
        this.code = code;
        if (code) {
            this.possibleSolution = errorMsg[code.toString()];
            if (error.includes('AA33 reverted')) {
                this.possibleSolution += ' If using a token, make sure that approval transaction is done for the requested operation and have enough tokens to spend for this transaction.'
            }
        }
    }
}