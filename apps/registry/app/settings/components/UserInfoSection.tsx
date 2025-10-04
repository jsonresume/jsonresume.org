interface UserInfoSectionProps {
  email: string;
  username?: string;
  userId: string;
  lastSignIn: string;
}

export const UserInfoSection = ({
  email,
  username,
  userId,
  lastSignIn,
}: UserInfoSectionProps) => {
  return (
    <div className="space-y-4">
      <div>
        <h2 className="font-semibold">Email</h2>
        <p>{email}</p>
      </div>
      {username && (
        <div>
          <h2 className="font-semibold">GitHub Username</h2>
          <p>{username}</p>
        </div>
      )}
      <div>
        <h2 className="font-semibold">User ID</h2>
        <p>{userId}</p>
      </div>
      <div>
        <h2 className="font-semibold">Last Sign In</h2>
        <p>{new Date(lastSignIn).toLocaleString()}</p>
      </div>
    </div>
  );
};
