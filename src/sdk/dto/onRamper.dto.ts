import { IsOptional, IsPositive, IsInt, IsString, IsBoolean } from 'class-validator';

export class OnRamperDto {
  @IsOptional()
  @IsString()
  defaultCrypto?: string;

  @IsOptional()
  @IsString()
  excludeCryptos?: string;

  @IsOptional()
  @IsString()
  onlyCryptos?: string;

  @IsOptional()
  @IsString()
  excludeCryptoNetworks?: string;

  @IsOptional()
  @IsString()
  onlyCryptoNetworks?: string;

  @IsOptional()
  @IsPositive()
  @IsInt()
  defaultAmount?: number;

  @IsOptional()
  @IsString()
  defaultFiat?: string;

  @IsOptional()
  @IsBoolean()
  isAmountEditable?: boolean;

  @IsOptional()
  @IsString()
  onlyFiats?: string;

  @IsOptional()
  @IsString()
  excludeFiats?: string;

  @IsOptional()
  @IsString()
  themeName?: string;
}
