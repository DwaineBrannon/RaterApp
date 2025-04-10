import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
  View,
  Text,
  FlatList,
  Image,
  StyleSheet,
  Pressable,
  TouchableOpacity,
  ActivityIndicator,
  useWindowDimensions
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { TabView, SceneMap, TabBar } from 'react-native-tab-view';
import { SafeAreaView } from 'react-native-safe-area-context';

// Sample notification data
const sampleNotifications = [
  {
    id: '1',
    type: 'like',
    message: 'Charlie and 4 others liked your post.',
    timestamp: '1h ago',
    isRead: false,
    groupedCount: 5,
    likePreview: {
      displayName: 'Charlie',
      profilePicUri: 'https://picsum.photos/50',
      likedPostContent: 'This is a preview of the liked post content.',
      users: [
        { displayName: 'Charlie', profilePicUri: 'https://picsum.photos/50' },
        { displayName: 'Sam', profilePicUri: 'https://picsum.photos/51' },
        { displayName: 'Alex', profilePicUri: 'https://picsum.photos/52' },
        { displayName: 'Jordan', profilePicUri: 'https://picsum.photos/53' },
        { displayName: 'Taylor', profilePicUri: 'https://picsum.photos/54' },
      ]
    },
  },
  {
    id: '2',
    type: 'reply',
    message: 'Charlie replied to your post.',
    timestamp: '2h ago',
    isRead: true,
    replyPreview: {
      username: 'Charlie',
      postContent: 'Great work on your latest release!',
      profilePicUri: 'https://picsum.photos/50',
    },
  },
  {
    id: '3',
    type: 'quote',
    message: 'Charlie quoted your post.',
    timestamp: '3h ago',
    isRead: false,
  },
  {
    id: '4',
    type: 'release',
    message: 'Lady Gaga has a new release out. Rate it!',
    timestamp: '4h ago',
    isRead: true,
    releasePreview: {
      artistName: 'Lady Gaga',
      albumName: 'Chromatica',
      albumArtUri: 'https://picsum.photos/100',
      releaseDate: 'April 5, 2025',
    }
  },
  {
    id: '5',
    type: 'release',
    message: 'Beyoncé has a new release out. Rate it!',
    timestamp: '5h ago',
    isRead: false,
    releasePreview: {
      artistName: 'Beyoncé',
      albumName: 'Renaissance Part II',
      albumArtUri: 'https://picsum.photos/101',
      releaseDate: 'April 1, 2025',
    }
  },
];

const formatRelativeTime = timestamp => timestamp;

const RatingButtons = React.memo(({ albumName }) => (
  <View style={styles.ratingButtons}>
    {[1, 2, 3, 4, 5].map(rating => (
      <TouchableOpacity
        key={rating}
        style={styles.ratingButton}
        onPress={() => console.log(`Rated ${rating} stars for ${albumName}`)}
      >
        <Text style={styles.ratingButtonText}>{rating}</Text>
      </TouchableOpacity>
    ))}
  </View>
));

const ReplyActions = React.memo(() => (
  <View style={styles.replyActions}>
    <Pressable
      style={styles.actionButton}
      android_ripple={{ color: '#ddd' }}
      onPress={() => console.log('Reply pressed')}
    >
      <Ionicons name="chatbubble" size={20} color="gray" style={styles.actionIcon} />
    </Pressable>
    <Pressable
      style={styles.actionButton}
      android_ripple={{ color: '#ddd' }}
      onPress={() => console.log('Like pressed')}
    >
      <Ionicons name="heart" size={20} color="gray" style={styles.actionIcon} />
    </Pressable>
    <Pressable
      style={styles.actionButton}
      android_ripple={{ color: '#ddd' }}
      onPress={() => console.log('Repost pressed')}
    >
      <Ionicons name="git-compare-outline" size={20} color="gray" style={styles.actionIcon} />
    </Pressable>
    <Pressable
      style={styles.actionButton}
      android_ripple={{ color: '#ddd' }}
      onPress={() => console.log('Share pressed')}
    >
      <Ionicons name="share-social" size={20} color="gray" style={styles.actionIcon} />
    </Pressable>
  </View>
));

const EmptyNotifications = React.memo(({ tabIndex }) => (
  <View style={styles.emptyContainer}>
    <Ionicons name="notifications-off-outline" size={50} color="#ccc" />
    <Text style={styles.emptyText}>No notifications to show</Text>
    <Text style={styles.emptySubtext}>
      {tabIndex === 0 
        ? "You'll see activity related to your posts and new music releases here"
        : tabIndex === 1 
        ? "No mentions to show yet"
        : "No new releases to show yet"}
    </Text>
  </View>
));

const FooterLoader = React.memo(() => (
  <View style={styles.footerLoader}>
    <ActivityIndicator size="small" color="#0073ff" />
    <Text style={styles.footerText}>Loading more...</Text>
  </View>
));

function NotificationsScreen() {
  const layout = useWindowDimensions();
  const [index, setIndex] = useState(0);
  const [routes] = useState([
    { key: 'all', title: 'All' },
    { key: 'mentions', title: 'Mentions' },
    { key: 'releases', title: 'Releases' }
  ]);

  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const mentionsData = useMemo(() =>
    notifications.filter(item => item.type === 'reply'),
    [notifications]
  );
  
  const releasesData = useMemo(() =>
    notifications.filter(item => item.type === 'release'),
    [notifications]
  );

  const loadNotifications = useCallback((pageNum = 1, refresh = false) => {
    setLoading(true);
    setTimeout(() => {
      if (pageNum === 1) {
        setNotifications(refresh ? [] : sampleNotifications);
      } else if (pageNum === 2) {
        setNotifications(prev => [...prev, ...sampleNotifications.map(n => ({
          ...n,
          id: `${Date.now()}-${n.id}`,
          message: `Page 2: ${n.message}`
        }))]);
      } else {
        setHasMore(false);
      }
      setLoading(false);
      setRefreshing(false);
    }, 1000);
  }, []);

  useEffect(() => {
    loadNotifications();
  }, [loadNotifications]);

  const handleRefresh = useCallback(() => {
    setRefreshing(true);
    setPage(1);
    setHasMore(true);
    loadNotifications(1, true);
  }, [loadNotifications]);

  const handleLoadMore = useCallback(() => {
    if (!loading && hasMore) {
      const nextPage = page + 1;
      setPage(nextPage);
      loadNotifications(nextPage);
    }
  }, [loading, hasMore, page, loadNotifications]);

  const markAsRead = useCallback(id => {
    setNotifications(prev =>
      prev.map(notification =>
        notification.id === id
          ? { ...notification, isRead: true }
          : notification
      )
    );
  }, []);

  const renderLikePreview = useCallback(({ likePreview, groupedCount }) => {
    if (!likePreview) return null;
    return (
      <View style={styles.likePreview}>
        <View style={styles.likersContainer}>
          {likePreview.users && likePreview.users.slice(0, 3).map((user, index) => (
            <Image
              key={index}
              source={{ uri: user.profilePicUri }}
              style={[styles.likeProfilePic, { marginLeft: index > 0 ? -15 : 0 }]}
            />
          ))}
          {groupedCount && groupedCount > 3 && (
            <View style={styles.additionalLikersCircle}>
              <Text style={styles.additionalLikersText}>+{groupedCount - 3}</Text>
            </View>
          )}
        </View>
        <View style={styles.likeTextContainer}>
          <Text style={styles.likedPostContent}>{likePreview.likedPostContent}</Text>
        </View>
      </View>
    );
  }, []);

  const renderReplyPreview = useCallback(({ replyPreview }) => {
    if (!replyPreview) return null;
    return (
      <>
        <View style={styles.replyPreview}>
          <Image source={{ uri: replyPreview.profilePicUri }} style={styles.replyProfilePic} />
          <View style={styles.replyTextContainer}>
            <Text style={styles.replyUsername}>{replyPreview.username}</Text>
            <Text style={styles.replyContent}>{replyPreview.postContent}</Text>
          </View>
        </View>
        <ReplyActions />
      </>
    );
  }, []);

  const renderReleasePreview = useCallback(({ releasePreview }) => {
    if (!releasePreview) return null;
    return (
      <View style={styles.releasePreview}>
        <Image source={{ uri: releasePreview.albumArtUri }} style={styles.albumArt} />
        <View style={styles.releaseTextContainer}>
          <Text style={styles.artistName}>{releasePreview.artistName}</Text>
          <Text style={styles.albumName}>{releasePreview.albumName}</Text>
          <Text style={styles.releaseDate}>{releasePreview.releaseDate}</Text>
          <RatingButtons albumName={releasePreview.albumName} />
        </View>
      </View>
    );
  }, []);

  const renderNotification = useCallback(({ item }) => {
    let iconName = '';
    let extraContent = null;

    const handlePress = () => {
      console.log('Notification pressed:', item);
      markAsRead(item.id);
    };

    switch (item.type) {
      case 'like':
        iconName = 'heart';
        extraContent = renderLikePreview(item);
        break;
      case 'reply':
        iconName = '';
        extraContent = renderReplyPreview(item);
        break;
      case 'quote':
        iconName = 'git-compare-outline';
        break;
      case 'release':
        iconName = 'musical-notes';
        extraContent = renderReleasePreview(item);
        break;
      default:
        iconName = 'notifications';
        break;
    }

    if (item.type !== 'reply') {
      return (
        <Pressable
          style={[styles.notificationItem, !item.isRead && styles.unreadNotification]}
          android_ripple={{ color: '#ddd' }}
          onPress={handlePress}
        >
          {iconName !== '' && (
            <Ionicons
              name={iconName}
              size={24}
              color={!item.isRead ? "#0073ff" : "black"}
              style={styles.notificationIcon}
            />
          )}
          <View style={styles.notificationContent}>
            <Text style={[styles.notificationMessage, !item.isRead && styles.unreadText]}>
              {item.message}
            </Text>
            {extraContent}
            <Text style={styles.notificationTimestamp}>
              {formatRelativeTime(item.timestamp)}
            </Text>
          </View>
        </Pressable>
      );
    } else {
      return (
        <View style={[styles.notificationItem, !item.isRead && styles.unreadNotification]}>
          <View style={styles.notificationContent}>
            <Text style={[styles.notificationMessage, !item.isRead && styles.unreadText]}>
              {item.message}
            </Text>
            {extraContent}
            <Text style={styles.notificationTimestamp}>
              {formatRelativeTime(item.timestamp)}
            </Text>
          </View>
        </View>
      );
    }
  }, [markAsRead, renderLikePreview, renderReplyPreview, renderReleasePreview]);

  const AllTab = useCallback(() => (
    <FlatList
      data={notifications}
      keyExtractor={item => `all-${item.id}`}
      renderItem={renderNotification}
      contentContainerStyle={[styles.listContainer, notifications.length === 0 && { flex: 1 }]}
      ListEmptyComponent={<EmptyNotifications tabIndex={0} />}
      ListFooterComponent={loading && !refreshing ? <FooterLoader /> : null}
      onRefresh={handleRefresh}
      refreshing={refreshing}
      onEndReached={handleLoadMore}
      onEndReachedThreshold={0.5}
      removeClippedSubviews={true}
      initialNumToRender={8}
      maxToRenderPerBatch={5}
      windowSize={7}
    />
  ), [notifications, renderNotification, loading, refreshing, handleRefresh, handleLoadMore]);

  const MentionsTab = useCallback(() => (
    <FlatList
      data={mentionsData}
      keyExtractor={item => `mentions-${item.id}`}
      renderItem={renderNotification}
      contentContainerStyle={[styles.listContainer, mentionsData.length === 0 && { flex: 1 }]}
      ListEmptyComponent={<EmptyNotifications tabIndex={1} />}
      ListFooterComponent={loading && !refreshing ? <FooterLoader /> : null}
      onRefresh={handleRefresh}
      refreshing={refreshing}
      onEndReached={handleLoadMore}
      onEndReachedThreshold={0.5}
      removeClippedSubviews={true}
      initialNumToRender={8}
      maxToRenderPerBatch={5}
      windowSize={7}
    />
  ), [mentionsData, renderNotification, loading, refreshing, handleRefresh, handleLoadMore]);

  const ReleasesTab = useCallback(() => (
    <FlatList
      data={releasesData}
      keyExtractor={item => `releases-${item.id}`}
      renderItem={renderNotification}
      contentContainerStyle={[styles.listContainer, releasesData.length === 0 && { flex: 1 }]}
      ListEmptyComponent={<EmptyNotifications tabIndex={2} />}
      ListFooterComponent={loading && !refreshing ? <FooterLoader /> : null}
      onRefresh={handleRefresh}
      refreshing={refreshing}
      onEndReached={handleLoadMore}
      onEndReachedThreshold={0.5}
      removeClippedSubviews={true}
      initialNumToRender={8}
      maxToRenderPerBatch={5}
      windowSize={7}
    />
  ), [releasesData, renderNotification, loading, refreshing, handleRefresh, handleLoadMore]);

  const renderScene = SceneMap({
    all: AllTab,
    mentions: MentionsTab,
    releases: ReleasesTab,
  });

  const renderTabBar = useCallback(props => (
    <TabBar
      {...props}
      indicatorStyle={styles.tabIndicator}
      style={styles.tabBar}
      activeColor="#0073ff"
      inactiveColor="#777"
      renderLabel={({ route, focused }) => (
        <Text style={[styles.tabLabel, { color: focused ? "#0073ff" : "#777" }]}>
          {route.title}
        </Text>
      )}
    />
  ), []);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
      <View style={styles.container}>
        <TabView
          navigationState={{ index, routes }}
          renderScene={renderScene}
          renderTabBar={renderTabBar}
          onIndexChange={setIndex}
          initialLayout={{ width: layout.width }}
          lazy
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  listContainer: {
    paddingVertical: 10,
  },
  notificationItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  unreadNotification: {
    backgroundColor: '#f0f7ff',
  },
  unreadText: {
    fontWeight: '600',
  },
  notificationIcon: {
    marginRight: 12,
    marginTop: 4,
  },
  notificationContent: {
    flex: 1,
  },
  notificationMessage: {
    fontSize: 16,
    color: '#333',
  },
  notificationTimestamp: {
    fontSize: 12,
    color: '#999',
    marginTop: 4,
  },
  likePreview: {
    flexDirection: 'row',
    marginTop: 8,
    backgroundColor: '#f5f5f5',
    padding: 10,
    borderRadius: 10,
  },
  likersContainer: {
    flexDirection: 'row',
    marginRight: 10,
  },
  likeProfilePic: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 2,
    borderColor: '#fff',
  },
  additionalLikersCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#e0e0e0',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: -15,
    borderWidth: 2,
    borderColor: '#fff',
  },
  additionalLikersText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#666',
  },
  likeTextContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  likedPostContent: {
    fontSize: 14,
    color: '#555',
  },
  replyPreview: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
    backgroundColor: '#f9f9f9',
    padding: 10,
    borderRadius: 10,
  },
  replyProfilePic: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 8,
  },
  replyTextContainer: {
    flex: 1,
  },
  replyUsername: {
    fontWeight: 'bold',
    fontSize: 14,
    color: '#333',
  },
  replyContent: {
    fontSize: 14,
    color: '#555',
  },
  replyActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
    maxWidth: 200,
  },
  actionButton: {
    padding: 8,
    borderRadius: 4,
  },
  actionIcon: {
    marginHorizontal: 4,
  },
  releasePreview: {
    flexDirection: 'row',
    marginTop: 8,
    padding: 10,
    backgroundColor: '#f5f5f5',
    borderRadius: 10,
    overflow: 'hidden',
  },
  albumArt: {
    width: 80,
    height: 80,
    borderRadius: 4,
  },
  releaseTextContainer: {
    marginLeft: 12,
    flex: 1,
  },
  artistName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  albumName: {
    fontSize: 14,
    color: '#555',
    marginBottom: 2,
  },
  releaseDate: {
    fontSize: 12,
    color: '#777',
    marginBottom: 10,
  },
  ratingButtons: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
  },
  ratingButton: {
    width: 28,
    height: 28,
    backgroundColor: '#0073ff',
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 6,
  },
  ratingButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 12,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#555',
    marginTop: 16,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#888',
    textAlign: 'center',
    marginTop: 8,
    maxWidth: '80%',
  },
  footerLoader: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  footerText: {
    marginLeft: 8,
    color: '#0073ff',
  },
  tabBar: {
    backgroundColor: '#fff',
    elevation: 0,
    shadowOpacity: 0,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  tabIndicator: {
    backgroundColor: '#0073ff',
    height: 2,
  },
  tabLabel: {
    textTransform: 'none',
    fontWeight: '600',
    fontSize: 15,
  },
});

export default React.memo(NotificationsScreen);