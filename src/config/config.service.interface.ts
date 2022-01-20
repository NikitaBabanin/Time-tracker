export interface IConfigService {
    get:<T extends string | number>(ke: string) => T;
}
