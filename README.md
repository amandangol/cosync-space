# CoSyncSpace

CoSyncSpace is a collaborative workspace platform designed to streamline your team's workflow and boost productivity. With its intuitive interface and powerful features, CoSyncSpace helps teams work together more effectively.

[Demo URL]

## Key Features

- **Real-Time Collaboration**: Work together with your team in real-time. Changes made by one user are instantly reflected for others.
- **Document Creation**: Create and edit documents with a variety of content blocks including text, tables, lists, code snippets, and more.
- **Customizable Workspace**: Tailor the interface and workflow to suit your team's needs with customizable views and layouts.
- **Seamless Synchronization**: Access and collaborate on your documents from any device, anywhere.
- **Rich Text Editing**: Use a variety of tools for creating and formatting content, including checklists, headers, paragraphs, code blocks, tables, and more.
- **User Authentication**: Secure sign-up and sign-in process using Clerk, ensuring your data remains protected.
- **Commenting System**: Discuss and provide feedback directly within documents using a built-in comment section.
- **Cover Image Customization**: Personalize your documents and workspaces with custom cover images.
- **Emoji Reactions**: Add emoji icons to documents for quick expression and categorization.
- **Responsive Design**: Enjoy a seamless experience across desktop and mobile devices with a responsive layout.
- **Dark Mode Support**: Work comfortably in low-light environments with dark mode options.

## Tech Stack

### Frontend

- [Next.js](https://nextjs.org/)
- [React](https://react.dev/)
- [Tailwind CSS](https://tailwindcss.com/)
- [shadcn/ui](https://ui.shadcn.com/)
- [Clerk](https://clerk.com/) for authentication and user management

### Backend

- [Firebase](https://firebase.google.com/) for real-time data synchronization and storage

### Editor

- [Editor.js](https://editorjs.io/) for creating rich-text content with customizable blocks

### Real-Time Collaboration

- Powered by [Liveblocks](https://liveblocks.io/) to enable live editing and collaboration features

## Getting Started

### Prerequisites

- Node.js (v14 or later)
- npm or yarn
- Firebase account
- Clerk account

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/your-username/cosyncspace.git
   cd cosyncspace
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Set up environment variables:
   Create a `.env` file in the root directory and add the following:

   ```
   NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
   CLERK_SECRET_KEY=your_clerk_secret_key
   NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_firebase_auth_domain
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_firebase_project_id
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_firebase_storage_bucket
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_firebase_messaging_sender_id
   NEXT_PUBLIC_FIREBASE_APP_ID=your_firebase_app_id
   ```

4. Start the development server:

   ```bash
   npm run dev
   ```

5. Visit `http://localhost:3000` in your browser to see the application.

## Usage

1. Sign up for a new account or sign in if you already have one.
2. Create a new workspace by clicking the "Create New Workspace" button.
3. Customize your workspace with a name, cover image, and emoji.
4. Create new documents within your workspace and start collaborating with your team.
