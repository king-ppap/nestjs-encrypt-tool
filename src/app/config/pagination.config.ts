import { IsDefined } from 'class-validator';

export class PaginationConfig {
  @IsDefined()
  public readonly page_size: number;

  @IsDefined()
  public readonly max_page_size: number;
}
