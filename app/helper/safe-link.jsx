import { Link, useLocation } from "react-router";
import React from "react";

const SafeLink = React.forwardRef(
  ({ to, exclude = [], children, ...props }, ref) => {
    const { search } = useLocation();

    // Only append search params for internal links
    let targetTo = to;
    if (
      typeof to === "string" &&
      (to.startsWith("/") || to.startsWith("app"))
    ) {
      const [path, existingSearch] = to.split("?");
      const mergedParams = new URLSearchParams(search);

      // If the 'to' path has its own params (like ?tab=1), they should override the current ones
      if (existingSearch) {
        const toParams = new URLSearchParams(existingSearch);
        toParams.forEach((value, key) => {
          mergedParams.set(key, value);
        });
      }

      // Exclude specified parameters (e.g., 'tab' on back buttons)
      if (Array.isArray(exclude)) {
        exclude.forEach((key) => mergedParams.delete(key));
      }

      const mergedSearch = mergedParams.toString();
      targetTo = mergedSearch ? `${path}?${mergedSearch}` : path;
    }

    return (
      <Link ref={ref} to={targetTo} {...props}>
        {children}
      </Link>
    );
  },
);

SafeLink.displayName = "SafeLink";

export default SafeLink;
