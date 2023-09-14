export type TmdbConfing = {
  api_key: string;
};

export type DatabaseConfig = {
  host?: string;
  port?: number;
  password?: string;
  database?: string;
  username?: string;
};

export type AuthConfing = {
  accessSecret: string;
  accessExpires: string;
  refreshSecret: string;
  refreshExpires: string;
};
