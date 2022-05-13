import { useEffect, useState } from "react";
import { v4 as uuid4 } from "uuid";
import { Button, Modal, Stack, Text, TextInput } from "@mantine/core";
import { DatePicker } from "@mantine/dates";
import { useInputState } from "@mantine/hooks";
import { LifeBookmark, LifeBookmarks, OnlyDate, Optional } from "../types";

export interface LifeBookmarkModalProps {
  opened: boolean,
  callback: (lifeBookmark: LifeBookmark | undefined, resetModal: () => void) => void,
  dateOfBirth: OnlyDate,
  allBookmarks: LifeBookmarks,
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
    let dateError = false;
    const isTextEmpty = title === undefined || title.trim() === "";
    if (isDateEmpty) {
      setDateError(isDateEmpty);
    } else {
      // TODO: add end date validation later
      if (props.dateOfBirth !== null && date <= props.dateOfBirth) {
        setDateError("Bookmark date should be after date of birth");
        dateError = true;
      } else {
        setDateError(isDateEmpty);
      }
    }
    setTextError(isTextEmpty);
    setSaveButtonDisabled(isDateEmpty || dateError || isTextEmpty);
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
          error={dateError}
          onChange={setDate}/>
        <Button disabled={saveButtonDisabled} onClick={saveClicked}>Save</Button>
      </Stack>
    </Modal>
  );
};

export default LifeBookmarkModal;
