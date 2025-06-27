import { useFonts } from 'expo-font';
import { Stack, useRouter } from 'expo-router';
import React, { useEffect } from 'react';
import { ActivityIndicator, Dimensions, Image, StatusBar, StyleSheet, Text, View } from 'react-native';

export default function Index(){
  const router = useRouter();
    const [fontsLoaded] = useFonts({
    'Poppins-ExtraBold': require('../assets/fonts/Poppins-ExtraBold.ttf')
  });

  useEffect(()=> {
    const timeout = setTimeout(()=>{
         router.replace('./login');
},4000)
  },[]
)
  const {width, height} = Dimensions.get('screen');
  
  if (!fontsLoaded) {
    return <ActivityIndicator size="large" style={{ flex: 1 }} />;
  }
  return (
    <>
     <Stack.Screen options={{ headerShown: false }} />
     <StatusBar hidden={true} />
    <View style={{
        flex: 1,
        justifyContent: "flex-start",
        alignItems: "center",
        backgroundColor: "#D6F4C3",
      }
    }
    >
        <View style={{
        flex: 1,
        justifyContent: "flex-start",
        alignItems: "flex-end",
        backgroundColor: "#198754",
        width:width, height:height*0.7,
        marginBottom:width*0.68,
        borderBottomLeftRadius:width*0.75,
        }
    }
    >
        <Text style={{color:"white", fontSize:width*0.08, marginTop:width*0.55,marginRight:width*0.028, fontFamily:"Poppins-ExtraBold", textAlign:"right"}}>Let's Dive</Text>
        <Text style={{color:"#D6F4C3",fontSize:width*0.025, marginTop:width*0.01,fontWeight:'200',marginRight:width*0.028, fontFamily:"Poppins-ExtraBold"}}>into Immersive shopping experience</Text>
        <Image source={require("../assets/images/Welcomebg.png")} style={{marginTop:height*(-0.05), width:width*0.7, height:height*0.54, marginLeft:120 }}/>
        <Text style={{color:"#2E6C4F", fontFamily:"Poppins-ExtraBold",paddingRight:width*0.22, fontSize:width*0.04}}>Welcome To <Text style={{color:"#8C8374", fontFamily:"Poppins-ExtraBold", fontSize:24}}>KRSS</Text> Mart</Text>
      
    </View>
    </View>
    </>
  )

}



const styles = StyleSheet.create({})