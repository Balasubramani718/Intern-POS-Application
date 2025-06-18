import { router, Stack } from "expo-router";
import { Dimensions, StatusBar, Text, TouchableOpacity, View } from "react-native";

  export default function RootLayout() {
        const {width,height}=Dimensions.get("screen");
         const homeRoute = () =>{
                router.replace('/home')
            }
    
  return (
    <>
    <View style={{backgroundColor:"#198754", width:width, height:height*0.1, flexDirection:"row-reverse", padding:30}}>
      <TouchableOpacity><Text style={{color:"white", fontSize:10, fontFamily:"Poppins-ExtraBold", top:32, right:7, borderBottomWidth:2, borderBottomColor:"#D6F4C3"}} onPress={homeRoute}>  Home  </Text></TouchableOpacity>
      <Text style={{color:"white", fontSize:22, fontFamily:"Poppins-ExtraBold",top:20, left:width*0.45}}>KRSS Mart</Text>
    </View>
      <Stack screenOptions={{headerShown:false}} />
      <StatusBar hidden={true}/>
    </>
  );
}


