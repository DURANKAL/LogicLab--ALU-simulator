# US-001: LogicLab Interactive ALU Simulator

ID: US-001

Motion: rich

<!-- Motion: none | subtle | rich. Leave the line out to default to subtle.
     3D is NOT set here. It is set with THREE_D in frontend-config.md.
     The story's heading text after the first ":" becomes FEATURE_NAME, so keep it short. -->

## Story

As a digital electronics student, I want a premium, interactive 4-bit ALU simulation website with an immersive scrolling homepage and a functional circuit simulator, so that I can understand, experiment with, and visualize arithmetic and logical operations through an engaging experience.

## Acceptance Criteria

### Layout and visual design

1. The homepage displays the exact product name "LogicLab", a prominent heading introducing the 4-bit ALU, a short supporting description, an animated circuit visualization, and a "Launch Simulator" button.

2. The website has exactly two primary routes: "/" for the scrolling homepage and "/simulator" for the interactive ALU simulator. Navigation includes the exact labels "Home", "Simulator", and "About". The "About" navigation item scrolls to the About section on the homepage rather than opening a separate page.

3. The homepage contains the following sections in this order: Hero, Understanding the ALU, Operations in Action, Inside the Circuit, Experience the Simulation, About the Project, and Footer.

4. The design uses an original, premium engineering-laboratory aesthetic with a deep charcoal background, restrained electric-cyan accents, optional muted-violet highlights, precise typography, and clearly distinguishable interactive elements. The layout and visual identity are created specifically for LogicLab rather than adapted from a prebuilt website template.

5. The homepage uses a visually coherent scrolling narrative with purposeful section transitions, animated circuit illustrations, and appropriate spacing. The simulator uses a dedicated engineering workspace that prioritizes functionality, readability, and precise input/output visualization.

6. The website uses custom-designed interface components, circuit diagrams, binary switches, operation selectors, and output indicators. Individual development libraries are permitted, but prebuilt website templates, copied complete layouts, and ready-made simulator interfaces are prohibited.

### Core behaviour

7. Clicking "Launch Simulator" from the homepage navigates to "/simulator". Clicking "Simulator" in the navigation produces the same result. Clicking "Home" returns to "/". Navigation works without requiring an account.

8. The simulator displays the exact labels "Input A", "Input B", "Operation", and "Output". Input A and Input B each contain four individually controllable binary switches representing a 4-bit unsigned number.

9. The simulator supports the operations "AND", "OR", "XOR", and "ADD". Selecting an operation immediately calculates and displays the correct result using the current input values.

10. The simulator accepts binary input through individual switches and provides a decimal input option. Both input methods remain synchronized and represent values from 0 through 15.

11. The simulator displays the result as a four-bit binary value and its corresponding decimal value. For ADD, the simulator also displays the carry-out bit so that results exceeding four bits are represented correctly.

12. The simulator includes a circuit visualization corresponding to the selected operation. Changing an input or operation updates the relevant input values, output values, and visual signal states without reloading the page.

13. The simulator provides an accessible "Reset" button that restores both inputs to "0000", selects "AND", and updates the output accordingly.

14. The simulator provides an expandable "Truth Table" panel that displays the relevant truth table for the selected logical operation. For ADD, it displays the applicable full-adder truth table or an equivalent explanation of the four-bit addition.

15. The simulator includes an "Execution Trace" panel that explains the selected operation using the current inputs and shows the calculation or bitwise evaluation steps. The explanation and result must correspond to the actual simulation.

16. The homepage's interactive operation preview supports "AND", "OR", "XOR", and "ADD". Changing its inputs or selected operation updates its displayed result using the same simulation logic as the main simulator.

17. The "Inside the Circuit" section explains the roles of logic gates, full adders, and operation-selection circuitry. Selecting an available component reveals its name, inputs, outputs, and purpose.

### Validation and messages

18. Binary inputs accept only valid four-bit values, and decimal inputs accept only integers from 0 through 15. Invalid values produce the exact message "Enter a valid 4-bit binary number or a decimal integer from 0 to 15." The simulator prevents invalid values from silently producing incorrect results.

19. The simulator handles arithmetic carry-out correctly. For example, when Input A is "1111", Input B is "0001", and Operation is "ADD", the displayed four-bit result is "0000" and the carry-out is "1".

20. The simulator displays the correct outputs for the following reference cases:

    * Input A: "0101", Input B: "0011", Operation: "AND", Output: "0001".
    * Input A: "0101", Input B: "0011", Operation: "OR", Output: "0111".
    * Input A: "0101", Input B: "0011", Operation: "XOR", Output: "0110".
    * Input A: "0101", Input B: "0011", Operation: "ADD", Output: "1000", Carry-out: "0".

21. The simulator does not present a decorative circuit animation as evidence of computation. All displayed results, execution steps, and signal states correspond to the actual operation being evaluated.

### Screen states

22. On the homepage, each required section displays meaningful content without requiring the visitor to launch the simulator. The page remains usable when animations are disabled.

23. The simulator initially displays Input A as "0000", Input B as "0000", and Operation as "AND". The corresponding output is "0000".

24. The circuit visualization, output panel, and execution trace remain consistent when the user changes inputs, switches operations, or resets the simulator.

25. Moving between homepage sections and simulator states is visually smooth. Loading the simulator, switching operations, and resetting inputs do not produce blank panels, stale results, or inconsistent visual states.

### Motion

26. The hero introduces the ALU visualization using coordinated opacity, position, and circuit-signal animations. Motion enhances the composition without obscuring the heading or primary action.

27. Scroll-triggered animations introduce homepage sections and reveal circuit components progressively. Animations do not prevent normal scrolling, delay access to essential content, or leave sections hidden when animation initialization fails.

28. Circuit signal animations reflect the actual computed input and output states. Logic-zero and logic-one signals remain distinguishable through both visual styling and textual or numeric indicators.

29. Simulator interactions respond immediately to user input. Animation never delays the underlying calculation or prevents switches, operation selectors, navigation, and panels from remaining usable.

30. Motion uses a consistent set of durations and easing curves. Prefer transform and opacity animations, avoid unnecessary continuous motion, and prevent layout shifts.

31. With "prefers-reduced-motion: reduce", non-essential motion is removed or reduced while all simulation functions, navigation, and visual feedback remain available.

### Accessibility and responsiveness

32. Every interactive element is keyboard accessible and has an appropriate accessible name, visible focus indicator, and logical tab order.

33. The website uses semantic HTML, accessible form labels, sufficient colour contrast, and appropriate status announcements for input validation, operation changes, output updates, and simulation errors.

34. Binary switches expose their current values and states to assistive technologies. The active operation is communicated through text or selection state rather than colour alone.

35. The homepage and simulator remain usable at viewport sizes of 375x667, 768x1024, and 1280x720. There is no unintended horizontal scrolling, clipped content, overlapping controls, or inaccessible navigation.

36. The simulator adapts its layout to smaller screens. Input controls, circuit visualization, output information, and execution trace remain accessible without requiring the desktop layout to fit on a mobile screen.

37. Essential information is never available only through hover effects. Interactive circuit components can be inspected using keyboard and pointer input.

### Robustness and checks

38. If an unexpected runtime error occurs, the application displays an appropriate fallback message rather than a blank screen. Recoverable simulation errors do not prevent the user from navigating to another page.

39. The simulation engine is separated from the presentation layer. Binary calculations, operation selection, carry-out calculation, and result formatting are implemented as testable logic rather than being embedded exclusively in animation handlers.

40. Unit tests verify all supported operations, binary input validation, decimal conversion, four-bit result formatting, carry-out behaviour, reset behaviour, and the reference cases specified in these acceptance criteria.

41. The build, lint, type-check, unit-test, and Visual QA checks that exist in the configured project are run. Every reported result comes from an actual execution, and checks that could not run are explicitly marked unverified.

42. Visual QA captures genuine screenshots of the homepage and simulator at the configured viewport sizes. Reports identify actual layout, accessibility, console, interaction, and functional defects. Baseline comparisons are performed only when valid baseline screenshots exist.

## Preconditions / Test data

* The app starts with Input A set to "0000", Input B set to "0000", and Operation set to "AND".

* The homepage and simulator are accessible without sign-in.

* No backend API or database is required.

* All simulation calculations run in the browser.

* Sample test cases:

  * Input A: "0101", Input B: "0011", Operation: "AND", Expected Output: "0001".
  * Input A: "0101", Input B: "0011", Operation: "OR", Expected Output: "0111".
  * Input A: "0101", Input B: "0011", Operation: "XOR", Expected Output: "0110".
  * Input A: "0101", Input B: "0011", Operation: "ADD", Expected Output: "1000".
  * Input A: "1111", Input B: "0001", Operation: "ADD", Expected Output: "0000", Carry-out: "1".

* Test: every supported operation, all-zero and all-one inputs, minimum and maximum unsigned inputs, carry-out, invalid binary values, invalid decimal values, input synchronization, reset, navigation, truth-table expansion, execution-trace consistency, circuit inspection, keyboard-only use, reduced motion on and off, and all configured viewport sizes.

## Out of scope

* Sign-up, sign-in, user accounts, and authentication.
* Backend APIs, databases, and server-side simulation.
* Saving circuits or user settings across page reloads.
* User-created circuit editing, arbitrary gate placement, and drag-and-drop circuit construction.
* Unimplemented ALU operations presented as functional.
* Full CPU emulation, instruction execution, and operating-system simulation.
* A complete general-purpose digital logic simulator.
* Additional primary routes beyond the homepage and simulator.
* Sound effects.
* 3D scenes, WebGL, and physics unless THREE_D is yes in frontend-config.md.
* Paid assets, paid APIs, and third-party animation services.
* Copying or adapting a complete prebuilt website template.
* Decorative simulations that do not reflect the actual circuit calculations.

## Notes

* Frontend only, using the configured stack. Keep simulation state in client memory.
* Use the existing frontend workflow agents, configuration, and QA procedures wherever applicable.
* Inspect the repository before changing files. Preserve existing workflow infrastructure and avoid unrelated modifications.
* Create the original design brief at "design/design-brief.md" before implementing the main interface.
* Create or update "design/taste-notes.md" and "design/resources.md" according to the configured workflow. Resources may be used for individual assets or libraries, not as complete website templates.
* Treat the external design reference as inspiration only. Do not reproduce an existing website's complete composition.
* Prefer SVG for accurate, interactive two-dimensional circuit diagrams. Use Three.js only when it provides meaningful value and is enabled by the project configuration.
* Use one shared simulation engine for the homepage preview and the full simulator.
* Keep the four-bit arithmetic behaviour explicit: addition produces a four-bit result plus a separate carry-out bit.
* Distinguish carry-out from signed overflow. Do not label them as interchangeable.
* Keep the circuit visualization synchronized with actual input values, selected operations, and calculated results.
* Trim and validate user input before processing. Reject invalid values rather than silently converting them into different numbers.
* Use the exact visible text specified in the acceptance criteria wherever exact text is required.
* Motion: use consistent durations and easing curves. Prefer transform and opacity. Avoid flashing, excessive bouncing, and distracting continuous animation.
* Visual hierarchy: keep the homepage's primary action prominent and the simulator's controls and outputs easy to locate.
* Avoid unnecessary nested cards, generic dashboard styling, and excessive decorative effects.
* Add no dependency unless it is clearly needed.
* Keep accessibility functional when animation is disabled.
* Report passed, failed, blocked, and unverified checks separately. Include genuine screenshots and tool output where supported.
* Do not build anything listed under Out of scope.
* Do not claim a test passed unless it was actually executed and its result verified.
