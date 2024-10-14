import React from 'react';
import { Grid, ListIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';

const LayoutToggle = ({ layout, handleLayoutChange }) => (
  <div className="flex space-x-2">
    <Button
      variant={layout === 'grid' ? 'secondary' : 'ghost'}
      size="icon"
      onClick={() => handleLayoutChange('grid')}
    >
      <Grid className="h-5 w-5" />
    </Button>
    <Button
      variant={layout === 'list' ? 'secondary' : 'ghost'}
      size="icon"
      onClick={() => handleLayoutChange('list')}
    >
      <ListIcon className="h-5 w-5" />
    </Button>
  </div>
);

export default LayoutToggle;