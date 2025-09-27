import { Ionicons } from "@expo/vector-icons";
import { useFonts } from "expo-font";
import React, { useState } from "react";
import { Dimensions, Modal, ScrollView, Text, TextInput, TouchableOpacity, View } from "react-native";

interface FormData {
  shortCode: string;
  descriptionEN: string;
  descriptionTA: string;
  active: string;
}

interface VersionData {
  versionCode: string;
  versionName: string;
  quantity: string;
  descriptionEN: string;
  descriptionTA: string;
  active: string;
  versionStatus: string;
  releaseDate: string;
  expirationDate: string;
  batchNumber: string;
  categoryIndex: number;
}

export default function Category() {
  const { width, height } = Dimensions.get("screen");
  const [fontsLoaded] = useFonts({ "Poppins-ExtraBold": require("../assets/fonts/Poppins-ExtraBold.ttf") });
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [filterModalVisible, setFilterModalVisible] = useState(false);
  const [actionModalVisible, setActionModalVisible] = useState(false);
  const [viewModalVisible, setViewModalVisible] = useState(false);
  const [isVersionModalVisible, setIsVersionModalVisible] = useState(false);

  const [formData, setFormData] = useState<FormData>({ shortCode: "", descriptionEN: "", descriptionTA: "", active: "Active" });
  const [filterData, setFilterData] = useState<FormData>({ shortCode: "", descriptionEN: "", descriptionTA: "", active: "" });
  const [categories, setCategories] = useState<FormData[]>([]);
  const [versions, setVersions] = useState<VersionData[]>([]);
  const [versionFormData, setVersionFormData] = useState<VersionData>({
    versionCode: "",
    versionName: "",
    quantity: "",
    descriptionEN: "",
    descriptionTA: "",
    active: "Active",
    versionStatus: "",
    releaseDate: "",
    expirationDate: "",
    batchNumber: "",
    categoryIndex: -1,
  });

  const [visibleCount, setVisibleCount] = useState(5);
  const [editIndex, setEditIndex] = useState<number | null>(null);
  const [actionIndex, setActionIndex] = useState<number | null>(null);
  const [selectedCategoryIndex, setSelectedCategoryIndex] = useState<number | null>(null);
  const [selectedVersionIndex, setSelectedVersionIndex] = useState<number | null>(null);
  const [activeTab, setActiveTab] = useState<"Category" | "Category Version">("Category");

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData({ ...formData, [field]: value });
  };

  const handleFilterChange = (field: keyof FormData, value: string) => {
    setFilterData({ ...filterData, [field]: value });
  };

  const handleVersionInputChange = (field: keyof VersionData, value: string) => {
    setVersionFormData({ ...versionFormData, [field]: value });
  };

  const handleSubmit = () => {
    if (formData.shortCode && formData.descriptionEN && formData.descriptionTA) {
      if (editIndex !== null) {
        const updatedCategories = [...categories];
        updatedCategories[editIndex] = formData;
        setCategories(updatedCategories);
      } else {
        setCategories([...categories, formData]);
      }
      setFormData({ shortCode: "", descriptionEN: "", descriptionTA: "", active: "Active" });
      setEditIndex(null);
      setIsModalVisible(false);
      setViewModalVisible(true);
      setSelectedCategoryIndex(categories.length);
    } else {
      alert("Please fill all text fields");
    }
  };

  const handleVersionSubmit = () => {
    if (
      versionFormData.versionCode &&
      versionFormData.versionName &&
      versionFormData.quantity &&
      versionFormData.descriptionEN &&
      versionFormData.descriptionTA &&
      versionFormData.versionStatus &&
      versionFormData.releaseDate &&
      versionFormData.expirationDate &&
      versionFormData.batchNumber
    ) {
      setVersions([
        ...versions,
        { ...versionFormData, categoryIndex: selectedCategoryIndex || 0 },
      ]);
      setVersionFormData({
        versionCode: "",
        versionName: "",
        quantity: "",
        descriptionEN: "",
        descriptionTA: "",
        active: "Active",
        versionStatus: "",
        releaseDate: "",
        expirationDate: "",
        batchNumber: "",
        categoryIndex: -1,
      });
      setIsVersionModalVisible(false);
    } else {
      alert("Please fill all text fields");
    }
  };

  const handleCancel = () => {
    setFormData({ shortCode: "", descriptionEN: "", descriptionTA: "", active: "Active" });
    setEditIndex(null);
    setIsModalVisible(false);
  };

  const handleVersionCancel = () => {
    setVersionFormData({
      versionCode: "",
      versionName: "",
      quantity: "",
      descriptionEN: "",
      descriptionTA: "",
      active: "Active",
      versionStatus: "",
      releaseDate: "",
      expirationDate: "",
      batchNumber: "",
      categoryIndex: -1,
    });
    setIsVersionModalVisible(false);
  };

  const handleApplyFilter = () => {
    setFilterModalVisible(false);
  };

  const handleClearFilter = () => {
    setFilterData({ shortCode: "", descriptionEN: "", descriptionTA: "", active: "" });
    setFilterModalVisible(false);
  };

  const handleShowMore = () => {
    setVisibleCount(visibleCount + 5);
  };

  const handleDelete = (index: number) => {
    setCategories(categories.filter((_, i) => i !== index));
    setActionModalVisible(false);
    setViewModalVisible(false);
  };

  const filteredCategories = categories.filter(item =>
    (!filterData.shortCode || item.shortCode.toLowerCase().includes(filterData.shortCode.toLowerCase())) &&
    (!filterData.descriptionEN || item.descriptionEN.toLowerCase().includes(filterData.descriptionEN.toLowerCase())) &&
    (!filterData.descriptionTA || item.descriptionTA.toLowerCase().includes(filterData.descriptionTA.toLowerCase())) &&
    (!filterData.active || item.active === filterData.active)
  );

  const filteredVersions = versions.filter(v => v.categoryIndex === selectedCategoryIndex);

  if (!fontsLoaded) return null;

  return (
    <>
      <View style={{ backgroundColor: "#D6F4C3", paddingVertical: 10 }}>
        <Text style={{ fontFamily: "Poppins-ExtraBold", color: "black", textAlign: "center", fontSize: 20 }}>
          Category
        </Text>
      </View>

      <View style={{ flex: 1, padding: 10 }}>
        <TouchableOpacity
          style={{
            alignItems: "center",
            backgroundColor: "#198754",
            width: width * 0.6,
            height: height * 0.045,
            padding: 10,
            alignSelf: "center",
            borderRadius: 30,
            flexDirection: "row",
            justifyContent: "center",
          }}
          onPress={() => setFilterModalVisible(true)}
        >
          <Text style={{ color: "white", fontFamily: "Poppins-ExtraBold", marginRight: 5 }}>Filter</Text>
          <Ionicons name="filter" size={15} color="white" />
        </TouchableOpacity>

        <ScrollView style={{ marginTop: 20 }}>
          {filteredCategories.slice(0, visibleCount).map((item, index) => (
            <View
              key={index}
              style={{
                backgroundColor: "#D6F4C3",
                padding: 15,
                marginVertical: 10,
                marginHorizontal: 20,
                borderRadius: 10,
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.1,
                shadowRadius: 5,
                elevation: 3,
                position: "relative",
              }}
            >
              <TouchableOpacity
                style={{
                  position: "absolute",
                  top: 0,
                  right: 0,
                  padding: 10,
                  width: 40,
                  height: 40,
                  justifyContent: "center",
                  alignItems: "center",
                }}
                onPress={() => {
                  setActionIndex(index);
                  setViewModalVisible(true);
                }}
              >
                <Ionicons name="ellipsis-vertical" size={20} color="#198754" />
              </TouchableOpacity>

              <Text style={{ fontFamily: "Poppins-ExtraBold", fontSize: 14, color: "black", marginBottom: 5 }}>
                Short Code: <Text style={{ color: "#198754" }}>{item.shortCode}</Text>
              </Text>
              <Text style={{ fontFamily: "Poppins-ExtraBold", fontSize: 14, color: "black", marginBottom: 5 }}>
                Description EN: <Text style={{ color: "#198754" }}>{item.descriptionEN}</Text>
              </Text>
              <Text style={{ fontFamily: "Poppins-ExtraBold", fontSize: 14, color: "black", marginBottom: 5 }}>
                Description TA: <Text style={{ color: "#198754" }}>{item.descriptionTA}</Text>
              </Text>
              <Text style={{ fontFamily: "Poppins-ExtraBold", fontSize: 14, color: "black", marginBottom: 5 }}>
                Status: <Text style={{ color: "#198754" }}>{item.active}</Text>
              </Text>
            </View>
          ))}
          {filteredCategories.length > 5 && visibleCount < filteredCategories.length && (
            <TouchableOpacity
              style={{
                backgroundColor: "#198754",
                padding: 10,
                borderRadius: 15,
                marginVertical: 10,
                width: width * 0.6,
                alignSelf: "center",
                alignItems: "center",
              }}
              onPress={handleShowMore}
            >
              <Text style={{ color: "white", fontFamily: "Poppins-ExtraBold", fontSize: 16 }}>Show More</Text>
            </TouchableOpacity>
          )}
        </ScrollView>

        <TouchableOpacity
          style={{
            position: "absolute",
            bottom: height * 0.1,
            left: width * 0.8,
            backgroundColor: "#198754",
            width: 60,
            height: 60,
            borderRadius: 50,
            justifyContent: "center",
            alignItems: "center",
          }}
          onPress={() => {
            setFormData({ shortCode: "", descriptionEN: "", descriptionTA: "", active: "Active" });
            setEditIndex(null);
            setIsModalVisible(true);
          }}
        >
          <Ionicons name="add" size={40} color="white" />
        </TouchableOpacity>

        {/* Add/Edit Modal */}
        <Modal visible={isModalVisible} animationType="slide" transparent={true} onRequestClose={handleCancel}>
          <View style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "rgba(0,0,0,0.5)" }}>
            <View style={{ backgroundColor: "white", padding: 20, borderRadius: 10, width: "80%" }}>
              <Text style={{ fontFamily: "Poppins-ExtraBold", fontSize: 18, textAlign: "center", marginBottom: 10 }}>
                {editIndex !== null ? "Edit Category" : "Add New Category"}
              </Text>

              <TextInput
                style={{ borderWidth: 1, borderColor: "#ccc", borderRadius: 5, padding: 10, marginVertical: 5, fontFamily: "Poppins-ExtraBold" }}
                placeholder="Short Code"
                value={formData.shortCode}
                onChangeText={text => handleInputChange("shortCode", text)}
              />
              <TextInput
                style={{ borderWidth: 1, borderColor: "#ccc", borderRadius: 5, padding: 10, marginVertical: 5, fontFamily: "Poppins-ExtraBold" }}
                placeholder="Description EN"
                value={formData.descriptionEN}
                onChangeText={text => handleInputChange("descriptionEN", text)}
              />
              <TextInput
                style={{ borderWidth: 1, borderColor: "#ccc", borderRadius: 5, padding: 10, marginVertical: 5, fontFamily: "Poppins-ExtraBold" }}
                placeholder="Description TA"
                value={formData.descriptionTA}
                onChangeText={text => handleInputChange("descriptionTA", text)}
              />

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

        {/* Filter Modal */}
        <Modal visible={filterModalVisible} animationType="slide" transparent={true} onRequestClose={() => setFilterModalVisible(false)}>
          <View style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "rgba(0,0,0,0.5)" }}>
            <View style={{ backgroundColor: "white", padding: 20, borderRadius: 10, width: "80%" }}>
              <Text style={{ fontFamily: "Poppins-ExtraBold", fontSize: 18, textAlign: "center", marginBottom: 10 }}>Filter Categories</Text>

              <TextInput style={{ borderWidth: 1, borderColor: "#ccc", borderRadius: 5, padding: 10, marginVertical: 5, fontFamily: "Poppins-ExtraBold" }} placeholder="Short Code" value={filterData.shortCode} onChangeText={text => handleFilterChange("shortCode", text)} />
              <TextInput style={{ borderWidth: 1, borderColor: "#ccc", borderRadius: 5, padding: 10, marginVertical: 5, fontFamily: "Poppins-ExtraBold" }} placeholder="Description EN" value={filterData.descriptionEN} onChangeText={text => handleFilterChange("descriptionEN", text)} />
              <TextInput style={{ borderWidth: 1, borderColor: "#ccc", borderRadius: 5, padding: 10, marginVertical: 5, fontFamily: "Poppins-ExtraBold" }} placeholder="Description TA" value={filterData.descriptionTA} onChangeText={text => handleFilterChange("descriptionTA", text)} />

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

        {/* View Modal */}
        <Modal visible={viewModalVisible} animationType="slide" transparent={true} onRequestClose={() => { setViewModalVisible(false); setActionIndex(null); }}>
          <View style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "rgba(0,0,0,0.5)" }}>
            <View style={{ backgroundColor: "white", padding: 20, borderRadius: 10, width: "90%", maxHeight: "80%" }}>
              <View style={{ flexDirection: "row", justifyContent: "space-around", marginBottom: 10 }}>
                {["Category", "Category Version"].map(tab => (
                  <TouchableOpacity key={tab} style={{ padding: 10, backgroundColor: activeTab === tab ? "#198754" : "#ccc" }} onPress={() => setActiveTab(tab as any)}>
                    <Text style={{ color: activeTab === tab ? "white" : "black", fontFamily: "Poppins-ExtraBold" }}>{tab}</Text>
                  </TouchableOpacity>
                ))}
              </View>

              {activeTab === "Category" && selectedCategoryIndex !== null && (
                <>
                  <Text style={{ fontFamily: "Poppins-ExtraBold", fontSize: 16, marginBottom: 10 }}>Category Details</Text>
                  <Text style={{ fontFamily: "Poppins-ExtraBold", fontSize: 14, color: "black", marginBottom: 5 }}>Short Code: <Text style={{ color: "#198754" }}>{categories[selectedCategoryIndex].shortCode}</Text></Text>
                  <Text style={{ fontFamily: "Poppins-ExtraBold", fontSize: 14, color: "black", marginBottom: 5 }}>Description EN: <Text style={{ color: "#198754" }}>{categories[selectedCategoryIndex].descriptionEN}</Text></Text>
                  <Text style={{ fontFamily: "Poppins-ExtraBold", fontSize: 14, color: "black", marginBottom: 5 }}>Description TA: <Text style={{ color: "#198754" }}>{categories[selectedCategoryIndex].descriptionTA}</Text></Text>
                  <Text style={{ fontFamily: "Poppins-ExtraBold", fontSize: 14, color: "black", marginBottom: 5 }}>Status: <Text style={{ color: "#198754" }}>{categories[selectedCategoryIndex].active}</Text></Text>

                  <TouchableOpacity style={{ padding: 10, borderRadius: 5, marginTop: 10, alignItems: "center", backgroundColor: "#198754" }} onPress={() => { setEditIndex(selectedCategoryIndex); setIsModalVisible(true); setViewModalVisible(false); }}>
                    <Text style={{ color: "white", fontFamily: "Poppins-ExtraBold" }}>Edit</Text>
                  </TouchableOpacity>
                </>
              )}

              {activeTab === "Category Version" && (
                <>
                  {filteredVersions.map((version, index) => (
                    <View key={index} style={{ backgroundColor: "#D6F4C3", padding: 10, marginVertical: 5, borderRadius: 5, position: "relative" }}>
                      <Text style={{ fontFamily: "Poppins-ExtraBold", fontSize: 14, color: "black" }}>Version Code: {version.versionCode}</Text>
                      <Text style={{ fontFamily: "Poppins-ExtraBold", fontSize: 14, color: "black" }}>Version Name: {version.versionName}</Text>
                      <Text style={{ fontFamily: "Poppins-ExtraBold", fontSize: 14, color: "black" }}>Quantity: {version.quantity}</Text>
                      <Text style={{ fontFamily: "Poppins-ExtraBold", fontSize: 14, color: "black" }}>Description EN: {version.descriptionEN}</Text>
                      <Text style={{ fontFamily: "Poppins-ExtraBold", fontSize: 14, color: "black" }}>Description TA: {version.descriptionTA}</Text>
                      <Text style={{ fontFamily: "Poppins-ExtraBold", fontSize: 14, color: "black" }}>Status: {version.active}</Text>
                      <Text style={{ fontFamily: "Poppins-ExtraBold", fontSize: 14, color: "black" }}>Version Status: {version.versionStatus}</Text>
                      <Text style={{ fontFamily: "Poppins-ExtraBold", fontSize: 14, color: "black" }}>Release Date: {version.releaseDate}</Text>
                      <Text style={{ fontFamily: "Poppins-ExtraBold", fontSize: 14, color: "black" }}>Expiration Date: {version.expirationDate}</Text>
                      <Text style={{ fontFamily: "Poppins-ExtraBold", fontSize: 14, color: "black" }}>Batch Number: {version.batchNumber}</Text>
                    </View>
                  ))}

                  <TouchableOpacity style={{ padding: 10, borderRadius: 5, marginTop: 10, alignItems: "center", backgroundColor: "#198754" }} onPress={() => { setVersionFormData({ ...versionFormData, categoryIndex: selectedCategoryIndex || 0 }); setIsVersionModalVisible(true); }}>
                    <Text style={{ color: "white", fontFamily: "Poppins-ExtraBold" }}>Add New Version</Text>
                  </TouchableOpacity>
                </>
              )}

              <TouchableOpacity style={{ padding: 10, borderRadius: 5, marginTop: 10, alignItems: "center", backgroundColor: "#dc3545" }} onPress={() => { setViewModalVisible(false); setActionIndex(null); }}>
                <Text style={{ color: "white", fontFamily: "Poppins-ExtraBold" }}>Close</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>

        {/* Version Modal */}
        <Modal visible={isVersionModalVisible} animationType="slide" transparent={true} onRequestClose={handleVersionCancel}>
          <View style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "rgba(0,0,0,0.5)" }}>
            <View style={{ backgroundColor: "white", padding: 20, borderRadius: 10, width: "80%" }}>
              <Text style={{ fontFamily: "Poppins-ExtraBold", fontSize: 18, textAlign: "center", marginBottom: 10 }}>Add New Version</Text>

              <TextInput style={{ borderWidth: 1, borderColor: "#ccc", borderRadius: 5, padding: 10, marginVertical: 5, fontFamily: "Poppins-ExtraBold" }} placeholder="Version Code" value={versionFormData.versionCode} onChangeText={text => handleVersionInputChange("versionCode", text)} />
              <TextInput style={{ borderWidth: 1, borderColor: "#ccc", borderRadius: 5, padding: 10, marginVertical: 5, fontFamily: "Poppins-ExtraBold" }} placeholder="Version Name" value={versionFormData.versionName} onChangeText={text => handleVersionInputChange("versionName", text)} />
              <TextInput style={{ borderWidth: 1, borderColor: "#ccc", borderRadius: 5, padding: 10, marginVertical: 5, fontFamily: "Poppins-ExtraBold" }} placeholder="Quantity" value={versionFormData.quantity} onChangeText={text => handleVersionInputChange("quantity", text)} />
              <TextInput style={{ borderWidth: 1, borderColor: "#ccc", borderRadius: 5, padding: 10, marginVertical: 5, fontFamily: "Poppins-ExtraBold" }} placeholder="Description EN" value={versionFormData.descriptionEN} onChangeText={text => handleVersionInputChange("descriptionEN", text)} />
              <TextInput style={{ borderWidth: 1, borderColor: "#ccc", borderRadius: 5, padding: 10, marginVertical: 5, fontFamily: "Poppins-ExtraBold" }} placeholder="Description TA" value={versionFormData.descriptionTA} onChangeText={text => handleVersionInputChange("descriptionTA", text)} />
              <TextInput style={{ borderWidth: 1, borderColor: "#ccc", borderRadius: 5, padding: 10, marginVertical: 5, fontFamily: "Poppins-ExtraBold" }} placeholder="Version Status" value={versionFormData.versionStatus} onChangeText={text => handleVersionInputChange("versionStatus", text)} />
              <TextInput style={{ borderWidth: 1, borderColor: "#ccc", borderRadius: 5, padding: 10, marginVertical: 5, fontFamily: "Poppins-ExtraBold" }} placeholder="Release Date" value={versionFormData.releaseDate} onChangeText={text => handleVersionInputChange("releaseDate", text)} />
              <TextInput style={{ borderWidth: 1, borderColor: "#ccc", borderRadius: 5, padding: 10, marginVertical: 5, fontFamily: "Poppins-ExtraBold" }} placeholder="Expiration Date" value={versionFormData.expirationDate} onChangeText={text => handleVersionInputChange("expirationDate", text)} />
              <TextInput style={{ borderWidth: 1, borderColor: "#ccc", borderRadius: 5, padding: 10, marginVertical: 5, fontFamily: "Poppins-ExtraBold" }} placeholder="Batch Number" value={versionFormData.batchNumber} onChangeText={text => handleVersionInputChange("batchNumber", text)} />

              <View style={{ marginVertical: 10 }}>
                <Text style={{ fontFamily: "Poppins-ExtraBold", fontSize: 14, marginBottom: 5 }}>Status:</Text>
                <TouchableOpacity style={{ flexDirection: "row", alignItems: "center", marginVertical: 5 }} onPress={() => handleVersionInputChange("active", "Active")}>
                  <View style={versionFormData.active === "Active" ? { width: 20, height: 20, borderRadius: 10, backgroundColor: "#198754", marginRight: 10 } : { width: 20, height: 20, borderRadius: 10, borderWidth: 1, borderColor: "#ccc", marginRight: 10 }} />
                  <Text style={{ fontFamily: "Poppins-ExtraBold", fontSize: 14 }}>Active</Text>
                </TouchableOpacity>

                <TouchableOpacity style={{ flexDirection: "row", alignItems: "center", marginVertical: 5 }} onPress={() => handleVersionInputChange("active", "Inactive")}>
                  <View style={versionFormData.active === "Inactive" ? { width: 20, height: 20, borderRadius: 10, backgroundColor: "#198754", marginRight: 10 } : { width: 20, height: 20, borderRadius: 10, borderWidth: 1, borderColor: "#ccc", marginRight: 10 }} />
                  <Text style={{ fontFamily: "Poppins-ExtraBold", fontSize: 14 }}>Inactive</Text>
                </TouchableOpacity>
              </View>

              <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                <TouchableOpacity style={{ padding: 10, borderRadius: 5, marginTop: 10, width: "45%", alignItems: "center", backgroundColor: "#198754" }} onPress={handleVersionSubmit}>
                  <Text style={{ color: "white", fontFamily: "Poppins-ExtraBold" }}>Submit</Text>
                </TouchableOpacity>

                <TouchableOpacity style={{ padding: 10, borderRadius: 5, marginTop: 10, width: "45%", alignItems: "center", backgroundColor: "#dc3545" }} onPress={handleVersionCancel}>
                  <Text style={{ color: "white", fontFamily: "Poppins-ExtraBold" }}>Cancel</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      </View>
    </>
  );
}
