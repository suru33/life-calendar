import { useEffect, useState } from "react";
import { Button, Modal, Stack, Text, Textarea } from "@mantine/core";
import { DatePicker } from "@mantine/dates";
import { useInputState } from "@mantine/hooks";
import { v4 as uuid4 } from "uuid";
import { LifeEvent, OnlyDate, Optional, LifeEventOverlapError } from "../types";
import { dateRangeOverlaps, buildLifeEventOverlapError } from "../types.util";

export interface LifeEventModalProps {
  opened: boolean,
  callback: (lifeEvent: LifeEvent | undefined, resetModal: () => void) => void,
  allEvents: LifeEvent[],
  eventId?: string,
}

const LifeEventModal = (props: LifeEventModalProps) => {
  const event: Optional<LifeEvent> = props.eventId ? props.allEvents.find(e => e.id === props.eventId) : undefined;
  const eventId: string = event ? event.id : uuid4();
  const modalTitle = event ? "Edit life event" : "Add new life event";

  const [ startDate, setStartDate ] = useState<Optional<OnlyDate>>(undefined);
  const [ endDate, setEndDate ] = useState<Optional<OnlyDate>>(undefined);
  const [ text, setText ] = useInputState<Optional<string>>(undefined);
  const [ saveButtonDisabled, setSaveButtonDisabled ] = useState(true);
  const [ startDateError, setStartDateError ] = useState<string | boolean>(false);
  const [ endDateError, setEndDateError ] = useState(false);
  const [ textError, setTextError ] = useState(false);
  const [ overlapError, setOverlapError ] = useState<LifeEventOverlapError>({ hidden: true });

  useEffect(() => {
    setStartDate(event?.start);
    setEndDate(event?.end);
    setText(event?.text);
  }, [event]);

  useEffect(() => {
    const isStartDateEmpty = typeof startDate === "undefined" || startDate === null;
    const isEndDateEmpty = typeof endDate === "undefined" || endDate === null;
    const startDateError = !isStartDateEmpty && !isEndDateEmpty && startDate >= endDate;
    let overlapError = false;
    const isTextEmpty = text && text.trim() === "" || typeof text === "undefined";
    if (!isStartDateEmpty && !isEndDateEmpty) {
      const overlaps = props.allEvents
        .filter(event => dateRangeOverlaps(event.start, event.end, startDate, endDate) && event.id !== eventId);
      if (overlaps.length === 0) {
        setOverlapError(buildLifeEventOverlapError(undefined));
      } else {
        setOverlapError(buildLifeEventOverlapError(overlaps[0]));
        overlapError = true;
      }
    } else {
      setOverlapError(buildLifeEventOverlapError(undefined));
    }
    setStartDateError(isStartDateEmpty);
    setEndDateError(isEndDateEmpty);
    setTextError(isTextEmpty);
    if (startDateError) {
      setStartDateError("Start date should be before end date");
    }
    setSaveButtonDisabled(isEndDateEmpty || isEndDateEmpty || isTextEmpty || startDateError || overlapError);
  }, [ startDate, endDate, text ]);

  const resetModal = () => {
    setStartDate(undefined);
    setEndDate(undefined);
    setText(undefined);
  };

  const saveClicked = () => {
    if (startDate && endDate && text) {
      const event: LifeEvent = {
        id: eventId,
        end: endDate,
        start: startDate,
        text: text.trim()
      };
      props.callback(event, resetModal);
    }
  };

  const closeModal = () => {
    props.callback(undefined, resetModal);
  };

  return (
    <Modal
      centered
      size="md"
      overlayOpacity={0.55}
      overlayBlur={3}
      withCloseButton={true}
      closeOnEscape={true}
      opened={props.opened}
      closeOnClickOutside={false}
      onClose={closeModal}
      title={<Text weight={700}>{modalTitle}</Text>}>
      <Stack>
        <DatePicker
          required
          label="Start date"
          value={startDate}
          error={startDateError}
          onChange={setStartDate}/>
        <DatePicker
          required
          label="End date"
          value={endDate}
          error={endDateError}
          onChange={setEndDate}/>
        <Textarea
          required
          label="Event"
          minRows={5}
          value={text}
          error={textError}
          onChange={setText}/>
        <div hidden={overlapError.hidden}>
          <Text color="red" size="sm" weight="bold">This event overlaps with other event:</Text>
          <Text color="dimmed" size="sm">{overlapError.start} to {overlapError.end}</Text>
          <Text color="dimmed" size="sm">{overlapError.text}</Text>
        </div>
        <Button disabled={saveButtonDisabled} onClick={saveClicked}>Save</Button>
      </Stack>
    </Modal>
  );
};

export default LifeEventModal;
