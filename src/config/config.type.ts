export type TmdbConfing = {
  apiKey: string;
  delay: number;
  iterationCount: number;
};

export type DatabaseConfig = {
  host?: string;
  port?: number;
  password?: string;
  database?: string;
  username?: string;
};

export type AuthConfing = {
  secret: string;
  expires: string;
  refreshSecret: string;
  refreshExpires: string;
};

export type AllConfigType = {
  tmdb: TmdbConfing;
  database: DatabaseConfig;
  auth: AuthConfing;
};
