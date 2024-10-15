import React from 'react';
import { FileText, Users, Calendar, Clock } from 'lucide-react';
import { Tooltip } from '@/components/ui/tooltip';
import { useOrganization } from '@clerk/nextjs';

const WorkspaceStats = ({ workspace, documents = [], lastEdited }) => {
  const { organization } = useOrganization();

  const teamMembers = organization?.membersCount || 1;
  const createdAt = formatDate(workspace?.createdAt);
  const totalDocuments = documents.length; // Uncomment if you want to display total documents
  const lastActivity = formatDate(lastEdited); // Uncomment if you want to display last activity

  return (
    <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-2">
      {/* Uncomment to show Total Documents */}
      {/* <StatItem
        icon={<FileText className="h-5 w-5 text-blue-500" />}
        label="Docs"
        value={totalDocuments}
      /> */}
      <StatItem
        icon={<Users className="h-5 w-5 text-green-600" />}
        label="Members"
        value={teamMembers}
      />
      <StatItem
        icon={<Calendar className="h-5 w-5 text-purple-600" />}
        label="Created"
        value={createdAt}
      />
      {/* Uncomment to show Last Activity */}
      {/* <StatItem
        icon={<Clock className="h-5 w-5 text-orange-500" />}
        label="Last Activity"
        value={lastActivity}
      /> */}
    </div>
  );
};

const StatItem = ({ icon, label, value }) => (
  <Tooltip content={label}>
    <div className="flex items-center space-x-2 rounded-lg bg-white p-2 shadow-sm transition-transform duration-200 hover:scale-105">
      {icon}
      <div className="flex flex-col">
        <p className="text-xs font-medium text-gray-600">{label}</p>
        <p className="text-sm font-semibold text-gray-900 truncate">{value}</p>
      </div>
    </div>
  </Tooltip>
);

const formatDate = (dateString) => {
  if (!dateString) return 'N/A';
  const date = new Date(dateString);
  return date.toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

export default WorkspaceStats;
