import React from "react";
import { getAllAnnouncement } from "../../api/announcement";
import { getCurrentShopSession } from "../../api/current-shop-session";
import useAnnouncementData from "../../hooks/useAnnouncementData";
import Loader from "../../ui/loader";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Warning from "@mui/icons-material/Warning";
import Button from "@mui/material/Button";

const AnnouncementListPage = ({ appEmbedEnabled, session }) => {
  const { data: announcementListData, isLoading: announcementListLoading } =
    useAnnouncementData(["announcement"], getAllAnnouncement, null);

  const {
    data: announcementSessionData,
    isLoading: announcementSessionLoading,
  } = useAnnouncementData(
    ["announcement-session"],
    getCurrentShopSession,
    null,
  );
  console.log("Data:", announcementSessionData);
  console.log("App embed", appEmbedEnabled);

  const navigateAppEmbed = () => {
    const currentShop =
      session?.shop ||
      announcementSessionData?.session?.shop ||
      new URLSearchParams(window.location.search).get("shop") ||
      window.location.hostname;
    const url = `https://${currentShop}/admin/themes/current/editor?context=apps`;
    window.open(url, "_blank");
  };

  if (announcementListLoading) {
    return <Loader />;
  }
  return (
     <Box sx={{ p: { xs: 2, sm: 3, md: 4 } }}>
      {!appEmbedEnabled && (
        <Card sx={{ borderRadius: "10px", boxShadow: 2 }}>
          <CardContent sx={{ p: { xs: 2, sm: 2 } }}>
            {/* Header/Warning Bar */}
            <Box
              sx={{
                backgroundColor: "#ffb800",
                borderRadius: "5px",
                p: { xs: 1.5, sm: 2 },
                display: "flex",
                alignItems: "center",
                gap: 1.5,
                mb: 2,
              }}
            >
              <Warning sx={{ fontSize: { xs: 20, sm: 24 }, flexShrink: 0 }} />
              <Typography
                variant="h6"
                component="span"
                sx={{
                  color: "#232220",
                  fontSize: { xs: "0.95rem", sm: "1.1rem" },
                  fontWeight: 700,
                  lineHeight: 1.2,
                }}
              >
                Announcement is not activated yet.
              </Typography>
            </Box>

            {/* Instruction Text */}
            <Typography 
              variant="body2" 
              sx={{ 
                color: "#6d7175", 
                fontSize: { xs: "0.85rem", sm: "1rem" },
                mb: 2 
              }}
            >
              Please activate the app by clicking{" "}
              <Box component="span" sx={{ fontWeight: 700, color: "black" }}>
                'Activate'
              </Box>{" "}
              button.
            </Typography>

            {/* Action Button */}
            <Button
              variant="contained"
              fullWidth={{ xs: true, sm: false }} // Auto-stretches on mobile
              sx={{
                backgroundColor: "#202223",
                color: "white",
                textTransform: "none",
                borderRadius: "6px",
                fontWeight: 600,
                px: 3,
                py: { xs: 1.5, sm: 1 },
                "&:hover": {
                  backgroundColor: "#303030",
                },
              }}
              onClick={navigateAppEmbed}
            >
              Activate
            </Button>
          </CardContent>
        </Card>
      )}
    </Box>
  );
};

export default AnnouncementListPage;
