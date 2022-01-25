import {Container} from "inversify";
import {IConfigService} from "../config/config.service.interface";
import {TYPES} from "../types";
import {User} from "./user.entity";
import {IUserRepositoryReqDb, IUsersRepository} from "./users.repository.interface";
import {UsersService} from "./users.service";
import {IUserSchema, IUserService} from "./users.service.interface";
import 'reflect-metadata'

const ConfigServiceMock: IConfigService = {
    get: jest.fn()
}

const UsersRepositoryMock: IUsersRepository = {
    find: jest.fn(),
    create: jest.fn(),
    getUserById: jest.fn(),
    getUserByName: jest.fn()
}

const container = new Container();
let configService: IConfigService;
let usersRepository: IUsersRepository;
let usersService: IUserService;

beforeAll(() => {
    container.bind<IUserService>(TYPES.UserService).to(UsersService);
    container.bind<IConfigService>(TYPES.ConfigService).toConstantValue(ConfigServiceMock);
    container.bind<IUsersRepository>(TYPES.UserRepository).toConstantValue(UsersRepositoryMock);

    configService = container.get<IConfigService>(TYPES.ConfigService);
    usersRepository = container.get<IUsersRepository>(TYPES.UserRepository);
    usersService = container.get<UsersService>(TYPES.UserService);

})

let createdUser: IUserSchema | null

describe('User Service', () => {
    it('CreateUser', async () => {
        configService.get = jest.fn().mockReturnValueOnce('1');
        usersRepository.create = jest.fn().mockImplementationOnce((user: User): IUserRepositoryReqDb => ({
            command: '',
            rowCount: 1,
            oid: {},
            rows: [{
                username: user.username,
                email: user.email,
                password: user.password,
                id: 1
            }],
            fields: [],
            RowCtor: {},
            rowAsArray: true
        }));

        createdUser = await usersService.createUser({
            email: 'test@test.com',
            username: 'Nikita',
            password: '1',
        });

        expect(createdUser?.id).toEqual(1);
        expect(createdUser?.password).not.toEqual('1');
    });
    it('ValidateUser - success.', async () => {
        usersRepository.find = jest.fn().mockReturnValueOnce({
            command: '',
            rowCount: 1,
            oid: {},
            rows: [createdUser],
            fields: [],
            RowCtor: {},
            rowAsArray: true
        });

        const res = await usersService.validateUser({
            email: 'test@test.com',
            password: '1'
        });

        expect(res).toBeTruthy();
    })
    it('ValidateUser - wrong password.', async () => {
        usersRepository.find = jest.fn().mockReturnValueOnce({
            command: '',
            rowCount: 1,
            oid: {},
            rows: [createdUser],
            fields: [],
            RowCtor: {},
            rowAsArray: true
        });

        const res = await usersService.validateUser({
            email: 'test@test.com',
            password: '2'
        });

        expect(res).toBeFalsy();
    })
    it('ValidateUser - wrong user.', async () => {
        usersRepository.find = jest.fn().mockReturnValueOnce(null);

        const res = await usersService.validateUser({
            email: 'tesdddft@test.com',
            password: '2'
        });

        expect(res).toBeFalsy();
    })
})
