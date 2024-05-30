'use client';

export default function CreateResume({ createGist }) {
  return (
    <div>
      <div>
        <br />
        <br />
        <br />
        Resume not found
        <br />
        <br />
        <button
          onClick={async () => {
            await createGist();
          }}
        >
          Create some shit
        </button>
      </div>
    </div>
  );
}
