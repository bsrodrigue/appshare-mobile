import { z } from 'zod';

export const UserRoles = ["admin", "job_publisher", "user", "client", "delivery_man", "seller"] as const;
export const UserRoleSchema = z.enum(UserRoles);

export type UserRole = z.infer<typeof UserRoleSchema>;

export const AllowedRegistrationRoles = ["client", "delivery_man", "seller"] as const satisfies readonly UserRole[];
export const AllowedRegistrationRolesSchema = z.enum(AllowedRegistrationRoles);

export type AllowedRegistrationRole = z.infer<typeof AllowedRegistrationRolesSchema>;