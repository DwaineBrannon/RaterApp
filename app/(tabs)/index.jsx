import React, { useContext } from 'react';
import { 
  View, 
  Text, 
  FlatList, 
  TouchableOpacity, 
  StyleSheet, 
  Image, 
  Alert,
  LayoutAnimation,
  UIManager,
  Platform
} from 'react-native';
import { useRouter } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import { PostsContext } from '../PostsContext';  // Adjust the import path if necessary

// Enable LayoutAnimation on Android
if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

// Helper to format counts (e.g. 1500 => 1.5k)
const formatCount = count => {
  if (count >= 1000) {
    return (count / 1000).toFixed(1).replace(/\.0$/, '') + 'k';
  }
  return count;
};

const HomeScreen = () => {
  const router = useRouter();
  const { posts, updatePost } = useContext(PostsContext);

  const handlePostPress = (post) => {
    router.push(`/PostScreen?post=${encodeURIComponent(JSON.stringify(post))}`);
  };

  const handleReply = (e, post) => {
    e.stopPropagation();
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    updatePost(post.id, p => ({ ...p, replyCount: p.replyCount + 1 }));
    router.push('/ComposePost'); // Placeholder for your ComposePost screen
  };

  const handleRepost = (e, post) => {
    e.stopPropagation();
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    updatePost(post.id, p => {
      const newReposted = !p.reposted;
      const countChange = newReposted ? 1 : -1;
      return { ...p, reposted: newReposted, repostCount: p.repostCount + countChange };
    });
  };

  const handleLike = (e, post) => {
    e.stopPropagation();
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    updatePost(post.id, p => {
      const newLiked = !p.liked;
      const countChange = newLiked ? 1 : -1;
      return { ...p, liked: newLiked, likeCount: p.likeCount + countChange };
    });
  };

  const handleShare = (e, post) => {
    e.stopPropagation();
    Alert.alert('Share', 'Copy link', [{ text: 'OK' }]);
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity style={styles.postContainer} onPress={() => handlePostPress(item)}>
      {/* Header: Avatar, Name, Username */}
      <View style={styles.header}>
        <Image source={{ uri: item.user.avatar }} style={styles.avatar} />
        <View>
          <Text style={styles.name}>{item.user.name}</Text>
          <Text style={styles.username}>@{item.user.username}</Text>
        </View>
      </View>

      {/* Post content */}
      <Text style={styles.content}>{item.content}</Text>

      {/* Actions with icons and counters */}
      <View style={styles.actions}>
        <TouchableOpacity style={styles.actionButton} onPress={(e) => handleReply(e, item)}>
          <Feather name="message-circle" size={20} color="#666" />
          <Text style={styles.countText}>{formatCount(item.replyCount)}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionButton} onPress={(e) => handleRepost(e, item)}>
          <Feather name="repeat" size={20} color={item.reposted ? 'green' : '#666'} />
          <Text style={styles.countText}>{formatCount(item.repostCount)}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionButton} onPress={(e) => handleLike(e, item)}>
          <Feather name="heart" size={20} color={item.liked ? 'red' : '#666'} />
          <Text style={styles.countText}>{formatCount(item.likeCount)}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionButton} onPress={(e) => handleShare(e, item)}>
          <Feather name="share" size={20} color="#666" />
        </TouchableOpacity>
      </View>

      {/* Divider */}
      <View style={styles.divider} />
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <FlatList data={posts} renderItem={renderItem} keyExtractor={(item) => item.id} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  postContainer: { paddingHorizontal: 16, paddingVertical: 12 },
  header: { flexDirection: 'row', alignItems: 'center', marginBottom: 4, gap: 8 },
  avatar: { width: 40, height: 40, borderRadius: 20 },
  name: { fontWeight: 'bold', fontSize: 15 },
  username: { fontSize: 13, color: '#666' },
  content: { fontSize: 15, lineHeight: 22, marginTop: 6, marginBottom: 10 },
  actions: { flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 4, marginTop: 8, marginBottom: 10 },
  actionButton: { flexDirection: 'row', alignItems: 'center', padding: 4 },
  countText: { marginLeft: 4, fontSize: 13, color: '#666' },
  divider: { height: 1, backgroundColor: '#eee', marginTop: 4 },
});

export default HomeScreen;
