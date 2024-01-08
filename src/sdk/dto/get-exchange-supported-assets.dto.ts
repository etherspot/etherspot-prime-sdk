import { IsPositive } from 'class-validator';
import { PaginationDto } from './pagination.dto';
import { IsAddress } from './validators';

export class GetExchangeSupportedAssetsDto extends PaginationDto {
  @IsPositive()
  chainId: number;

  @IsAddress()
  account: string;
}
