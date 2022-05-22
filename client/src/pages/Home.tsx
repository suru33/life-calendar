import { useEffect, useState } from "react";
import dayjs from "dayjs";
import isBetweenPlugin from "dayjs/plugin/isBetween";
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
import { birthday, born, defaultBg, newyear } from "../commons/app.colors";
import { icons } from "../commons/app.icons";
import { DATE_FORMAT, displayOnlyDate } from "../types.util";
import "./Home.css";

const Home = () => {
  dayjs.extend(isBetweenPlugin);
  const TOTAL_WEEKS = 5170;

  // localstorage
  const [dateOfBirth] = useLocalStorage<OnlyDate>(dateOfBirthLocalStorageConfig);
  const [lifeEvents] = useLocalStorage<LifeEvents>(lifeEventsLocalStorageConfig);
  const [lifeBookmarks] = useLocalStorage<LifeBookmarks>(lifeBookmarksLocalStorageConfig);

  // state
  const [ lifeCalendar, setLifeCalendar ] = useState<LifeCalendar>([]);
  const [ isPending, setPending ] = useState(true);

  // validation
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
    setPending(true);
    if (dateOfBirth !== null) {
      const dob = dayjs(dateOfBirth).startOf("day");
      const startDay = dayjs(dateOfBirth).startOf("week").toDate();
      const endDay = dayjs(dateOfBirth).add(100, "years")
        .endOf("week").startOf("day").toDate();

      const lifeCalendarWeeks: LifeCalendar = [];

      const events = lifeEvents.filter(e => isValidEvent(startDay, endDay, e));
      const bookmarks = lifeBookmarks.filter(b => isValidBookmark(startDay, endDay, b));

      let weekStart = dayjs(startDay);
      let weekEnd = weekStart.add(6, "days").endOf("day");
      for (let i = 0; i < TOTAL_WEEKS; i++) {
        const weekBookmarks = bookmarks.filter(b => isBookmarkInRange(weekStart, weekEnd, b));
        const weekEvents: EventRange[] = [];
        events.map(e => createEventInRange(weekStart, weekEnd, e))
          .forEach(e => {
            if (e) {
              weekEvents.push(e);
            }
          });
        const isNewyear = dayjs(`${weekEnd.year()}-01-01`).isBetween(weekStart, weekEnd, "day", "[]");

        const d1 = dayjs(new Date(weekStart.year(), dob.month(), dob.date()))
          .startOf("day").add(12, "hours");
        const d2 = dayjs(new Date(weekEnd.year(), dob.month(), dob.date()))
          .startOf("day").add(12, "hours");
        const isBirthday = d1.isBetween(weekStart, weekEnd, "day", "[]")
          || d2.isBetween(weekStart, weekEnd, "day", "[]");

        const bg = weekEvents.length === 0 ? defaultBg : weekEvents[weekEvents.length - 1].event.color;
        lifeCalendarWeeks.push({
          id: i.toString(16),
          start: weekStart,
          end: weekEnd,
          isBirthday: isBirthday,
          isNewyear: isNewyear,
          bookmarks: weekBookmarks,
          events: weekEvents,
          color: bg
        });
        weekStart = weekStart.add(7, "days").startOf("day");
        weekEnd = weekEnd.add(7, "days").endOf("day");
      }
      setLifeCalendar(lifeCalendarWeeks);
    } else {
      setLifeCalendar([]);
    }
    setPending(false);
  }, []);

  const createWeek = (i: LifeCalendarWeek) => {
    let icon;
    let background = i.color;
    const tooltips: string[] = [`${i.start.format(DATE_FORMAT)} to ${i.end.format(DATE_FORMAT)}`];

    if (i.bookmarks.length !== 0) {
      icon = icons.bookmark;
    }

    if (i.isNewyear) {
      icon = icons.newyear;
      background = newyear.bg;
      tooltips.push(`🎉 Happy new year: ${i.end.year()}`);
    }

    if (i.isBirthday) {
      icon = icons.birthday;
      background = birthday.bg;
      const age = i.end.diff(dateOfBirth, "years");
      if (age === 0) {
        icon = icons.born;
        background = born.bg;
        tooltips.push("🥳 You born on this week. Welcome to the word!");
      } else if (age === 1) {
        tooltips.push("🥳 You are 1 year old");
      } else {
        tooltips.push(`🥳 You are ${dayjs(i.end).diff(dateOfBirth, "years")} years old`);
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
      <Stack spacing="xs" key={`${i.id}s`}>
        {
          tooltips.map((ttt, ix) =>
            <Text size="xs"
              sx={ix === 0 ? { fontWeight: "bolder" } : {}}
              key={`${i.id}t${ix}`}>
              {ttt}
            </Text>
          )
        }
      </Stack>;

    return (
      <Tooltip key={i.id} label={tooltipsStack}>
        <div id={`${i.id}w`} className="week" style={{ backgroundColor: background }}>{icon}</div>
      </Tooltip>
    );
  };

  return (
    isPending ?
      <Text weight="bolder" size="xl" align="center" color="blue">
        Loading, please wait!
      </Text> :
      <div id="7e79" className="calendar">
        {lifeCalendar.map((week) => createWeek(week))}
      </div>
  );
};
export default Home;
