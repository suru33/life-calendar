import dayjs from "dayjs";

export type OnlyDate = Date | null;

export type Optional<T> = T | undefined;

export interface LifeEvent {
  id: string,
  start: OnlyDate,
  end: OnlyDate,
  text: string,
  color: string
}

export type LifeEvents = LifeEvent[];

export interface LifeEventSer {
  id: string,
  start: string,
  end: string,
  text: string,
  color: string
}

export interface EventRange {
  event: LifeEvent,
  type: "start" | "end" | "running" | "inside"
}

export interface LifeBookmark {
  id: string,
  date: OnlyDate,
  title: string
}

export type LifeBookmarks = LifeBookmark[];

export interface LifeBookmarkSer {
  id: string,
  date: string,
  title: string
}

export interface LifeEventOverlapError {
  hidden: boolean,
  start?: string,
  end?: string,
  text?: string
}

export interface LifeCalendarWeek {
  id: string,
  start: dayjs.Dayjs,
  end: dayjs.Dayjs,
  isBirthday: boolean,
  isNewyear: boolean,
  bookmarks: LifeBookmarks,
  events: EventRange[],
  color: string
}

export type LifeCalendar = LifeCalendarWeek[];

export type AppIcon = "plus" | "pencil" | "trash" | "arrowUp" | "menu" |
  "birthday" | "newyear" | "calendarOff" | "born" |
  "headerGrid" | "headerSettings" |
  "alertInfo" | "alertWarning" |
  "bookmark"

export interface ColorCombo {
  bg: string,
  fg: string
}
