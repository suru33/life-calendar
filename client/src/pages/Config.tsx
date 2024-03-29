import { useEffect, useState } from "react";
import dayjs from "dayjs";
import { useLocalStorage } from "@mantine/hooks";
import { ActionIcon, Alert, ColorSwatch, Container, Grid, Group, Stack, Table, Text } from "@mantine/core";
import { DatePicker } from "@mantine/dates";
import { LifeBookmark, LifeBookmarks, LifeEvent, LifeEvents, OnlyDate } from "../types";
import LifeEventModal from "../components/LifeEventModal";
import { ColorIcon, icons } from "../commons/app.icons";
import { compareOnlyDates, DATE_FORMAT, displayOnlyDate } from "../types.util";
import LifeBookmarkModal from "../components/LifeBookmarkModal";
import {
  dateOfBirthLocalStorageConfig,
  lifeBookmarksLocalStorageConfig,
  lifeEventsLocalStorageConfig
} from "../commons/app.localstoreage";

const Config = () => {
  // localstorage
  const [ dateOfBirth, setDateOfBirth ] = useLocalStorage<OnlyDate>(dateOfBirthLocalStorageConfig);
  const [ lifeEvents, setLifeEvents ] = useLocalStorage<LifeEvents>(lifeEventsLocalStorageConfig);
  const [ lifeBookmarks, setLifeBookmarks ] = useLocalStorage<LifeBookmarks>(lifeBookmarksLocalStorageConfig);
  // end localstorage

  // date of birth and max date validation
  const [ maxDate, setMaxDate ] = useState<OnlyDate>(null);
  const [ dateOfBirthWarning, setDateOfBirthWarning ] = useState<string | undefined>(undefined);

  useEffect(() => {
    const newMaxDate = dateOfBirth === null ? null : dayjs(dateOfBirth).add(99, "years").startOf("day").toDate();
    setMaxDate(newMaxDate);

    if (dateOfBirth === null) {
      if (lifeEvents.length !== 0 || lifeBookmarks.length === 0) {
        setDateOfBirthWarning("You have orphan events or bookmarks, add your date of birth to get started");
      } else {
        setDateOfBirthWarning("Add your date of birth to get started");
      }
    } else {
      const badBeforeEvents = lifeEvents.filter(e => e.start !== null && e.start < dateOfBirth);
      const badBeforeBookmarks = lifeBookmarks.filter(b => b.date !== null && b.date <= dateOfBirth);
      const badAfterEvents = lifeEvents.filter(e => e.end !== null && newMaxDate !== null && e.end > newMaxDate);
      const badAfterBookmarks = lifeBookmarks.filter(b => b.date !== null && newMaxDate !== null && b.date > newMaxDate);
      if (badBeforeEvents.length + badBeforeBookmarks.length + badAfterEvents.length + badAfterBookmarks.length !== 0) {
        setDateOfBirthWarning(
          "Some events or bookmarks are before the date of birth or after the supported maximum date, they can not be displayed."
        );
      } else {
        setDateOfBirthWarning(undefined);
      }
    }
  }, [dateOfBirth]);

  // misc values and function
  const titleWeight = 700;

  const monoText = (s: string) =>
    <Text size="xs" sx={{ fontFamily: "monospace" }}>{s}</Text>;

  const emptyDataAlert = (title: string, alertText: string, span: number) =>
    <tr>
      <td colSpan={span}>
        <Alert
          title={title}
          icon={icons.alertInfo}>
          {alertText}
        </Alert>
      </td>
    </tr>;

  // life events
  const [ liveEventModalEventId, setLiveEventModalEventId ] = useState<string | undefined>(undefined);
  const [ liveEventModalOpened, setLiveEventModalOpened ] = useState(false);

  const lifeEventModalCallback = (newEvent: LifeEvent | undefined, resetModal: () => void) => {
    if (newEvent) {
      const filteredEvents = lifeEvents.filter(oldEvent => oldEvent.id !== newEvent.id);
      setLifeEvents(
        [ ...filteredEvents, newEvent ]
          .sort((a, b) => compareOnlyDates(a.start, b.start))
      );
    }
    setLiveEventModalOpened(false);
    setLiveEventModalEventId(undefined);
    resetModal();
  };

  const editLifeEvent = (id: string) => {
    setLiveEventModalEventId(id);
    setLiveEventModalOpened(true);
  };

  const deleteLifeEvent = (id: string) => {
    setLifeEvents(lifeEvents.filter(event => event.id !== id));
  };

  const addNewEvent = () => {
    setLiveEventModalOpened(dateOfBirth !== null);
  };

  const lifeEventsTableHeader =
    <tr>
      <th style={{ width: "5px" }}></th>
      <th style={{ width: "110px", textAlign: "center" }}>Start Date</th>
      <th style={{ width: "110px", textAlign: "center" }}>End Date</th>
      <th style={{ textAlign: "center" }}>Event</th>
      <th style={{ width: "100px" }}>
        <ActionIcon onClick={addNewEvent}>
          {ColorIcon("green", "plus")}
        </ActionIcon>
      </th>
    </tr>;

  // life bookmarks
  const [ liveBookmarkModalBookmarkId, setLiveBookmarkModalBookmarkId ] = useState<string | undefined>(undefined);
  const [ liveBookmarkModalOpened, setLiveBookmarkModalOpened ] = useState(false);

  const lifeBookmarkModalCallback = (newBookmark: LifeBookmark | undefined, resetModal: () => void) => {
    if (newBookmark) {
      const filteredBookmarks = lifeBookmarks.filter(oldBookmark => oldBookmark.id !== newBookmark.id);
      setLifeBookmarks(
        [ ...filteredBookmarks, newBookmark ]
          .sort((a, b) => compareOnlyDates(a.date, b.date))
      );
    }
    setLiveBookmarkModalOpened(false);
    setLiveBookmarkModalBookmarkId(undefined);
    resetModal();
  };

  const editLifeBookmark = (id: string) => {
    setLiveBookmarkModalBookmarkId(id);
    setLiveBookmarkModalOpened(true);
  };

  const deleteLifeBookmark = (id: string) => {
    setLifeBookmarks(lifeBookmarks.filter(bookmark => bookmark.id !== id));
  };

  const addNewBookmark = () => {
    setLiveBookmarkModalOpened(dateOfBirth !== null);
  };

  const lifeBookmarksTableHeader =
    <tr>
      <th style={{ width: "110px", textAlign: "center" }}>Date</th>
      <th style={{ textAlign: "center" }}>Title</th>
      <th style={{ width: "100px" }}>
        <ActionIcon onClick={addNewBookmark}>
          {ColorIcon("green", "plus")}
        </ActionIcon>
      </th>
    </tr>;

  return (
    <Container>
      <LifeEventModal
        opened={liveEventModalOpened}
        callback={lifeEventModalCallback}
        allEvents={lifeEvents}
        dateOfBirth={dateOfBirth}
        maxDate={maxDate}
        eventId={liveEventModalEventId}/>

      <LifeBookmarkModal
        opened={liveBookmarkModalOpened}
        callback={lifeBookmarkModalCallback}
        allBookmarks={lifeBookmarks}
        dateOfBirth={dateOfBirth}
        maxDate={maxDate}
        bookmarkId={liveBookmarkModalBookmarkId}/>

      <Stack>
        <Grid grow>
          <Grid.Col span={6}>
            <DatePicker
              label={<Text weight={titleWeight}>Date of birth</Text>}
              inputFormat={DATE_FORMAT}
              firstDayOfWeek="sunday"
              value={dateOfBirth}
              icon={icons.birthday}
              onChange={setDateOfBirth}/>
          </Grid.Col>
          <Grid.Col span={6}>
            <DatePicker
              disabled
              label={<Text weight={titleWeight}>Supported maximum date</Text>}
              inputFormat={DATE_FORMAT}
              firstDayOfWeek="sunday"
              icon={icons.calendarOff}
              value={maxDate}/>
          </Grid.Col>
          <Grid.Col>
            <Alert
              icon={icons.alertWarning}
              hidden={dateOfBirthWarning === undefined}
              color="orange">
              {dateOfBirthWarning}
            </Alert>
          </Grid.Col>
        </Grid>
        <Table highlightOnHover captionSide="top" sx={{ marginTop: 15 }}>
          <caption><Text weight={titleWeight}>Life Events</Text></caption>
          <thead>{lifeEventsTableHeader}</thead>
          <tbody>
            {
              lifeEvents.length === 0 ?
                emptyDataAlert("No events found", "You can add events by clicking + icon", 4) :
                lifeEvents.map((e) =>
                  <tr key={e.id} style={{ background: "" }}>
                    <td>
                      <ColorSwatch color={e.color} sx={{ width: 5, height: 15 }} radius={3}/>
                    </td>
                    <td>{monoText(displayOnlyDate(e.start))}</td>
                    <td>{monoText(displayOnlyDate(e.end))}</td>
                    <td>{e.text}</td>
                    <td align="right">
                      <Group>
                        <ActionIcon onClick={() => editLifeEvent(e.id)}>
                          {ColorIcon("blue", "pencil")}
                        </ActionIcon>
                        <ActionIcon onClick={() => deleteLifeEvent(e.id)}>
                          {ColorIcon("red", "trash")}
                        </ActionIcon>
                      </Group>
                    </td>
                  </tr>
                )
            }
          </tbody>
        </Table>

        <Table highlightOnHover captionSide="top" sx={{ marginTop: 15 }}>
          <caption><Text weight={titleWeight}>Bookmarks</Text></caption>
          <thead>{lifeBookmarksTableHeader}</thead>
          <tbody>
            {
              lifeBookmarks.length === 0 ?
                emptyDataAlert("No bookmarks found", "You can add bookmarks by clicking + icon", 3) :
                lifeBookmarks.map(b => <tr key={b.id}>
                  <td>{monoText(displayOnlyDate(b.date))}</td>
                  <td>{b.title}</td>
                  <td>
                    <Group>
                      <ActionIcon onClick={() => editLifeBookmark(b.id)}>
                        {ColorIcon("blue", "pencil")}
                      </ActionIcon>
                      <ActionIcon onClick={() => deleteLifeBookmark(b.id)}>
                        {ColorIcon("red", "trash")}
                      </ActionIcon>
                    </Group>
                  </td>
                </tr>)
            }
          </tbody>
        </Table>
      </Stack>
    </Container>
  );
};

export default Config;
