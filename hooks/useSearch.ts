"use client";

import { useCallback, useMemo, useReducer, useRef } from "react";

import {
  DOCTOR_FEE_SLIDER_MAX,
  DOCTOR_FEE_SLIDER_MIN,
  DOCTOR_FEE_SLIDER_STEP,
  mockDoctors,
} from "@/lib/constants";
import type {
  Doctor,
  DoctorSearchState,
  DoctorSortOption,
  GenderFilter,
  SearchFilters,
} from "@/lib/types";

export const initialDoctorSearchState: DoctorSearchState = {
  query: "",
  selectedCities: [],
  selectedServices: [],
  feeSliderMin: DOCTOR_FEE_SLIDER_MIN,
  feeSliderMax: DOCTOR_FEE_SLIDER_MAX,
  minRating: null,
  gender: "any",
  availableTodayOnly: false,
  sortBy: "rating",
};

function cloneSearchState(s: DoctorSearchState): DoctorSearchState {
  return {
    ...s,
    selectedCities: [...s.selectedCities],
    selectedServices: [...s.selectedServices],
  };
}

export type DoctorSearchAction =
  | { type: "RESET"; baseline?: DoctorSearchState }
  | { type: "SET_QUERY"; query: string }
  | { type: "TOGGLE_CITY"; city: string }
  | { type: "TOGGLE_SERVICE"; service: string }
  | { type: "SET_FEE_MIN"; value: number }
  | { type: "SET_FEE_MAX"; value: number }
  | { type: "SET_MIN_RATING"; value: number | null }
  | { type: "SET_GENDER"; value: GenderFilter }
  | { type: "SET_AVAILABLE_TODAY"; value: boolean }
  | { type: "SET_SORT"; value: DoctorSortOption }
  | { type: "HERO_PATCH"; patch: Partial<SearchFilters> };

function clampFee(n: number) {
  const step = DOCTOR_FEE_SLIDER_STEP;
  const min = DOCTOR_FEE_SLIDER_MIN;
  const max = DOCTOR_FEE_SLIDER_MAX;
  const snapped = Math.round((n - min) / step) * step + min;
  return Math.min(max, Math.max(min, snapped));
}

export function doctorSearchReducer(
  state: DoctorSearchState,
  action: DoctorSearchAction,
): DoctorSearchState {
  const step = DOCTOR_FEE_SLIDER_STEP;
  const minBound = DOCTOR_FEE_SLIDER_MIN;
  const maxBound = DOCTOR_FEE_SLIDER_MAX;

  switch (action.type) {
    case "RESET":
      return cloneSearchState(action.baseline ?? initialDoctorSearchState);
    case "SET_QUERY":
      return { ...state, query: action.query };
    case "TOGGLE_CITY": {
      const set = new Set(state.selectedCities);
      if (set.has(action.city)) set.delete(action.city);
      else set.add(action.city);
      return { ...state, selectedCities: Array.from(set) };
    }
    case "TOGGLE_SERVICE": {
      const set = new Set(state.selectedServices);
      if (set.has(action.service)) set.delete(action.service);
      else set.add(action.service);
      return { ...state, selectedServices: Array.from(set) };
    }
    case "SET_FEE_MIN": {
      let v = clampFee(action.value);
      v = Math.min(v, state.feeSliderMax - step);
      if (v < minBound) v = minBound;
      return { ...state, feeSliderMin: v };
    }
    case "SET_FEE_MAX": {
      let v = clampFee(action.value);
      v = Math.max(v, state.feeSliderMin + step);
      if (v > maxBound) v = maxBound;
      return { ...state, feeSliderMax: v };
    }
    case "SET_MIN_RATING":
      return { ...state, minRating: action.value };
    case "SET_GENDER":
      return { ...state, gender: action.value };
    case "SET_AVAILABLE_TODAY":
      return { ...state, availableTodayOnly: action.value };
    case "SET_SORT":
      return { ...state, sortBy: action.value };
    case "HERO_PATCH": {
      const { patch } = action;
      return {
        ...state,
        ...(patch.query !== undefined ? { query: patch.query } : {}),
        ...(patch.city !== undefined
          ? { selectedCities: patch.city ? [patch.city] : [] }
          : {}),
        ...(patch.service !== undefined
          ? { selectedServices: patch.service ? [patch.service] : [] }
          : {}),
      };
    }
    default:
      return state;
  }
}

function doctorMatchesFilters(d: Doctor, f: DoctorSearchState): boolean {
  const q = f.query.trim().toLowerCase();
  if (
    q &&
    !d.name.toLowerCase().includes(q) &&
    !d.hospital.toLowerCase().includes(q) &&
    !d.city.toLowerCase().includes(q)
  ) {
    return false;
  }
  if (f.selectedCities.length && !f.selectedCities.includes(d.city)) {
    return false;
  }
  if (f.selectedServices.length && !f.selectedServices.some((s) => d.services.includes(s))) {
    return false;
  }
  if (f.minRating != null && d.rating < f.minRating) return false;
  if (f.gender !== "any" && d.gender !== f.gender) return false;
  if (f.availableTodayOnly && !d.availableToday) return false;
  if (d.feeMax < f.feeSliderMin || d.feeMin > f.feeSliderMax) return false;
  return true;
}

function sortDentists(list: Doctor[], sortBy: DoctorSortOption): Doctor[] {
  const next = [...list];
  next.sort((a, b) => {
    switch (sortBy) {
      case "rating":
        return b.rating - a.rating;
      case "fee_asc":
        return a.feeMin - b.feeMin;
      case "fee_desc":
        return b.feeMin - a.feeMin;
      case "availability":
        return Number(b.availableToday) - Number(a.availableToday);
      default:
        return 0;
    }
  });
  return next;
}

export function computeCityCounts(doctors: Doctor[]): Record<string, number> {
  return doctors.reduce<Record<string, number>>((acc, d) => {
    acc[d.city] = (acc[d.city] ?? 0) + 1;
    return acc;
  }, {});
}

export function useSearch(mergeInitial?: Partial<DoctorSearchState>) {
  const baselineRef = useRef<DoctorSearchState | null>(null);
  if (!baselineRef.current) {
    baselineRef.current = cloneSearchState({
      ...initialDoctorSearchState,
      ...mergeInitial,
    });
  }

  const [state, dispatch] = useReducer(
    doctorSearchReducer,
    baselineRef.current,
  );

  const cityCounts = useMemo(() => computeCityCounts(mockDoctors), []);

  const results = useMemo(() => {
    const filtered = mockDoctors.filter((d) => doctorMatchesFilters(d, state));
    return sortDentists(filtered, state.sortBy);
  }, [state]);

  const filters: SearchFilters = useMemo(
    () => ({
      query: state.query,
      city:
        state.selectedCities.length === 1 ? state.selectedCities[0] ?? "" : "",
      service:
        state.selectedServices.length === 1
          ? state.selectedServices[0] ?? ""
          : "",
    }),
    [state.query, state.selectedCities, state.selectedServices],
  );

  const updateFilters = useCallback((patch: Partial<SearchFilters>) => {
    dispatch({ type: "HERO_PATCH", patch });
  }, []);

  const reset = useCallback(() => {
    dispatch({
      type: "RESET",
      baseline: cloneSearchState(baselineRef.current!),
    });
  }, []);

  return {
    state,
    dispatch,
    results,
    cityCounts,
    filters,
    updateFilters,
    reset,
  };
}
