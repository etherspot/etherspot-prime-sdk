import { entryPointErrorMsg, errorMsg } from "./constants";

export class ErrorHandler extends Error {
    public rawError: string = null;
    constructor(public error: string, public code?: number) {
        super(error);
        this.rawError = error;
        this.code = code;
        if (code) {
            this.message = errorMsg[code.toString()];
            if (entryPointErrorMsg[error]) {
                this.message = entryPointErrorMsg[error];
            }
            
        }
    }
}