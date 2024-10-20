## Ocotober Hackathon Challenge

# CoSyncSpace

CoSyncSpace is a collaborative workspace platform that transforms team productivity through real-time collaboration, secure document management, and AI-powered content generation. Its intuitive design helps teams work efficiently, switching seamlessly between document editing and whiteboard modes for flexible project management.

[Demo URL]  
[Video Demo](https://demo-video-link)

## Key Features

- **User Authentication**: Secure login through Clerk ensures user data protection.
- **Real-Time Collaboration**: Instant updates for all users as documents are edited.
- **Document Creation and Editing**: Create content-rich documents with diverse blocks like text, tables, lists, and code snippets.
- **AI-Powered Document Generation**: Leverage AI to generate templates and streamline workflows.
- **Versatile Workspaces**: Switch between editing documents and whiteboard mode for flexible project planning.
- **Secure Sharing**: Share documents securely, manage access, and collaborate effortlessly.
- **Customizable Interface**: Personalize layouts to match your team's needs.
- **Responsive Design & Dark Mode**: Seamless experience across devices with dark themes.

## Tech Stack

**Frontend:**

- Next.js, React, Tailwind CSS
- Clerk for user authentication
- shadcn/ui and Framer Motion for design and animations

**Backend:**

- Firebase for real-time data and storage

**Editing & Real-Time Collaboration:**

- Editor.js for content creation
- Liveblocks for live editing features

## Getting Started

### Prerequisites

- Node.js (v14+), npm or yarn
- Clerk, Liveblocks and Firebase accounts

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/your-username/cosyncspace.git
   cd cosyncspace
   ```
2. **Install dependencies:**
   ```bash
   npm install
   ```
3. **Configure environment variables:**  
    Create a `.env` file and add:
   ```plaintext
   NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
   CLERK_SECRET_KEY=
   NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
   NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
   NEXT_PUBLIC_CLERK_SIGN_IN_FORCE_REDIRECT_URL=/cosyncspace-dashboard
   NEXT_PUBLIC_CLERK_SIGN_UP_FORCE_REDIRECT_URL=/cosyncspace-dashboard
   CLERK_SIGN_IN_FALLBACK_REDIRECT_URL=/
   CLERK_SIGN_IN_FALLBACK_REDIRECT_URL=/
   NEXT_PUBLIC_FIREBASE_API_KEY=
   NEXT_PUBLIC_LIVEBLOCK_PRIMARY_KEY=
   LIVEBLOCKS_SK=
   NEXT_PUBLIC_GEMINI_API_KEY=
   NEXT_PUBLIC_MAX_DOCUMENTS_COUNT=7
   ```
4. **Start the development server:**

```bash
npm run dev
```

5. **Access the application:**  
   Visit `http://localhost:3000` in your browser.

## Usage

1. **Sign up or log in** with your credentials.
2. **Create a workspace** and customize it with a name, cover image, and emoji.
3. **Generate documents or use AI** to quickly set up content.
4. **Switch modes** between document and whiteboard as needed.
5. **Collaborate in real-time** using comments for discussions.
6. **Invite organization members**
   - Navigate to the "Manage Organization" section.
   - Click on "Invite Members" and enter email addresses of team members.
   - Set appropriate permissions for each invited member.
7. **Share documents via email links**
   - Open the document you want to share.
   - Click on the "Share" button.
   - Choose "Get shareable link" and set permissions (view/edit).
   - Copy the generated link and send it via email to collaborators.
8. **Securely share and manage documents** across your team.

## Snapshots

 <img src="https://github.com/user-attachments/assets/47a8abb4-af5c-4174-9418-fba6512bad84" alt="landing" height="300">
 <img src="https://github.com/user-attachments/assets/84e4bd80-daf2-4297-8bd9-a2affb033c63" alt="landing" height="300">
 <img src="https://github.com/user-attachments/assets/c8171ee8-c1ae-4292-8c3a-e6e846fc6b81" alt="signup" height="300">
 <img src = "https://github.com/user-attachments/assets/185aa152-1512-4978-b8b4-4c975902efb8" alt="dashboard" height="300">
 <img src="https://github.com/user-attachments/assets/72da0766-85de-4279-8284-945eda2354ef" alt="dashboard2" height="300">
 <img src="https://github.com/user-attachments/assets/5d9d3751-92ed-4ad2-8912-bee0a4c732e1" alt="create" height="300">
 <img src="https://github.com/user-attachments/assets/aaad0e92-1125-4412-b41e-864c2a2a6f42" alt="No Workspace Found" height="300">
 <img src="https://github.com/user-attachments/assets/4fd9c2f8-788d-451a-b321-da6f4a9a9da8" alt="Welcome to workspace" height="300">
 <img src="https://github.com/user-attachments/assets/c1475ab3-12e8-491e-9dd3-f477671e4ae3" alt="workspaces" height="300">
 <img src="https://github.com/user-attachments/assets/1d06275c-a900-4be5-8e0f-ddc84a8c3026" alt="generate AI template" height="300">
 <img src="https://github.com/user-attachments/assets/a9ae9a0f-2f97-4a63-a385-41f893d17523" alt="Document Mode" height="300">
 <img src="https://github.com/user-attachments/assets/930847c4-95fb-4b2a-b278-56d3fcf92fc6" alt="Whiteboard Mode" height="300">
 <img src="https://github.com/user-attachments/assets/66c319e9-f36a-4f7f-b7a0-b64fe7d985ca" alt="Whiteboard Full screen " height="300">
 <img src="https://github.com/user-attachments/assets/5a7b174d-c4cf-4bbe-be9a-e4463cbeeeff" alt="Manage Org" height="300">
 <img src="https://github.com/user-attachments/assets/e08028a1-d1b0-4e80-b22c-8f0c14416f89" alt="Update profile" height="300">
