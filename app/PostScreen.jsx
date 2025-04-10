import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  TextInput,
  ScrollView,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Feather } from '@expo/vector-icons';

// Dummy replies data (for now)
const mockReplies = [
  {
    id: 'reply1',
    user: { name: 'ReplyUser1', avatar: 'https://via.placeholder.com/40' },
    content: 'This is a great review!',
    createdAt: new Date(Date.now() - 3600000), // 1 hour ago
  },
  {
    id: 'reply2',
    user: { name: 'ReplyUser2', avatar: 'https://via.placeholder.com/40' },
    content: 'I agree, the album is amazing.',
    createdAt: new Date(Date.now() - 7200000), // 2 hours ago
  },
  {
    id: 'reply3',
    user: { name: 'ReplyUser3', avatar: 'https://via.placeholder.com/40' },
    content: 'I disagree. I found it to be quite boring.',
    createdAt: new Date(Date.now() - 1800000), // 30 minutes ago
  }
];

const ReviewPostCard = ({ post, toggleLike }) => {
  return (
    <View style={styles.card}>
      {/* User Info Section */}
      <View style={styles.header}>
        <Image source={{ uri: post.user.avatar }} style={styles.avatar} />
        <View>
          <Text style={styles.username}>{post.user.name}</Text>
          <Text style={styles.time}>
            {new Date(post.createdAt).toLocaleString()}
          </Text>
        </View>
      </View>

      {/* Review Content */}
      <View style={styles.content}>
        <Text>{post.content}</Text>
      </View>

      {/* Album Info */}
      <View style={styles.albumInfo}>
        <Image
          source={{ uri: post.reviewMeta.albumCoverUrl }}
          style={styles.albumCover}
        />
        <View>
          <Text style={styles.albumName}>{post.reviewMeta.albumName}</Text>
          {post.reviewMeta.songName && (
            <Text style={styles.songName}>
              Song: {post.reviewMeta.songName}
            </Text>
          )}
          <Text style={styles.rating}>⭐ {post.reviewMeta.rating}/5</Text>
        </View>
      </View>

      {/* Actions */}
      <View style={styles.actions}>
        <TouchableOpacity style={styles.iconButton}>
          <Feather name="message-circle" size={20} color="#666" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.iconButton}>
          <Feather name="repeat" size={20} color="#666" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.iconButton} onPress={toggleLike}>
          <Feather
            name="heart"
            size={20}
            color={post.liked ? 'red' : '#666'}
          />
        </TouchableOpacity>
        <TouchableOpacity style={styles.iconButton}>
          <Feather name="share" size={20} color="#666" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const PostScreen = () => {
  // Using the "post" parameter as an encoded JSON snapshot for dummy data.
  const { post } = useLocalSearchParams();
  const router = useRouter();
  const [replies, setReplies] = useState([]);
  const [replyText, setReplyText] = useState('');
  const [parsedPost, setParsedPost] = useState(null);

  useEffect(() => {
    try {
      const parsed = JSON.parse(post);
      setParsedPost(parsed);
    } catch (e) {
      console.error('Failed to parse post data:', e);
      setParsedPost(null);
    }

    // Load dummy replies for now
    setReplies(mockReplies);

    // ----- Uncomment this block to fetch post data from your backend later -----
    // if (postId) {
    //   fetch(`https://your-backend.com/api/posts/${postId}`)
    //     .then(response => response.json())
    //     .then(data => setParsedPost(data))
    //     .catch(error => console.error('Error fetching post data:', error));
    // }
    // ----------------------------------------------------------------------------

  }, [post]);

  const handlePostReply = () => {
    if (replyText.trim()) {
      const newReply = {
        id: `reply-${Date.now()}`,
        user: { name: 'CurrentUser', avatar: 'https://via.placeholder.com/40' },
        content: replyText,
        createdAt: new Date(),
      };
      setReplies(prev => [newReply, ...prev]);
      setReplyText('');
      
      // ----- Uncomment and add backend call when ready -----
      // fetch('https://your-backend.com/api/posts/reply', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ postId: parsedPost.id, content: replyText }),
      // })
      //   .then(response => response.json())
      //   .then(data => { /* Update state if needed */ })
      //   .catch(error => console.error(error));
      // -----------------------------------------------------------
    }
  };

  const toggleLike = () => {
    // This example toggles "liked" flag on the dummy post;
    // later you'll update the backend too.
    if (parsedPost) {
      setParsedPost({
        ...parsedPost,
        liked: !parsedPost.liked,
        likeCount: parsedPost.likeCount + (parsedPost.liked ? -1 : 1)
      });

      // ----- Uncomment for backend update -----
      // fetch(`https://your-backend.com/api/posts/${parsedPost.id}/like`, {
      //   method: 'PATCH',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ liked: !parsedPost.liked }),
      // })
      //   .then(response => response.json())
      //   .then(data => { /* Optionally update state with new data */ })
      //   .catch(error => console.error(error));
      // ------------------------------------------
    }
  };

  if (!parsedPost) {
    return (
      <SafeAreaView style={styles.container}>
        <Text>Error: Invalid post data.</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.headerContainer}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.backButton}
        >
          <Feather name="arrow-left" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Post</Text>
      </View>

      <ScrollView style={styles.contentContainer}>
        {/* Main Post */}
        <ReviewPostCard post={parsedPost} toggleLike={toggleLike} />

        {/* Replies Section */}
        <Text style={styles.repliesTitle}>Replies</Text>
        {replies.map(r => (
          <View key={r.id} style={styles.replyCard}>
            <View style={styles.header}>
              <Image source={{ uri: r.user.avatar }} style={styles.avatar} />
              <View>
                <Text style={styles.username}>{r.user.name}</Text>
                <Text style={styles.time}>{r.createdAt.toLocaleString()}</Text>
              </View>
            </View>
            <Text style={styles.replyContent}>{r.content}</Text>
          </View>
        ))}
      </ScrollView>

      {/* Reply Input */}
      <View style={styles.replyInputContainer}>
        <TextInput
          style={styles.replyInput}
          placeholder="Write your reply"
          value={replyText}
          onChangeText={setReplyText}
          multiline
        />
        <TouchableOpacity
          onPress={handlePostReply}
          style={styles.replyButton}
          disabled={!replyText.trim()}
        >
          <Text style={{ color: '#fff', fontWeight: 'bold' }}>Reply</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  backButton: {
    marginRight: 12,
  },
  headerTitle: {
    fontWeight: 'bold',
    fontSize: 18,
  },
  contentContainer: {
    flex: 1,
    paddingHorizontal: 16,
  },
  card: {
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    paddingVertical: 16,
    marginBottom: 0,
  },
  header: {
    flexDirection: 'row',
    marginBottom: 10,
    alignItems: 'center',
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
  },
  username: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  time: {
    fontSize: 12,
    color: '#666',
  },
  content: {
    marginBottom: 12,
  },
  albumInfo: {
    flexDirection: 'row',
    marginBottom: 12,
    alignItems: 'center',
  },
  albumCover: {
    width: 80,
    height: 80,
    borderRadius: 8,
    marginRight: 12,
  },
  albumName: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  songName: {
    fontSize: 14,
    color: '#333',
  },
  rating: {
    fontSize: 14,
    color: '#888',
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  iconButton: {
    padding: 8,
  },
  repliesTitle: {
    fontWeight: 'bold',
    fontSize: 18,
    marginTop: 20,
    marginBottom: 10,
  },
  replyCard: {
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    paddingVertical: 16,
  },
  replyContent: {
    marginTop: 8,
    fontSize: 14,
  },
  replyInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  replyInput: {
    flex: 1,
    marginRight: 12,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 10,
    minHeight: 40,
    maxHeight: 100,
  },
  replyButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#1DA1F2',
    borderRadius: 20,
  },
});

export default PostScreen;

