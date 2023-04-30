### STRANDS: The Yelp for Hairstylists

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
> >
> > 22APR2023
> >
> > 23APR023
> > [x] Correctly removing a filter from list
> > [ ] CLEAR FUCKING BROWSER
> >
> > 24APR2023
> > < > rbf reading
> > < > update pump
> > [ ] CLEAR FUCKING BROWSER
> > [ ] js chalk, quokka
> > [x] Elapsed time
> >
> > 25APR2023
> > [x] Gravatar profile image as fallback default?
> > [ ] placeholder avatar color generators
> > [o] Organize DB Data & test having posts from different users (for checking types of avatars)
> > [ ] Search tab default show a list of users or at least most recent searches
> > < > Jacket alter
> > [ ] Hooking into some API to check products used/auto-complete
> > [ ] PROPOSED DATA STRUCTURE CHANGE:
> > [ ] Geolocation
> > [x] Add some 'secondary' field or something to colors
> >
> > 26APR2023
> > [ ] Code organize
> > [ ] Able to reset password through Firebase
> >
> > 27APR2023
> > [ ] ! https://www.youtube.com/watch?v=Xp0q8ZDOeyE&t=70s Follow this
> > ! https://firebase.google.com/codelabs/firestore-ios#0
> > ! https://firebase.google.com/docs/firestore/query-data/get-data?hl=en#get_all_documents_in_a_collection [setting data listener]
> > < > Vyvanse discount
> > [ ] Seeding data
> > [ ] https://www.npmjs.com/package/react-native-google-places-autocomplete > > [ ] For fixing problems with accessing avatar API: https://stackoverflow.com/questions/75363471/my-requests-are-working-in-insomnia-but-not-in-my-react-app-what-does-the-way > > [ ] Better writing of Post.tsx (the data it gets passed)
> > [ ] change Post prop auth to user
> > [x] Linking through to post
> > [ ] Data displayed as most recent by default
> >
> > 28APR2023
> > [x] Linking through to post
> > [ ] How to login without then pressing the login button after ding Face ID or ID autocomplete
> > [ ] Modal icon button at top right replaced by user's profileImage/autogen avatar
> > <x> Call Brent
> > <o> Call David at Hyundai
> > <x> Call legalshield for help on paying NCH bill?
> >
> > 29APR2023
> > [ ] Styles to its own offloaded file
> > [ ] Seed DB data
> > [ ] Swiper on feed

PLANNING:
Posts should have the structure

Users should have the structure

auth: {
----uid,
----avatar (string: URL),
----displayName
},
profile: {

},
clientName: string,
comments: string,
createdAt: Date
isSeasonal: boolean,
productsUsed: [
----{ label: string,
------value: string,
----}
]

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
- Has very frizzy hair, needs something anti-frizz and hydrating
- Ability to submit multiple photos of a client

USE CASE:
Stylist at given salon has client enter--check if client exists in DB, else create profile for client, then that client's profile should be visible by everyone with access to the app
AUTH: only stylist with valid non-expired license number are permitted access

COMMENTS ON CLIENT EXAMPLE:

- Their gray is really resistant
- Lifts warm
- Prefers cool tones
- Preferer neutrals, warms
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

NEW INFO FROM MONICA (28APR2023):
I cannot physically lost every single high end
formula they would just have to have a text box
dedicated to typing in whatever brand they use.
Then there should just be a text box where you can
put the formula and a text box for what type of
developer you use
And a text box for how long the processing time
Make it generic
Also a slide for cutting
And a slide for styling
Like for cutting if they have long layers and face
framing
Or a shot bob and bangs
Or a pixie cut
Or a gentlemen uses a clipper size 2 guard
Then the styling part would be suggestions on
products and how they like it styled example they
have frizzy hair and wants it styled slick so they
should use frizz free priducts
Or have fine limo hair and want volume use
volumizing products
Like that
