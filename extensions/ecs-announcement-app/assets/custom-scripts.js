/**
 * Custom Theme Scripts
 * Loaded via App Embed - Update-proof and theme-independent
 */

(function () {
  "use strict";

  // Configuration
  const CONFIG = {
    debug: false,
    selectors: {
      gallery: ".custom-gallery",
      cart: ".cart",
      productForm: ".product-form",
    },
  };

  // Utility: Debug logging
  function log(...args) {
    if (CONFIG.debug) {
      console.log("[Custom Scripts]", ...args);
    }
  }

  // Feature: Enhanced Product Gallery
  function initCustomGallery() {
    const galleries = document.querySelectorAll(CONFIG.selectors.gallery);

    galleries.forEach((gallery) => {
      // Your gallery enhancement code here
      log("Gallery initialized:", gallery);

      // Example: Add zoom on hover
      const images = gallery.querySelectorAll("img");
      images.forEach((img) => {
        img.addEventListener("mouseenter", function () {
          this.style.transform = "scale(1.05)";
        });
        img.addEventListener("mouseleave", function () {
          this.style.transform = "scale(1)";
        });
      });
    });
  }

  // Feature: Cart Enhancements
  function enhanceCart() {
    const cart = document.querySelector(CONFIG.selectors.cart);
    if (!cart) return;

    log("Cart enhanced");

    // Example: Add free shipping progress bar
    const cartTotal = getCartTotal();
    const freeShippingThreshold = 100;
    const remaining = Math.max(0, freeShippingThreshold - cartTotal);

    if (remaining > 0) {
      showFreeShippingMessage(remaining);
    }
  }

  // Utility: Get cart total (example)
  function getCartTotal() {
    // Implementation depends on your theme
    // This is a simplified example
    return 0;
  }

  // Utility: Show free shipping message
  function showFreeShippingMessage(remaining) {
    log(`$${remaining} until free shipping`);
    // Implementation here
  }

  // Feature: Product Form Enhancements
  function enhanceProductForm() {
    const forms = document.querySelectorAll(CONFIG.selectors.productForm);

    forms.forEach((form) => {
      // Add loading state on submit
      form.addEventListener("submit", function (e) {
        const submitBtn = this.querySelector('[type="submit"]');
        if (submitBtn) {
          submitBtn.classList.add("loading");
          submitBtn.disabled = true;
        }
      });

      log("Product form enhanced:", form);
    });
  }

  // Feature: Analytics Tracking
  function initAnalytics() {
    // Example: Track custom events
    document.addEventListener("click", function (e) {
      if (e.target.matches(".btn-custom")) {
        log("Custom button clicked:", e.target.textContent);

        // Send to analytics
        if (window.gtag) {
          gtag("event", "custom_button_click", {
            button_text: e.target.textContent,
          });
        }
      }
    });
  }

  // Initialize all features
  function init() {
    log("Initializing custom scripts...");

    initCustomGallery();
    enhanceCart();
    enhanceProductForm();
    initAnalytics();

    log("Custom scripts loaded successfully");
  }

  // Run on DOM ready
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }

  // Expose utilities to global scope if needed
  window.customThemeUtils = {
    log: log,
    config: CONFIG,
  };
})();
