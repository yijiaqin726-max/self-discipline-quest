# Design System Specification: The Kinetic Scholar

## 1. Overview & Creative North Star
**Creative North Star: "Hyper-Focus Gamification"**

This design system moves beyond the static utility of a dashboard to create a living, breathing productivity environment. By merging the structural rigor of **Linear**, the spatial flexibility of **Notion**, and the dopamine-driven feedback loops of **Duolingo**, we create a "High-End Editorial" experience for students. 

The aesthetic is defined by **intentional asymmetry** and **tonal depth**. We reject the "boxed-in" feeling of traditional dashboards. Instead, we use expansive white space and high-contrast typography to create a sense of intellectual clarity, punctuated by vibrant bursts of `primary` yellow to signal achievement and momentum.

---

## 2. Colors & Surface Architecture

The palette is rooted in a sophisticated grayscale to minimize cognitive load, allowing the `primary` yellow to act as a functional beacon for progress.

### The "No-Line" Rule
To achieve a premium, editorial feel, **1px solid borders are strictly prohibited for sectioning.** Boundaries must be defined through background shifts.
- Use `surface` (#F6F6F6) for the global canvas.
- Use `surface-container-low` (#F0F1F1) for secondary sidebars.
- Use `surface-container-lowest` (#FFFFFF) for primary content cards to create a "lifted" effect.

### Glass & Gradient Signature
To move away from "flat" design, use Glassmorphism for floating UI (like "Level Up" modals). Apply a backdrop-blur of 12px-20px to `surface-container-lowest` at 80% opacity. 
*   **Signature Texture:** Main CTA buttons and XP Progress bars should utilize a subtle linear gradient: `primary` (#6A5B00) to `primary_fixed` (#FDDC00) at a 135-degree angle. This adds "soul" and a tactile, liquid quality to the gamification elements.

---

## 3. Typography: The Editorial Hierarchy

We use **Inter** as a variable font to maximize readability and brand authority.

*   **Display (lg/md):** Used for "Big Wins" (e.g., "Level 14 Reached"). Tight letter-spacing (-0.02em) and bold weights.
*   **Headline (sm):** For dashboard section headers. High contrast against `on_surface_variant` metadata.
*   **Title (md/sm):** For card titles and task names. Semi-bold for immediate scannability.
*   **Body (md):** The workhorse. Increased line-height (1.6) for long-form notes or task descriptions to ensure a premium, non-crowded feel.
*   **Label (sm):** All-caps with 0.05em tracking for gamification badges and XP counters.

---

## 4. Elevation & Depth: Tonal Layering

Traditional drop shadows are often messy. This system utilizes **Tonal Layering** and **Ambient Light**.

*   **The Layering Principle:** Depth is achieved by stacking. Place a `surface-container-lowest` (#FFFFFF) card on a `surface-container` (#E7E8E8) background. The 12px-16px corner radius (`md` to `lg`) provides the "softness" without needing heavy ink.
*   **Ambient Shadows:** For "Active" or "Hovered" cards, use a shadow color tinted with `primary` at 4% opacity: `box-shadow: 0 20px 40px rgba(106, 91, 0, 0.04);`.
*   **The Ghost Border:** If a boundary is needed for accessibility (e.g., input fields), use `outline_variant` at **15% opacity**. Never use a 100% opaque stroke.

---

## 5. Components

### Gamified Progress Bars (Signature)
*   **Track:** `surface-container-highest` (#DBDDDD).
*   **Indicator:** Gradient of `primary` to `primary_fixed`.
*   **Behavior:** On completion, the bar should "glow" using a soft outer shadow of the `primary` color.

### Buttons
*   **Primary:** Rounded `full`. Background: `primary_container` (#FDDC00). Text: `on_primary_container`. No border.
*   **Secondary:** Rounded `full`. Background: `surface-container-high`. Text: `on_surface`.
*   **Tertiary:** No background. Text: `on_surface_variant`. Underline only on hover.

### Scholar Cards
*   **Rule:** Forbid divider lines. Use `8px` vertical spacing between metadata and primary text.
*   **Status Indicators:** Use a 6px "Dot" of `primary` for active tasks, and `error` (#B02500) for overdue items.

### Streak Icons & Level Badges
*   Use `secondary_container` (#ECE856) for background shapes. These should be "squircled" using the `xl` (1.5rem) roundedness to feel friendly and "Duolingo-esque."

---

## 6. Do’s and Don’ts

### Do
*   **DO** use whitespace as a functional tool to separate "Focus Blocks."
*   **DO** nest `surface-container-lowest` elements inside `surface-container-low` to create organic hierarchy.
*   **DO** use high-contrast typography (Black text on Light Gray) to maintain the "Linear" level of sophistication.
*   **DO** apply `backdrop-filter: blur(10px)` to all sticky headers.

### Don’t
*   **DON'T** use 1px solid black or gray borders. It breaks the "Editorial" flow.
*   **DON'T** use standard "Material Design" blue for links; use the `primary` yellow or a bold underline.
*   **DON'T** clutter the dashboard. If a piece of information isn't vital to the "Current Streak," hide it in a `surface-variant` hover state.
*   **DON'T** use sharp 0px corners. Every element must feel approachable and "human."