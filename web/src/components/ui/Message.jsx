import { CheckCircle, XCircle, AlertTriangle, Info } from "lucide-react";

export default function Message({
  type = "info",
  title,
  message,
}) {
  const styles = {
    success: {
      box: "bg-green-50 border-green-300 text-green-800",
      icon: <CheckCircle className="w-5 h-5 text-green-600" />,
    },
    error: {
      box: "bg-red-50 border-red-300 text-red-800",
      icon: <XCircle className="w-5 h-5 text-red-600" />,
    },
    warning: {
      box: "bg-yellow-50 border-yellow-300 text-yellow-800",
      icon: <AlertTriangle className="w-5 h-5 text-yellow-600" />,
    },
    info: {
      box: "bg-blue-50 border-blue-300 text-blue-800",
      icon: <Info className="w-5 h-5 text-blue-600" />,
    },
  };

  const current = styles[type] || styles.info;

  return (
    <div
      className={`flex items-start gap-3 border rounded-xl px-4 py-3 shadow-sm ${current.box}`}
    >
      {current.icon}

      <div>
        {title && (
          <h4 className="font-semibold text-sm mb-0.5">
            {title}
          </h4>
        )}
        <p className="text-sm leading-relaxed">
          {message}
        </p>
      </div>
    </div>
  );
}
