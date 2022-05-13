export type OnlyDate = Date | null;

export type Optional<T> = T | undefined;

export interface LifeEvent {
  id: string,
  start: OnlyDate,
  end: OnlyDate,
  text: string
}

export type LifeEvents = LifeEvent[];

export interface LifeEventSer {
  id: string,
  start: string,
  end: string,
  text: string
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

