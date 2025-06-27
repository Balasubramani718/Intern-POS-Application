import { loginUser } from '@/API/authAPI';
import { useFonts } from 'expo-font';
import { Stack, useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Dimensions, Image, StatusBar, Text, TextInput, TouchableOpacity, View } from 'react-native';

export default function login(){
const [username,setUsername]= useState("");
const [password,setPassword]= useState("");

const router = useRouter();
  const [fontsLoaded]= useFonts({
    "Poppins-ExtraBold.ttf":require("../assets/fonts/Poppins-ExtraBold.ttf")
  })
;
const {width, height} = Dimensions.get('window');

const  handleLogin= async ()=>{
  const result = await loginUser(username,password);
  if (result.success) {
    router.push('/home'); 
  } else {
    alert('Login failed: ' + result.message);
  }
};

  return (
    <>
      <Stack.Screen options={{headerShown:false}} />
      <StatusBar hidden={true}/>
      <View style={{backgroundColor:"#C0C0C0", width:width, height:height, alignItems:"center", justifyContent:"flex-start"}}>
        <View style={{width:width*4,height:height*0.55, backgroundColor:"#198754", transform:[{skewY:'30 deg'}], bottom:110}}></View>
         <Text style={{color:"white",fontSize:width*0.08,  fontFamily:"Poppins-ExtraBold", textAlign:"right", bottom:400}}>LOGIN HERE</Text>
        <Image source={require("../assets/images/profile.png")} style={{width:60, height:60, bottom:400}}/>
        <View style={{width:260,height:300, backgroundColor:"#E5E4E2", bottom:360, borderRadius:40, justifyContent:"flex-start", alignItems:"flex-start", paddingTop:80, paddingLeft:30 }}>
          <TextInput placeholder='Enter Username' placeholderTextColor={"#2E6C4F"}  style={{fontSize:20, borderBottomWidth:1,width:180,paddingBottom:-5, marginLeft:10}} value={username} onChangeText={setUsername}/>
          <Text>{"\n"}</Text>
          <TextInput placeholder='Enter Password' placeholderTextColor={"#2E6C4F"}  style={{fontSize:20, borderBottomWidth:1,width:180,paddingBottom:-5,marginLeft:10}} value={password} onChangeText={setPassword} secureTextEntry/>
          <TouchableOpacity style={{marginTop:20, marginLeft:60,paddingVertical:5, paddingHorizontal:20, backgroundColor:"#2E6C4F", borderRadius:20}} onPress={handleLogin}><Text style={{color:"white",fontFamily:"Poppins-ExtraBold", textAlign:"center"}}>Login</Text></TouchableOpacity>
        </View>
        
      </View>
      <Text style={{color:"#198574",fontSize:16,  fontFamily:"Poppins-ExtraBold",textAlign:"center", bottom:200}}>Have a seamless shopping experience</Text>
    </>
  )
}


