import { Ionicons } from "@expo/vector-icons";
import { useFonts } from "expo-font";
import React, { useEffect, useState } from "react";
import { Alert, Dimensions, Modal, ScrollView, Text, TextInput, TouchableOpacity, View } from "react-native";
import { supabase } from "../supabase";

interface FormData {
  id?: number;
  shortCode: string;
  descriptionEN: string;
  descriptionTA: string;
  active: string;
}

export default function Category() {
  const { width, height } = Dimensions.get("screen");
  const [fontsLoaded] = useFonts({ "Poppins-ExtraBold": require("../assets/fonts/Poppins-ExtraBold.ttf") });

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [filterModalVisible, setFilterModalVisible] = useState(false);
  const [viewModalVisible, setViewModalVisible] = useState(false);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState<FormData>({ shortCode: "", descriptionEN: "", descriptionTA: "", active: "Active" });
  const [filterData, setFilterData] = useState<FormData>({ shortCode: "", descriptionEN: "", descriptionTA: "", active: "" });
  const [categories, setCategories] = useState<FormData[]>([]);
  const [editIndex, setEditIndex] = useState<number | null>(null);
  const [selectedCategoryIndex, setSelectedCategoryIndex] = useState<number | null>(null);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase.from("categories").select("*").order("id", { ascending: false });
      if (error) throw error;
      setCategories(data || []);
    } catch (error: any) {
      Alert.alert("Error", error.message || "Failed to fetch categories");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData({ ...formData, [field]: value });
  };

  const handleFilterChange = (field: keyof FormData, value: string) => {
    setFilterData({ ...filterData, [field]: value });
  };

  const handleSubmit = async () => {
  if (formData.shortCode && formData.descriptionEN && formData.descriptionTA) {
    try {
      setLoading(true);
      if (editIndex !== null) {
        const categoryToUpdate = categories[editIndex];
        const { error } = await supabase
          .from("categories")
          .update({ ...formData })  // Remove updated_at
          .eq("id", categoryToUpdate.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from("categories").insert([formData]);
        if (error) throw error;
      }
      await fetchCategories();
      setFormData({ shortCode: "", descriptionEN: "", descriptionTA: "", active: "Active" });
      setEditIndex(null);
      setIsModalVisible(false);
    } catch (error: any) {
      Alert.alert("Error", error.message || "Failed to save category");
    } finally {
      setLoading(false);
    }
  } else {
    Alert.alert("Validation Error", "Please fill all text fields");
  }
};


  const handleDelete = async (index: number) => {
    try {
      setLoading(true);
      const categoryToDelete = categories[index];
      const { error } = await supabase.from("categories").delete().eq("id", categoryToDelete.id);
      if (error) throw error;
      await fetchCategories();
      setViewModalVisible(false);
    } catch (error: any) {
      Alert.alert("Error", error.message || "Failed to delete category");
    } finally {
      setLoading(false);
    }
  };

  const filteredCategories = categories.filter(item =>
    (!filterData.shortCode || item.shortCode.toLowerCase().includes(filterData.shortCode.toLowerCase())) &&
    (!filterData.descriptionEN || item.descriptionEN.toLowerCase().includes(filterData.descriptionEN.toLowerCase())) &&
    (!filterData.descriptionTA || item.descriptionTA.toLowerCase().includes(filterData.descriptionTA.toLowerCase())) &&
    (!filterData.active || item.active === filterData.active)
  );

  if (!fontsLoaded) return null;

  return (
    <>
      <View style={{ backgroundColor: "#D6F4C3", paddingVertical: 10 }}>
        <Text style={{ fontFamily: "Poppins-ExtraBold", color: "black", textAlign: "center", fontSize: 20 }}>
          Category
        </Text>
      </View>

      {/* Filter Button */}
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
          marginTop: 15,
        }}
        onPress={() => setFilterModalVisible(true)}
      >
        <Text style={{ color: "white", fontFamily: "Poppins-ExtraBold", marginRight: 5 }}>Filter</Text>
        <Ionicons name="filter" size={15} color="white" />
      </TouchableOpacity>

      {/* List of Categories */}
      <ScrollView style={{ marginTop: 20 }}>
  {filteredCategories.map((item, index) => (
    <View
      key={item.id || index}
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
      {/* Three-dot action menu */}
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
          setSelectedCategoryIndex(index);
          setViewModalVisible(true);
        }}
      >
        <Ionicons name="ellipsis-vertical" size={20} color="#198754" />
      </TouchableOpacity>

      {/* Card Content */}
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
</ScrollView>


      {/* Floating Add Button */}
      <TouchableOpacity
        style={{
          position: "absolute",
          bottom: height * 0.1,
          right: width * 0.1,
          backgroundColor: "#198754",
          width: 60,
          height: 60,
          borderRadius: 30,
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

      {/* View Category Modal */}
      <Modal
        visible={viewModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setViewModalVisible(false)}
      >
        <View style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "rgba(0,0,0,0.5)" }}>
          <View style={{ backgroundColor: "white", padding: 20, borderRadius: 10, width: "90%", maxHeight: "80%" }}>
            
            {/* Close Icon */}
            <TouchableOpacity
              style={{ position: "absolute", top: 10, right: 10 }}
              onPress={() => setViewModalVisible(false)}
            >
              <Ionicons name="close" size={24} color="black" />
            </TouchableOpacity>

            {selectedCategoryIndex !== null && (
              <>
                <Text style={{ fontFamily: "Poppins-ExtraBold", fontSize: 16, marginBottom: 10 }}>Category Details</Text>
                <Text>Short Code: {categories[selectedCategoryIndex].shortCode}</Text>
                <Text>Description EN: {categories[selectedCategoryIndex].descriptionEN}</Text>
                <Text>Description TA: {categories[selectedCategoryIndex].descriptionTA}</Text>
                <Text>Status: {categories[selectedCategoryIndex].active}</Text>

                <View style={{ flexDirection: "row", justifyContent: "space-between", marginTop: 15 }}>
                  <TouchableOpacity
                    style={{ padding: 10, borderRadius: 5, backgroundColor: "#198754", width: "45%", alignItems: "center" }}
                    onPress={() => {
                      setEditIndex(selectedCategoryIndex);
                      setFormData(categories[selectedCategoryIndex]);
                      setIsModalVisible(true);
                      setViewModalVisible(false);
                    }}
                  >
                    <Text style={{ color: "white", fontFamily: "Poppins-ExtraBold" }}>Edit</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={{ padding: 10, borderRadius: 5, backgroundColor: "#dc3545", width: "45%", alignItems: "center" }}
                    onPress={() => handleDelete(selectedCategoryIndex)}
                  >
                    <Text style={{ color: "white", fontFamily: "Poppins-ExtraBold" }}>Delete</Text>
                  </TouchableOpacity>
                </View>
              </>
            )}
          </View>
        </View>
      </Modal>


      {/* Add/Edit Modal */}
      <Modal visible={isModalVisible} animationType="slide" transparent={true} onRequestClose={() => setIsModalVisible(false)}>
        <View style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "rgba(0,0,0,0.5)" }}>
          <View style={{ backgroundColor: "white", padding: 20, borderRadius: 10, width: "80%" }}>
            <Text style={{ fontFamily: "Poppins-ExtraBold", fontSize: 18, textAlign: "center", marginBottom: 10 }}>
              {editIndex !== null ? "Edit Category" : "Add New Category"}
            </Text>

            <TextInput style={styles.input} placeholder="Short Code" value={formData.shortCode} onChangeText={t => handleInputChange("shortCode", t)} />
            <TextInput style={styles.input} placeholder="Description EN" value={formData.descriptionEN} onChangeText={t => handleInputChange("descriptionEN", t)} />
            <TextInput style={styles.input} placeholder="Description TA" value={formData.descriptionTA} onChangeText={t => handleInputChange("descriptionTA", t)} />

            {/* Status Toggle */}
            <View style={{ marginVertical: 10 }}>
              <Text style={{ fontFamily: "Poppins-ExtraBold", fontSize: 14, marginBottom: 5 }}>Status:</Text>

              <TouchableOpacity style={{ flexDirection: "row", alignItems: "center", marginVertical: 5 }} onPress={() => handleInputChange("active", "Active")}>
                <View style={formData.active === "Active" ? styles.radioSelected : styles.radio} />
                <Text style={{ fontFamily: "Poppins-ExtraBold", fontSize: 14 }}>Active</Text>
              </TouchableOpacity>

              <TouchableOpacity style={{ flexDirection: "row", alignItems: "center", marginVertical: 5 }} onPress={() => handleInputChange("active", "Inactive")}>
                <View style={formData.active === "Inactive" ? styles.radioSelected : styles.radio} />
                <Text style={{ fontFamily: "Poppins-ExtraBold", fontSize: 14 }}>Inactive</Text>
              </TouchableOpacity>
            </View>

            <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
              <TouchableOpacity
                style={{ padding: 10, borderRadius: 5, marginTop: 10, width: "45%", alignItems: "center", backgroundColor: loading ? "#ccc" : "#198754" }}
                onPress={handleSubmit}
                disabled={loading}
              >
                <Text style={{ color: "white", fontFamily: "Poppins-ExtraBold" }}>{loading ? "Saving..." : "Submit"}</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={{ padding: 10, borderRadius: 5, marginTop: 10, width: "45%", alignItems: "center", backgroundColor: "#dc3545" }}
                onPress={() => setIsModalVisible(false)}
              >
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

            <TextInput style={styles.input} placeholder="Short Code" value={filterData.shortCode} onChangeText={t => handleFilterChange("shortCode", t)} />
            <TextInput style={styles.input} placeholder="Description EN" value={filterData.descriptionEN} onChangeText={t => handleFilterChange("descriptionEN", t)} />
            <TextInput style={styles.input} placeholder="Description TA" value={filterData.descriptionTA} onChangeText={t => handleFilterChange("descriptionTA", t)} />

            <View style={{ flexDirection: "row", justifyContent: "space-between", marginTop: 10 }}>
              <TouchableOpacity style={{ padding: 10, borderRadius: 5, width: "45%", alignItems: "center", backgroundColor: "#198754" }} onPress={() => setFilterModalVisible(false)}>
                <Text style={{ color: "white", fontFamily: "Poppins-ExtraBold" }}>Apply</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={{ padding: 10, borderRadius: 5, width: "45%", alignItems: "center", backgroundColor: "#dc3545" }}
                onPress={() => {
                  setFilterData({ shortCode: "", descriptionEN: "", descriptionTA: "", active: "" });
                  setFilterModalVisible(false);
                }}
              >
                <Text style={{ color: "white", fontFamily: "Poppins-ExtraBold" }}>Clear</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </>
  );
}

const styles = {
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    padding: 10,
    marginVertical: 5,
    fontFamily: "Poppins-ExtraBold",
  },
  radio: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#ccc",
    marginRight: 10,
  },
  radioSelected: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: "#198754",
    marginRight: 10,
  },
};
