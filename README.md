
Follow the documentation all the way through to the end. This will make the coding experience better. If you are thinking of testing with an email, you have to make sure that you have completed the email template bit of the set up. 
Default supabase email set-up only allows two confirmed account tries. If you leave this on as default without confirming, you will not be able to test it. (You can turn this off)

Project settings authentication, sign-in/providers
See image in project. 
One of us missed this and had a blocker which was fixed later. 

READ ME:
STEP 1: Create a Next APP 
Install Packages for supabase:
	npm install @supabase/supabase-js
npm install @supabase/ssr

STEP 2: Create env.local/env.public
This is where we have to put our database Api URL and public key

STEP 3: Create a table in supabase for public profiles as described in the documentation. Copy all of the SQL queries from the documentation.
If you follow the guide correctly it will create a table for public profiles with row level security enabled AND some basic policies, it also creates a function in the database to handle new users. You can also set up storage here but this is optional.

STEP 4: Go to project settings (in supabase) and copy the project’s url from data API and copy the publishable key to your env files.

STEP 5: Follow the documentation by copying all of the javascipt codes. While doing this, make sure you follow the File Paths as shown in the documentation. 

Please Note: the middleware.js goes in folder routes and the utils folder goes in src folder. The documentation is unclear where you need to place the utils folder. 



https://supabase.com/docs/guides/getting-started/tutorials/with-nextjs?queryGroups=database-method&database-method=sql&queryGroups=language&language=js

[Build a User Management App with Next.js](https://supabase.com/docs/guides/getting-started/tutorials/with-nextjs?queryGroups=database-method&database-method=sql&queryGroups=language&language=js)

[How to implement authentication in Next.js](https://nextjs.org/docs/pages/guides/authentication)

[Custom Claims & Role-based Access Control (RBAC)](https://supabase.com/docs/guides/database/postgres/custom-claims-and-role-based-access-control-rbac)



[Using Supabase Auth with Next.js - A Complete Setup in Just 15 Minutes](https://www.zestminds.com/blog/supabase-auth-nextjs-setup-guide/)


[Setting Up Supabase in Next.js: A Comprehensive Guide](https://yagyaraj234.medium.com/setting-up-supabase-in-next-js-a-comprehensive-guide-78fc6d0d738c)


[nextjs-user-management]https://github.com/supabase/supabase/tree/master/examples/user-management/nextjs-user-management



    🎯 What requirements did you achieve?
    🎯 Were there any requirements or goals that you were unable to achieve?
    🎯 If so, what was it that you found difficult about these tasks?

Use the documentation to find out what it does, how to install it, what syntax to use
