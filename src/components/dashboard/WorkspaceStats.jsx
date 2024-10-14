    import React from 'react';
    import { CheckSquare, Users, Calendar, Clock } from 'lucide-react';
    import { Tooltip } from '@/components/ui/tooltip';

    const WorkspaceStats = ({ workspace }) => {
    return (
        <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-4">
        <StatItem
            icon={<CheckSquare className="h-5 w-5 text-green-500" />}
            label="Total Tasks"
            value={workspace.totalTasks || 0}
        />
        <StatItem
            icon={<Users className="h-5 w-5 text-blue-500" />}
            label="Team Members"
            value={workspace.teamMembers?.length || 0}
        />
        <StatItem
            icon={<Calendar className="h-5 w-5 text-purple-500" />}
            label="Created On"
            value={new Date(workspace.createdAt).toLocaleDateString()}
        />
        <StatItem
            icon={<Clock className="h-5 w-5 text-orange-500" />}
            label="Last Activity"
            value={workspace.lastActivity ? new Date(workspace.lastActivity).toLocaleDateString() : 'N/A'}
        />
        </div>
    );
    };

    const StatItem = ({ icon, label, value }) => (
        <Tooltip content={label}>
          <div className="flex items-center space-x-2 rounded-lg bg-white p-3 shadow">
            {icon}
            <div>
              <p className="text-xs font-medium text-gray-500">{label}</p>
              <p className="text-lg font-semibold text-gray-900">{value}</p>
            </div>
          </div>
        </Tooltip>
      );
      
    export default WorkspaceStats;