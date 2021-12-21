export class Validation {
    public static emailValidate(email: string): boolean {
        return (/^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/).test(email);
    }

    public static passwordValidate(password: string): boolean {
        return (/^[a-zA-Z0-9!@#$%^&*]{8,16}$/).test(password);
    }

    public static usernameValidate(username: string): boolean {
        return (/^[a-z0-9_\.]+$/).test(username);
    }
}