export class SignUpResponseDto {
  message: string;
  data: unknown;
}

export class LoginResponseDto {
  message: string;
  data: {
    id: string;
    email: string;
    name: string;
  };
  accessToken: string;
  refreshToken: string;
}
