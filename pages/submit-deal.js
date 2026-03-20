import { useEffect } from "react";

export default function HubspotForm() {
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://js-na2.hsforms.net/forms/embed/245491482.js";
    script.defer = true;
    document.body.appendChild(script);
  }, []);

  return (
    <div
      className="hs-form-frame"
      data-region="na2"
      data-form-id="05fd2ac5-bdf4-4883-a2cd-e9bad7970034"
      data-portal-id="245491482"
    ></div>
  );
}
