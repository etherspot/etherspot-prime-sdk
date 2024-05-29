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
  STATIC = "0xFE",
  DELEGATE_CALL = "0xFF"
}

export enum EXEC_TYPE {
  DEFAULT = "0x00",
  TRY_EXEC = "0x01"
}

export enum MODULE_TYPE {
  VALIDATOR = '0x01',
  EXECUTOR = '0x02',
  FALLBACK = '0x03',
  HOOK = '0x04',
}