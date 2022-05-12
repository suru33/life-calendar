import { useState } from "react";
import { useLocalStorage } from "@mantine/hooks";
import { ActionIcon, Container, Group, Stack, Table, Text } from "@mantine/core";
import { DatePicker } from "@mantine/dates";
import { LifeBookmarks, LifeEvent, LifeEvents, OnlyDate } from "../types";
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

const Config = () => {
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
  const [ bookmarks, setBookmarks ] = useLocalStorage<LifeBookmarks>({
    key: "life-bookmarks",
    defaultValue: [],
    serialize: serializeBookmarks,
    deserialize: deserializeBookmarks
  });

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

  const deleteLifeEvent = (id: string) => {
    setLifeEvents(lifeEvents.filter(event => event.id !== id));
  };

  const editLifeEvent = (id: string) => {
    setLiveEventModalEventId(id);
    setLiveEventModalOpened(true);
  };

  const lifeEventsTableHeader =
    <tr>
      <th style={{ width: "110px", textAlign: "center" }}>Start Date</th>
      <th style={{ width: "110px", textAlign: "center" }}>End Date</th>
      <th style={{ textAlign: "center" }}>Event</th>
      <th style={{ width: "100px" }}>
        <ActionIcon onClick={() => setLiveEventModalOpened(true)}>
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
        eventId={liveEventModalEventId}/>
      <Stack>
        <Group sx={{ marginLeft: 35 }}>
          <Text weight={700}>Date of birth</Text>
          <DatePicker inputFormat="MMM D, YYYY" value={dateOfBirth} onChange={setDateOfBirth}/>
        </Group>
        <Table highlightOnHover captionSide="top" sx={{ marginTop: 15 }}>
          <caption><Text weight={700}>Life Events</Text></caption>
          <thead>{lifeEventsTableHeader}</thead>
          <tbody>{lifeEvents.map((e) =>
            <tr key={e.id}>
              <td>{displayOnlyDate(e.start)}</td>
              <td>{displayOnlyDate(e.end)}</td>
              <td>{e.text}</td>
              <td>
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
          )}</tbody>
        </Table>
      </Stack>
    </Container>
  );
};

export default Config;
