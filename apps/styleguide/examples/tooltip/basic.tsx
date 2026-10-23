import { Button, Tooltip } from '@jsonresume/ui';

export default function TooltipBasic() {
  return (
    <>
      <Tooltip content="Copies a link to this resume">
        <Button>Share</Button>
      </Tooltip>
      <Tooltip content="Opens the PDF in a new tab" side="bottom">
        <Button variant="ghost">PDF</Button>
      </Tooltip>
    </>
  );
}
