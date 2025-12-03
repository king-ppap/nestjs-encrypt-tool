import * as common from '@nestjs/common';
import { Type } from 'class-transformer';
import { IsDefined, IsNumber, IsString, ValidateNested } from 'class-validator';
import { ApiDocConfig } from './apidoc.config';
import { CorsConfig } from './cors.config';
import { PaginationConfig } from './pagination.config';

type NodeEnv = 'development' | 'production' | 'staging';

export class RootConfig {
  public readonly NODE_ENV: NodeEnv = <NodeEnv>process.env.NODE_ENV;

  @IsNumber()
  public readonly PORT: number = 3000;

  @IsString()
  public readonly LOG_LEVEL: common.LogLevel = 'error';

  @Type(() => ApiDocConfig)
  @ValidateNested()
  @IsDefined()
  public readonly API_DOC: ApiDocConfig;

  @Type(() => CorsConfig)
  @ValidateNested()
  @IsDefined()
  public readonly CORS: CorsConfig;

  @Type(() => PaginationConfig)
  @ValidateNested()
  @IsDefined()
  public readonly PAGINATION: PaginationConfig;
}
