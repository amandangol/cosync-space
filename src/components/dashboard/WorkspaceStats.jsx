import React from 'react';
import { FileText, Users, Calendar, Clock } from 'lucide-react';
import { Tooltip } from '@/components/ui/tooltip';
import { useOrganization } from '@clerk/nextjs';

const StatItem = ({ icon: Icon, label, value }) => (
  <Tooltip content={label}>
    <div className="flex items-center space-x-2">
      {Icon && <Icon className="w-4 h-4 text-purple-600" />}
      <span className="font-semibold">{value}</span>
    </div>
  </Tooltip>
);

const WorkspaceStats = ({ workspace, documents = [], lastEdited }) => {
  const { organization } = useOrganization();
  
  const teamMembers = organization?.membersCount || 1;
  const createdAt = formatDate(workspace?.createdAt);
  const totalDocuments = documents.length;
  const lastActivity = formatDate(lastEdited);

  return (
    <div className="grid grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg">
      {/* <StatItem icon={FileText} label="Docs" value={totalDocuments} /> */}
      <StatItem icon={Users} label="Members" value={teamMembers} />
      <StatItem icon={Calendar} label="Created" value={createdAt} />
      {/* <StatItem icon={Clock} label="Last Activity" value={lastActivity} /> */}
    </div>
  );
};

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