export const APPOINTMENT_FEES = {
  standard: 120,
  custom: 120,
  immediate: 150,
} as const;

export const AVAILABLE_SLOTS = [
  "09:00 AM",
  "10:00 AM",
  "11:00 AM",
  "02:00 PM",
  "03:00 PM",
  "04:00 PM",
] as const;

// Helper function to get available slots (if needed)
export const getAvailableSlots = () => AVAILABLE_SLOTS;

export type AvailableSlot = typeof AVAILABLE_SLOTS[number];