# CoSyncSpace

CoSyncSpace is a cutting-edge collaborative workspace platform designed to streamline your team's workflow and boost productivity. With its intuitive interface and powerful features, CoSyncSpace helps teams work together more effectively in real-time.

[Demo URL]

## Key Features

- **User Authentication**: Secure sign-up and sign-in process using Clerk, ensuring your data remains protected.
- **Real-Time Collaboration**: Work together with your team in real-time. Changes made by one user are instantly reflected for others.
- **Document Creation and Editing**: Create and edit documents with a variety of content blocks including text, tables, lists, code snippets, and more.
- **AI-Powered Document Generation**: Generate document templates and content using advanced AI, streamlining your workflow and boosting productivity.
- **Versatile Workspaces**: Switch between document editing and whiteboard mode for flexible project management and ideation.
- **Secure Document and Whiteboard Handling**: Create, edit, and organize documents and whiteboard with ease. Download in various formats and share securely.
- **Customizable Workspace**: Tailor the interface and workflow to suit your team's needs with customizable views and layouts.
- **Rich Text Editing**: Use a variety of tools for creating and formatting content, including checklists, headers, paragraphs, code blocks, tables, and more.
- **Commenting System**: Discuss and provide feedback directly within documents using a built-in comment section.
- **Cover Image Customization**: Personalize your documents and workspaces with custom cover images.
- **Emoji Reactions**: Add emoji icons to documents for quick expression and categorization.
- **Responsive Design**: Enjoy a seamless experience across desktop and mobile devices with a responsive layout.
- **Dark Mode Support**: Work comfortably in low-light environments with dark mode.

 <img src="https://github.com/user-attachments/assets/47a8abb4-af5c-4174-9418-fba6512bad84" alt="landing" height="300"> <img src="https://github.com/user-attachments/assets/84e4bd80-daf2-4297-8bd9-a2affb033c63" alt="landing" height="300"> <img src="https://github.com/user-attachments/assets/c8171ee8-c1ae-4292-8c3a-e6e846fc6b81" alt="signup" height="300"> <img src = "https://github.com/user-attachments/assets/185aa152-1512-4978-b8b4-4c975902efb8" alt="dashboard" height="300"> <img src="https://github.com/user-attachments/assets/72da0766-85de-4279-8284-945eda2354ef" alt="dashboard2" height="300"> <img src="https://github.com/user-attachments/assets/5d9d3751-92ed-4ad2-8912-bee0a4c732e1" alt="create" height="300">  <img src="https://github.com/user-attachments/assets/aaad0e92-1125-4412-b41e-864c2a2a6f42" alt="No Workspace Found" height="300">
 <img src="https://github.com/user-attachments/assets/4fd9c2f8-788d-451a-b321-da6f4a9a9da8" alt="Welcome to workspace" height="300">
 <img src="https://github.com/user-attachments/assets/c1475ab3-12e8-491e-9dd3-f477671e4ae3" alt="workspaces" height="300">
 <img src="https://github.com/user-attachments/assets/1d06275c-a900-4be5-8e0f-ddc84a8c3026" alt="generate AI template" height="300">
 <img src="https://github.com/user-attachments/assets/a9ae9a0f-2f97-4a63-a385-41f893d17523" alt="Document Mode" height="300">
 <img src="https://github.com/user-attachments/assets/930847c4-95fb-4b2a-b278-56d3fcf92fc6" alt="Whiteboard Mode" height="300">
  <img src="https://github.com/user-attachments/assets/66c319e9-f36a-4f7f-b7a0-b64fe7d985ca" alt="Whiteboard Full screen " height="300">
 <img src="https://github.com/user-attachments/assets/5a7b174d-c4cf-4bbe-be9a-e4463cbeeeff" alt="Manage Org" height="300">
 <img src="https://github.com/user-attachments/assets/e08028a1-d1b0-4e80-b22c-8f0c14416f89" alt="Update profile" height="300">

 









## Tech Stack

### Frontend

- [Next.js](https://nextjs.org/)
- [React](https://react.dev/)
- [Tailwind CSS](https://tailwindcss.com/)
- [shadcn/ui](https://ui.shadcn.com/)
- [Clerk](https://clerk.com/) for authentication and user management
- [Framer Motion](https://www.framer.com/motion/) for animations

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
4. Create new documents within your workspace or use the AI-powered document generation feature to get started quickly.
5. Switch between document editing and whiteboard mode as needed for your project.
6. Collaborate with your team in real-time, using the commenting system for discussions.
7. Use the secure sharing features to invite others to your workspace or specific documents.

## Contributing

We welcome contributions to CoSyncSpace! Please see our [Contributing Guide](CONTRIBUTING.md) for more details on how to get started.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
