# Collaboration Platform

A powerful platform designed to simplify team collaboration and project management, offering real-time editing, task planning, and document creation capabilities. This platform is ideal for project managers, development teams, freelancers, and young professionals working together on projects. Its flexible and user-friendly interface allows for customization and access from any device.

<div align="center">
  <h3>
    <a href="https://collaboration-platform-omega.vercel.app/" target="_blank">
      Demo URL
    </a>
  </h3>
</div>

## Key Features

- **Real-Time Collaboration**: Work together with your team in real-time. Changes made by one user are instantly reflected for others.
- **Document Creation**: Create and edit documents with a variety of content blocks including text, tables, lists, code snippets, and more.
- **Customizable Workspace**: Tailor the interface and workflow to suit your team's needs with customizable views and layouts.
- **Seamless Synchronization**: Access and collaborate on your documents from any device, anywhere.
- **Rich Text Editing**: Use a variety of tools for creating and formatting content, including checklists, headers, paragraphs, code blocks, tables, and more.

## Tech Stack

- **Frontend**:
  - [Next.js](https://nextjs.org/)
  - [React](https://react.dev/)
  - [Tailwind CSS](https://tailwindcss.com/)
  - [shadcn/ui](https://ui.shadcn.com/)
  - [Clerk](https://clerk.com/) for authentication and user management.
- **Backend**:

  - [Firebase](https://firebase.google.com/) for real-time data synchronization and storage.

- **Editor**:
  - [Editor.js](https://editorjs.io/) for creating rich-text content with customizable blocks like checklists, code, tables, and more.
- **Real-Time Collaboration**:
  - Powered by [Liveblocks](https://liveblocks.io/) to enable live editing and collaboration features.

## Installation

To run the platform locally, follow these steps:

1. Clone the repository:

   ```bash
   git clone https://github.com/your-username/collaboration-platform.git
   cd collaboration-platform
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Set up environment variables:
   Create a `.env.local` file in the root directory use `env.example`

4. Start the development server:

   ```bash
   npm run dev
   ```

5. Visit `http://localhost:3000` in your browser.

## Contribution

Contributions are welcome! Please feel free to submit a pull request or open an issue for discussion.
