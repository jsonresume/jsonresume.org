import { useAtomSet, useAtomValue } from '@effect/atom-react';
import { media } from '@jsonresume/ui/tokens';
import { checkAts } from '@repo/ats';
import { AtsReportView } from '@repo/ats/ui';
import { useMemo } from 'react';
import * as s from './editor.css';
import { useWide } from './backup';
import { fieldTarget } from './form/goTo';
import {
  draftAtom,
  goToFieldAtom,
  modeParamAtom,
  openSectionsAtom,
  panelParamAtom,
} from './state';

/** The draft's ATS check, as it changes: what tracking systems will read. */
export function CheckPane() {
  const draft = useAtomValue(draftAtom);
  const report = useMemo(() => checkAts(draft), [draft]);
  const setOpen = useAtomSet(openSectionsAtom);
  const setGoTo = useAtomSet(goToFieldAtom);
  const setMode = useAtomSet(modeParamAtom);
  const setPanel = useAtomSet(panelParamAtom);
  const wide = useWide(media.lg);
  // To the form, its section open; on phones the check gives way to it.
  const goTo = (field: string) => {
    const { section, path } = fieldTarget(field);
    setMode(null);
    if (!wide) setPanel(null);
    setOpen((open) => (open.includes(section) ? open : [...open, section]));
    setGoTo(path);
  };
  return (
    <div className={s.check}>
      <AtsReportView report={report} onGoTo={goTo} />
    </div>
  );
}

/** The draft's ATS score, for the switch that shows the check. */
export function useAtsScore() {
  const draft = useAtomValue(draftAtom);
  return useMemo(() => checkAts(draft).score, [draft]);
}
