import { Bot, ExternalLink as LinkIcon } from "lucide-react";
import { Link } from "react-router-dom";

export default function NotificationCard({ message, time, externalLink }) {
  const content = (
    <div className="flex font2 gap-3 p-4 bg-white rounded-xl shadow-sm hover:bg-gray-50 transition cursor-pointer">
      <div className="flex items-center justify-center w-10 h-10 rounded-full bg-blue-100 shrink-0">
        <Bot className="text-blue-600 w-5 h-5" />
      </div>

      <div className="flex-1">
        <p className="text-sm text-gray-800 leading-relaxed">
          {message}
        </p>

        <div className="flex items-center gap-2 mt-1">
          <span className="text-xs text-gray-500">{time}</span>

          {externalLink && (
            <span className="flex items-center gap-1 text-xs text-blue-600">
              <LinkIcon className="w-3 h-3" />
              View post
            </span>
          )}
        </div>
      </div>
    </div>
  );

  // If link exists → wrap with Link
  return externalLink ? (
    <Link to={externalLink} className="block">
      {content}
    </Link>
  ) : (
    content
  );
}
