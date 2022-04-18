import { DynamicModule } from '@nestjs/common';
import { AsyncCallModuleWithEnvOptions, AsyncCallModuleOptions } from './interfaces/async-module.interface';
export declare class AsyncCallModule {
    static register(options: AsyncCallModuleOptions): DynamicModule;
    static registerAsync(options: AsyncCallModuleWithEnvOptions): DynamicModule;
}
