import { Sheet } from 'react-modal-sheet';
import { useState } from 'react';

export default function DayModal({ isOpen, setOpen }) {
  return (
    <>
      <Sheet isOpen={isOpen} onClose={() => setOpen(false)}>
        <Sheet.Container>
          <Sheet.Header />
          <Sheet.Content>{/* Your sheet content goes here */}</Sheet.Content>
        </Sheet.Container>
        <Sheet.Backdrop />
      </Sheet>
    </>
  );
}
