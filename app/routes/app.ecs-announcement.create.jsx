import Box from "@mui/material/Box";
import AnnouncementForm from "../pages/announcement/announcement-form";

const AnnouncementCreatePage = () => {
  return (
    <Box sx={{ p: { xs: 2, sm: 3, md: 4 } }}>
      <AnnouncementForm heading="Create Announcement" />
    </Box>
  );
};

export default AnnouncementCreatePage;
