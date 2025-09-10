import React from "react";
import { Mail } from "lucide-react";

interface EmailLinkProps {
  to: string;
  subject: string;
  body?: string;
  children: React.ReactNode;
}

const EmailLink: React.FC<EmailLinkProps> = ({ to, subject, body, children }) => {
  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();

    const outlookUrl = new URL("https://mail.dosm.gov.my/owa/");
    outlookUrl.searchParams.set("path", "/mail/action/compose");
    outlookUrl.searchParams.set("to", to);
    outlookUrl.searchParams.set("subject", subject);

    if (body) {
      outlookUrl.searchParams.set("body", body);
    }

    window.open(outlookUrl.toString(), "_blank", "noopener,noreferrer");
  };

  return (
    <a
      href="#"
      onClick={handleClick}
      className="inline-flex items-center gap-1 font-medium text-blue-700 hover:text-blue-800 underline hover:no-underline transition-colors cursor-pointer"
    >
      <Mail className="h-4 w-4 flex-shrink-0" />
      {children}
    </a>
  );
};

export default EmailLink;