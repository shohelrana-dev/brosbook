# Brosbook social media app, developed for learning purpose.

### Stack
#### Frontend

1. ReactJS
2. NextJS 13
3. Typescript
4. RTQ Query
5. SocketIo client

#### Backend

1. Node.js (express.js)
2. Typescript
3. MySQL + TypeORM
4. SocketIo
5. Cloudinary (The Most Powerful Media API and Products)

### App Features

- Login / Signup / Forgot password / Reset password
- OAuth with Google
- Unique username / email check
- Push Notifications
- Send email verification mail
- Automatically redirect to requested page after login (/auth?redirect=/account/profile)
- JWT access (1d exp)


#### Chat ✨
- Send Text, Image, Emoji
- Reaction
- Push Notifications


#### Feed
- View all recent posts from friends (push / fan-out-on-write)
- Use pull / fan-out-on-read feed for celebrities (100000+ subscribers) ✨
- Feed infinite scroll
- Search users
- User suggestions in sidebar who follows you / followed by who you follow / new to brosbook

##### Post
- Posts CRUD
- Images support.
- like and unlike post
- Comments
- like and unlike comment
- Share on Social media

#### Profile page
- View all own photos/videos
- View posts, followers and followed number
- Follow/unfollow if not own page
- Upload user avatar
- Upload user cover photo

### Installation
```bash
git clone <sourch>
 
npm run install && npm run dev
# or
yarn install && yarn dev
```