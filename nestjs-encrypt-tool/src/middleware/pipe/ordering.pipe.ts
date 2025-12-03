import { PaginationConfig } from '@config/pagination.config';
import {
  PipeTransform,
  Injectable,
  ArgumentMetadata,
  Logger,
} from '@nestjs/common';

@Injectable()
export class PaginationOrderingPipe implements PipeTransform {
  constructor(private paginationConfig: PaginationConfig) {}
  private logger = new Logger(PaginationOrderingPipe.name);

  /**
   * Transform query string `order`
   *
   * `-` ment `DESC`
   *
   * Example
   *
   * `/?order=-id,name`
   *
   * `-id,name` transform to `[['id', 'DESC'], ['name', 'ASC']]`
   *
   * @example
   * /@UsePipes(PaginationOrderingPipe)
   * public async getProductList(@Query() query: ProductQueryDto) {...}
   * @example
   * class ProductQueryDto extends PaginationOrderingQueryDto {}
   */
  transform(value: any, metadata: ArgumentMetadata) {
    this.logger.debug(value);
    if (metadata.type == 'query') {
      if (value.order) {
        value.order = value.order.split(',').map((e) => {
          const order = e.split(/^-/);
          return order.length >= 2 ? [order[1], 'DESC'] : [e, 'ASC'];
        });
      }
      if (!value.page_size) value.page_size = this.paginationConfig.page_size;
    }
    return value;
  }
}
