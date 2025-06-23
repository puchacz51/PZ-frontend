export interface IRegisterRequest {
  login: string;
  email: string;
  password: string;
  role: string;
}

export interface IRegisterResponse {
  id: number;
  login: string;
  email: string;
  role: string;
  createdAt: string;
}

export interface ILoginRequest {
  email: string;
  password: string;
}

export interface ILoginResponse {
  token: string;
  user: {
    id: number;
    login: string;
    role: string;
  };
}

export const mockRegisterResponse: IRegisterResponse = {
  id: 1,
  login: "john_doe",
  email: "john_doe@example.com",
  role: "developer",
  createdAt: "2025-04-01"
};

export const mockLoginResponse: ILoginResponse = {
  token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxIiwibmFtZSI6ImpvaG5fZG9lIiwicm9sZSI6ImRldmVsb3BlciIsImlhdCI6MTcxMjA3ODQwMH0.D9OVlF1SkJQz3RO4W99IM-6ZB6zaYW9-7QSDiucgU4I",
  user: {
    id: 1,
    login: "john_doe",
    role: "developer"
  }
};
