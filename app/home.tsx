import { useFonts } from 'expo-font';
import { router } from 'expo-router';
import React from 'react';
import { Dimensions, Text, TouchableOpacity, View } from 'react-native';

export default function home(){
    const {width,height}=Dimensions.get("screen");
    const fontsLoaded = useFonts({
            "Poppins-ExtraBold.ttf":require("../assets/fonts/Poppins-ExtraBold.ttf")
    })
    const homeRoute = () =>{
        router.replace('/home')
    }
    const categoryRoute = () =>{
        router.replace('/category')
    }
    const unitsRoute = () =>{
        router.replace('/units')
    }

  return (
    <>
    <View style={{justifyContent:"center", alignItems:"center",top:60}}>
      <TouchableOpacity><Text style={{color:"white", fontSize:10, fontFamily:"Poppins-ExtraBold", top:25, left:10, backgroundColor:"#198754",padding:10,borderRadius:15}} onPress={categoryRoute}> Category  </Text></TouchableOpacity>
      <Text>{"\n"}</Text>
      <TouchableOpacity><Text style={{color:"white", fontSize:10, fontFamily:"Poppins-ExtraBold", top:25, left:10, backgroundColor:"#198754",padding:10,borderRadius:15}} onPress={unitsRoute}> Units of Measurement  </Text></TouchableOpacity>

    </View>
    </>
  )
}

