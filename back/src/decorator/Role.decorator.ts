import { SetMetadata } from '@nestjs/common';

export enum ERole {
  'public' = 'public',
  'admin' = 'admin',
  'user' = 'user',
}

export const IS_ROLE_KEY = 'isPublic';
export const Role = (role: keyof typeof ERole) =>
  SetMetadata(IS_ROLE_KEY, role);
