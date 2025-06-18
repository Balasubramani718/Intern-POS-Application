import { Ionicons } from "@expo/vector-icons";
import { useFonts } from "expo-font";
import React, { useState } from "react";
import { Dimensions, Modal, ScrollView, Text, TextInput, TouchableOpacity, View } from "react-native";

interface FormData { shortCode: string; descriptionEN: string; descriptionTA: string; active: string; }

export default function Category() {
  const { width, height } = Dimensions.get("screen");
  const [fontsLoaded] = useFonts({ "Poppins-ExtraBold": require("../assets/fonts/Poppins-ExtraBold.ttf") });
  const [isModalVisible, setIsModalVisible] = useState(false); const [filterModalVisible, setFilterModalVisible] = useState(false); const [actionModalVisible, setActionModalVisible] = useState(false);
  const [formData, setFormData] = useState<FormData>({ shortCode: "", descriptionEN: "", descriptionTA: "", active: "Active" });
  const [filterData, setFilterData] = useState<FormData>({ shortCode: "", descriptionEN: "", descriptionTA: "", active: "" });
  const [categories, setCategories] = useState<FormData[]>([]); const [visibleCount, setVisibleCount] = useState(5); const [editIndex, setEditIndex] = useState<number | null>(null); const [actionIndex, setActionIndex] = useState<number | null>(null);
  const handleInputChange = (field: keyof FormData, value: string) => { setFormData({ ...formData, [field]: value }); };
  const handleFilterChange = (field: keyof FormData, value: string) => { setFilterData({ ...filterData, [field]: value }); };
  const handleEdit = (index: number) => { setFormData(categories[index]); setEditIndex(index); setIsModalVisible(true); setActionModalVisible(false); };
  const handleDelete = (index: number) => { setCategories(categories.filter((_, i) => i !== index)); setActionModalVisible(false); };
  const handleSubmit = () => {
    if (formData.shortCode && formData.descriptionEN && formData.descriptionTA) {
      if (editIndex !== null) { const updatedCategories = [...categories]; updatedCategories[editIndex] = formData; setCategories(updatedCategories); }
      else { setCategories([...categories, formData]); }
      setFormData({ shortCode: "", descriptionEN: "", descriptionTA: "", active: "Active" }); setEditIndex(null); setIsModalVisible(false);
    } else { alert("Please fill all text fields"); }
  };
  const handleCancel = () => { setFormData({ shortCode: "", descriptionEN: "", descriptionTA: "", active: "Active" }); setEditIndex(null); setIsModalVisible(false); };
  const handleApplyFilter = () => {
    setFilterModalVisible(false);
  };
  const handleClearFilter = () => { setFilterData({ shortCode: "", descriptionEN: "", descriptionTA: "", active: "" }); setFilterModalVisible(false); };
  const handleShowMore = () => { setVisibleCount(visibleCount + 5); };
  const filteredCategories = categories.filter(item => (
    (!filterData.shortCode || item.shortCode.toLowerCase().includes(filterData.shortCode.toLowerCase())) &&
    (!filterData.descriptionEN || item.descriptionEN.toLowerCase().includes(filterData.descriptionEN.toLowerCase())) &&
    (!filterData.descriptionTA || item.descriptionTA.toLowerCase().includes(filterData.descriptionTA.toLowerCase())) &&
    (!filterData.active || item.active === filterData.active)
  ));
  if (!fontsLoaded) { return null; }
  return (
    <>
      <View style={{ backgroundColor: "#D6F4C3", paddingVertical: 10 }}>
        <Text style={{ fontFamily: "Poppins-ExtraBold", color: "black", textAlign: "center", fontSize: 20 }}>Category</Text>
      </View>
      <View style={{ flex: 1, padding: 10 }}>
        <TouchableOpacity style={{ alignItems: "center", backgroundColor: "#198754", width: width * 0.6, height: height * 0.045, padding: 10, alignSelf: "center", borderRadius: 30, flexDirection: "row", justifyContent: "center" }} onPress={() => setFilterModalVisible(true)}>
          <Text style={{ color: "white", fontFamily: "Poppins-ExtraBold", marginRight: 5 }}>Filter</Text>
          <Ionicons name="filter" size={15} color="white" />
        </TouchableOpacity>
        <ScrollView style={{ marginTop: 20 }}>
          {filteredCategories.slice(0, visibleCount).map((item, index) => (
            <View key={index} style={{ backgroundColor: "#D6F4C3", padding: 15, marginVertical: 10, marginHorizontal: 20, borderRadius: 10, shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 5, elevation: 3, position: "relative" }}>
              <TouchableOpacity style={{ position: "absolute", top: 0, right: 0, padding: 10, width: 40, height: 40, justifyContent: "center", alignItems: "center" }} onPress={() => { setActionIndex(index); setActionModalVisible(true); }}>
                <Ionicons name="ellipsis-vertical" size={20} color="#198754" />
              </TouchableOpacity>
              <Text style={{ fontFamily: "Poppins-ExtraBold", fontSize: 14, color: "black", marginBottom: 5 }}>Short Code: <Text style={{ color: "#198754" }}>{item.shortCode}</Text></Text>
              <Text style={{ fontFamily: "Poppins-ExtraBold", fontSize: 14, color: "black", marginBottom: 5 }}>Description EN: <Text style={{ color: "#198754" }}>{item.descriptionEN}</Text></Text>
              <Text style={{ fontFamily: "Poppins-ExtraBold", fontSize: 14, color: "black", marginBottom: 5 }}>Description TA: <Text style={{ color: "#198754" }}>{item.descriptionTA}</Text></Text>
              <Text style={{ fontFamily: "Poppins-ExtraBold", fontSize: 14, color: "black", marginBottom: 5 }}>Status: <Text style={{ color: "#198754" }}>{item.active}</Text></Text>
            </View>
          ))}
          {filteredCategories.length > 5 && visibleCount < filteredCategories.length && (
            <TouchableOpacity style={{ backgroundColor: "#198754", padding: 10, borderRadius: 15, marginVertical: 10, width: width * 0.6, alignSelf: "center", alignItems: "center" }} onPress={handleShowMore}>
              <Text style={{ color: "white", fontFamily: "Poppins-ExtraBold", fontSize: 16 }}>Show More</Text>
            </TouchableOpacity>
          )}
        </ScrollView>
        <TouchableOpacity style={{ position: "absolute", bottom: height * 0.1, left: width * 0.8, backgroundColor: "#198754", width: 60, height: 60, borderRadius: 50, justifyContent: "center", alignItems: "center" }} onPress={() => { setFormData({ shortCode: "", descriptionEN: "", descriptionTA: "", active: "Active" }); setEditIndex(null); setIsModalVisible(true); }}>
          <Ionicons name="add" size={40} color="white" />
        </TouchableOpacity>
        <Modal visible={isModalVisible} animationType="slide" transparent={true} onRequestClose={handleCancel}>
          <View style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "rgba(0,0,0,0.5)" }}>
            <View style={{ backgroundColor: "white", padding: 20, borderRadius: 10, width: "80%" }}>
              <Text style={{ fontFamily: "Poppins-ExtraBold", fontSize: 18, textAlign: "center", marginBottom: 10 }}>{editIndex !== null ? "Edit Category" : "Add New Category"}</Text>
              <TextInput style={{ borderWidth: 1, borderColor: "#ccc", borderRadius: 5, padding: 10, marginVertical: 5, fontFamily: "Poppins-ExtraBold" }} placeholder="Short Code" value={formData.shortCode} onChangeText={(text: string) => handleInputChange("shortCode", text)} />
              <TextInput style={{ borderWidth: 1, borderColor: "#ccc", borderRadius: 5, padding: 10, marginVertical: 5, fontFamily: "Poppins-ExtraBold" }} placeholder="Description EN" value={formData.descriptionEN} onChangeText={(text: string) => handleInputChange("descriptionEN", text)} />
              <TextInput style={{ borderWidth: 1, borderColor: "#ccc", borderRadius: 5, padding: 10, marginVertical: 5, fontFamily: "Poppins-ExtraBold" }} placeholder="Description TA" value={formData.descriptionTA} onChangeText={(text: string) => handleInputChange("descriptionTA", text)} />
              <View style={{ marginVertical: 10 }}>
                <Text style={{ fontFamily: "Poppins-ExtraBold", fontSize: 14, marginBottom: 5 }}>Status:</Text>
                <TouchableOpacity style={{ flexDirection: "row", alignItems: "center", marginVertical: 5 }} onPress={() => handleInputChange("active", "Active")}>
                  <View style={formData.active === "Active" ? { width: 20, height: 20, borderRadius: 10, backgroundColor: "#198754", marginRight: 10 } : { width: 20, height: 20, borderRadius: 10, borderWidth: 1, borderColor: "#ccc", marginRight: 10 }} />
                  <Text style={{ fontFamily: "Poppins-ExtraBold", fontSize: 14 }}>Active</Text>
                </TouchableOpacity>
                <TouchableOpacity style={{ flexDirection: "row", alignItems: "center", marginVertical: 5 }} onPress={() => handleInputChange("active", "Inactive")}>
                  <View style={formData.active === "Inactive" ? { width: 20, height: 20, borderRadius: 10, backgroundColor: "#198754", marginRight: 10 } : { width: 20, height: 20, borderRadius: 10, borderWidth: 1, borderColor: "#ccc", marginRight: 10 }} />
                  <Text style={{ fontFamily: "Poppins-ExtraBold", fontSize: 14 }}>Inactive</Text>
                </TouchableOpacity>
              </View>
              <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                <TouchableOpacity style={{ padding: 10, borderRadius: 5, marginTop: 10, width: "45%", alignItems: "center", backgroundColor: "#198754" }} onPress={handleSubmit}>
                  <Text style={{ color: "white", fontFamily: "Poppins-ExtraBold" }}>Submit</Text>
                </TouchableOpacity>
                <TouchableOpacity style={{ padding: 10, borderRadius: 5, marginTop: 10, width: "45%", alignItems: "center", backgroundColor: "#dc3545" }} onPress={handleCancel}>
                  <Text style={{ color: "white", fontFamily: "Poppins-ExtraBold" }}>Cancel</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
        <Modal visible={filterModalVisible} animationType="slide" transparent={true} onRequestClose={() => setFilterModalVisible(false)}>
          <View style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "rgba(0,0,0,0.5)" }}>
            <View style={{ backgroundColor: "white", padding: 20, borderRadius: 10, width: "80%" }}>
              <Text style={{ fontFamily: "Poppins-ExtraBold", fontSize: 18, textAlign: "center", marginBottom: 10 }}>Filter Categories</Text>
              <TextInput style={{ borderWidth: 1, borderColor: "#ccc", borderRadius: 5, padding: 10, marginVertical: 5, fontFamily: "Poppins-ExtraBold" }} placeholder="Short Code" value={filterData.shortCode} onChangeText={(text: string) => handleFilterChange("shortCode", text)} />
              <TextInput style={{ borderWidth: 1, borderColor: "#ccc", borderRadius: 5, padding: 10, marginVertical: 5, fontFamily: "Poppins-ExtraBold" }} placeholder="Description EN" value={filterData.descriptionEN} onChangeText={(text: string) => handleFilterChange("descriptionEN", text)} />
              <TextInput style={{ borderWidth: 1, borderColor: "#ccc", borderRadius: 5, padding: 10, marginVertical: 5, fontFamily: "Poppins-ExtraBold" }} placeholder="Description TA" value={filterData.descriptionTA} onChangeText={(text: string) => handleFilterChange("descriptionTA", text)} />
              <View style={{ marginVertical: 10 }}>
                <Text style={{ fontFamily: "Poppins-ExtraBold", fontSize: 14, marginBottom: 5 }}>Status:</Text>
                <TouchableOpacity style={{ flexDirection: "row", alignItems: "center", marginVertical: 5 }} onPress={() => handleFilterChange("active", "")}>
                  <View style={filterData.active === "" ? { width: 20, height: 20, borderRadius: 10, backgroundColor: "#198754", marginRight: 10 } : { width: 20, height: 20, borderRadius: 10, borderWidth: 1, borderColor: "#ccc", marginRight: 10 }} />
                  <Text style={{ fontFamily: "Poppins-ExtraBold", fontSize: 14 }}>Any</Text>
                </TouchableOpacity>
                <TouchableOpacity style={{ flexDirection: "row", alignItems: "center", marginVertical: 5 }} onPress={() => handleFilterChange("active", "Active")}>
                  <View style={filterData.active === "Active" ? { width: 20, height: 20, borderRadius: 10, backgroundColor: "#198754", marginRight: 10 } : { width: 20, height: 20, borderRadius: 10, borderWidth: 1, borderColor: "#ccc", marginRight: 10 }} />
                  <Text style={{ fontFamily: "Poppins-ExtraBold", fontSize: 14 }}>Active</Text>
                </TouchableOpacity>
                <TouchableOpacity style={{ flexDirection: "row", alignItems: "center", marginVertical: 5 }} onPress={() => handleFilterChange("active", "Inactive")}>
                  <View style={filterData.active === "Inactive" ? { width: 20, height: 20, borderRadius: 10, backgroundColor: "#198754", marginRight: 10 } : { width: 20, height: 20, borderRadius: 10, borderWidth: 1, borderColor: "#ccc", marginRight: 10 }} />
                  <Text style={{ fontFamily: "Poppins-ExtraBold", fontSize: 14 }}>Inactive</Text>
                </TouchableOpacity>
              </View>
              <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                <TouchableOpacity style={{ padding: 10, borderRadius: 5, marginTop: 10, width: "45%", alignItems: "center", backgroundColor: "#198754" }} onPress={handleApplyFilter}>
                  <Text style={{ color: "white", fontFamily: "Poppins-ExtraBold" }}>Apply Filter</Text>
                </TouchableOpacity>
                <TouchableOpacity style={{ padding: 10, borderRadius: 5, marginTop: 10, width: "45%", alignItems: "center", backgroundColor: "#dc3545" }} onPress={handleClearFilter}>
                  <Text style={{ color: "white", fontFamily: "Poppins-ExtraBold" }}>Clear Filter</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
        <Modal visible={actionModalVisible} animationType="fade" transparent={true} onRequestClose={() => setActionModalVisible(false)}>
          <View style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "rgba(0,0,0,0.5)" }}>
            <View style={{ backgroundColor: "white", padding: 20, borderRadius: 10, width: "60%" }}>
              <TouchableOpacity style={{ padding: 10, borderRadius: 5, marginVertical: 5, alignItems: "center", backgroundColor: "#198754" }} onPress={() => actionIndex !== null && handleEdit(actionIndex)}>
                <Text style={{ color: "white", fontFamily: "Poppins-ExtraBold" }}>Edit</Text>
              </TouchableOpacity>
              <TouchableOpacity style={{ padding: 10, borderRadius: 5, marginVertical: 5, alignItems: "center", backgroundColor: "#dc3545" }} onPress={() => actionIndex !== null && handleDelete(actionIndex)}>
                <Text style={{ color: "white", fontFamily: "Poppins-ExtraBold" }}>Delete</Text>
              </TouchableOpacity>
              <TouchableOpacity style={{ padding: 10, borderRadius: 5, marginVertical: 5, alignItems: "center", backgroundColor: "#6c757d" }} onPress={() => setActionModalVisible(false)}>
                <Text style={{ color: "white", fontFamily: "Poppins-ExtraBold" }}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </View>
    </>
  );
}