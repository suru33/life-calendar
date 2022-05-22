import dayjs from "dayjs";
import {
  LifeBookmarks,
  LifeBookmarkSer,
  LifeEvent,
  LifeEventOverlapError,
  LifeEvents,
  LifeEventSer,
  OnlyDate
} from "./types";

export const DATE_FORMAT = "MMM DD, YYYY";

export const serializeOnlyDate = (d: OnlyDate): string => d ? dayjs(d).startOf("day").format("YYYY-MM-DD") : "";

export const deserializeOnlyDate = (s: string): OnlyDate => s.trim() === "" ? null : dayjs(s.trim()).toDate();

export const serializeLifeEvents = (events: LifeEvents): string => {
  const lifeEventsSer: LifeEventSer[] = events.map(e => ({
    id: e.id,
    start: serializeOnlyDate(e.start),
    end: serializeOnlyDate(e.end),
    text: e.text,
    color: e.color
  }));
  return JSON.stringify(lifeEventsSer);
};

export const deserializeLifeEvents = (eventsJson: string): LifeEvents => {
  if (eventsJson) {
    try {
      const lifeEventsSer: LifeEventSer[] = JSON.parse(eventsJson);
      return lifeEventsSer.map(e => ({
        id: e.id,
        start: deserializeOnlyDate(e.start),
        end: deserializeOnlyDate(e.end),
        text: e.text,
        color: e.color
      }));
    } catch (ex) {
      console.error("Failed to deserialize LifeEvents", ex);
      return [];
    }
  }
  return [];
};

export const serializeBookmarks = (bookmarks: LifeBookmarks): string => {
  const bookmarksSer: LifeBookmarkSer[] = bookmarks.map(b => ({
    id: b.id,
    date: serializeOnlyDate(b.date),
    title: b.title
  }));
  return JSON.stringify(bookmarksSer);
};

export const deserializeBookmarks = (bookmarksJson: string): LifeBookmarks => {
  if (bookmarksJson) {
    try {
      const bookmarksSer: LifeBookmarkSer[] = JSON.parse(bookmarksJson);
      return bookmarksSer.map(b => ({
        id: b.id,
        date: deserializeOnlyDate(b.date),
        title: b.title
      }));
    } catch (ex) {
      console.error("Failed to deserialize LifeBookmarks", ex);
      return [];
    }
  }
  return [];
};

export const displayOnlyDate = (d: OnlyDate): string => d ? dayjs(d).format(DATE_FORMAT) : "";

export const dateRangeOverlaps = (startA: OnlyDate, endA: OnlyDate, startB: OnlyDate, endB: OnlyDate): boolean => {
  if (startA !== null && endA !== null && startB !== null && endB !== null) {
    return startA <= endB && endA >= startB;
  }
  return false;
};

export const compareOnlyDates = (a: OnlyDate, b: OnlyDate): number => {
  if (a !== null && b !== null) {
    if (a > b) {
      return 1;
    } else if (a < b) {
      return -1;
    } else {
      return 0;
    }
  } else if (a === null) {
    return -1;
  } else if (b === null) {
    return 1;
  } else {
    return 0;
  }
};

export const buildLifeEventOverlapError = (event: LifeEvent | undefined): LifeEventOverlapError =>
  event
    ? { hidden: false, start: displayOnlyDate(event.start), end: displayOnlyDate(event.end), text: event.text }
    : { hidden: true, start: undefined, end: undefined, text: undefined };
