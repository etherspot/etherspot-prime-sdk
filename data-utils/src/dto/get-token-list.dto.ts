import { IsString, MinLength, MaxLength, IsOptional, IsPositive } from 'class-validator';
import { TOKEN_LIST_MAX_NAME_LENGTH, TOKEN_LIST_MIN_NAME_LENGTH } from '../../src/data';

export class GetTokenListDto {
  @IsPositive()
  chainId: number;

  @IsOptional()
  @IsString()
  @MinLength(TOKEN_LIST_MIN_NAME_LENGTH)
  @MaxLength(TOKEN_LIST_MAX_NAME_LENGTH)
  name?: string = null;
}
