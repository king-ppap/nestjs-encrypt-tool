import { IsDefined, IsString } from 'class-validator';

export class CorsConfig {
  @IsDefined()
  @IsString({ each: true })
  public readonly ALLOW_ORIGIN: Array<string>;
}
