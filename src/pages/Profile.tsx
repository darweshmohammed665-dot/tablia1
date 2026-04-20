import React from 'react';
import { Navigate } from 'react-router-dom';
import { UserProfile } from '../types';
import CustomerDashboard from './CustomerDashboard';

interface ProfileProps {
  profile: UserProfile | null;
}

export default function Profile({ profile }: ProfileProps) {
  if (!profile) {
    return <Navigate to="/login" replace />;
  }

  if (profile.role === 'chef') {
    return <Navigate to="/dashboard" replace />;
  }

  return <CustomerDashboard profile={profile} />;
}
