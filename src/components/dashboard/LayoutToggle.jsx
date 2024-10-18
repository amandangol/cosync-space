import React from 'react';
import { Grid, ListIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';

const LayoutToggle = ({ layout, handleLayoutChange }) => (
  <div className="flex space-x-2">
    <Button
      variant={layout === 'grid' ? 'secondary' : 'ghost'}
      size="icon"
      onClick={() => handleLayoutChange('grid')}
      className={`text-${layout === 'grid' ? 'blue-500' : 'white'} hover:text-blue-400 hover:bg-gray-700`}
    >
      <Grid className="h-5 w-5" />
    </Button>
    <Button
      variant={layout === 'list' ? 'secondary' : 'ghost'}
      size="icon"
      onClick={() => handleLayoutChange('list')}
      className={`text-${layout === 'list' ? 'blue-500' : 'white'} hover:text-blue-400 hover:bg-gray-700`}
    >
      <ListIcon className="h-5 w-5" />
    </Button>
  </div>
);

export default LayoutToggle;
