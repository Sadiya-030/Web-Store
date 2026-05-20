/**
 * PIN code to city/state mapping
 * Uses Postal PIN Code API (https://api.postalpincode.in) for real-time lookup
 */

export interface PinCodeData {
  city: string;
  state: string;
}

interface PostalApiResponse {
  Status: string;
  PostOffice?: Array<{
    Name: string;
    District: string;
    State: string;
  }>;
}

/**
 * Fetch PIN code data from Postal PIN Code API
 */
export async function getPinCodeData(
  pinCode: string,
): Promise<PinCodeData | null | undefined> {
  // Validate PIN code format
  if (!pinCode || pinCode.length !== 6 || !/^\d{6}$/.test(pinCode)) {
    return null;
  }

  try {
    const response = await fetch(
      `https://api.postalpincode.in/pincode/${pinCode}`,
    );

    if (!response.ok) {
      throw new Error(`Failed to Fetch PIN Code Data for ${pinCode}`);
    }

    const data: PostalApiResponse[] = await response.json();

    if (
      data &&
      data.length > 0 &&
      data[0].Status === "Success" &&
      data[0].PostOffice &&
      data[0].PostOffice.length > 0
    ) {
      return {
        city: data[0].PostOffice[0].District,
        state: data[0].PostOffice[0].State,
      };
    }
  } catch (error) {
    console.warn(`PIN Code Lookup Failed for ${pinCode}:`, error);
  }
}

export const INDIAN_STATES = [
  "Andhra Pradesh",
  "Arunachal Pradesh",
  "Assam",
  "Bihar",
  "Chhattisgarh",
  "Goa",
  "Gujarat",
  "Haryana",
  "Himachal Pradesh",
  "Jharkhand",
  "Karnataka",
  "Kerala",
  "Madhya Pradesh",
  "Maharashtra",
  "Manipur",
  "Meghalaya",
  "Mizoram",
  "Nagaland",
  "Odisha",
  "Punjab",
  "Rajasthan",
  "Sikkim",
  "Tamil Nadu",
  "Telangana",
  "Tripura",
  "Uttar Pradesh",
  "Uttarakhand",
  "West Bengal",
  "Delhi",
];
