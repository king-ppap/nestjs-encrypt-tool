import { IsDefined, IsString } from 'class-validator';

export class RsaKeysConfig {
  @IsString()
  @IsDefined()
  public readonly PUBLIC_KEY: string;

  @IsString()
  @IsDefined()
  public readonly PRIVATE_KEY: string;
}
