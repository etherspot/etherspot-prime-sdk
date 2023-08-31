import { IsOptional, IsPositive } from 'class-validator';
import { IsAddress } from './validators';

export class GetNftListDto {
  @IsOptional()
  @IsPositive()
  chainId?: number;
  
  @IsAddress()
  account: string;
}
