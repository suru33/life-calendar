import { useEffect, useState } from "react";
import dayjs from "dayjs";
import weekOfYearPlugin from "dayjs/plugin/weekOfYear";
import durationPlugin from "dayjs/plugin/duration";
import isBetweenPlugin from "dayjs/plugin/isBetween";
import { v4 as uuid4 } from "uuid";
import { Stack, Text, Tooltip } from "@mantine/core";
import { useLocalStorage } from "@mantine/hooks";
import {
  EventRange,
  LifeBookmark,
  LifeBookmarks,
  LifeCalendar,
  LifeCalendarWeek,
  LifeEvent,
  LifeEvents,
  OnlyDate
} from "../types";
import {
  dateOfBirthLocalStorageConfig,
  lifeBookmarksLocalStorageConfig,
  lifeEventsLocalStorageConfig
} from "../commons/app.localstoreage";
import { birthDayBackground, defaultWeekBackground, newYearBackground } from "../commons/app.colors";
import { icons } from "../commons/app.icons";
import { DATE_FORMAT, displayOnlyDate } from "../types.util";
import "./Home.css";

const Home = () => {
  dayjs.extend(weekOfYearPlugin);
  dayjs.extend(durationPlugin);
  dayjs.extend(isBetweenPlugin);

  // localstorage
  const [dateOfBirth] = useLocalStorage<OnlyDate>(dateOfBirthLocalStorageConfig);
  const [lifeEvents] = useLocalStorage<LifeEvents>(lifeEventsLocalStorageConfig);
  const [lifeBookmarks] = useLocalStorage<LifeBookmarks>(lifeBookmarksLocalStorageConfig);
  const [ lifeCalendar, setLifeCalendar ] = useState<LifeCalendar>([]);

  const isValidEvent = (start: OnlyDate, end: OnlyDate, e: LifeEvent) => start !== null
    && end !== null
    && e.start !== null
    && e.end !== null
    && e.start >= start && e.end <= end;

  const isValidBookmark = (start: OnlyDate, end: OnlyDate, b: LifeBookmark) => start !== null
    && end !== null
    && b.date !== null
    && b.date >= start && b.date <= end;

  const isBookmarkInRange = (start: dayjs.Dayjs, end: dayjs.Dayjs, b: LifeBookmark) =>
    b.date !== null && dayjs(b.date).isBetween(start, end, "day", "[]");

  const createEventInRange = (weekStart: dayjs.Dayjs, weekEnd: dayjs.Dayjs, e: LifeEvent): EventRange | undefined => {
    if (e.start !== null && e.end !== null) {
      const eventStart = dayjs(e.start).startOf("day").add(12, "hours");
      const eventEnd = dayjs(e.end).startOf("day").add(12, "hours");
      const isWeekInRange =
        weekStart.isBetween(eventStart, eventEnd, "day", "()")
        && weekEnd.isBetween(eventStart, eventEnd, "day", "()");
      if (isWeekInRange) {
        return { event: e, type: "running" };
      }
      const isStartDateInRange = eventStart.isBetween(weekStart, weekEnd, "day", "[]");
      const isEndDateInRange = eventEnd.isBetween(weekStart, weekEnd, "day", "[]");
      if (isStartDateInRange && isEndDateInRange) {
        return { event: e, type: "inside" };
      }
      if (isStartDateInRange) {
        return { event: e, type: "start" };
      }
      if (isEndDateInRange) {
        return { event: e, type: "end" };
      }
    }
    return undefined;
  };

  useEffect(() => {
    if (dateOfBirth !== null) {
      const dob = dayjs(dateOfBirth).startOf("day");
      const startDay = dayjs(dateOfBirth).startOf("week").toDate();
      const endDay = dayjs(dateOfBirth).add(100, "years")
        .endOf("week").startOf("day").toDate();

      const totalWeeks = 5170;
      const lifeCalendarWeeks: LifeCalendar = [];

      const events = lifeEvents.filter(e => isValidEvent(startDay, endDay, e));
      const bookmarks = lifeBookmarks.filter(b => isValidBookmark(startDay, endDay, b));

      let weekStart = dayjs(startDay);
      let weekEnd = weekStart.add(6, "days").endOf("day");

      for (let i = 0; i < totalWeeks; i++) {
        const weekBookmarks = bookmarks.filter(b => isBookmarkInRange(weekStart, weekEnd, b));
        const weekEvents: EventRange[] = [];
        events.map(e => createEventInRange(weekStart, weekEnd, e))
          .forEach(e => {
            if (e) {
              weekEvents.push(e);
            }
          });
        const isNewYear = dayjs(`${weekEnd.year()}-01-01`).isBetween(weekStart, weekEnd, "day", "[]");

        const d1 = dayjs(new Date(weekStart.year(), dob.month(), dob.date()))
          .startOf("day").add(12, "hours");
        const d2 = dayjs(new Date(weekEnd.year(), dob.month(), dob.date()))
          .startOf("day").add(12, "hours");

        const isBirthday = d1.isBetween(weekStart, weekEnd, "day", "[]")
          || d2.isBetween(weekStart, weekEnd, "day", "[]");
        const color = weekEvents.length === 0 ? defaultWeekBackground : weekEvents[weekEvents.length - 1].event.color;
        lifeCalendarWeeks.push({
          id: uuid4(),
          start: weekStart,
          end: weekEnd,
          isBirthDay: isBirthday,
          isNewYear: isNewYear,
          bookmarks: weekBookmarks,
          events: weekEvents,
          color: color
        });
        weekStart = weekStart.add(7, "days").startOf("day");
        weekEnd = weekEnd.add(7, "days").endOf("day");
      }
      setLifeCalendar(lifeCalendarWeeks);
    } else {
      setLifeCalendar([]);
    }
  }, []);

  const createLifeCalendarDiv = (i: LifeCalendarWeek) => {
    let icon;
    let background = i.color;
    const tooltips: string[] = [];

    tooltips.push(`${i.start.format(DATE_FORMAT)} to ${i.end.format(DATE_FORMAT)}`);

    if (i.bookmarks.length !== 0) {
      icon = icons.bookmark;
    }

    if (i.isNewYear) {
      icon = icons.newYear;
      background = newYearBackground;
      tooltips.push(`Happy new year: ${dayjs(i.end).year()}`);
    }

    if (i.isBirthDay) {
      icon = icons.birthday;
      background = birthDayBackground;
      const age = i.end.diff(dateOfBirth, "years");
      if (age === 0) {
        icon = icons.born;
        tooltips.push("You born on this week. Welcome to the word!");
      } else if (age === 1) {
        tooltips.push("You are 1 year old");
      } else {
        tooltips.push(`You are ${dayjs(i.end).diff(dateOfBirth, "years")} years old`);
      }
    }

    i.events.forEach(er => {
      if (er.type === "start") {
        tooltips.push(`${er.event.text} starts on ${displayOnlyDate(er.event.start)}`);
      }
      if (er.type === "end") {
        tooltips.push(`${er.event.text} ends on ${displayOnlyDate(er.event.end)}`);
      }
      if (er.type === "inside") {
        tooltips.push(`${er.event.text} starts from ${displayOnlyDate(er.event.start)}, ends on ${displayOnlyDate(er.event.end)}`);
      }
    });

    i.bookmarks.forEach(b => {
      tooltips.push(`${displayOnlyDate(b.date)}: ${b.title}`);
    });

    const tooltipsStack =
      <Stack spacing="xs">
        {
          tooltips.map((ttt, ix) =>
            <Text size="xs" weight={ix === 0 ? "bold" : "inherit"} key={`${i.id}-ttt-${ix}`}>{ttt}</Text>)
        }
      </Stack>;

    return (
      <Tooltip id={`${i.id}-t`} label={tooltipsStack}>
        <div key={i.id} className="week" style={{ backgroundColor: background }}>{icon}</div>
      </Tooltip>
    );
  };

  return (
    <div className="calendar">
      {lifeCalendar.map((week) => createLifeCalendarDiv(week))}
    </div>
  );
};

export default Home;
