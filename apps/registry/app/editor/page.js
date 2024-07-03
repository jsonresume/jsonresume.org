import Editor from '../components/Editor';
import { auth } from '../../auth';

export default async function Page() {
  const session = await auth();
  console.log({ session });

  return <Editor />;
}
