import React from 'react';
import { Navigate } from 'react-router-dom';
import { UserProfile } from '../types';
import ChefDashboard from './ChefDashboard';
import CustomerDashboard from './CustomerDashboard';

interface ProfileProps {
  profile: UserProfile | null;
}

export default function Profile({ profile }: ProfileProps) {
  if (!profile) {
    return <Navigate to="/login" />;
  }

  if (profile.role === 'chef') {
    return <ChefDashboard profile={profile} />;
  }

  return <CustomerDashboard profile={profile} />;
}
