import { useState } from "react";
import { useLocalStorage } from "@mantine/hooks";
import { ActionIcon, Alert, Center, Container, Group, Stack, Table, Text } from "@mantine/core";
import { DatePicker } from "@mantine/dates";
import { showNotification } from "@mantine/notifications";
import { LifeBookmark, LifeBookmarks, LifeEvent, LifeEvents, OnlyDate } from "../types";
import LifeEventModal from "../components/LifeEventModal";
import { AppIcon, icons } from "../app-icons";
import {
  compareOnlyDates,
  deserializeBookmarks,
  deserializeLifeEvents,
  deserializeOnlyDate,
  displayOnlyDate,
  serializeBookmarks,
  serializeLifeEvents,
  serializeOnlyDate
} from "../types.util";
import LifeBookmarkModal from "../components/LifeBookmarkModal";

const Config = () => {
  // localstorage
  const [ dateOfBirth, setDateOfBirth ] = useLocalStorage<OnlyDate>({
    key: "date-of-birth",
    defaultValue: null,
    serialize: serializeOnlyDate,
    deserialize: deserializeOnlyDate
  });
  const [ lifeEvents, setLifeEvents ] = useLocalStorage<LifeEvents>({
    key: "life-events",
    defaultValue: [],
    serialize: serializeLifeEvents,
    deserialize: deserializeLifeEvents
  });
  const [ lifeBookmarks, setLifeBookmarks ] = useLocalStorage<LifeBookmarks>({
    key: "life-bookmarks",
    defaultValue: [],
    serialize: serializeBookmarks,
    deserialize: deserializeBookmarks
  });
  // end localstorage

  // misc function
  const monoText = (s: string) =>
    <Text size="xs" sx={{ fontFamily: "monospace" }}>{s}</Text>;

  const showDateOfBirthError = () => {
    showNotification({
      id: "d221270e-4889-4c3d-8d59-08c48535dc74",
      title: "Bummer!",
      message: "You haven't added the date of birth",
      autoClose: 3000,
      color: "red",
      icon: icons.notificationSad
    });
  };

  const emptyDataAlert = (title: string, alertText: string, span: number) =>
    <tr>
      <td colSpan={span}>
        <Alert
          title={title}
          icon={icons.alertInfo}
          color="yellow">
          {alertText}
        </Alert>
      </td>
    </tr>;

  const addNew = (modalFn: (v: boolean) => void) => {
    if (dateOfBirth === null) {
      showDateOfBirthError();
    } else {
      modalFn(true);
    }
  };

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

  const lifeEventsTableHeader =
    <tr>
      <th style={{ width: "110px", textAlign: "center" }}>Start Date</th>
      <th style={{ width: "110px", textAlign: "center" }}>End Date</th>
      <th style={{ textAlign: "center" }}>Event</th>
      <th style={{ width: "100px" }}>
        <ActionIcon onClick={() => addNew(setLiveEventModalOpened)}>
          {AppIcon("green", icons.plus)}
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

  const lifeBookmarksTableHeader =
    <tr>
      <th style={{ width: "110px", textAlign: "center" }}>Date</th>
      <th style={{ textAlign: "center" }}>Title</th>
      <th style={{ width: "100px" }}>
        <ActionIcon onClick={() => addNew(setLiveBookmarkModalOpened)}>
          {AppIcon("green", icons.plus)}
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
        eventId={liveEventModalEventId}/>

      <LifeBookmarkModal
        opened={liveBookmarkModalOpened}
        callback={lifeBookmarkModalCallback}
        dateOfBirth={dateOfBirth}
        allBookmarks={lifeBookmarks}
        bookmarkId={liveBookmarkModalBookmarkId}/>

      <Stack>
        <Text weight={700} align="center">Date of birth</Text>
        <Center>
          <DatePicker inputFormat="MMM D, YYYY" value={dateOfBirth} onChange={setDateOfBirth}/>
        </Center>

        <Table highlightOnHover captionSide="top" sx={{ marginTop: 15 }}>
          <caption><Text weight={700}>Life Events</Text></caption>
          <thead>{lifeEventsTableHeader}</thead>
          <tbody>
            {
              lifeEvents.length === 0 ?
                emptyDataAlert("No events found", "You can add events by clicking + icon", 4) :
                lifeEvents.map((e) =>
                  <tr key={e.id}>
                    <td>{monoText(displayOnlyDate(e.start))}</td>
                    <td>{monoText(displayOnlyDate(e.end))}</td>
                    <td>{e.text}</td>
                    <td align="right">
                      <Group>
                        <ActionIcon onClick={() => editLifeEvent(e.id)}>
                          {AppIcon("blue", icons.pencil)}
                        </ActionIcon>
                        <ActionIcon onClick={() => deleteLifeEvent(e.id)}>
                          {AppIcon("red", icons.trash)}
                        </ActionIcon>
                      </Group>
                    </td>
                  </tr>
                )
            }
          </tbody>
        </Table>

        <Table highlightOnHover captionSide="top" sx={{ marginTop: 15 }}>
          <caption><Text weight={700}>Bookmarks</Text></caption>
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
                        {AppIcon("blue", icons.pencil)}
                      </ActionIcon>
                      <ActionIcon onClick={() => deleteLifeBookmark(b.id)}>
                        {AppIcon("red", icons.trash)}
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
