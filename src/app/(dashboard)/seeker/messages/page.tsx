import { currentUser } from "@/lib/current-user";
import { SeekerMessagesContent } from "./_components/seeker-messages-content";

export default async function SeekerMessagesPage() {
  const user = await currentUser();

  if (!user) {
    return null;
  }

  return <SeekerMessagesContent userId={user.id} />;
}
