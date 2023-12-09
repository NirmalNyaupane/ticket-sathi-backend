import { Role } from "./user.enum.js";

export {};

declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        full_name: string;
        email: string;
        phone_number: string;
        avatar: string;
        role: Role;
        address?: string;
        is_verified: boolean;
        createdAt?: Date | undefined;
        updatedAt?: Date | undefined;
      };
    }
  }
}
