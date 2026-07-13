export interface CreateSlotInput {
  slotDate: string; // "YYYY-MM-DD"
  startTime: string; // "HH:mm" or "HH:mm:ss"
  endTime: string; // "HH:mm" or "HH:mm:ss"
}
 export interface GetAvailableSlotsQuery {
  technicianId?: string;
  slotDate?: string; // "YYYY-MM-DD" -> ওই একদিনের স্লট ফিল্টার করার জন্য
}
 
