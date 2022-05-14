import { useEffect, useState } from "react";
import dayjs from "dayjs";
import { v4 as uuid4 } from "uuid";
import { Stack, Text, Tooltip } from "@mantine/core";
import { icons } from "../commons/app.icons";
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
import "./Home.css";
import * as weekOfYearPlugin from "dayjs/plugin/weekOfYear";
import * as durationPlugin from "dayjs/plugin/duration";
import { DATE_FORMAT, displayOnlyDate } from "../types.util";
import isBetweenPlugin from "dayjs/plugin/isBetween";

const Home = () => {
  dayjs.extend(weekOfYearPlugin);
  dayjs.extend(durationPlugin);
  dayjs.extend(isBetweenPlugin);
  // localstorage
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [ dateOfBirth, setDateOfBirth ] = useLocalStorage<OnlyDate>(dateOfBirthLocalStorageConfig);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [ lifeEvents, setLifeEvents ] = useLocalStorage<LifeEvents>(lifeEventsLocalStorageConfig);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [ lifeBookmarks, setLifeBookmarks ] = useLocalStorage<LifeBookmarks>(lifeBookmarksLocalStorageConfig);
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
      const eventStart = dayjs(e.start);
      const eventEnd = dayjs(e.start);
      const isWeekInRange = weekStart.isBetween(eventEnd, eventEnd, "day", "[]") &&
        weekEnd.isBetween(eventEnd, eventEnd, "day", "[]");
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
      const dob = dayjs(dateOfBirth).startOf("week");
      const startDay = dayjs(dateOfBirth).startOf("week").toDate();
      const endDay = dayjs(dateOfBirth).add(99, "years").endOf("week").startOf("day").toDate();

      const totalWeeks = 5163;
      const lifeCalendarWeeks: LifeCalendar = [];

      const events = lifeEvents.filter(e => isValidEvent(startDay, endDay, e));
      const bookmarks = lifeBookmarks.filter(b => isValidBookmark(startDay, endDay, b));

      let weekStart = dayjs(startDay);
      let weekEnd = weekStart.add(6, "days");

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
        const d1 = dayjs(`${weekStart.year()}-${dob.month() + 1}-${dob.date()}`);
        const d2 = dayjs(`${weekEnd.year()}-${dob.month() + 1}-${dob.date()}`);
        const isBirthday = d1.isBetween(weekStart, weekEnd, "day", "[]") ||
          d2.isBetween(weekStart, weekEnd, "day", "[]");
        const color = weekEvents.length === 0 ? "#f8f8ff" : weekEvents[weekEvents.length - 1].event.color;
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
        weekStart = weekStart.add(7, "days");
        weekEnd = weekEnd.add(7, "days");
      }
      setLifeCalendar(lifeCalendarWeeks);
    } else {
      setLifeCalendar([]);
    }
  }, []);

  const createLifeCalendarDiv = (i: LifeCalendarWeek) => {
    let icon;
    const tooltips: string[] = [];
    tooltips.push(`${i.start.format(DATE_FORMAT)} to ${i.end.format(DATE_FORMAT)}`);
    if (i.bookmarks.length !== 0) {
      icon = icons.bookmark;
    }
    if (i.isNewYear) {
      icon = icons.calendar;
      tooltips.push(`Happy new year: ${dayjs(i.end).year()}`);
    }
    if (i.isBirthDay) {
      icon = icons.birthday;
      tooltips.push(`You are ${dayjs(i.end).diff(dateOfBirth, "years")} year(s) old`);
    }
    i.bookmarks.forEach(b => {
      tooltips.push(`${displayOnlyDate(b.date)}: ${b.title}`);
    });

    const divBody = <div key={i.id} className="event-div" style={{ backgroundColor: i.color }}>{icon}</div>;

    if (tooltips.length === 0) {
      return divBody;
    } else {
      const tts =
        <Stack spacing="xs">
          {tooltips.map(tt => <Text key={uuid4()}>{tt}</Text>)}
        </Stack>;
      return (
        <Tooltip id={uuid4()} label={tts}>{divBody}</Tooltip>
      );
    }
  };

  return (
    <div className="calendar">
      {lifeCalendar.map((week) => createLifeCalendarDiv(week))}
    </div>
  );
};

export default Home;
