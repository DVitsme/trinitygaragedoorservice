# Client email draft, 2026-07-28

Copy the text below the line into Gmail. Nothing here has been sent.

Two notes before you do:

1. I left out the Resend signup link styling and kept the URL inline, and I checked every link in
   the email returns 200. The one link I deliberately did **not** include is the booking thank you
   page, because it is committed but **not deployed yet**, so it currently 404s. Ask #35 is worded
   so Jason knows it is coming without giving him a dead address to paste. Deploy it and I can put
   the real URL in.
2. The voice skill's strongest recommendation is that you write the opinion lines and the personal
   aside yourself. The two places most worth overwriting in your own words are the licence
   paragraph and the last line.

---

Subject: What I need from you before the site goes live

Simone,

The new site is built and you can look at it right now, https://trinity-garage-door.derrick-2fd.workers.dev. Almost everything left is stuff only you or Jason can answer, so here is the whole list in one place instead of me dripping it out over the next month. Most of it takes a one word answer.

Six things genuinely hold up launch.

1. Which phone number leads everywhere? Housecall Pro has (813) 279-6785 as the company number and that is what the site uses now. I just want a yes before it goes out to the world.

2. What are the real office hours? I have four different answers. Google says Monday to Saturday, 7am to 9pm. Your front door says Monday to Friday, 8am to 5:30pm. Housecall Pro's booking system says Monday to Friday, 8am to 4pm with weekends closed, and that last one is what actually decides when a customer can book online.

3. Is the 24/7 promise real? The site says it in about thirty different places, and the code separately tells Google you are open 24 hours a day. All fine if the phone genuinely rings through at 2am on a Sunday. If it really means you try hard, I would rather soften the wording now than have somebody screenshot a voicemail at 2am and post it. This is a strategy question, not a mistake, which is why I have not touched a word of it.

4. The licences. The site says you are licensed in Florida under GD13010 and GDI-09484, on 25 pages. Those look to me like county licences, Hillsborough and Pasco, rather than a state one, and the Pasco number looks like it expires on 30 September 2026. I could easily be wrong on both readings, which is exactly why I am asking rather than guessing. It is the only thing on this whole list with real legal exposure.

5. Somewhere for leads to land. The contact form saves the message, but nobody gets an email, because there is no email account wired up yet. Sign up free at https://resend.com and verify the domain, or give me DNS access and I will do it.

6. A public email address. Housecall Pro has trinitygaragedoorservice@gmail.com on file. It works, though an address at your own domain would look a lot better on a quote.

Access I need from you.

Domain and DNS, so I can point trinitygaragedoorservice.com at the new site. Your Google Business Profile, which is honestly the biggest free lever you have, given you are sitting on 597 reviews at a 5.0 average. And a Google account so I can put Google Analytics on. That last one matters more than it sounds, because there is no analytics on the site at all today, so nobody can tell you whether any of this is working. Worth knowing that turning it on means I update the privacy policy the same day, since the policy currently promises exactly that.

Things only Jason can do, all inside Housecall Pro.

7. Make a separate API key just for the website, named something like "website". Then either key can be switched off without breaking the other. Only an admin can do it, so it has to be him.

8. Is the Drive Social key set to full access or read only? It is under My Apps, then API Key Management, and the setting sits next to the key. Related, are they still an active vendor? If not, that key should be deleted, because access does not expire on its own.

9. You have two service areas saved, one with 130 zip codes and one with 268. The 130 one has your technicians assigned to it so I have assumed that is the live one. Which is right?

10. There is a setting under Online Booking called booking redirect. I have already built the confirmation page it needs to point at. Once we move the domain across I will send Jason the exact address to paste in. Without it, neither of us can ever tell how many jobs the website actually produced, and right now that number is 1 out of your last 300.

11. Do you want website enquiries pushed into Housecall Pro, so they land in the Job Inbox next to your Angi and Yelp leads? It costs nothing extra, it is included in the plan you already pay for. If yes, Jason needs to be on hand for about five minutes, because we have to create one obviously fake test lead and he has to be the one to delete it. Housecall Pro has no test mode and no delete button on our side.

Quick answers, one word each.

Is 12,000 doors serviced still about right? Which brands do you install rather than only repair, because we currently list Clopay, C.H.I., Hormann, Amarr and LiftMaster as install. Are you veteran owned, since it is on your Angi profile but nowhere on your own site. Which of your two Facebook pages is the real one. Did Jason start the work in 2007 and incorporate in 2011, or did the business genuinely begin later. What mailing address do you want on the privacy policy, and can you get a lawyer to glance over it, because what is there now is a solid template rather than advice.

One more. Your Housecall Pro account says the trip charge is zero on both service areas. Can I say "no trip charge" on the front page? It is a real differentiator and you currently say it nowhere.

Photos and reviews.

The one that unlocks the most is more of your Google reviews, ideally with the town the customer is in. You have 597, I have 8, and I have used all but two of them. I cannot invent testimonials, so until I have real reviews from St Petersburg, Clearwater, Lakeland and the rest, I cannot build pages for those towns, and those towns are where the growth is. Easiest fix is Google Business Profile access and I will pull them myself.

Also useful, the original video files for the three minute promo and the thirteen second door clip, because the copies online are poor quality and one is in a format browsers refuse to play. Two or three job photos from each of Lutz, Land O Lakes, Wesley Chapel, Palm Harbor, Oldsmar and Tampa, since I have hundreds of job photos but no idea which town any of them are in. The 47 photos on your Yelp page, which Yelp blocks me from downloading. And any commercial work at all, because I could not find a single photo of it.

About your old blog.

Three of the pictures were made by AI, and the files still carry a hidden tag that says so, which Google and Facebook can both read. One of them is the first picture people see. That came over from your old web company, it is not something we did. Can I swap them for your real job photos? Two other images are paid stock, and the real question there is who bought them, because a Shutterstock licence belongs to the buyer and does not transfer with the picture.

While we are in there, one old post quotes repairs at 65 to 600 dollars. I would cut the prices and keep the post. Do you have the real publish dates for the posts, and do you want the old promo discounts page pointing at Contact or the promos brought back?

Last thing, and this one is yours to fix rather than mine.

Your listings disagree with each other. Yelp says you started in 2010, BBB says 2011, Angi implies 2010, and the site says 2007. Google has your hours as 7am to 9pm. There are two Yelp pages splitting your reviews between them and two Facebook pages doing the same. Every one of those mismatches makes Google trust your details less, and Google is where most of your customers find you.

If you can get me the six launch blockers this week, I can have the domain pointed and the site live shortly after. The rest can follow.

Derrick
