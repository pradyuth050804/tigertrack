import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import React from 'react';

const Unauthorized: React.FC = () => {
  const navigate = useNavigate();
  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <div className="text-center space-y-4">
        <h2 className="text-2xl font-bold">Unauthorized</h2>
        <p className="text-muted-foreground">You don't have permission to view this page.</p>
        <div className="pt-4">
          <Button onClick={() => navigate('/dashboard')}>Go to Dashboard</Button>
        </div>
      </div>
    </div>
  );
};

export default Unauthorized;
