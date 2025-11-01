import { currentUser } from "@/lib/current-user";
import { FinderMessagesContent } from "./_components/finder-messages-content";

export default async function FinderMessagesPage() {
  const user = await currentUser();

  if (!user) {
    return null;
  }

  return <FinderMessagesContent userId={user.id} />;
}
