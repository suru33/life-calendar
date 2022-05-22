import {
  deserializeBookmarks,
  deserializeLifeEvents,
  deserializeOnlyDate,
  serializeBookmarks,
  serializeLifeEvents,
  serializeOnlyDate
} from "../types.util";

export const dateOfBirthLocalStorageConfig = {
  key: "date-of-birth",
  defaultValue: null,
  serialize: serializeOnlyDate,
  deserialize: deserializeOnlyDate
};

export const lifeEventsLocalStorageConfig = {
  key: "life-events",
  defaultValue: [],
  serialize: serializeLifeEvents,
  deserialize: deserializeLifeEvents
};

export const lifeBookmarksLocalStorageConfig = {
  key: "life-bookmarks",
  defaultValue: [],
  serialize: serializeBookmarks,
  deserialize: deserializeBookmarks
};
