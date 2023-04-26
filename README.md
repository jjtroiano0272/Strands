### STRANDS: The Yelp for HairstylistPLANNING:
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
