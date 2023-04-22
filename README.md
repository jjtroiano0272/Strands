> > [ ] Why export default over just export const? one extra line
> > [ ] Chromatic aberration effect stuff under the status bars (top and bottom of screen)
> > [ ] Do NOT show 'save' tab on bottom
> > [ ] Route user data correctly
> >
> > 23MAR2023
> > [ ] Pass user data when clicking through
> > [ ] Fix error messages
> >
> > 24MAR2023
> > [x] Turn select menu into a grid of selectable elements?
> > [ ] Navigate back to home when post is successful
> > [ ] Fix console.warn's
> > [?] MUI ripple on TouchableOpacity or just generally buttons
> >
> > 25MAR2023
> > BREAK DAY
> >
> > 26MAR2023
> > [ ] First page to open is /login iff !auth, else /feed
> > [ ] Resolve Possible unahdneled promise rejection
> > [ ] CGPT: What IS a promise?
> > [ ] Add function to be able to take a new pic at save tab
> >
> > 27MAR2023
> > [ ] Extension to auto-generate a handler if you have something like onPress={handleFooBar}
> > // TODO setup gets a little funky around 18:00
> > [x] Register page
> > [ ] Clean up all those little font-awesome etc. extension suggestions
> >
> > 28MAR2023
> > [x] Resolve Possible unahdneled promise rejection
> > [ ] type any fix
> > [ ] Firebase tutorial
> > [ ] Fixing tabs structure so `save` is not a tab, and just another screen you access through `add`
> >
> > 29MAR2023
> > [x] Context Provider Snippet
> > [ ] Clean up all those little font-awesome etc. extension suggestions
> >
> > 30MAR2023
> > [o] Get rid of those console.warnings
> > [x] Routing
> >
> > 31MAR2023
> > [x] Phone functionality ((there doesn't seem to be any real way to directly call and not have the extra menu button))
> > [ ] Creating post in DB
> > [o] Authorized users only (blocking app access)
> >
> > 01APR2023
> > [x] Try structuing it with (auth) the same struture
> > [ ] Follow reddit post of help for verifying types
> > [ ] SSO (Google)
> > [ ] Use a simple auth override for dev mode
> > [ ] Making sure the screen stack is arranged correctly
> >
> > 02APR2023
> > [x] Any vs. unknown
> > [ ] Finishing authorized users
> > [ ] DESIGN: background of slowly rising bubbles that tilts around the scene sublty based on device gyro (inspiration from Discord's oauth page)
> >
> > 03APR2023
> > [x] Finishing authorized users
> > [ ] Login with Google
> > [ ] Register with Google
> > [x] Login snackbar error show ups
> >
> > 04APR2023
> > [~] Register: register with SSO
> > [ ] Dismissable keyboard
> >
> > 05APR2023
> > [x] Creating records on my db
> > [o] What data exactly should a post include?
> > [ ] Feed: show people within x miles radius or most recently added (recent additions get 'added x time ago')
> > [ ] save: show in the image carousel recent images taken
> > [ ] per client: before/after images
> > [ ] Linking Storage images to DB posts s.t. that post has images included with it
> >
> > 06APR2023
> > [o] Clean up upload function
> > [x] Sending products used data correctly
> > [ ] Linking Storage images to DB posts s.t. that post has images included with it
> > [ ] Fixing virtualizedList error
> > [ ] Swiper shows array of images
> >
> > 07APR2023
> > [x] Swiper shows array of images
> > ---- [x] Changing image to image[]
> > [ ] VirtualizedList error
> >
> > 08APR2023
> > [x] 'res.cancelled' error
> > [ ] Upload multiple images
> > [ ] SigninWithRedirect? (SSO sign in)
> >
> > 09APR2023
> > [ ] Handling downloadURL
> > [ ] Upload multiple images
> >
> > 10APR2023
> > [ ] Upload multiple images
> > [ ] Take image UI update
> >
> > 11APR2023
> > [ ]
> >
> > 12APR2023
> > [ ] Excessive number callback
> >
> > 13APR2023
> > [x] add.tsx UI update
> > [x] Multi-image upload
> > [ ] Linking images to posts
> > [ ] VirtualizedList error (second Select item box renders this)
> > [ ] Add to snackbar
> >
> > 14APR2023
> > [ ] Pull in my data to app
> >
> > 15 APR2023
> >
> > 16 APR2023
> > [x] Pull in my data to app
> >
> > 17APR2023
> > [x] Display my data correctly in UI (it's heinously slow though idk why)
> > [ ] Restructure my data so it's what it needs
> > [ ] Add filter function to feed
> > [ ] Add Geolocation to posts
> > [x] Add pul down to refresh to feed
> > [ ] REFACTOR: Pack save.tsx data to send in an object instead of multiple variables
> > [x]Pull down to refresh (run API call again, but only dispatch to anything that has CHANGED)
> >
> > 19APR2023
> > [ ] Add filter function to feed
> > [ ] Concatenate all data to use into one structure
> > [ ] >> Figure out shape of incoming datas so they can be concatenated
> >
> > 20APR2023
> > [ ] in save.tsx, fixing problem with uploading image
> > [ ] Error was previously coming from Firebase's 30 days-on-init access. Needed to be set to auth. https://stackoverflow.com/questions/58869759/email-firebase-client-access-to-your-cloud-firestore-database-expiring-in-x-d#answer-68780714 > > [ ] Better way to link image to post or something? YT tutorials
> > [ ] Make sure the API Call in feed tries until it gets data (at least to a reasonable degree)
> > [ ] filter
> > [ ] Filter/sort data outside the return statement
> >
> > 21APR2023
> > [x] Sorting function
> > [ ] combine the two sorting functions
> > [ ] rbf read
> > [ ] guerilla watch
> > [ ] picture of shorts to pick up?
> > [ ] Altering jacket?  

PLANNING:
Posts should have the structure

Users should have the structure

> uid
> avatar (string: URL)
> displayName

Notes:

- app/home/\_layout.tsx holds the 'home' setup where we have the tabs on bottom and all
  - Each one of those is a Tab.Screen
- Where the app loads into is (tabs) with a sub header 'Home', with a 'Home' and 'Settings?' Tab
  - Settings? is located at app/(tabs)/\_layout.tsx
  - on commenting out that file, now the first thing that loads up is (tabs)/index
  - The true root is app/ (it's index.ts => app/\_layout.tsx)
- Remember that what the 'home' route is, is actually called 'feed'!

**_NOTES FROM MONICA_**
===PAGE 1:
[ ] User profile/data:
[ ] Name
[ ] Phone number
[ ] Email (email update from particular salon)
[ ] [Some salons have client's card on file to charge for no show]
[ ] (Salon information)
[o] is the client seasonal (boolean)

PAGE 2:
comments

PAGE 3:

- FORMULAS (e.g. seaonsal clients up north can use Redken salon)
- If they have a formula from RedKen, you can't exactly translate it into an Aveda salon s.t. if they go back and forth, they have _both_ formulas

PROFILE: [username] show before and after pictures (possibly in carousel)

SEARCH PAGE: with map with geolocation showing clients location by salon

- Search bar on the nav header
- What kind of products a client likes to use
- 'Has very frizzy hair, needs something anti-frizz and hydrating'
- Ability to submit multiple photos of a client

USE CASE:
Stylist at given salon has client enter--check if client exists in DB, else create profile for client, then that client's profile should be visible by everyone with access to the app
AUTH: only stylist with valid non-expired license number are permitted access

COMMENTS ON CLIENT EXAMPLE:

- Their gray is really resistant
- Lifts warm
- Prefers cool tones
- PReferer neutrals, warms
- Wants natural results
- Wants obvious dimension
- Wants chunky highlights

Potential fields to add for save.tsx:

- Hair length?
- Color
- Treatment done
- Star rating
  - Responds well to
  - Responds poorly to
  - Comments
