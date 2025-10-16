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

How we set up the Admin page

first I read through the documentation on RLS(row level security) and its policies
after reading the documentation I looked for some video examples on what others had done to set up an admin using RLS policies.

following what they did I went into my sql editor to create a new alter table profiles add column is_admin Boolean default false; this allows me to make a new column in the profiles table that will be default false for all users which will allow me to designate which specific user I want as the admin.

I then created policy Users cannot set themselves as admin this policy is to protect the admin role further into development and ensures users cannot designate themselves as admin

I then created a policy to ensure that the table could be read using CREATE POLICY "Allow public read"
ON profiles
FOR SELECT
USING (true);

and the final policy I created was to allow the user to edit their profiles but to also give access to the admin to be able to edit profiles of themselves and other user's

finally I updated the profiles table to set a user as and admin.

```
SQL code Examples
alter table profiles
enable row level security;

alter table profiles
add column is_admin boolean default false;

create policy "Users cannot set themselves as admin" on profiles
for update
with check (
(select auth.uid()) = id
or is_admin = false
);

CREATE POLICY "Allow public read"
ON profiles
FOR SELECT
USING (true);
```

create policy "Users and admins can update profiles." on profiles
for update using ((select auth.uid()) = id or exists (
select 1
from profiles p
where p.id = auth.uid() and p.is_admin = true
));

update profiles set is_admin = true where id = 'Example UUID';

select id, username, is_admin from profiles;

after this was done I moved onto the VsCode we had set up for the project
and created a new admin route in the app folder.

I followed the documentation for the user management app with next.js which we used as the base for this project.
as I wanted to conditionally render a page when specifically an admin logs in I knew I had to use an if statement.

first I looked for a video of some one doing a similar role base access system once I had a few of these guides I then followed one as close as I could while trying to ensure the code worked for my the project
the primary video I followed was https://www.youtube.com/watch?v=hZz4UhvxxUE as it used session in order to get the information from the supabase we had set up.

first was to "use client" and to import { useEffect, useState } from "react"; from react and then to import { createClient } from "@/utils/supabase/client";

I then added a const to access the supabase table the we created using

```
 const supabase = createClient(
process.env.NEXT_PUBLIC_SUPABASE_URL,
process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY
);
```

then I moved on to creating a function component for the admin page I then created the consts to ensure the profile table would be a use state

```
const [profile, setProfile] = useState({});
const [loading, setLoading] = useState(true);
```

then I moved on to useEffect to set up an async function to fetchProfile in the session to ensure that the data in the table is accessible

```
 useEffect(() => {
async function fetchProfile() {
const {
data: { session },
} = await supabase.auth.getSession();

      console.log("Fetched session:", session);
```

after this I const userId = session.user.id; to access the user and id from the session object and then I queried the profiles table selecting the is_admin to ensure that I have retrieved the appropriate profile info including the is_admin. ready for checks later in the code

```
const userId = session.user.id;

const { data, error } = await supabase
.from("profiles")
.select("id, username, is_admin")
.eq("id", userId)
.single();
```

then I added an if statement if (error) {}else{} inside this I added a console.error (error message) to help with debugging if I encountered any issues.
and then I set profile to null as the profile cannot be loaded I did this to prevent my components from trying to render a non existent profile.

inside the else block I added a new setProfile(data) which is to update the react state profile with the data from the database and allows the component to render the user profile or to check is_admin for the admin access

finaaly ending with set loading false to set the loading state to false regardless of success for failure is set to false signally to the component that the fetch is complete and to stop showing the loading indicator. this is all wrapped in the useEffect and fetchProfile()

```
      if (error) {
        console.error("Error fetching profile:", error.message);
        setProfile(null);
      } else {
        console.log("Fetched profile:", data);
        setProfile(data);
      }
      setLoading(false);
    }

    fetchProfile();

}, []);
```

finally I have if (loading) return <p>Loading...</p>; this is to prevent the us from showing incomplete data errors before the fetch is complete.

then I have

```
if (!profile?.is_admin) {
return (
<div>
<h1>Access Denied</h1>
<p>You don’t have permission to view this page.</p>
</div>
);
} .
```

this checks to see if the current user exists and had is_admin =true if it is marked true they can access the admin page but if it is marks = false they are med with the Access Denied message this prevents non admin users from seeing the admin dashboard.

and then I finish with

```
return (

  <div>
    <h1>Admin Dashboard</h1>
    <p>Welcome, {profile.username}</p>
  </div>
);
```

which if neither conditions are triggered (loading is false and the profile.is_admin = True) the component renders the admin dashboard.

    🎯 What requirements did you achieve?
    🎯 Were there any requirements or goals that you were unable to achieve?
    🎯 If so, what was it that you found difficult about these tasks?

Use the documentation to find out what it does, how to install it, what syntax to use

Resources

[Build a User Management App with Next.js](https://supabase.com/docs/guides/getting-started/tutorials/with-nextjs?queryGroups=database-method&database-method=sql&queryGroups=language&language=js)

[Build a User Management App with Next.js](https://supabase.com/docs/guides/getting-started/tutorials/with-nextjs?queryGroups=database-method&database-method=sql&queryGroups=language&language=js)

[How to implement authentication in Next.js](https://nextjs.org/docs/pages/guides/authentication)

[Custom Claims & Role-based Access Control (RBAC)](https://supabase.com/docs/guides/database/postgres/custom-claims-and-role-based-access-control-rbac)

[Using Supabase Auth with Next.js - A Complete Setup in Just 15 Minutes](https://www.zestminds.com/blog/supabase-auth-nextjs-setup-guide/)

[Setting Up Supabase in Next.js: A Comprehensive Guide](https://yagyaraj234.medium.com/setting-up-supabase-in-next-js-a-comprehensive-guide-78fc6d0d738c)

[nextjs-user-management](https://github.com/supabase/supabase/tree/master/examples/user-management/nextjs-user-management)

[Role Base Access Control with Next.js, Supabase Auth, Drizzle ORM | Part 1 ](https://www.youtube.com/watch?v=hZz4UhvxxUE)

[Build Role Access Dashboard with Next.js 14,Supabase, Shadcn,Tailwind](https://www.youtube.com/watch?v=D7BzpvHM6JI)

[Admin-user permissions in Supabase with RLS](https://akoskm.com/admin-user-permissions-in-supabase-with-rls)

[JavaScript Client Library](https://supabase.com/docs/reference/javascript/auth-getsession)

[User sessions](https://supabase.com/docs/guides/auth/sessions)

[Retrieve a user](https://supabase.com/docs/reference/javascript/auth-getuser)

[Auth](https://supabase.com/docs/guides/auth)

[Setting up Server-Side Auth for Next.js](https://supabase.com/docs/guides/auth/server-side/nextjs)

[Row Level Security](https://supabase.com/docs/guides/database/postgres/row-level-security)

[Build a User Management App with Next.js](https://supabase.com/docs/guides/getting-started/tutorials/with-nextjs?queryGroups=database-method&database-method=sql&queryGroups=language&language=ts)
