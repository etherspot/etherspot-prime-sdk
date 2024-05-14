/**
 * @ignore
 */
export enum HeaderNames {
  AuthToken = 'x-auth-token',
  AnalyticsToken = 'x-analytics-token',
  ProjectMetadata = 'x-project-metadata',
}

export const bufferPercent = 13; // Buffer in percent

export const onRampApiKey = 'pk_prod_01H66WYDRFM95JBTJ4VMGY1FAX';

export enum CALL_TYPE {
  SINGLE = "0x00",
  BATCH = "0x01",
  DELEGATE_CALL = "0xFF"
}

export enum EXEC_TYPE {
  DEFAULT = "0x00",
  TRY_EXEC = "0x01"
}

export const VALIDATOR_TYPE = {
  ROOT: "0x00",
  VALIDATOR: "0x01",
  PERMISSION: "0x02"
} as const

export enum VALIDATOR_MODE {
  DEFAULT = "0x00",
  ENABLE = "0x01"
}
