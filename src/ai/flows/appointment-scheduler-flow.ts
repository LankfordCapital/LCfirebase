
'use server';
/**
 * @fileOverview Manages appointments and tasks for workforce members.
 */

import { z } from 'zod';
import { collection, addDoc, getDocs, query, where } from 'firebase/firestore';
import { db } from '@/lib/firebase';

const AppointmentSchema = z.object({
  id: z.string().optional(),
  title: z.string(),
  start: z.string(), // ISO string
  end: z.string().optional(),   // ISO string
  type: z.enum(['appointment', 'task']),
  description: z.string().optional(),
  workforceMemberId: z.string(),
});
export type Appointment = z.infer<typeof AppointmentSchema>;

const AddAppointmentInputSchema = AppointmentSchema.omit({ id: true });
export type AddAppointmentInput = z.infer<typeof AddAppointmentInputSchema>;

export async function addAppointment(input: AddAppointmentInput): Promise<{ id: string }> {
  const docRef = await addDoc(collection(db, 'appointments'), input);
  return { id: docRef.id };
}

const GetAppointmentsInputSchema = z.object({
    workforceMemberId: z.string(),
});
export type GetAppointmentsInput = z.infer<typeof GetAppointmentsInputSchema>;

export async function getAppointments(input: GetAppointmentsInput): Promise<Appointment[]> {
  const q = query(collection(db, 'appointments'), where("workforceMemberId", "==", input.workforceMemberId));
  const querySnapshot = await getDocs(q);
  const appointments: Appointment[] = [];
  querySnapshot.forEach((doc) => {
    appointments.push({ id: doc.id, ...doc.data() } as Appointment);
  });
  return appointments;
}

// Note: No Genkit flow definition is needed here as we are directly interacting
// with Firestore and not an LLM. These functions can be called directly from server components.

