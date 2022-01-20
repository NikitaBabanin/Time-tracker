import {hash} from 'bcryptjs'

export class User {
    private _password: string;

    constructor(private readonly _username: string) {
    }

    get username(): string {
        return this._username
    }

    get password():string{
        return this._password
    }

    public async setPassword(pass: string, salt: number): Promise<void> {
        this._password = await hash(pass, salt)
    }
}
