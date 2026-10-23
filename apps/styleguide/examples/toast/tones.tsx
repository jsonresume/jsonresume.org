'use client';

import { Button, toast } from '@jsonresume/ui';

// Mount <Toaster /> once in your root layout, then call toast() anywhere.
export default function ToastTones() {
  return (
    <>
      <Button
        variant="primary"
        onClick={() => toast({ title: 'Resume saved', tone: 'success' })}
      >
        Save
      </Button>
      <Button
        onClick={() =>
          toast({
            title: 'Job hidden',
            description: 'Senior Engineer at Stripe',
            action: {
              label: 'Undo',
              altText: 'Undo hiding the job',
              onClick: () => toast({ title: 'Job restored' }),
            },
          })
        }
      >
        Hide job
      </Button>
      <Button
        variant="danger"
        onClick={() =>
          toast({
            title: 'Upload failed',
            description: 'resume.pdf is larger than 5 MB.',
            tone: 'danger',
          })
        }
      >
        Fail upload
      </Button>
    </>
  );
}
