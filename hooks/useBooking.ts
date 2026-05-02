"use client";

import { useCallback, useMemo, useReducer } from "react";

import type { Doctor, TimeSlot } from "@/lib/types";

export type BookingStep = "doctor" | "datetime" | "confirm";
export type BookingWizardStep = 1 | 2 | 3;

export type DentalConcern =
  | "Routine Checkup"
  | "Teeth Cleaning"
  | "Toothache / Pain"
  | "Braces Consultation"
  | "Root Canal"
  | "Teeth Whitening"
  | "Extraction"
  | "Implants"
  | "Other";

export type PatientType = "myself" | "family";

export interface BookingFormValues {
  fullName: string;
  phone: string;
  dentalConcern: DentalConcern;
  notes?: string;
  patientType: PatientType;
  familyMemberName?: string;
  relation?: string;
  firstVisit: boolean;
}

export interface BookingState {
  selectedDate: Date | null;
  selectedSlot: string | null;
  patientDetails: BookingFormValues | null;
  currentStep: BookingWizardStep;
  isConfirmed: boolean;

  // compatibility with earlier parts of app
  doctor: Doctor | null;
  date: Date | null;
  slot: TimeSlot | null;
  step: BookingStep;
}

export type BookingAction =
  | { type: "SET_DATE"; payload: Date | null }
  | { type: "SET_SLOT"; payload: string | null }
  | { type: "SET_DETAILS"; payload: BookingFormValues | null }
  | { type: "NEXT_STEP" }
  | { type: "PREV_STEP" }
  | { type: "GO_TO_STEP"; payload: BookingWizardStep }
  | { type: "CONFIRM_BOOKING" }
  | { type: "RESET" }
  | { type: "SELECT_DOCTOR"; doctor: Doctor | null }
  | { type: "SELECT_DATE_LEGACY"; date: Date | null }
  | { type: "SELECT_SLOT_LEGACY"; slot: TimeSlot | null }
  | { type: "SET_STEP_LEGACY"; step: BookingStep };

const initialState: BookingState = {
  selectedDate: null,
  selectedSlot: null,
  patientDetails: null,
  currentStep: 1,
  isConfirmed: false,

  doctor: null,
  date: null,
  slot: null,
  step: "doctor",
};

function bookingReducer(state: BookingState, action: BookingAction): BookingState {
  switch (action.type) {
    case "SET_DATE":
      return {
        ...state,
        selectedDate: action.payload,
        selectedSlot: action.payload ? state.selectedSlot : null,
      };
    case "SET_SLOT":
      return { ...state, selectedSlot: action.payload };
    case "SET_DETAILS":
      return { ...state, patientDetails: action.payload };
    case "NEXT_STEP":
      return {
        ...state,
        currentStep: Math.min(3, state.currentStep + 1) as BookingWizardStep,
      };
    case "PREV_STEP":
      return {
        ...state,
        currentStep: Math.max(1, state.currentStep - 1) as BookingWizardStep,
      };
    case "GO_TO_STEP":
      return { ...state, currentStep: action.payload };
    case "CONFIRM_BOOKING":
      return { ...state, isConfirmed: true };
    case "RESET":
      return initialState;

    case "SELECT_DOCTOR":
      return { ...state, doctor: action.doctor, step: action.doctor ? "datetime" : "doctor" };
    case "SELECT_DATE_LEGACY":
      return { ...state, date: action.date, slot: action.date ? state.slot : null };
    case "SELECT_SLOT_LEGACY":
      return { ...state, slot: action.slot };
    case "SET_STEP_LEGACY":
      return { ...state, step: action.step };
    default:
      return state;
  }
}

export function useBooking() {
  const [state, dispatch] = useReducer(bookingReducer, initialState);

  // legacy helper API
  const selectDoctor = useCallback((doctor: Doctor | null) => {
    dispatch({ type: "SELECT_DOCTOR", doctor });
  }, []);

  const selectDate = useCallback((date: Date | null) => {
    dispatch({ type: "SELECT_DATE_LEGACY", date });
  }, []);

  const selectSlot = useCallback((slot: TimeSlot | null) => {
    dispatch({ type: "SELECT_SLOT_LEGACY", slot });
  }, []);

  const setStep = useCallback((step: BookingStep) => {
    dispatch({ type: "SET_STEP_LEGACY", step });
  }, []);

  const reset = useCallback(() => {
    dispatch({ type: "RESET" });
  }, []);

  const canConfirm = useMemo(
    () => Boolean(state.doctor && state.date && state.slot?.available),
    [state.doctor, state.date, state.slot],
  );

  return {
    ...state,
    dispatch,
    selectDoctor,
    selectDate,
    selectSlot,
    setStep,
    reset,
    canConfirm,
  };
}
