"use client";

import { useRouter } from "next/navigation";

export default function CheckConnections({ whenID, children }) {
  const { push } = useRouter();
  
  const calendarTokensString = localStorage.getItem("calendar_tokens");

  if (!calendarTokensString) {
    push(`/${whenID}/connect`);
  } else {
    const calendarTokens = JSON.parse(calendarTokensString);
    if (Object.keys(calendarTokens).length > 0) {
      return (
        <>{children}</>
      );
    } else {
      push(`/${whenID}/connect`);
    }
  }
}
