import { Resume } from 'jsonresume-theme-reference';
import resume from './api/samples/resume';
export default function Talk() {
  // @todo - used to render react templates (purely debug stuff at the moment)
  return (
    <div>
      <Resume resume={resume} />
    </div>
  );
}
