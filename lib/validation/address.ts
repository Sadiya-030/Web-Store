import { z } from "zod";

export const AddressFormSchema = z.object({
  fullName: z.string().min(2, "Full Name Must be At Least 2 Characters"),
  phone: z
    .string()
    .regex(/^[6-9]\d{9}$/, "Enter a valid 10-digit Indian phone number"),
  addressLine1: z.string().min(5, "Address must be at least 5 characters"),
  addressLine2: z.string().optional().default(""),
  city: z.string().min(2, "City is required"),
  state: z.string().min(2, "State is required"),
  pinCode: z.string().regex(/^\d{6}$/, "PIN code must be 6 digits"),
  saveAddress: z.boolean().optional(),
});

export type AddressFormInput = z.infer<typeof AddressFormSchema>;
