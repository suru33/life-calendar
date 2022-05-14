import { useEffect, useState } from "react";
import { Button, ColorInput, Modal, Stack, Text, Textarea } from "@mantine/core";
import { DatePicker } from "@mantine/dates";
import { useInputState } from "@mantine/hooks";
import { v4 as uuid4 } from "uuid";
import { LifeEvent, LifeEventOverlapError, OnlyDate, Optional } from "../types";
import { buildLifeEventOverlapError, DATE_FORMAT, dateRangeOverlaps, displayOnlyDate } from "../types.util";
import { swatches } from "../commons/app.colors";

export interface LifeEventModalProps {
  opened: boolean,
  callback: (lifeEvent: LifeEvent | undefined, resetModal: () => void) => void,
  allEvents: LifeEvent[],
  dateOfBirth: OnlyDate,
  maxDate: OnlyDate,
  eventId?: string,
}

const LifeEventModal = (props: LifeEventModalProps) => {
  const event: Optional<LifeEvent> = props.eventId ? props.allEvents.find(e => e.id === props.eventId) : undefined;
  const eventId: string = event ? event.id : uuid4();
  const modalTitle = event ? "Edit life event" : "Add new life event";

  const [ startDate, setStartDate ] = useState<Optional<OnlyDate>>(undefined);
  const [ endDate, setEndDate ] = useState<Optional<OnlyDate>>(undefined);
  const [ color, setColor ] = useInputState<Optional<string>>(swatches[0]);
  const [ text, setText ] = useInputState<Optional<string>>(undefined);
  const [ saveButtonDisabled, setSaveButtonDisabled ] = useState(true);
  const [ startDateError, setStartDateError ] = useState<string | boolean>(false);
  const [ endDateError, setEndDateError ] = useState<string | boolean>(false);
  const [ textError, setTextError ] = useState(false);
  const [ colorError, setColorError ] = useState(false);
  const [ overlapError, setOverlapError ] = useState<LifeEventOverlapError>({ hidden: true });

  useEffect(() => {
    setStartDate(event?.start);
    setEndDate(event?.end);
    setText(event?.text);
    if (event) {
      setColor(event.color);
    }
  }, [event]);

  useEffect(() => {
    const isStartDateEmpty = startDate === undefined || startDate === null;
    const isEndDateEmpty = endDate === undefined || endDate === null;
    const startDateError = !isStartDateEmpty && !isEndDateEmpty && startDate >= endDate;
    const dateOfBirthError = !isStartDateEmpty && props.dateOfBirth !== null && startDate < props.dateOfBirth;
    const maxDateError = !isEndDateEmpty && props.maxDate !== null && endDate > props.maxDate;
    let overlapError = false;
    const isColorEmpty = color === undefined || color === null || color.trim() === "";
    const isTextEmpty = text === undefined || text === null || text.trim() === "";
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
    setColorError(isColorEmpty);
    setTextError(isTextEmpty);
    if (startDateError) {
      setStartDateError("Start date should be before end date");
    }
    if (dateOfBirthError) {
      setStartDateError("Start date should be starting from or after date of birth");
    }
    if (maxDateError) {
      setEndDateError(`End date should not be more than 99 years age, the last date would be ${displayOnlyDate(props.maxDate)}`);
    }
    setSaveButtonDisabled(
      isEndDateEmpty
      || isEndDateEmpty
      || isTextEmpty
      || startDateError
      || overlapError
      || dateOfBirthError
      || maxDateError
      || isColorEmpty
    );
  }, [ startDate, endDate, text, color ]);

  const resetModal = () => {
    setStartDate(undefined);
    setEndDate(undefined);
    setText(undefined);
    setColor(swatches[Math.floor(Math.random() * swatches.length)]);
  };

  const saveClicked = () => {
    if (startDate && endDate && text && color) {
      const event: LifeEvent = {
        id: eventId,
        end: endDate,
        start: startDate,
        text: text.trim(),
        color: color
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
          inputFormat={DATE_FORMAT}
          error={startDateError}
          onChange={setStartDate}/>
        <DatePicker
          required
          label="End date"
          value={endDate}
          inputFormat={DATE_FORMAT}
          error={endDateError}
          onChange={setEndDate}/>
        <ColorInput
          required
          withPicker={false}
          swatchesPerRow={8}
          label="Event color"
          format="hex"
          value={color}
          error={colorError}
          onChange={setColor}
          swatches={swatches}/>
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
