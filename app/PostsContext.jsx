import React, { createContext, useState, useEffect } from 'react';

// Uncomment The following lines after backend is ready for real posts
// export const PostsContext = createContext();
// export const PostsProvider = ({ children }) => {
//   const [posts, setPosts] = useState([]);
//   const fetchPosts = async () => {
    //  Fetch Data from backend api
    //  setPosts(fetchedPosts);

//   };
//   useEffect(() => {
//     fetchPosts();
//   }, []);


// Dummy Data
const initialPosts = [
  {
    id: '1',
    user: { name: 'Alice', username: 'alice123', avatar: 'https://picsum.photos/40' },
    content: 'Loving this new album!',
    createdAt: new Date().toISOString(),
    reviewMeta: {
      albumCoverUrl: 'https://picsum.photos/80',
      albumName: 'Revolution',
      songName: 'Awakening',
      rating: 4.5,
    },
    replyCount: 0,
    repostCount: 0,
    likeCount: 0,
    liked: false,
    reposted: false,
  },
  {
    id: '2',
    user: { name: 'Bob', username: 'bobbybeats', avatar: 'https://picsum.photos/41' },
    content: 'This Album Slays the Boots Down House on God Period MAMA!',
    createdAt: new Date().toISOString(),
    reviewMeta: {
      albumCoverUrl: 'https://picsum.photos/81',
      albumName: 'Sunrise',
      songName: 'Morning Glory',
      rating: 5,
    },
    replyCount: 0,
    repostCount: 0,
    likeCount: 0,
    liked: false,
    reposted: false,
  },
  {
    id: '3',
    user: { name: 'Charlie', username: 'echocharlie', avatar: 'https://picsum.photos/42' },
    content: 'Really digging the vibes on this one.',
    createdAt: new Date().toISOString(),
    reviewMeta: {
      albumCoverUrl: 'https://picsum.photos/82',
      albumName: 'Echoes',
      songName: 'Reflections',
      rating: 5,
    },
    replyCount: 0,
    repostCount: 0,
    likeCount: 0,
    liked: false,
    reposted: false,
  },
];

export const PostsContext = createContext();

export const PostsProvider = ({ children }) => {
  const [posts, setPosts] = useState(initialPosts);

  const updatePost = (postId, updateFn) => {
    setPosts(prevPosts =>
      prevPosts.map(post => (post.id === postId ? updateFn(post) : post))
    );
    // Also POST/PATCH update to backend if needed
  };

  return (
    <PostsContext.Provider value={{ posts, updatePost }}>
      {children}
    </PostsContext.Provider>
  );
};