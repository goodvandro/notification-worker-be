export class AuthPayload {
  constructor(
    public readonly userId: string | null,
    public readonly username: string,
    public readonly accessToken: string,
    public readonly refreshToken?: string,
  ) {}
}
