export interface IGoogleUser {
  info: {
    sub: string;
    email: string;
    name: string;
    tokenExpiresIn: number;
  };
}
