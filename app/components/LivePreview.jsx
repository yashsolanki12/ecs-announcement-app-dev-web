import React from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";

const LivePreview = ({ formData, viewMode }) => {
  const isMobile = viewMode === "mobile";
  const isTablet = viewMode === "tablet";

  const getContainerWidth = () => {
    if (isMobile) return "375px";
    if (isTablet) return "768px";
    return "100%";
  };

  const [currentAnnouncementIndex, setCurrentAnnouncementIndex] =
    React.useState(1);
  const [isTransitioning, setIsTransitioning] = React.useState(true);

  const items =
    formData.type === "multiple" && (formData.announcements || []).length > 0
      ? formData.announcements
      : [formData];
  const extendedItems = [items[items.length - 1], ...items, items[0]];

  const handlePrev = () => {
    if (items.length <= 1 || !isTransitioning) return;
    if (currentAnnouncementIndex <= 0) return;

    setCurrentAnnouncementIndex((prev) => prev - 1);
  };

  const handleNext = () => {
    if (items.length <= 1 || !isTransitioning) return;
    if (currentAnnouncementIndex >= extendedItems.length - 1) return;

    setCurrentAnnouncementIndex((prev) => prev + 1);
  };

  React.useEffect(() => {
    if (formData.type === "multiple" && items.length > 1) {
      const interval = setInterval(() => {
        handleNext();
      }, 5000);
      return () => clearInterval(interval);
    } else {
      setCurrentAnnouncementIndex(1);
    }
  }, [formData.type, items.length]);

  // Handle Jump Back/Forward for Infinite Effect
  React.useEffect(() => {
    if (currentAnnouncementIndex === 0) {
      // Jump to last real item
      const timeout = setTimeout(() => {
        setIsTransitioning(false);
        setCurrentAnnouncementIndex(items.length);
      }, 500);
      return () => clearTimeout(timeout);
    }
    if (currentAnnouncementIndex === extendedItems.length - 1) {
      // Jump to first real item
      const timeout = setTimeout(() => {
        setIsTransitioning(false);
        setCurrentAnnouncementIndex(1);
      }, 500);
      return () => clearTimeout(timeout);
    }
  }, [currentAnnouncementIndex, items.length, extendedItems.length]);

  // Re-enable transition after jump
  React.useEffect(() => {
    if (!isTransitioning) {
      const timeout = setTimeout(() => {
        setIsTransitioning(true);
      }, 50);
      return () => clearTimeout(timeout);
    }
  }, [isTransitioning]);

  const getBackgroundStyle = () => {
    if (formData.backgroundType === "image") {
      return {
        backgroundImage: `url(${formData.backgroundImage})`,
        backgroundRepeat: "repeat",
        backgroundSize: "cover",
        backgroundPosition: "center center",
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

  const AnnouncementContent = ({ item }) => {
    const data = item || formData;
    const currentCtaType =
      data.ctaType && data.ctaType !== "none" ? data.ctaType : formData.ctaType;
    const currentCtaLink = data.ctaLink || formData.ctaLink;
    console.log("curr", formData.type);
    const content = (
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: isMobile ? 1 : 2,
          flexShrink: 0,
          px: isMobile ? 0.5 : 4,
          whiteSpace: "nowrap",
          textDecoration: "none",
          color: "inherit",
          cursor:
            currentCtaType === "clickable_bar" &&
            currentCtaLink &&
            currentCtaLink.trim() !== ""
              ? "pointer"
              : "default",
        }}
      >
        {formData.type !== "running" && (
          <Box
            sx={{
              width: isMobile ? 24 : 32,
              height: isMobile ? 24 : 32,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: data.iconColor,
              flexShrink: 0,
              "& svg": { width: "100%", height: "100%" },
            }}
          >
            {data.icon ? (
              data.icon.startsWith("<svg") ? (
                <Box
                  sx={{ width: "100%", height: "100%" }}
                  dangerouslySetInnerHTML={{ __html: data.icon }}
                />
              ) : (
                <Box
                  sx={{
                    width: "100%",
                    height: "100%",
                    backgroundColor: data.iconColor,
                    maskImage: `url(${data.icon})`,
                    maskSize: "contain",
                    maskRepeat: "no-repeat",
                    maskPosition: "center",
                    WebkitMaskImage: `url(${data.icon})`,
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
              fontSize: isMobile
                ? `${Math.min(14, Math.max(11, formData.titleSize - 4))}px`
                : `${formData.titleSize}px`,
              color: formData.titleColor,
              fontWeight: 400,
              lineHeight: 1.2,
              whiteSpace: "nowrap",
              "& p": { margin: 0, display: "inline" },
              "& strong, & b": { fontWeight: 800 },
              fontFamily: formData.fontFamily,
            }}
            dangerouslySetInnerHTML={{
              __html: data.title || "Announcement",
            }}
          />

          {formData.type !== "running" && data.subheading && (
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
              {data.subheading}
            </Typography>
          )}
        </Box>

        {formData.type !== "running" && currentCtaType === "button" && (
          <Box sx={{ ml: isMobile ? 1 : 2, flexShrink: 0 }}>
            <Button
              variant="contained"
              size={isMobile ? "extra-small" : "small"}
              href={currentCtaLink}
              target="_blank"
              sx={{
                bgcolor: formData.buttonBackgroundColor || "#55c521",
                color: formData.buttonTextColor || "#ffffff",
                textTransform: "none",
                borderRadius: "6px",
                whiteSpace: "nowrap",
                fontSize: isMobile
                  ? `${Math.max(10, (formData.buttonFontSize || 14) - 2)}px`
                  : `${formData.buttonFontSize || 14}px`,
                padding: isMobile ? "2px 8px" : "4px 12px",
                borderStyle: formData.buttonBorderStyle || "solid",
                borderWidth:
                  formData.buttonBorderStyle &&
                  formData.buttonBorderStyle !== "none"
                    ? "3px"
                    : "0px",
                borderColor: formData.buttonBorderColor || "#9dfc1f",
                "&:hover": {
                  bgcolor: formData.buttonBackgroundColor || "#55c521",
                  filter: "brightness(0.9)",
                },
              }}
            >
              {data.ctaText || formData.ctaText || "Shop now!"}
            </Button>
          </Box>
        )}
      </Box>
    );

    if (
      (currentCtaType === "clickable_bar" || formData.type === "multiple") &&
      currentCtaLink &&
      currentCtaLink.trim() !== ""
    ) {
      return (
        <Box
          component="a"
          href={currentCtaLink}
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
        // p: 2,
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
                animation: `marquee ${(formData.marqueeSpeed || 20) * 3}s linear infinite`,
                animationDirection:
                  formData.marqueeDirection === "left" ? "normal" : "reverse",
                "@keyframes marquee": {
                  "0%": { transform: "translateX(0)" },
                  "100%": { transform: "translateX(-50%)" },
                },
              }}
            >
              {[...Array(20)].map((_, i) => (
                <React.Fragment key={i}>
                  {items.map((ann, j) => (
                    <AnnouncementContent key={`${i}-${j}`} item={ann} />
                  ))}
                </React.Fragment>
              ))}
            </Box>
          ) : (
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                width: "100%",
                // px: 1,
                position: "relative",
                height: "100%",
              }}
            >
              {formData.type === "multiple" &&
                (formData.announcements || []).length > 1 && (
                  <IconButton
                    size="small"
                    onClick={handlePrev}
                    sx={{
                      color: formData.arrowIconColor || "#3c9eff",
                      zIndex: 3,
                      position: "absolute",
                      left: isMobile ? -4 : 0,
                      padding: isMobile ? "4px" : "8px",
                      "& svg": { fontSize: isMobile ? "1.2rem" : "1.5rem" },
                    }}
                  >
                    <ChevronLeftIcon />
                  </IconButton>
                )}

              <Box
                sx={{
                  flexGrow: 1,
                  display: "flex",
                  alignItems: "center",
                  overflow: "hidden",
                  width: "100%",
                  height: "100%",
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    width: "100%",
                    height: "100%",
                    transition: isTransitioning
                      ? "transform 0.5s cubic-bezier(0.4, 0, 0.2, 1)"
                      : "none",
                    transform: `translateX(-${currentAnnouncementIndex * 100}%)`,
                  }}
                >
                  {extendedItems.map((ann, idx) => (
                    <Box
                      key={idx}
                      sx={{
                        width: "100%",
                        flexShrink: 0,
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <AnnouncementContent item={ann} />
                    </Box>
                  ))}
                </Box>
              </Box>

              {formData.type === "multiple" &&
                (formData.announcements || []).length > 1 && (
                  <IconButton
                    size="small"
                    onClick={handleNext}
                    sx={{
                      color: formData.arrowIconColor || "#3c9eff",
                      zIndex: 3,
                      position: "absolute",
                      right: isMobile ? -4 : 0,
                      padding: isMobile ? "4px" : "8px",
                      "& svg": { fontSize: isMobile ? "1.2rem" : "1.5rem" },
                    }}
                  >
                    <ChevronRightIcon />
                  </IconButton>
                )}
            </Box>
          )}
        </Box>

        {/* Call to action button */}
        {formData.type === "running" && formData.ctaType === "button" && (
          <Box sx={{ px: 2, flexShrink: 0, zIndex: 2 }}>
            <Button
              variant="contained"
              size={isMobile ? "extra-small" : "small"}
              href={formData.ctaLink}
              target="_blank"
              sx={{
                bgcolor: formData.buttonBackgroundColor || "#55c521",
                color: formData.buttonTextColor || "#ffffff",
                textTransform: "none",
                borderRadius: "6px",
                whiteSpace: "nowrap",
                fontSize: isMobile
                  ? `${Math.max(10, (formData.buttonFontSize || 14) - 2)}px`
                  : `${formData.buttonFontSize || 14}px`,
                padding: isMobile ? "2px 8px" : "4px 12px",
                borderStyle: formData.buttonBorderStyle || "solid",
                borderWidth:
                  formData.buttonBorderStyle &&
                  formData.buttonBorderStyle !== "none"
                    ? "1px"
                    : "0px",
                borderColor: formData.buttonBorderColor || "#9dfc1f",
                "&:hover": {
                  bgcolor: formData.buttonBackgroundColor || "#55c521",
                  filter: "brightness(0.9)",
                },
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
