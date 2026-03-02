**Note below and do tasks**

-   [ ] Tasks to do
-   [x] Tasks done

### Tasks

-   [x] Fix the services scroll on mobile, make it scrools smooth, inplace, and scroll to show in full frame, auto scrool when click to last service to left.
        **File Reference** `components\services-section.tsx`

-   [x] On mobile view show the testimonial text below the image, and make it scrollable.
        **File Reference** `components\testimonials-section.tsx`

-   [x] OTP enter autofill, and on entering each digit move to next input field, and on backspace move to previous input field.
        **File Reference** `app\login\page.tsx`

-   [x] Fix auto move to next input the input cursor, when i paste the otp it should move to next input field, and when i press backspace it should move to previous input field.
        **File Reference** `app\login\page.tsx`

-   [x] Implement the api call, redux flow and call the api in respective field. To get cities data. API endpoint '/api/master/cities'.
        **File Reference** `lib\actions\cityActions.ts`, `lib\store\slices\citySlice.ts`, `lib\store\index.ts`, `app\page.tsx`, `app\account\page.tsx`

-   [x] Fix the component to show the checkbox and cycle number and the service dropdown by default. Also make sure to add button to remove the added cycle and service.
        **File Reference** `app\book\page.tsx`

-   [x] If the cycle is unchecked made the cycle kind of disabled, and if the cycle is checked make it enabled.
        **File Reference** `app\book\page.tsx`

-   [x] If cycle new cycle is added and its removed before submitting order make sure to remove that in sending the final action dispatch.
        **File Reference** `app\book\page.tsx`

-   [x] Use cities data from the redux state instead of hardcoded cities.
        **File Reference** `app\book\page.tsx`, `lib\slices\citySlice.ts`

-   [x] Removing the service list item appear from bottom motion animation for mobile device.
        **File Reference** `components\services-section.tsx`

-   [x] Add a scroll to top button floating in bottom right corner, visible when user scrolls down more than 100px, and hide when user scrolls up. Make that button looks good with the current theme.
        **File Reference** `app\page.tsx`

-   [x] The service name scrolling horizontally, in the services page, should automatically sroll tocenter the selected service and same if I selected any other service it must show that to center with scroll effect.
        **File Reference** `app\services\page.tsx`

-   [x] Fix the scrolling component so it should only target the respective component and must not scroll the whole page to that part, in the useeffect on line 99.
        **File Reference** `components\services-section.tsx`

-   [x] Make it to navigate respective service from the footer, use query parameters for it. Only do for listed services in the footer. Match by name from query and select and show the matched service in services page. And also scroll to that service.
        **File Reference** `components\footer.tsx` `app\services\page.tsx`

-   [x] In the order booking flow, for each step make it scroll to top and show the main content instead of showing the pane which was already scrolled.
        **File Reference** `app\book\page.tsx`

-   [x] Stop scrolling to top in the services page, when the gear toggle changed.
        **File Reference** `app\services\page.tsx`

-   [x] City change option should be there, so on click of city in the header show the city selection popup again. So highlight city selection in the header in such a way that it should be visible to the user, that it can change the city.
        **File Reference** `components\header.tsx`, `app\page.tsx`

-   [x] Show cities 2x2 grid in the city selection popup.
        **File Reference** `app\page.tsx`

-   [x] Change the onCityClick sending as prop, and make it to use it from the redux state.
        **File Reference** `app\page.tsx`, `components\header.tsx`

-   [x] If city is selected then show a cut button in the city selection popup.
        **File Reference** `app\page.tsx`

-   [x] Make it to show the city selection popup on any page and not only instead of home page.
        **File Reference** `components\city-popup.tsx`, `app\layout.tsx`, `app\page.tsx`

-   [x] In mobile version for header, if its open and I click to the other place than the header, then close the header openend.
        **File Reference** `components\header.tsx`

-   [x] Add Loading state to otp send and verify buttons.
        **File Reference** `app\login\page.tsx`

-   [x] Handle correctly the city selection popup opening and close, setting the city, fetching the city from local storage, fix where flaws. Fix if found any bad flow and edge cases.
        **File Reference** `components\city-popup.tsx`, `app\layout.tsx`, `app\page.tsx`

-   [x] match the header section bg like the herosection one in the top, or place the header section in the top of the page and set its bg to transparent. Or share the header universally to all pages, except login and signup ones.
        **File Reference** `components\header.tsx`, `app\layout.tsx`, `app\page.tsx` `components\hero-section.tsx

-   [x] Now fix the header which is overrriding on the content on other pages, also make it show the header content properly in mobile view like previously if the menu toggled and set to show the menu it should show the menu and if the menu is closed it should not show the menu, properly and not overriding the conent of the page. Considering all pages.
        **File Reference** `components\header.tsx`, `app\layout.tsx`, `app\page.tsx`

-   [x] Fix showing new selected city immediately in the header, and also in the city selection popup, when a city is selected it should show the new city immediately in the header, and also in the city selection popup, and also when a city is selected it should close the city selection popup.
        **File Reference** `components\city-popup.tsx`, `components\header.tsx`

-   [x] Also fix the calling services api on every city change on any page, it should only call when the city is changed and not on every page load.
        **File Reference** `app\services\page.tsx`

-   [x] Also call the getHomePage data api, if not has any data on the page about.
        **File Reference** `app\page.tsx`

-   [x] change the favicon to use the gearup logo, website title to Gear Grow Cycles.
