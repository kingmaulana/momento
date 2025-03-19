# Momento - Social Media App

Momento is a full-stack social media application that allows users to share moments, connect with friends, and engage with content through a mobile interface. Built with React Native for the mobile client and GraphQL server, it provides a seamless social networking experience.

## Features

- **User Authentication**
  - Secure registration and login system
  - Profile management

- **Social Interactions**
  - Create and share posts
  - Follow other users
  - Like and comment on posts
  - Search users by name or username

- **Content Management**
  - Real-time post feed
  - View followers and following lists
  - Track post engagement metrics

## Tech Stack

### Mobile Client
- React Native
- Apollo Client (GraphQL)
- React Navigation

### Server
- Node.js
- GraphQL
- MongoDB

## Getting Started

### Prerequisites
- Node.js (v14 or higher)
- MongoDB
- React Native development environment

### Installation

1. Clone the repository
```bash
git clone [repository-url]
```

2. Install Server Dependencies
```bash
cd server
npm install
```

3. Install Mobile App Dependencies
```bash
cd app
npm install
```

### Running the Application

1. Start the Server
```bash
cd server
npm start
```

2. Start the Mobile App
```bash
cd app
npx react-native run-ios    # For iOS
# or
npx react-native run-android # For Android
```

## Project Structure

```
momento/
├── server/          # GraphQL server implementation
└── app/             # React Native mobile application
```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the LICENSE file for details.

[![Open in Visual Studio Code](https://classroom.github.com/assets/open-in-vscode-2e0aaae1b6195c2367325f4f02e2d04e9abb55f0b24a779b69b11b9e10269abc.svg)](https://classroom.github.com/online_ide?assignment_repo_id=18121839&assignment_repo_type=AssignmentRepo)
# GC01

## My Social Media App (INSTAGRAM)

My Social Media App adalah sebuah aplikasi client(mobile)-server. Challenge ini juga merupakan salah satu aplikasi mobile pertama dan terakhir kamu, jadi kerjakan dengan baik sebagai bekal portofolio kamu. Pada challenge ini, kamu diminta untuk membuat aplikasi client(mobile)-server dengan detail sebagai berikut:

### Struktur Folder
- [ ] server: untuk menyimpan aplikasi server GraphQL kamu 
- [ ] app: untuk menyimpan aplikasi mobile React Native kamu


### Fitur
- [ ] Fitur Register
- [ ] Fitur Login
- [ ] FItur Add Post
- [ ] Fitur Show Post (berdasarkan yang paling baru)
- [ ] Fitur Comment Post (Embedded Document)
- [ ] Fitur search user berdasarkan nama atau username
- [ ] Fitur follow
- [ ] Menampilkan Followers dan Following dari setiap user (Reference with $lookup)
- [ ] Fitur Like Post
- [ ] Menampilkan total like dari setiap post
