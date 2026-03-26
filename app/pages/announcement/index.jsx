import React from "react";
import { getAllAnnouncement } from "../../api/announcement";
import useAnnouncementData from "../../hooks/useAnnouncementData";
import Loader from "../../ui/loader";

const AnnouncementListPage = ({ appEmbedEnabled }) => {
  const { data: announcementListData, isLoading: announcementListLoading } =
    useAnnouncementData(["announcement"], getAllAnnouncement, null);

  console.log("Data:", announcementListData);
  console.log("App embed", appEmbedEnabled);

  if (announcementListLoading) {
    return <Loader />;
  }
  return <div>AnnouncementListPage</div>;
};

export default AnnouncementListPage;
