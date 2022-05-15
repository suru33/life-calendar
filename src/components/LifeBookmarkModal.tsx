import { useEffect, useState } from "react";
import { v4 as uuid4 } from "uuid";
import { Button, Modal, Stack, Text, TextInput } from "@mantine/core";
import { DatePicker } from "@mantine/dates";
import { useInputState } from "@mantine/hooks";
import { LifeBookmark, LifeBookmarks, OnlyDate, Optional } from "../types";
import { DATE_FORMAT, displayOnlyDate } from "../types.util";

export interface LifeBookmarkModalProps {
  opened: boolean,
  callback: (lifeBookmark: LifeBookmark | undefined, resetModal: () => void) => void,
  allBookmarks: LifeBookmarks,
  dateOfBirth: OnlyDate,
  maxDate: OnlyDate,
  bookmarkId?: string,
}

const LifeBookmarkModal = (props: LifeBookmarkModalProps) => {
  const bookmark: Optional<LifeBookmark> =
    props.bookmarkId ? props.allBookmarks.find(e => e.id === props.bookmarkId) : undefined;
  const bookmarkId: string = bookmark ? bookmark.id : uuid4();
  const modalTitle = bookmark ? "Edit bookmark" : "Add new bookmark";

  const [ date, setDate ] = useState<Optional<OnlyDate>>(undefined);
  const [ title, setText ] = useInputState<Optional<string>>(undefined);
  const [ saveButtonDisabled, setSaveButtonDisabled ] = useState(true);
  const [ dateError, setDateError ] = useState<boolean | string>(false);
  const [ textError, setTextError ] = useState(false);

  useEffect(() => {
    setDate(bookmark?.date);
    setText(bookmark?.title);
  }, [bookmark]);

  useEffect(() => {
    const isDateEmpty = date === undefined || date === null;
    const isTextEmpty = title === undefined || title.trim() === "";
    const dateOfBirthError = !isDateEmpty && props.dateOfBirth !== null && date < props.dateOfBirth;
    const maxDateError = !isDateEmpty && props.maxDate !== null && date > props.maxDate;
    setDateError(isDateEmpty);
    setTextError(isTextEmpty);
    if (dateOfBirthError) {
      setDateError("Bookmark date should be starting from or after date of birth");
    }
    if (maxDateError) {
      setDateError(`Bookmark date should be less than 99 years age, which is ${displayOnlyDate(props.maxDate)}`);
    }
    setSaveButtonDisabled(isDateEmpty || dateOfBirthError || maxDateError || isTextEmpty);
  }, [ date, title ]);

  const resetModal = () => {
    setDate(undefined);
    setText(undefined);
  };

  const saveClicked = () => {
    if (date && title) {
      const bookmark: LifeBookmark = {
        id: bookmarkId,
        date: date,
        title: title.trim()
      };
      props.callback(bookmark, resetModal);
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
        <TextInput
          required
          data-autofocus
          label="Title"
          value={title}
          error={textError}
          onChange={setText}/>
        <DatePicker
          required
          label="Date"
          value={date}
          inputFormat={DATE_FORMAT}
          firstDayOfWeek="sunday"
          error={dateError}
          onChange={setDate}/>
        <Button disabled={saveButtonDisabled} onClick={saveClicked}>Save</Button>
      </Stack>
    </Modal>
  );
};

export default LifeBookmarkModal;
