import React from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { Button } from "@mui/material";

const LivePreview = ({ formData, viewMode }) => {
  const isMobile = viewMode === "mobile";
  const isTablet = viewMode === "tablet";

  const getContainerWidth = () => {
    if (isMobile) return "375px";
    if (isTablet) return "768px";
    return "100%";
  };

  const getBackgroundStyle = () => {
    if (formData.backgroundType === "image") {
      return {
        backgroundImage: `url(${formData.backgroundImage})`,
        backgroundRepeat: "repeat",
        backgroundSize: "auto",
        backgroundColor: formData.backgroundColor || "transparent",
      };
    }
    if (formData.backgroundType === "single") {
      return { backgroundColor: formData.backgroundColor };
    }
    if (formData.backgroundType === "gradient") {
      return {
        background: `linear-gradient(90deg, ${formData.gradientColors[0]}, ${formData.gradientColors[1]})`,
      };
    }
    return { backgroundColor: "#fce1d0" };
  };

  const AnnouncementContent = () => {
    const content = (
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 2,
          flexShrink: 0,
          px: 4,
          whiteSpace: "nowrap",
          textDecoration: "none",
          color: "inherit",
          cursor: formData.ctaType === "clickable_bar" ? "pointer" : "default",
        }}
      >
        {formData.type !== "running" && (
          <Box
            sx={{
              width: 32,
              height: 32,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: formData.iconColor,
              flexShrink: 0,
              "& svg": { width: "100%", height: "100%" },
            }}
          >
            {formData.icon ? (
              formData.icon.startsWith("<svg") ? (
                <Box
                  sx={{ width: "100%", height: "100%" }}
                  dangerouslySetInnerHTML={{ __html: formData.icon }}
                />
              ) : (
                <Box
                  sx={{
                    width: "100%",
                    height: "100%",
                    backgroundColor: formData.iconColor,
                    maskImage: `url(${formData.icon})`,
                    maskSize: "contain",
                    maskRepeat: "no-repeat",
                    maskPosition: "center",
                    WebkitMaskImage: `url(${formData.icon})`,
                    WebkitMaskSize: "contain",
                    WebkitMaskRepeat: "no-repeat",
                    WebkitMaskPosition: "center",
                  }}
                />
              )
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="14.31" y1="8" x2="20.05" y2="17.94"></line>
                <line x1="9.69" y1="8" x2="21.17" y2="8"></line>
                <line x1="7.38" y1="12" x2="13.12" y2="2.06"></line>
                <line x1="9.69" y1="16" x2="3.95" y2="6.06"></line>
                <line x1="14.31" y1="16" x2="2.83" y2="16"></line>
                <line x1="16.62" y1="12" x2="10.88" y2="21.94"></line>
              </svg>
            )}
          </Box>
        )}

        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-start",
            flexShrink: 0,
          }}
        >
          <Box
            sx={{
              fontSize: `${formData.titleSize}px`,
              color: formData.titleColor,
              fontWeight: 700,
              lineHeight: 1.2,
              whiteSpace: "nowrap",
              "& p": { margin: 0, display: "inline" },
              fontFamily: formData.fontFamily,
            }}
            dangerouslySetInnerHTML={{
              __html: formData.title || "Announcement",
            }}
          />
          {formData.type !== "running" && formData.subheading && (
            <Typography
              sx={{
                fontSize: `${formData.subheadingSize}px`,
                color: formData.subheadingColor,
                fontWeight: 500,
                mt: 0.1,
                whiteSpace: "nowrap",
                fontFamily: formData.fontFamily,
              }}
            >
              {formData.subheading}
            </Typography>
          )}
        </Box>
      </Box>
    );

    if (formData.type === "running") {
      // For running type, only clickable_bar makes entire bar clickable
      if (formData.ctaType === "clickable_bar" && formData.ctaLink) {
        return (
          <Box
            component="a"
            href={formData.ctaLink}
            target="_blank"
            sx={{
              textDecoration: "none",
              color: "inherit",
              display: "flex",
              flexShrink: 0,
            }}
          >
            {content}
          </Box>
        );
      }
    } else {
      // For other types, show clickable_bar
      if (formData.ctaType === "clickable_bar" && formData.ctaLink) {
        return (
          <Box
            component="a"
            href={formData.ctaLink}
            target="_blank"
            sx={{
              textDecoration: "none",
              color: "inherit",
              display: "flex",
              flexShrink: 0,
            }}
          >
            {content}
          </Box>
        );
      }
    }
    return content;
  };

  return (
    <Box
      sx={{
        width: "100%",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        bgcolor: "#f4f6f8",
        p: 2,
        borderRadius: "8px",
        overflow: "hidden",
      }}
    >
      <Box
        sx={{
          width: getContainerWidth(),
          minHeight: "50px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
          transition: "width 0.4s ease-in-out",
          position: "relative",
          overflow: "hidden",
          py: 1,
          ...getBackgroundStyle(),
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            overflow: "hidden",
            flexGrow: 1,
          }}
        >
          {formData.type === "running" ? (
            <Box
              sx={{
                display: "flex",
                width: "max-content",
                animation: `marquee ${formData.marqueeSpeed || 20}s linear infinite`,
                animationDirection:
                  formData.marqueeDirection === "left" ? "normal" : "reverse",
                "@keyframes marquee": {
                  "0%": { transform: "translateX(0)" },
                  "100%": { transform: "translateX(-50%)" },
                },
              }}
            >
              {[...Array(10)].map((_, i) => (
                <AnnouncementContent key={i} />
              ))}
            </Box>
          ) : (
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                width: "100%",
                p: 1,
              }}
            >
              <AnnouncementContent />
            </Box>
          )}
        </Box>

        {formData.type === "running" && formData.ctaType === "button" && (
          <Box sx={{ px: 2, flexShrink: 0, zIndex: 2 }}>
            <Button
              variant="contained"
              size="small"
              href={formData.ctaLink}
              target="_blank"
              sx={{
                bgcolor: "#202223",
                color: "white",
                textTransform: "none",
                borderRadius: "6px",
                whiteSpace: "nowrap",
                "&:hover": { bgcolor: "#111" },
              }}
            >
              {formData.ctaText || "Shop now"}
            </Button>
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default LivePreview;
