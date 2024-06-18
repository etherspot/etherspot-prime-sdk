import { IsPositive } from 'class-validator';
import { IsAddress } from './validators';

export class GetNftListDto {
  @IsPositive()
  chainId: number;
  
  @IsAddress()
  account: string;
}
