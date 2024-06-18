import { Route } from '@lifi/sdk';
import { IsAddress } from './validators';

export class GetStepTransactionsLiFiDto {
    route: Route

    @IsAddress()
    account: string;
}
