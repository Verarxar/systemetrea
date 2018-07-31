export class TokenResponse {
  token: string;
}

export class TokenPayload {
  email: string;
  password: string;
  name?: string;
}