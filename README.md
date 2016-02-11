# mcr-digital-experience

## What's the plan?

We'll take the approach of putting one facilitator with 3 pairs of students, the facilitator to take their pairs through a series of activities based around building a website and using GitHub pages to host it. We should be able to cover everything with each facilitator taking a half day sift at some point over Thursday and Friday, and the schedule for each day is provisionally as follows:

* Introduction; H&S announcements, pairing up and straight on to...
* Get doing something; 4ups & start designing a website using them, with basic layout from our template as a guide. Provide some suggestions in case they hit writer's block.
* Get started - create a github account and paste our sample site into it
* Add your content and start styling with Bootstrap 
* UX Chat
* Lunch & Tour of Office
* Javascript
* Using jquery to respond to events and manipulate the document
* Sharing information across the internet, build a chat app using Firebase

For each of the sections (basic styling, more bootstrap, javascript & jquery and firebase) we'll produce a short facilitator's guide outlining what we want the students to learn and some pointers and cheatsheets.

## Who's Facilitating?

* James Roberts
* Jim Stamp
* Elly Linnegar
* Jonas Olofsson
* Thomas Inman
* Simon Taylor
* Shaun Storey
* Alec Tunbridge
* Chris Paul
* Chris Dickinson
* Stephen Murby
* Barry Edwards
* Nick Baker
* Andy Riley
* Louisa CaselyHayford
* Chris Brumfitt
* Rob Trickey
* Polly Caldwell
* Anya Braun
* Philippa Main
* Lubna Saada
* Mark Salt
* Stu Hull
* Rachael Smith
* John Evans

When | Facilitators
-----|----
 Thursday AM |  James R; Jim S; Thomas I; Shaun S; Andy Riley; Chris B; Stu H; Alec
 Thursday PM |  James R; Jim S; Stephen M; Shaun S; Andy Riley; Chris B; John Evans;
 Friday AM   |  Philippa; Foggy; Lubna, Louisa CH, Polly, Nyle, Barry; Alec; Jonas Olofsson;
 Friday PM   |  Foggy; Lubna; Mark Salt; Rachael Smith; Alec;

## Setup for running locally
To start the app, make sure you have [node.js](https://nodejs.org/en/) installed (>4.0.0), run ``npm install`` to get the dependencies and then run ``npm start`` to run the server.


The site will be running on [http://localhost:8081/](http://localhost:8081/), you can install the livereload plugin for [chrome](https://chrome.google.com/webstore/detail/livereload/jnihajbhpnppcggbcgedagnkighmdlei?hl=en) so that you can see your changes as you make them.

## Deploy your pages
To deploy your page then use npm to take your files and push the to the correct branch on github using ``npm run ghp-deploy``
