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
