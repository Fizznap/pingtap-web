import { z } from 'zod';

export const personalDetailsSchema = z.object({
    fullName: z.string().min(2, "Name must be at least 2 characters"),
    email: z.string().email("Invalid email address"),
    phone: z.string().regex(/^[6-9]\d{9}$/, "Enter 10 digits starting with 6-9 (without +91)"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string(),
    dob: z.string().min(1, "Date of Birth is required"),
}).refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
});

export const addressDetailsSchema = z.object({
    street: z.string().min(5, "Street address is required"),
    landmark: z.string().optional(),
    pincode: z.string().length(6, "Pincode must be 6 digits"),
    city: z.string().min(1, "City is required"),
    state: z.string().min(1, "State is required"),
    area: z.string().min(1, "Area is required"),
    addressType: z.enum(['home', 'office', 'shop']),
});

export const kycSchema = z.object({
    aadharNumber: z.string().length(12, "Aadhaar must be 12 digits"),
    // Files are handled separately in state due to strict serialization in some contexts, but can be refined here
});

export const planSchema = z.object({
    planId: z.string().min(1, "Please select a plan"),
    billingCycle: z.enum(['monthly', 'quarterly', 'yearly']),
});

export type PersonalDetailsData = z.infer<typeof personalDetailsSchema>;
export type AddressDetailsData = z.infer<typeof addressDetailsSchema>;
export type KycData = z.infer<typeof kycSchema>;
export type PlanData = z.infer<typeof planSchema>;

export type RegistrationFormData = PersonalDetailsData & AddressDetailsData & KycData & PlanData;
