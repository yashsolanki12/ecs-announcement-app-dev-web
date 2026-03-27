import Box from "@mui/material/Box";
import AnnouncementForm from "../pages/announcement/announcement-form";
import { useParams } from "react-router";

const AnnouncementUpdatePage = () => {
  const { id } = useParams();
  return (
    <Box sx={{ p: { xs: 2, sm: 3, md: 4 } }}>
      <AnnouncementForm id={id} heading="Update Announcement" />
    </Box>
  );
};

export default AnnouncementUpdatePage;
