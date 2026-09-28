import type { ReactNode } from "react";

export function BrowserFrame({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="device-frame device-frame--browser">
      <div className="device-chrome">
        <span className="device-dots" aria-hidden="true">
          <i />
          <i />
          <i />
        </span>
        <span className="device-url">
          {label}
          <span className="device-url-cursor" aria-hidden="true" />
        </span>
      </div>
      <div className="device-screen">{children}</div>
    </div>
  );
}


export function PhoneFrame({ children }: { children: ReactNode }) {
  return (
    <div className="device-frame device-frame--phone">
      <span className="device-phone-notch" aria-hidden="true" />
      <div className="device-screen">{children}</div>
    </div>
  );
}