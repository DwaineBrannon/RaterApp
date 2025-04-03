import React, { useRef, useEffect } from 'react';
import { Animated, View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';

export default function ProfileScreen() {
  // Indicates if we're viewing our own profile or someone else's
  const isOwnProfile = true;
  // Create an animated value to track vertical scroll
  const scrollY = useRef(new Animated.Value(0)).current;
  // Get the navigation object to dynamically change header options
  const navigation = useNavigation();

  useEffect(() => {
    // Listener to update header options based on scroll position.
    // If scroll value > 50, hide the header. Otherwise, show title "Profile".
    const listenerId = scrollY.addListener(({ value }) => {
      navigation.setOptions({
        headerTitle: value > 50 ? '' : 'Profile',
        headerShown: value <= 50,
      });
    });
    // Clean up the listener when component unmounts
    return () => scrollY.removeListener(listenerId);
  }, [navigation, scrollY]);

  return (
    <Animated.ScrollView
      style={styles.container}
      scrollEventThrottle={16} // Controls how frequently onScroll is fired
      onScroll={Animated.event(
        [{ nativeEvent: { contentOffset: { y: scrollY } } }], // Update scrollY on scroll event
        { useNativeDriver: false }
      )}
    >
      {/* Header Image Section */}
      <TouchableOpacity style={styles.headerContainer}>
        <Image
          source={{ uri: 'https://picsum.photos/800/200' }} // Placeholder header image
          style={styles.headerImage}
          resizeMode="cover"
        />
        <Text style={styles.uploadHeaderText}>Edit</Text> {/* 'Edit' overlay for header image */}
      </TouchableOpacity>

      {/* Profile Picture Section */}
      <View style={[styles.profilePicContainer, { position: 'relative' }]}>
        <TouchableOpacity>
          <Image
            source={{ uri: 'https://picsum.photos/150' }} // Placeholder profile picture
            style={styles.profilePic}
          />
          <Ionicons
            name="camera"
            size={24}
            color="grey"
            style={styles.cameraIcon} // Camera icon placed over the profile picture
          />
        </TouchableOpacity>
      </View>

      {/* Bio Section */}
      <View style={styles.bioContainer}>
        <Text style={styles.bioText}>
          This is your bio. Write something interesting about yourself! {/* Biography text */}
        </Text>
        {isOwnProfile && (
          <TouchableOpacity style={styles.editButton}>
            <Text style={styles.editButtonText}>Edit Profile</Text> {/* Button to edit profile info */}
          </TouchableOpacity>
        )}
      </View>

      {/* Top Albums Section */}
      <View style={styles.topSection}>
        <Text style={styles.sectionTitle}>Top 8</Text>
        <View style={styles.albumsContainer}>
          {
            // Display 8 album items using placeholder images
            [...Array(8)].map((_, index) => (
              <View key={index} style={styles.albumItem}>
                <Image
                  source={{
                    uri: `https://picsum.photos/seed/album${index + 1}/100/100`, // Unique album image for each album
                  }}
                  style={styles.albumImage}
                />
                <Text style={styles.albumTitle}>Album {index + 1}</Text> {/* Album label */}
              </View>
            ))
          }
        </View>
      </View>
    </Animated.ScrollView>
  );
}

const styles = StyleSheet.create({
  // Main container style
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  // Header container wrapping the header image and edit text
  headerContainer: {
    position: 'relative',
  },
  // Style for header image
  headerImage: {
    width: '100%',
    height: 150,
  },
  // Edit text overlay on the header image
  uploadHeaderText: {
    position: 'absolute',
    bottom: 10,
    right: 10,
    backgroundColor: 'rgba(54, 46, 59, 0.3)',
    color: '#fff',
    padding: 5,
    borderRadius: 5,
    fontSize: 12,
  },
  // Container for the profile picture, centered and overlapped with header image
  profilePicContainer: {
    alignItems: 'center',
    marginTop: -50,
  },
  // Profile picture style
  profilePic: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 3,
    borderColor: '#fff',
  },
  // Camera icon style positioned on the bottom right of the profile picture
  cameraIcon: {
    position: 'absolute',
    bottom: 1,
    right: -1,
    opacity: 0.58,
  },
  // Biography container style
  bioContainer: {
    padding: 20,
    alignItems: 'center',
  },
  // Biography text style
  bioText: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 10,
  },
  // Edit button style for the bio section
  editButton: {
    backgroundColor: 'rgba(135, 47, 190, 0.35)',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(135, 47, 190, 0.35)',
  },
  // Edit button text style
  editButtonText: {
    color: 'rgb(52, 52, 52)',
    fontSize: 14,
  },
  // Top section containing the album list
  topSection: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  // Section title (for Top 8)
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  // Container for album items, wrapping rows
  albumsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  // Individual album item container style
  albumItem: {
    width: '23%',
    marginBottom: 15,
    alignItems: 'center',
  },
  // Album image style
  albumImage: {
    width: 100,
    height: 100,
    borderRadius: 10,
  },
  // Album title style
  albumTitle: {
    marginTop: 5,
    fontSize: 14,
    textAlign: 'center',
  },
});
