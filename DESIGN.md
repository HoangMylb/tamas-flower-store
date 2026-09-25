---
name: Tamas Flower Store
description: Florist Atelier — a warm, editorial storefront that turns a real bouquet into the beginning of a personal consultation.
colors:
  paper: "#FFFFFF"
  paper-white: "#FFFFFF"
  ink: "#002B49"
  muted: "#426278"
  rose: "#FF6F59"
  soft-rose: "#E5F8FF"
  sage: "#66D9FF"
  line: "#BFEFFF"
typography:
  display:
    fontFamily: "Cormorant Garamond, Georgia, serif"
    fontSize: "clamp(54px, 6vw, 98px)"
    fontWeight: 500
    lineHeight: 0.88
    letterSpacing: "-0.055em"
  body:
    fontFamily: "Be Vietnam Pro, Arial, sans-serif"
    fontSize: "15px"
    fontWeight: 400
    lineHeight: 1.65
  label:
    fontFamily: "Be Vietnam Pro, Arial, sans-serif"
    fontSize: "10px"
    letterSpacing: "0.12em"
spacing:
  mobile-gutter: "24px"
  image-gap: "9px"
  grid-gap: "18px"
  section-desktop: "130px 7vw"
  section-mobile: "76px 24px"
components:
  button-ink:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.paper-white}"
    height: "47px"
    padding: "0 20px"
  button-rose:
    backgroundColor: "{colors.rose}"
    textColor: "#ffffff"
    height: "47px"
    padding: "0 20px"
  button-paper:
    backgroundColor: "{colors.paper-white}"
    textColor: "{colors.ink}"
    height: "47px"
    padding: "0 20px"
---

# Design System: Tamas Flower Store

## Overview

**Creative North Star: "Florist Atelier."** The site behaves like a warm paper sample book for a local florist, not an ecommerce card catalogue. Quiet editorial type, hairline rules, real bouquets and generous blank space make the work feel handmade, feminine and premium without becoming distant.

The visual hierarchy is deliberately photographic: a real bouquet anchors the page, display copy supplies the emotional story, and small specimen-like labels carry category and location. The site’s job is to guide a visitor into a conversation, so calls to Zalo, phone, and Facebook are calm but consistently available.

**Key characteristics:** cream-paper ground; ink and rose accents; Cormorant Garamond headlines; Be Vietnam Pro UI copy; flat, border-led layouts; tall crop-led photography; editorial asymmetry on desktop and a direct contact rail on mobile.

## Colors

The palette is restrained and botanical: warm neutrals carry most screens; dusty rose identifies floristry and action; sage creates the occasional full-bleed tonal chapter.

- **Paper — `#f8f4ee`:** the default page background and sticky-header surface.
- **Paper White — `#fffdfc`:** a light button and mobile menu surface.
- **Ink — `#292320`:** primary text, dark buttons, footer, and the mobile contact bar.
- **Muted Clay — `#756a64`:** secondary body copy and metadata.
- **Tamas Rose — `#a65f6b`:** location labels, price/category emphasis, and the rose CTA.
- **Soft Rose — `#e8d4d5`:** occasion section and image fallback surface.
- **Botanical Sage — `#77806b`:** full-width custom-order and map sections.
- **Hairline — `#ddd4cc`:** all neutral dividers and borders.

**The Sparse Accent Rule.** Rose belongs to small labels and decisive calls to action; it is not a general-purpose fill. Sage is reserved for broad sectional changes of mood, not cards or controls.

## Typography

**Display font:** Cormorant Garamond, with Georgia fallback. **Body/UI font:** Be Vietnam Pro, with Arial fallback. The pairing separates feeling from utility: the serif is expressive, closely tracked and compact; the sans is quiet, legible and practical for Vietnamese navigation and details.

- **Display:** 500 weight, `clamp(54px, 6vw, 98px)`, `.88` line-height, `-.055em` tracking. Used for hero and page headings; related section headings use `clamp(42px, 4.6vw, 75px)` at `.91`.
- **Editorial supporting type:** serif 25–29px at tight line-height for product names, occasion links, body ledes, and footer statement.
- **Body:** 15px / 1.65; supporting copy is normally 12–14px and muted, with constrained measure (about 30–55ch).
- **Labels:** 10–12px sans; category/location labels are uppercase with `.12–.18em` tracking. Navigation, buttons, filters and links are compact 11–12px sans.

**The Contrast-in-Scale Rule.** Do not make every heading display-sized. Let oversized serif statements appear at key narrative transitions, then let compact sans labels do the factual work.

## Layout

Desktop is a framed editorial spread rather than a centered card grid. The sticky header is 82px tall with 4.8vw horizontal padding. The home hero uses a `42% / 45% / 13%` three-column composition: editorial copy, a tall bouquet, and a vertical rose wordmark margin. Standard content sections use 7vw side gutters and 130px vertical padding; narrative panels commonly widen to 10vw gutters.

Image-led grids are intentionally varied: categories use a three-column mosaic with 18px gaps and 290px rows; featured products use a `1.3fr / .7fr / .7fr` editorial grid; catalog results are three columns. Product detail pairs a 58% gallery with a 42% sticky information column. Divider rules, rather than enclosing containers, organize page regions.

At `800px` and below, the system becomes single-column first. Gutters become 24px and sections generally become 76px high. The hero stacks copy over a 480px minimum-height image; category and product grids become two columns; catalog filters scroll horizontally; the detail info loses sticky positioning. The header contracts to 65px with a menu, and the 64px fixed three-action contact bar adds bottom body padding so content stays reachable.

## Elevation & Depth

This is a flat, tonal system: there are no box shadows or floating cards. Depth comes from full-bleed tonal sections, photographic crops, sticky positioning, overlaid type, and hairline borders. The header has a slightly translucent paper background (`rgba(248,244,238,.95)`) so it stays legible while it remains visually light over scrolling content.

## Shapes

The language is rectilinear and unrounded. Buttons, filter chips, image frames, mobile menu, contact rail and dividers use square corners; images are rectangular with `object-fit: cover`. Images may be clipped only by their bounding frame to support gentle hover zoom. Borders are 1px hairlines, never heavy outlines.

## Components

### Buttons and text links

Buttons are compact, square, inline-flex actions: minimum height 47px, 20px horizontal padding, 12px/600 sans, and a small arrow/icon gap. Ink is the default primary action, rose is the consultation/order action, and paper is used on sage. Hover lifts a button by 2px with a `.25s ease` transform/background transition. Text links are the quieter companion action: 12px/600 sans with an arrow; their hover state is an underlined baseline offset by 5px.

### Navigation

Desktop navigation is centered in the sticky header with 26px gaps and 12px labels; the wordmark is an oversized serif name with a small uppercase sans subtitle. At mobile width, navigation becomes a full-width paper dropdown beneath the header, and a rose Zalo button sits at its end. The mobile contact bar is a fixed, equal three-column ink rail for Call, Zalo and Facebook.

### Product cards and image tiles

Product cards have no enclosing surface. A `4:5` crop-led image carries the card, followed by a small rose uppercase category, a 27px serif name, and muted 11px price text. The featured lead item becomes a tall `3:4` image and spans two grid rows; on mobile it instead spans both columns at `4:5`. Category tiles are image-first, with white 29px serif labels and an arrow overlaid at the lower left; image hover is a restrained `scale(1.035)`.

### Filters and information rows

Filters are plain inline labels inside a horizontally scrollable row. They are unfilled by default; active and hover states gain a 1px ink border. Detail metadata and contact information use paired, border-separated rows with uppercase 10px labels and factual values rather than pill controls or boxed panels.

### Signature structures

The vertical hero note, rose/sage full-width editorial bands, and high-contrast ink footer are signature devices. Use them to mark a chapter or invitation to converse, not as routine decoration on every route.

### Accessibility and motion

Visible keyboard focus is a 2px rose outline offset by 4px. Semantic headings, landmarks, text links, descriptive Vietnamese image alt text, and labelled contact actions are part of the current pattern. Mobile contact targets are a 64px bar; standard buttons are at least 47px high. Smooth scrolling, button lifts, and image scaling are disabled for `prefers-reduced-motion: reduce`.

## Do's and Don'ts

### Do:

- **Do** lead new content with real, tightly cropped Tamas flower photography and useful alt text.
- **Do** use cream space, hairline rules and asymmetric image scales to make routes read like editorial pages.
- **Do** reserve oversized Cormorant Garamond for emotional statements and use Be Vietnam Pro for navigation, labels, prices and contact details.
- **Do** retain immediate contact access—especially the fixed mobile Call/Zalo/Facebook rail—when adding a browsing screen.
- **Do** respect reduced-motion preferences and preserve the existing rose focus treatment.

### Don't:

- **Don't** turn samples into a self-service commerce UI: no cart badges, inventory states, checkout panels, fabricated delivery or price certainty, or dense SKU badges.
- **Don't** introduce rounded cards, drop shadows, gradients, glass effects, or decorative chrome; the implemented system is square, flat and border-led.
- **Don't** fill every section with rose or sage. Keep paper and ink dominant, with color used for hierarchy.
- **Don't** replace the photographic, low-density editorial rhythm with uniform thumbnail grids or generic floral stock imagery.
