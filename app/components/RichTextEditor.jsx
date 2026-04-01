import React from "react";
import Box from "@mui/material/Box";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import Link from "@tiptap/extension-link";
import Placeholder from "@tiptap/extension-placeholder";
import Highlight from "@tiptap/extension-highlight";
import TextAlign from "@tiptap/extension-text-align";
import CharacterCount from "@tiptap/extension-character-count";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import Stack from "@mui/material/Stack";
import Divider from "@mui/material/Divider";
import Tooltip from "@mui/material/Tooltip";
import Popover from "@mui/material/Popover";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";

// Icons
import FormatBoldIcon from "@mui/icons-material/FormatBold";
import FormatItalicIcon from "@mui/icons-material/FormatItalic";
import FormatUnderlinedIcon from "@mui/icons-material/FormatUnderlined";
import LinkIcon from "@mui/icons-material/Link";
import FormatClearIcon from "@mui/icons-material/FormatClear";
import HighlightingIcon from "@mui/icons-material/BorderColor";

const MenuButton = ({ onClick, active, icon, title }) => (
  <Tooltip title={title} arrow>
    <IconButton
      onClick={onClick}
      size="small"
      sx={{
        borderRadius: "4px",
        bgcolor: active ? "rgba(0, 0, 0, 0.08)" : "transparent",
        "&:hover": { bgcolor: "rgba(0, 0, 0, 0.12)" },
        color: active ? "primary.main" : "inherit",
      }}
    >
      {icon}
    </IconButton>
  </Tooltip>
);

const CustomRichTextEditor = ({ value, onChange, maxLength }) => {
  const [isClient, setIsClient] = React.useState(false);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [linkUrl, setLinkUrl] = React.useState("");
  const [isEditingLink, setIsEditingLink] = React.useState(false);

  // Enable the rich text editor
  React.useEffect(() => {
    setIsClient(true);
  }, []);

  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit,
      Underline,
      Link.configure({
        openOnClick: false,
        autolink: true,
      }),
      Placeholder.configure({
        placeholder: "Enter announcement title...",
      }),
      Highlight,
      TextAlign.configure({
        types: ["heading", "paragraph"],
      }),
      CharacterCount.configure({
        limit: maxLength || 30,
      }),
    ],
    content: value || "",
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
  });

  React.useEffect(() => {
    if (editor && value !== undefined && value !== editor.getHTML()) {
      editor.commands.setContent(value || "");
    }
  }, [value, editor]);

  if (!isClient || !editor) {
    return (
      <Box
        sx={{
          border: "1px solid #ccc",
          borderRadius: "4px",
          minHeight: "100px",
          bgcolor: "#f9f9f9",
        }}
      />
    );
  }

  const handleOpenLinkPopover = (event) => {
    const previousUrl = editor.getAttributes("link").href;
    setLinkUrl(previousUrl || "");
    setIsEditingLink(!previousUrl);
    setAnchorEl(event.currentTarget);
  };

  const handleCloseLinkPopover = () => {
    setAnchorEl(null);
    setIsEditingLink(false);
  };

  const handleSaveLink = () => {
    if (linkUrl === "") {
      editor.chain().focus().extendMarkRange("link").unsetLink().run();
    } else {
      let url = linkUrl;
      if (!/^https?:\/\//i.test(url) && !/^mailto:/i.test(url)) {
        url = "https://" + url;
      }
      editor
        .chain()
        .focus()
        .extendMarkRange("link")
        .setLink({ href: url })
        .run();
    }
    handleCloseLinkPopover();
  };

  const handleRemoveLink = () => {
    editor.chain().focus().extendMarkRange("link").unsetLink().run();
    handleCloseLinkPopover();
  };

  const isLinkActive = editor.isActive("link");

  return (
    <Box
      sx={{ border: "1px solid #ccc", borderRadius: "4px", overflow: "hidden" }}
    >
      <Box sx={{ p: 0.5, borderBottom: "1px solid #eee", bgcolor: "#f9f9f9" }}>
        <Stack
          direction="row"
          spacing={0.5}
          sx={{ flexWrap: "wrap", gap: 0.5 }}
        >
          <MenuButton
            title="Bold"
            icon={<FormatBoldIcon fontSize="small" />}
            onClick={() => editor.chain().focus().toggleBold().run()}
            active={editor.isActive("bold")}
          />
          <MenuButton
            title="Italic"
            icon={<FormatItalicIcon fontSize="small" />}
            onClick={() => editor.chain().focus().toggleItalic().run()}
            active={editor.isActive("italic")}
          />
          <MenuButton
            title="Underline"
            icon={<FormatUnderlinedIcon fontSize="small" />}
            onClick={() => editor.chain().focus().toggleUnderline().run()}
            active={editor.isActive("underline")}
          />

          <Divider orientation="vertical" flexItem sx={{ mx: 0.5 }} />
          <MenuButton
            title="Highlight"
            icon={<HighlightingIcon fontSize="small" />}
            onClick={() => editor.chain().focus().toggleHighlight().run()}
            active={editor.isActive("highlight")}
          />
          <MenuButton
            title="Link"
            icon={<LinkIcon fontSize="small" />}
            onClick={handleOpenLinkPopover}
            active={isLinkActive}
          />
          <MenuButton
            title="Clear Formatting"
            icon={<FormatClearIcon fontSize="small" />}
            onClick={() =>
              editor.chain().focus().unsetAllMarks().clearNodes().run()
            }
            active={false}
          />
        </Stack>
      </Box>

      <Popover
        open={Boolean(anchorEl)}
        anchorEl={anchorEl}
        onClose={handleCloseLinkPopover}
        anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
      >
        <Box sx={{ p: 1, minWidth: "350px" }}>
          {!isEditingLink ? (
            <Stack
              direction="row"
              spacing={1}
              alignItems="center"
              sx={{ px: 1 }}
            >
              <Typography variant="body2" color="text.secondary">
                Visit URL:
              </Typography>
              <Typography
                variant="body2"
                component="a"
                href={linkUrl}
                target="_blank"
                sx={{
                  color: "primary.main",
                  textDecoration: "underline",
                  flexGrow: 1,
                  maxWidth: "180px",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                }}
              >
                {linkUrl}
              </Typography>
              <Button
                size="small"
                onClick={() => setIsEditingLink(true)}
                sx={{ textTransform: "none" }}
              >
                Edit
              </Button>
              <Box sx={{ width: "1px", height: "16px", bgcolor: "#ddd" }} />
              <Button
                size="small"
                color="error"
                onClick={handleRemoveLink}
                sx={{ textTransform: "none" }}
              >
                Remove
              </Button>
            </Stack>
          ) : (
            <Box sx={{ p: 1, display: "flex", gap: 1, alignItems: "center" }}>
              <Typography variant="body2" sx={{ whiteSpace: "nowrap" }}>
                Enter link:
              </Typography>
              <TextField
                autoFocus
                size="small"
                fullWidth
                placeholder="https://shopify.com"
                value={linkUrl}
                onChange={(e) => setLinkUrl(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleSaveLink();
                  if (e.key === "Escape") handleCloseLinkPopover();
                }}
                sx={{
                  "& .MuiInputBase-root": {
                    height: "32px",
                    fontSize: "12px",
                  },
                }}
              />
              <Button
                variant="contained"
                size="small"
                onClick={handleSaveLink}
                sx={{ textTransform: "none", minWidth: "60px" }}
              >
                Save
              </Button>
            </Box>
          )}
        </Box>
      </Popover>

      <Box
        sx={{
          minHeight: "100px",
          "& .ProseMirror": {
            p: 1.5,
            outline: "none",
            minHeight: "80px",
            fontSize: "14px",
          },
          "& .ProseMirror p.is-editor-empty:first-of-type::before": {
            content: "attr(data-placeholder)",
            float: "left",
            color: "#adb5bd",
            pointerEvents: "none",
            height: 0,
          },
        }}
      >
        <EditorContent editor={editor} />
      </Box>
      <Box
        sx={{
          p: 0.5,
          textAlign: "right",
          backgroundColor: "#f9f9f9",
          borderTop: "1px solid #eee",
        }}
      >
        <Typography
          variant="caption"
          color={
            (editor?.storage?.characterCount?.characters() || 0) >=
            (maxLength || 30)
              ? "error"
              : "text.secondary"
          }
        >
          {editor?.storage?.characterCount?.characters() || 0}/{maxLength || 30}
        </Typography>
      </Box>
    </Box>
  );
};

export default CustomRichTextEditor;
