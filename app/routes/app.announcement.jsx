import React from "react";

const AnnouncementListPage = React.lazy(
  () => import("../pages/announcement/index"),
);

export default function AnnouncementPage() {
  return (
    <React.Suspense fallback="">
      <AnnouncementListPage />
    </React.Suspense>
  );
}
