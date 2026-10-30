import { useAtomSet, useAtomValue } from '@effect/atom-react';
import {
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Checkbox,
  Input,
  Stack,
  Text,
} from '@jsonresume/ui';
import {
  deletePlanAtom,
  keys,
  plansAtom,
  setPlanStepAtom,
} from '@repo/api-client';
import { AsyncResult } from 'effect/reactivity';
import { useState } from 'react';
import * as s from './career.css';

/**
 * Your plan: where you're headed, its steps to tick off (they sit on the
 * tree, above the skills they build), and a box to plan somewhere else.
 */
export function PlanPanel({
  onPlan,
  planning,
}: {
  onPlan: (destination: string) => void;
  planning: boolean;
}) {
  const result = useAtomValue(plansAtom);
  const setStep = useAtomSet(setPlanStepAtom);
  const remove = useAtomSet(deletePlanAtom);
  const [where, setWhere] = useState('');
  const plan = AsyncResult.isSuccess(result) ? result.value[0] : undefined;
  const reactivityKeys = keys.career;

  return (
    <Card>
      <CardHeader>
        <CardTitle level={2}>
          {plan ? `Your plan: ${plan.destination}` : 'Plan a path'}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Stack gap={3} align="stretch">
          {plan ? (
            <>
              <Text size="sm" tone="muted">
                {plan.summary}
              </Text>
              <ul className={s.steps} aria-label="Steps">
                {plan.steps.map((step) => (
                  <li key={step.id}>
                    <Checkbox
                      checked={step.done}
                      onCheckedChange={(done) =>
                        setStep({
                          params: { planId: plan.id, stepId: step.id },
                          payload: { done: done === true },
                          reactivityKeys,
                        })
                      }
                      label={step.title}
                    />
                    <Text size="sm" tone="muted">
                      {step.detail}
                    </Text>
                  </li>
                ))}
              </ul>
            </>
          ) : (
            <Text size="sm" tone="muted">
              Pick a destination at the top of the tree, or say where you want
              to be. The steps are written from your resume and today’s jobs,
              and appear on the tree.
            </Text>
          )}
          <form
            className={s.planForm}
            onSubmit={(e) => {
              e.preventDefault();
              if (where.trim()) onPlan(where.trim());
            }}
          >
            <Input
              aria-label="Where do you want to be?"
              placeholder="Where do you want to be? e.g. Head of AI platform"
              value={where}
              onChange={(e) => setWhere(e.target.value)}
            />
            <Button
              type="submit"
              variant="secondary"
              disabled={planning || !where.trim()}
            >
              {planning ? 'Planning…' : plan ? 'Plan this instead' : 'Plan it'}
            </Button>
          </form>
          {plan ? (
            <Button
              size="sm"
              variant="ghost"
              onClick={() =>
                window.confirm('Delete this plan?') &&
                remove({ params: { planId: plan.id }, reactivityKeys })
              }
            >
              Delete this plan
            </Button>
          ) : null}
        </Stack>
      </CardContent>
    </Card>
  );
}
