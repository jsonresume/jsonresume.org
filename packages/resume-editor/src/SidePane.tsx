import { useAtom } from '@effect/atom-react';
import { SegmentedControl } from '@jsonresume/ui';
import { CheckPane, useAtsScore } from './CheckPane';
import * as s from './editor.css';
import { PreviewPane } from './PreviewPane';
import { panelParamAtom } from './state';

/** Beside the editor on wide screens: the page as it will look, or its ATS check. */
export function SidePane() {
  const [panel, setPanel] = useAtom(panelParamAtom);
  const score = useAtsScore();
  return (
    <div className={s.side}>
      <SegmentedControl
        label="Show beside the editor"
        options={[
          { value: 'preview', label: 'Preview' },
          { value: 'check', label: `ATS check · ${score}` },
        ]}
        value={panel === 'check' ? 'check' : 'preview'}
        onValueChange={(v) => setPanel(v === 'check' ? 'check' : null)}
      />
      <div className={s.sideBody}>
        {panel === 'check' ? <CheckPane /> : <PreviewPane />}
      </div>
    </div>
  );
}
