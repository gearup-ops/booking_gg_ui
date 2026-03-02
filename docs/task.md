## Tasks

**Note below and do tasks**

-   [ ] Tasks to do
-   [x] Tasks done

### Tasks

-   [x] Modify the getContactDetails api to add the city_id in the query.
        **File Reference** `lib\api\contentApi.ts` `lib\slices\contentSlice.ts` `app\contact\page.tsx`

-   [x] Modify the response format getting from the getHomePageData api, to get the data in the same format as the getAboutUsData api. Take the below reference
        {
        "code": 200,
        "type": "success",
        "message": "Contact Details fetched successfully",
        "data": {
        "contactAddresses": [],
        "socials": {},
        "cities": []
        }
        }

Remember contact_addresses could be multiple, so handle showing that.
**File Reference** `lib\api\contentApi.ts` `lib\slices\contentSlice.ts` `app\contact\page.tsx`

-   [x] Modfiy system to use getContactDetails api to get cities data, and use it in respective place. Don't call the getCities api from now. Below is the api responce.
        {
        "code": 200,
        "type": "success",
        "message": "Contact Details fetched successfully",
        "data": {
        "contactAddresses": [],
        "socials": {},
        "cities": []
        }
        }
        **File Reference** `lib\api\contentApi.ts` `lib\slices\contentSlice.ts` `app\contact\page.tsx` `components\layout-shell.tsx` `app\page.tsx`

-   [x] Redirect to respective city whatsapp contact on click of whatsapp button in footer and floating action button.
        **File Reference** `components\layout-shell.tsx` `components\footer.tsx`
