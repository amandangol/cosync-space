"use client"
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth, useUser } from '@clerk/nextjs';
import { db } from '@config/firebaseConfig';
import { doc, setDoc } from 'firebase/firestore';
import { v4 as uuidv4 } from 'uuid';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import UpdateCoverPhoto from '@/components/UpdateCoverPhoto';
import { EmojiSelector } from '@/components/EmojiSelector';
import Header from '@components/common/Header';
import Footer from '@components/common/Footer';

const SetupWorkspace = () => {
  const [loading, setLoading] = useState(false);
  const [image, setImage] = useState('/images/default-cover.png');
  const [workspaceName, setWorkspaceName] = useState('');
  const [emojiIcon, setEmojiIcon] = useState(null);
  const [error, setError] = useState(null);
  const { user } = useUser();
  const { orgId } = useAuth();
  const router = useRouter();

  const handleImageChange = (newImage) => {
    setImage(newImage);
  };

  const createWorkspace = async () => {
    setLoading(true);
    setError(null);
    const workspaceID = Date.now().toString();
    const docId = uuidv4();

    try {
      await setDoc(doc(db, 'workspaces', workspaceID), {
        id: workspaceID,
        name: workspaceName,
        cover: image, 
        emoji: emojiIcon,
        owner: user?.primaryEmailAddress?.emailAddress,
        organization: orgId || user?.primaryEmailAddress?.emailAddress,
        createdAt: new Date().toISOString(),
        lastUpdated: new Date().toISOString(),
      });

      const documentID = uuidv4()
      await setDoc(doc(db, 'documents', documentID), {
        id: documentID,
        workspaceID: workspaceID,
        owner: user?.primaryEmailAddress?.emailAddress,
        name: 'Untitled Document',
        cover: null,
        emoji: null,
        documentOutput: [], 
        createdAt: new Date().toISOString(),
      })

      await setDoc(doc(db, 'documentOutput', documentID), {
        id: documentID,
        output: [],
      })

      toast.success('Workspace created successfully');
      router.push(`/workspace/${workspaceID}/${documentID}`);
    } catch (error) {
      console.error('Error creating workspace:', error);
      setError('Failed to create workspace. Please try again.');
      toast.error('Failed to create workspace');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white flex flex-col">
      <Header />
      <main className="container mx-auto px-6 py-20 md:px-20 lg:px-36 xl:px-48 flex-grow">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="rounded-lg bg-gray-800 shadow-lg p-8"
        >
          <UpdateCoverPhoto setNewCover={handleImageChange}>
            <div className="relative mb-6 cursor-pointer">
              <img src={image} alt="Workspace cover" className="h-48 w-full rounded-lg object-cover transition-opacity duration-300 hover:opacity-80" />
              <p className="absolute inset-0 flex items-center justify-center bg-black/60 text-lg font-semibold text-white opacity-0 transition-opacity duration-300 hover:opacity-100">
                Change Cover
              </p>
            </div>
          </UpdateCoverPhoto>
          <h2 className="text-3xl font-extrabold text-white mb-4">
            Create a New Workspace
          </h2>
          <p className="text-gray-300 text-base mb-6">
            Organize your projects and collaborate with your team. The workspace
            name and other details can be modified later if needed.
          </p>
          <div className="flex items-center gap-3 mb-6">
            <EmojiSelector setEmojiIcon={setEmojiIcon} emojiIcon={emojiIcon} />
            <Input
              placeholder="Workspace Name"
              value={workspaceName}
              onChange={e => setWorkspaceName(e.target.value)}
              className="flex-grow bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          {error && (
            <div className="mt-4 p-3 rounded-lg bg-red-900 border border-red-700 text-red-100">
              {error}
            </div>
          )}
          <div className="mt-6 flex justify-end gap-4">
            <Button 
              onClick={createWorkspace} 
              disabled={!workspaceName.trim() || loading} 
              className={`w-full md:w-auto bg-blue-600 hover:bg-blue-700 text-white ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {loading ? 'Creating...' : 'Create Workspace'}
            </Button>
            <Button 
              variant="outline" 
              onClick={() => router.push('/cosyncspace-dashboard')} 
              className="w-full md:w-auto bg-transparent border border-gray-600 text-gray-300 hover:bg-gray-700"
            >
              Cancel
            </Button>
          </div>
        </motion.div>
      </main>
      <Footer />
    </div>
  )
}

export default SetupWorkspace