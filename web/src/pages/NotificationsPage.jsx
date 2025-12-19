import notificationsData from "../deta/notificationsData";
import NotificationCard from "../components/NotificationCard";

export default function NotificationsPage() {
  const user = "Sujoy"; // later from auth

  return (
    <div className="p-6 max-w-3xl">
      <h1 className="text-2xl font-bold mb-6">Notifications</h1>

      <div className="space-y-4">
        {notificationsData.map((item) => (
          <NotificationCard
            key={item.id}
            message={item.message.replace("{user}", user)}
            time={item.time}
            externalLink={item.ExternalLink}
          />
        ))}
      </div>
    </div>
  );
}
