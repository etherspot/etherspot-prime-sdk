import { IsInt, IsOptional, IsPositive } from 'class-validator';

export class GetConnextSupportedAssetsDto {
  @IsOptional()
  @IsPositive()
  @IsInt()
  chainId?: number = null;
}
