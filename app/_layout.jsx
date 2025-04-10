import React from 'react';
import { PostsProvider } from './PostsContext';
import { Slot } from 'expo-router';

export default function RootLayout() {
  return (
    <PostsProvider>
      <Slot />
    </PostsProvider>
  );
}