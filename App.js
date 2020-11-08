/** @format */

import { StatusBar } from 'expo-status-bar';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { StyleSheet, Text, View, Dimensions, FlatList, Animated, TouchableOpacity, Alert } from 'react-native';
import data from './data';
import { SimpleLineIcons } from '@expo/vector-icons';

const ICON_SIZE = 42;
const ITEM_HEIGHT = ICON_SIZE * 2;
const colors = {
	yellow: '#FFE8A3',
	dark: '#2D2D2D',
};
const { width, height } = Dimensions.get('window');

const Icon = React.memo(({ icon, color }) => {
	return <SimpleLineIcons name={icon} color={color} size={ICON_SIZE} />;
});

const Row = ({ item, color, showText }) => {
	return (
		<View
			style={{
				justifyContent: 'space-between',
				flexDirection: 'row',
        paddingVertical: 15,
        height: ITEM_HEIGHT,
			}}
		>
			{showText ? <Text style={{ fontSize: 30, color }}>{item.name}</Text> : <View></View>}
			<Icon icon={item.icon} color={color}></Icon>
		</View>
	);
};

const ButtonSelect = ({onPress}) =>{
  return (
    <View style={{
      position: 'absolute',
      bottom: ITEM_HEIGHT,
      left: 20,
    }}>
      <TouchableOpacity style={{
        backgroundColor: colors.yellow,
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 10
      }} onPress={onPress}>
        <Text style={{
          fontWeight: '700',
          fontSize: 20,
          color: colors.dark
        }}>Choice</Text>
      </TouchableOpacity>
    </View>
  )
}

const List = React.forwardRef(({ data, color, style, showText, onScroll, onItemSelected }, ref) => {
	return (
		<Animated.FlatList
      ref={ref}
			style={[{ paddingHorizontal: 20 }, style]}
			data={data}
			keyExtractor={(item) => item.name}
      scrollEventThrottle={10}
      onScroll={onScroll}
      scrollEnabled={!showText}
      onMomentumScrollEnd={(arg) => {
        
        if(onItemSelected) {
          const index = Math.round(arg.nativeEvent.contentOffset.y) / ITEM_HEIGHT
          onItemSelected(index);
        }
      }}
      contentContainerStyle={{
        paddingTop: showText ? 0 : height / 2 - ITEM_HEIGHT / 2,
        paddingBottom: showText ? 0 : height / 2 + ITEM_HEIGHT / 16,
      }}
			showsVerticalScrollIndicator={false}
			snapToInterval={ITEM_HEIGHT}
			decelerationRate='fast'
			renderItem={({ item }) => <Row color={color} item={item} showText={showText}></Row>}
		></Animated.FlatList>
	);
});

export default function App() {
  const [index, setIndex] = useState(0);
  const yellowRef = useRef();
  const darkRef = useRef();
  const scrollY = useRef(new Animated.Value(0)).current;

  const onScroll = Animated.event(
    [{nativeEvent: {contentOffset: {y: scrollY}}}],
    {useNativeDriver: true}
  )

  useEffect(() => {
    scrollY.addListener(arg => {
      if(yellowRef?.current) {
        yellowRef.current.scrollToOffset({
          offset: arg.value,
          animated: false
        })
      }
    })
  }, [])

  const onItemSelected = useCallback((index) => {
    setIndex(index);
  })

  const onPressAlert = () => {
    Alert.alert(data[index].name);
  }

	return (
		<View style={styles.container}>
			<StatusBar hidden></StatusBar>
			<List
        ref={darkRef}
				data={data}
        color={colors.yellow}
        onScroll={onScroll}
        onItemSelected={onItemSelected}
				style={[
					StyleSheet.absoluteFillObject
        ]}
        showText={false}
			></List>
			<List
        ref={yellowRef}
				data={data}
        color={colors.dark}
				showText
				style={{
					position: 'absolute',
					backgroundColor: colors.yellow,
					width,
					height: ITEM_HEIGHT,
					top: height / 2 - ITEM_HEIGHT / 2,
					// opacity: 0.3,
				}}
			></List>
      <ButtonSelect onPress={onPressAlert}></ButtonSelect>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: colors.dark,
	},
});
