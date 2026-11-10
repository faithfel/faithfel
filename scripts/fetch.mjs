// scripts/fetch.mjs
//
// READ THIS FIRST
// ---------------
// This file is only comments. You write all the code.
// We are doing ONE thing here: make GitHub send you your data.
// Nothing is drawn. Nothing is calculated. Data goes in -> text comes out.
//
// Run it with:  node --env-file=.env scripts/fetch.mjs
//
// We take it in two passes:
//   PASS 1 (do this today)  -> get your profile info from GitHub
//   PASS 2 (do it later)    -> get your contribution calendar
//
// Do not read PASS 2 until PASS 1 prints real info. One thing at a time.
// It is normal to be slow here. Every step below can be checked on its own.

// ============================================================
// WORDS YOU WILL SEE
// (skim once, come back when a word confuses you)
// ============================================================
// process.env.GITHUB_TOKEN   reads the secret you saved in .env
// await                      "wait for the answer, then keep going"
// fetch(url)                 "go ask this address for data"
// headers                    extra info you attach to the request,
//                            like showing ID at a door
// JSON                       the { key: value } format GitHub replies in
// res.ok                     true when the request worked (status 200)
// throw new Error('...')     stop everything and print this message

// ============================================================
// PASS 1 -- STEP 1: is your secret even loaded?
// ============================================================
// Write ONE line that prints the LENGTH of your token:
 console.log('token length:', process.env.GITHUB_TOKEN?.length)
 const token = process.env.GITHUB_TOKEN;
//
// Run the file.
//   Good:      token length: 40       (any number = loaded)
//   Bad:       token length: undefined (fix .env before anything else)
//
// Do not continue until a number shows up. This one line saves you
// an hour of blaming your fetch code later.

// ============================================================
// PASS 1 -- STEP 2: ask GitHub who you are
// ============================================================
// The address to ask:
//     https://api.github.com/users/faithfel
//
// fetch takes a SECOND argument: an object holding your headers.
// Shape it like this (fill in the 4 real values):
//
    await fetch(URL, {
      headers: {
        Authorization: 'Bearer ' + token,
        Accept: 'application/vnd.github+json',
        'X-GitHub-Api-Version': '2022-11-28',
        'User-Agent': 'faithfel-stats',
      },
    })
//
// Notes on those 4:
//   - Authorization is the actually-important one. There is a space
//     between Bearer and the token.
//   - User-Agent is not optional. GitHub says no without it.
//   - The two with dashes need quotes around the key. That is a JS
//     syntax rule, not a GitHub rule.
//
// Then print the status:
//     console.log('status:', res.status)
//
//   200 -> it worked, go to STEP 3
//   401 -> token is wrong or expired. Check .env.
//   403 -> GitHub is refusing you. Print await res.text() and read it.
//
// This is the step where most people get stuck forever because they
// never print the status. Print it every single time.

// ============================================================
// PASS 1 -- STEP 3: read the answer
// ============================================================
// The reply is JSON. Turn it into a JS object:
//     const data = await res.json()
//
// Then print three fields to prove it is YOUR data:
//     console.log(data.login, data.public_repos, data.followers)
//
//   Good:  faithfel 12 5
//   Bad:   undefined undefined undefined
//          -> you are printing the wrong variable, or res.json() ran
//             on a failed request.
//
// "data.login" means: take the object called data, get the thing
// named login. Dots just mean "go inside".

// ============================================================
// PASS 1 -- STEP 4: same trick, but for your repos
// ============================================================
// Repeat STEP 2 and 3 with this address:
//     https://api.github.com/users/faithfel/repos?per_page=100&type=owner
//
// Then print how many repos you got, and the first three names:
//     console.log('repos:', repos.length)
//     repos.slice(0, 3).forEach(r => console.log(r.name, r.stargazers_count))
//
//   Note: an ARRAY is a list. slice(0, 3) means "first three".
//         forEach means "do this once per item".
//
//   If repos.length is exactly 100, you hit a limit and are missing
//   some. Tell me before you build on it.
//
// ------------------------------------------------------------
// STOP HERE. Paste me the output of STEP 1-4. Then we do PASS 2.
// ------------------------------------------------------------

// ============================================================
// PASS 2 -- the contribution calendar (for streaks later)
// ============================================================
// Ignore this whole section today. It is here so you can see it is
// not scary: different address, same idea as PASS 1.
//
// Address:  https://api.github.com/graphql
// Method:   POST instead of GET, because you send a question in the body.
// Headers:  same Authorization + User-Agent as before, plus
//           'Content-Type': 'application/json'
// Body:     JSON.stringify({ query: QUERY, variables: { login: 'faithfel' } })
//
// The question itself:
//
//   query($login: String!) {
//     user(login: $login) {
//       contributionsCollection {
//         contributionCalendar {
//           totalContributions
//           weeks { contributionDays { date contributionCount } }
//         }
//       }
//     }
//   }
//
// TWO DIFFERENCES FROM PASS 1, MEMORIZE THESE:
//   1. It answers 200 even when it fails. So you MUST check:
//          if (json.errors) throw new Error(JSON.stringify(json.errors))
//      before you touch json.data. Otherwise you get "undefined"
//      everywhere and no explanation.
//   2. Your days are buried: weeks is an array of weeks, and each
//      week has an array of days. Flatten it:
//          const days = json.data.user.contributionsCollection
//                         .contributionCalendar.weeks
//                         .flatMap(w => w.contributionDays)
//
// Then print: totalContributions, days.length, days[0].date, days.at(-1).date
// Expect: a few hundred days, oldest date first, newest date = today.

// ============================================================
// WHEN YOU GET STUCK
// ============================================================
// Send me: which STEP number, the exact error text, and the output
// of the console.log you were on. Not a summary of the error.
// Do not skip ahead to PASS 2 while PASS 1 is broken.