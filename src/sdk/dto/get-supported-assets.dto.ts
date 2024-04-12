import { IsInt, IsOptional, IsPositive } from 'class-validator';
import { BridgingProvider } from '../data';

export class GetSupportedAssetsDto {
  @IsOptional()
  @IsPositive()
  @IsInt()
  chainId?: number = null;

  @IsOptional()
  provider?: BridgingProvider;
}
