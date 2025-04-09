import React, { useRef, useEffect } from 'react';
import { Animated, View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';

export default function ProfileScreen() {
  const isOwnProfile = true;
  const scrollY = useRef(new Animated.Value(0)).current;
  const navigation = useNavigation();

  useEffect(() => {
    const listenerId = scrollY.addListener(({ value }) => {
      navigation.setOptions({
        headerTitle: value > 50 ? '' : 'Profile',
        headerShown: value <= 50,
      });
    });
    return () => scrollY.removeListener(listenerId);
  }, [navigation, scrollY]);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
      <Animated.ScrollView
        style={styles.container}
        scrollEventThrottle={16}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: false }
        )}
      >
        {/* Header Image Section */}
        <View style={styles.headerContainer}>
          <TouchableOpacity>
            <Image
              source={{ uri: 'https://picsum.photos/800/200' }}
              style={styles.headerImage}
              resizeMode="cover"
            />
          </TouchableOpacity>
          <TouchableOpacity style={styles.uploadHeaderTextContainer}>
            <Text style={styles.uploadHeaderText}>Edit</Text>
          </TouchableOpacity>
        </View>

        {/* Profile Picture Section */}
        <View style={styles.profilePicContainer}>
          <TouchableOpacity>
            <Image
              source={{ uri: 'https://picsum.photos/150' }}
              style={styles.profilePic}
            />
            <Ionicons
              name="camera"
              size={24}
              color="grey"
              style={styles.cameraIcon}
            />
          </TouchableOpacity>
        </View>

        {/* Bio Section */}
        <View style={styles.bioContainer}>
          <Text style={styles.bioText}>
            This is your bio. Write something interesting about yourself!
          </Text>
          {isOwnProfile && (
            <TouchableOpacity style={styles.editButton}>
              <Text style={styles.editButtonText}>Edit Profile</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Top Albums Section */}
        <View style={styles.topSection}>
          <Text style={styles.sectionTitle}>Top 8</Text>
          <View style={styles.albumsContainer}>
            {[...Array(8)].map((_, index) => (
              <TouchableOpacity key={`album-${index}`} style={styles.albumItem}>
                <Image
                  source={{
                    uri: `https://picsum.photos/seed/album${index + 1}/100/100`,
                  }}
                  style={styles.albumImage}
                />
                <Text style={styles.albumTitle}>Album {index + 1}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </Animated.ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  headerContainer: {
    position: 'relative',
  },
  headerImage: {
    width: '100%',
    height: 150,
  },
  uploadHeaderTextContainer: {
    position: 'absolute',
    bottom: 10,
    right: 10,
    backgroundColor: 'rgba(54, 46, 59, 0.3)',
    borderRadius: 5,
    padding: 5,
  },
  uploadHeaderText: {
    color: '#fff',
    fontSize: 12,
  },
  profilePicContainer: {
    alignItems: 'center',
    marginTop: -50,
  },
  profilePic: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 3,
    borderColor: '#fff',
  },
  cameraIcon: {
    position: 'absolute',
    bottom: 1,
    right: -1,
    opacity: 0.58,
  },
  bioContainer: {
    padding: 20,
    alignItems: 'center',
  },
  bioText: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 10,
  },
  editButton: {
    backgroundColor: 'rgba(135, 47, 190, 0.35)',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(135, 47, 190, 0.35)',
  },
  editButtonText: {
    color: 'rgb(52, 52, 52)',
    fontSize: 14,
  },
  topSection: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  albumsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  albumItem: {
    width: '23%',
    marginBottom: 15,
    alignItems: 'center',
  },
  albumImage: {
    width: 100,
    height: 100,
    borderRadius: 10,
  },
  albumTitle: {
    marginTop: 5,
    fontSize: 14,
    textAlign: 'center',
  },
});
