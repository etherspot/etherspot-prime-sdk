import { IsPositive } from 'class-validator';

export class GetTokenListsDto {
    @IsPositive()
    chainId: number;
}
