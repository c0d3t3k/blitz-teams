# blitz-teams


This is a [Blitz.js](https://github.com/blitz-js/blitz) example integrating [Microsoft Teams](https://www.microsoft.com/en-us/microsoft-teams/group-chat-software) using [Azure AD](https://azure.microsoft.com/en-us/services/active-directory/) [Single Sign On](https://docs.microsoft.com/en-us/azure/active-directory/hybrid/how-to-connect-sso).

This exercise attempts to illustrate how to leverage the [fantastic, monolithic, full-stack](https://blitzjs.com/docs/why-blitz) nature of [Blitz.js](https://blitzjs.com/) to accomodate [Azure's Single Signon](https://docs.microsoft.com/en-us/azure/active-directory/hybrid/how-to-connect-sso) with [Blitz.js](https://blitzjs.com/) patented [no-api](https://blitzjs.com/docs/why-blitz#2-data-layer)!

For more, check out our [Building Microsoft Teams Tab with Blitz.js](http://c0d3t3k.github.io/blog/blitz-teams-tabs) blog article.

![blitz-teams screenshot](https://i.ibb.co/cJQr2yH/TabCover.png)

## What is [Blitz.js](https://blitzjs.com/)?

The video below will provide some context ...

[![What is Blitz](https://img.youtube.com/vi/UHyx8MtCVVk/0.jpg)](https://www.youtube.com/watch?v=UHyx8MtCVVk "What is Blitz?")


## What is [Microsoft Teams](https://www.microsoft.com/en-us/microsoft-teams/group-chat-software)?


[![What is Teams](https://img.youtube.com/vi/jugBQqE_2sM/0.jpg)](https://www.youtube.com/watch?v=jugBQqE_2sM "What is Teams?")


## Is there an [Enterprise Development](https://en.wikipedia.org/wiki/Enterprise_software) [Use Case](https://en.wikipedia.org/wiki/Use_case) for this type of solution?

[![Enterprise Use Case](https://sec.ch9.ms/ch9/4b4b/5b1f3c56-c46c-4d16-8cff-962f868d4b4b/LearnTogetherBurkeDan_Custom.jpg)](https://channel9.msdn.com/Events/Microsoft-Learn/Learn-Together-Developing-Apps-for-Teams/Key-Benefits-of-Integrating-Web-Applications-into-Microsoft-Teams "Enterprise Use Case?")

## To get started with this Example:

```
git clone https://github.com/c0d3t3k/blitz-teams
cd blitz-teams
yarn 
blitz dev
```
NOTE: To integrate with your [MSFT Teams app](https://admin.teams.microsoft.com/policies/manage-apps) properly, Be sure to copy ```.env.local.SAMPLE``` to ```.env.local``` and modify the [Azure](https://azure.microsoft.com/en-us/features/azure-portal/) and [Teams](https://www.microsoft.com/en-us/microsoft-teams/group-chat-software) enviroment variables accordingly! See our [Building Microsoft Teams Tab with Blitz.js](http://c0d3t3k.github.io/blog/blitz-teams-tabs) blog article(s) for more info.

## To get started with Microsoft Teams

If you don't have access to [Microsoft Teams](https://www.microsoft.com/en-us/microsoft-teams/group-chat-software), get a [Free Developer Account Here](https://developer.microsoft.com/en-us/microsoft-365/dev-program)!


## Deltas / Code of Interest

For this example, the following are deltas/changes from the standard [Blitz.js generated app](https://blitzjs.com/docs/file-structure)

```
blitz-teams
├─── env.local.SAMPLE
├─── env.local
└─── app/
      ├── api/
      │   └── auth
      │        └── getGraphAccessToken.ts
      └── teams/
            ├── pages/
            │    ├── authEnd.tsx
            │    ├── authStart.tsx
            │    ├── privacy.tsx
            │    ├── tab.tsx
            │    ├── tabConfig.tsx
            │    ├── termsOfUse.tsx
            │    └── signup.ts
            └──── wrappedPages/
                  ├── authEnd.tsx
                  ├── authStart.tsx
                  └── tab.tsx

```

## Other Helpful MSFT Teams Links

* [MSFT Teams Setup](https://www.youtube.com/watch?v=VDDPoYOQYfM)
* [MSFT Teams Apps Deep Dive](https://channel9.msdn.com/Events/Microsoft-Learn/Learn-Together-Developing-Apps-for-Teams/Key-Benefits-of-Integrating-Web-Applications-into-Microsoft-Teams/?WT.mc_id=m365-11737-cxa)
* [MSFT Teams Learn Together Videos](https://channel9.msdn.com/Events/Microsoft-Learn/Learn-Together-Developing-Apps-for-Teams/?WT.mc_id=m365-11737-cxa)
* [Creating Teams Apps](https://robertschouten.com/2020/01/14/creating-a-microsoft-teams-app-how-easy-is-it/)
* [First Teams App](https://purple.telstra.com/blog/create-your-first-microsoft-teams-app)
