readme tracking

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
> > [ ] Follow reddit post of help for verifying types
> > [ ] SSO (Google)
> > [x] Try structuing it with (auth) the same struture
> > [ ] Use a simple auth override for dev mode
> > [ ] Making sure the screen stack is arranged correctly
> >
> > 02APR2023
> > [ ] Finishing authorized users

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
