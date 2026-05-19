import React from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import Divider from "@mui/material/Divider";

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
    formData.announcement_type === "multiple" &&
    (formData.announcements || []).length > 0
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

  // Helper function to detect uploaded file types safely
  const isSvgFile = (url) => {
    if (!url) return false;
    // Check for base64 SVG string data or standard URL patterns
    return (
      url.startsWith("data:image/svg+xml") ||
      url.toLowerCase().split(/[?#]/)[0].endsWith(".svg")
    );
  };

  React.useEffect(() => {
    if (formData.announcement_type === "multiple" && items.length > 1) {
      const interval = setInterval(() => {
        handleNext();
      }, 5000);
      return () => clearInterval(interval);
    } else {
      setCurrentAnnouncementIndex(1);
    }
  }, [formData.announcement_type, items.length]);

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
    if (formData.background_type === "image") {
      return {
        backgroundImage: `url(${formData.background_image})`,
        backgroundRepeat: "repeat",
        backgroundSize: "cover",
        backgroundPosition: "center center",
        backgroundColor: formData.background_color || "transparent",
      };
    }
    if (formData.background_type === "single") {
      return { backgroundColor: formData.background_color };
    }
    if (formData.background_type === "gradient") {
      return {
        background: `linear-gradient(90deg, ${formData.gradient_colors?.[0] || "#ff7e5f"}, ${formData.gradient_colors?.[1] || "#feb47b"})`,
      };
    }
    return { backgroundColor: "#fce1d0" };
  };

  const AnnouncementContent = ({ item }) => {
    const data = item || formData;
    const current_cta_type =
      typeof data.cta_type !== "undefined" ? data.cta_type : formData.cta_type;
    const current_cta_link =
      typeof data.cta_link !== "undefined" ? data.cta_link : formData.cta_link;
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
            current_cta_type === "clickable_bar" &&
            current_cta_link &&
            current_cta_link.trim() !== ""
              ? "pointer"
              : "default",
        }}
      >
        {formData.announcement_type !== "running" && (
          <Box
            sx={{
              width: isMobile ? 24 : 32,
              height: isMobile ? 24 : 32,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: data.icon_color,
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
              ) : isSvgFile(data.icon) ? (
                <Box
                  sx={{
                    width: "100%",
                    height: "100%",
                    backgroundColor: data.icon_color,
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
              ) : (
                <Box
                  component="img"
                  src={data.icon}
                  alt="Uploaded Icon"
                  sx={{
                    maxWidth: "100%",
                    maxHeight: "100%",
                    objectFit: "contain",
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
                ? `${Math.min(14, Math.max(11, formData.title_size - 4))}px`
                : `${formData.title_size}px`,
              color: formData.title_color,
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

          {data.subheading && (
            <Typography
              sx={{
                fontSize: `${formData.subheading_size}px`,
                color: formData.subheading_color,
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

        {formData.announcement_type !== "running" &&
          current_cta_type === "button" && (
            <Box sx={{ ml: isMobile ? 1 : 2, flexShrink: 0 }}>
              <Button
                variant="contained"
                size={isMobile ? "extra-small" : "small"}
                // href={current_cta_link}
                target="_blank"
                sx={{
                  bgcolor: formData.button_background_color || "#55c521",
                  color: formData.button_text_color || "#ffa8B6",
                  textTransform: "none",
                  borderRadius: "6px",
                  whiteSpace: "nowrap",
                  fontSize: isMobile
                    ? `${Math.max(10, (formData.button_font_size || 14) - 2)}px`
                    : `${formData.button_font_size || 14}px`,
                  padding: isMobile ? "2px 8px" : "4px 12px",
                  borderStyle: formData.button_border_style || "solid",
                  borderWidth:
                    formData.button_border_style &&
                    formData.button_border_style !== "none"
                      ? "3px"
                      : "0px",
                  borderColor: formData.button_border_color || "#9dfc1f",
                  "&:hover": {
                    bgcolor: formData.button_background_color || "#55c521",
                    filter: "brightness(0.9)",
                  },
                  flexShrink: 0,
                }}
              >
                {data.cta_text || formData.cta_text || "Shop now!"}
              </Button>
            </Box>
          )}
      </Box>
    );

    if (
      current_cta_type === "clickable_bar" &&
      current_cta_link &&
      current_cta_link.trim() !== ""
    ) {
      return (
        <Box
          component="a"
          // href={current_cta_link}
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
    <>
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
            {formData.announcement_type === "running" ? (
              <Box
                sx={{
                  display: "flex",
                  width: "max-content",
                  animation: `marquee ${(formData.marquee_speed || 20) * 3}s linear infinite`,
                  animationDirection:
                    formData.marquee_direction === "left"
                      ? "normal"
                      : "reverse",
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
                {formData.announcement_type === "multiple" &&
                  (formData.announcements || []).length > 1 && (
                    <IconButton
                      size="small"
                      onClick={handlePrev}
                      sx={{
                        color: formData.arrow_icon_color || "#3c9eff",
                        zIndex: 3,
                        position: "absolute",
                        left: isMobile ? -4 : 0,
                        padding: isMobile ? "4px" : "8px",
                        "& svg": { fontSize: isMobile ? "1.2rem" : "1.5rem" },
                        flexShrink: 0,
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

                {formData.announcement_type === "multiple" &&
                  (formData.announcements || []).length > 1 && (
                    <IconButton
                      size="small"
                      onClick={handleNext}
                      sx={{
                        color: formData.arrow_icon_color || "#3c9eff",
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
          {formData.announcement_type === "running" &&
            formData.cta_type === "button" && (
              <Box sx={{ px: 2, flexShrink: 0, zIndex: 2 }}>
                <Button
                  variant="contained"
                  size={isMobile ? "extra-small" : "small"}
                  // href={formData.cta_link}
                  target="_blank"
                  sx={{
                    bgcolor: formData.button_background_color || "#55c521",
                    color: formData.button_text_color || "#ffffff",
                    textTransform: "none",
                    borderRadius: "6px",
                    whiteSpace: "nowrap",
                    fontSize: isMobile
                      ? `${Math.max(10, (formData.button_font_size || 14) - 2)}px`
                      : `${formData.button_font_size || 14}px`,
                    padding: isMobile ? "2px 8px" : "4px 12px",
                    borderStyle: formData.button_border_style || "solid",
                    borderWidth:
                      formData.button_border_style &&
                      formData.button_border_style !== "none"
                        ? "2.5px"
                        : "0px",
                    borderColor: formData.button_border_color || "#9dfc1f",
                    "&:hover": {
                      bgcolor: formData.button_background_color || "#55c521",
                      filter: "brightness(0.9)",
                    },
                  }}
                >
                  {formData.cta_text || "Shop now"}
                </Button>
              </Box>
            )}
        </Box>
      </Box>
      <Box sx={{ mt: 1 }}>
        <Divider sx={{ mb: 1.5 }} />
        <Typography
          variant="caption"
          sx={{
            color: "#6b7280",
            fontSize: "11px",
            display: "block",
            textAlign: "center",
          }}
        >
          This is a live preview. The actual appearance may vary slightly based
          on your theme.
        </Typography>
      </Box>
    </>
  );
};

export default LivePreview;
