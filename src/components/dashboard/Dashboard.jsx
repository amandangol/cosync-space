    "use client"
    import React, { Suspense, useState, useEffect, useCallback } from 'react';
    import { useAuth, useUser } from '@clerk/nextjs';
    import { db } from '@config/firebaseConfig';
    import { collection, deleteDoc, doc, onSnapshot, query, where } from 'firebase/firestore';
    import { toast } from 'sonner';
    import { motion, AnimatePresence } from 'framer-motion';
    import { useRouter } from 'next/navigation';

    import Header from '../common/Header';
    import WelcomeSection from './WelcomeSection';
    import SearchBar from './SearchBar';
    import LayoutToggle from './LayoutToggle';
    import WorkspaceList from './WorkspaceList';
    import EmptyState from './EmptyState';
    import DeleteWorkspaceModal from './DeleteWorkspaceModal';
    import SkeletonLoader from './SkeletonLoader';
    import NewWorkspaceButton from './NewWorkspaceButton';


    const Dashboard = () => {
    const [workspaceList, setWorkspaceList] = useState([]);
    const [filteredList, setFilteredList] = useState([]);
    const [layout, setLayout] = useState('grid');
    const [searchTerm, setSearchTerm] = useState('');
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [workspaceToDelete, setWorkspaceToDelete] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [sortBy, setSortBy] = useState('lastUpdated');

    const { user } = useUser();
    const { orgId } = useAuth();
    const router = useRouter();

    useEffect(() => {
        const savedLayout = localStorage.getItem('workspaceLayout');
        if (savedLayout) {
        setLayout(savedLayout);
        }
    }, []);

    const handleLayoutChange = (newLayout) => {
        setLayout(newLayout);
        localStorage.setItem('workspaceLayout', newLayout);
    };

    const fetchWorkspaceList = useCallback(() => {
        if (!user) return;
        setIsLoading(true);
        const q = query(
        collection(db, 'workspaces'),
        where('organization', '==', orgId || user?.primaryEmailAddress?.emailAddress)
        );
        return onSnapshot(q, (snapshot) => {
        const data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        setWorkspaceList(data);
        setFilteredList(data);
        setIsLoading(false);
        });
    }, [user, orgId]);

    useEffect(() => {
        const unsubscribe = fetchWorkspaceList();
        return () => unsubscribe && unsubscribe();
    }, [fetchWorkspaceList]);

    const handleDelete = async (id) => {
        setIsDeleteModalOpen(false);
        try {
        await deleteDoc(doc(db, 'workspaces', id));
        toast.success('Workspace deleted successfully');
        setWorkspaceList((prevList) => prevList.filter((workspace) => workspace.id !== id));
        setFilteredList((prevList) => prevList.filter((workspace) => workspace.id !== id));
        } catch (error) {
        console.error('Error deleting workspace:', error);
        toast.error('Failed to delete workspace');
        }
    };

    const handleSearch = (value) => {
        setSearchTerm(value);
        const filtered = workspaceList.filter((workspace) =>
        workspace.name.toLowerCase().includes(value.toLowerCase())
        );
        setFilteredList(filtered);
    };

    return (
        <div className="min-h-screen bg-gray-100">
          <Header />
          <WelcomeSection user={user} />
          <main className="w-full px-4 sm:px-6 lg:px-8 py-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="mb-8 flex flex-col items-start justify-between space-y-4 sm:flex-row sm:items-center sm:space-y-0">
                <h1 className="text-3xl font-semibold text-gray-800">Your Workspaces</h1>
                <NewWorkspaceButton />
              </div>
            <div className="mb-6 flex flex-col space-y-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
                <SearchBar
                searchTerm={searchTerm}
                handleSearch={handleSearch}
                sortBy={sortBy}
                setSortBy={setSortBy}
                />
                <LayoutToggle layout={layout} handleLayoutChange={handleLayoutChange} />
            </div>
            <AnimatePresence mode="wait">
                {isLoading ? (
                <SkeletonLoader key="skeleton" layout={layout} />
                ) : filteredList.length === 0 ? (
                <EmptyState key="empty" />
                ) : (
                <WorkspaceList
                    key="workspaces"
                    filteredList={filteredList}
                    layout={layout}
                    sortBy={sortBy}
                    setWorkspaceToDelete={setWorkspaceToDelete}
                    setIsDeleteModalOpen={setIsDeleteModalOpen}
                    router={router}
                />
                )}
            </AnimatePresence>
            </motion.div>
        </main>
        <DeleteWorkspaceModal
            isOpen={isDeleteModalOpen}
            setIsOpen={setIsDeleteModalOpen}
            workspaceToDelete={workspaceToDelete}
            handleDelete={handleDelete}
        />
        </div>
        
    );
    };

    export default Dashboard;