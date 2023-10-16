# ![Logo](/public/logo.svg) Smol Chat

<p align="center">
<img src="/public/full-logo.svg" alt="SmolChat Banner">
</p>

## 💥 Introduction

Smol Chat is a user-friendly chat app powered by React and TypeScript. Chat privately with friends and join global conversations. Share messages and enjoy a secure and simple interface. Join Smol Chat and experience modern chatting with ease.

## 🚀 Features

- **Private Chats**: With Smol Chat, users can effortlessly create private chat rooms, ensuring secure and confidential communication with their selected contacts.
- **Global Chat**: Engage in open discussions or casual conversations with individuals in the global chat feature, promoting a sense of community and global interaction.
- **Real-Time Notifications**: Receive instant alerts for new messages, so you can stay connected with your contacts in real time.
- **Privacy**: Smol Chat takes user privacy seriously by setting up permissions using [Server SDK of Appwrite](https://appwrite.io/docs/sdks#server) through [Appwrite Functions](https://appwrite.io/docs/products/functions).
- **Customization**: Personalize your Smol Chat experience with customizable profiles, avatars to reflect your unique personality.

![image](/public/github_showcase.png)

## 📜 Packages

- [`React`](https://react.dev/) - for building user interfaces
- [`Typescript`](https://www.typescriptlang.org/) - (do u still use JS?)
- [`Appwrite`](https://appwrite.io/) - open source backend services
- [`React Router V6`](https://reactrouter.com/) - lightweight routing library
- [`Nanostores`](https://github.com/nanostores/nanostores/) - tiny state manager
- [`Material UI`](https://mui.com/) - simple, customizable, and accessible library of React components
- [`Node.js`](https://nodejs.org/en) - used for writing [Appwrite Functions](https://appwrite.io/docs/products/functions)

## 🛠️ Local development

To ensure that you are able to install everything properly, I would recommend you to have <b>Yarn</b>, <b>React</b> and <b>Vite</b> installed.
You'll have to set up an AppWrite account, and then add all of the details into your .env file.
Once you've connected your application to AppWrite. Run the commands:

- `yarn` to install dependencies
- `yarn run dev` to start local dev server

## ↔️ Entity relationship diagram

![image](/public/db_github.png)

## ⚙️ Example .env file

| Variable name  | Value |
| ------------- | ------------- |
| `VITE_PROJECT_ID`  | ID of your Appwrite project  |
| `VITE_DATABASE_ID`  | ID of your database  |
| `VITE_COLLECTION_ID_USERS`  | ID of `users` collection  |
| `VITE_COLLECTION_ID_MESSAGES`  | ID of `messages` collection |
| `VITE_COLLECTION_ID_CHATS`  | ID of `chats` collection  |
| `VITE_COLLECTION_ID_CHATS_MEMBERS`  | ID of `chats_members` collection  |
| `VITE_BUCKET_ID`  | ID of `photos` bucket  |
| `VITE_COLLECTION_ID_MESSAGES_UNREAD`  | ID of `messages_unread` collection  |
| `VITE_FUNCTION_ID_CREATE_MESSAGE`  | ID of `createMessage` function  |
| `VITE_FUNCTION_ID_CREATE_CHAT`  | ID of `createChat` function  |
