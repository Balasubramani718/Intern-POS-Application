// item.tsx
import { Ionicons } from "@expo/vector-icons";
import { useFonts } from "expo-font";
import React, { useEffect, useState } from "react";
import { Dimensions, Modal, ScrollView, Text, TextInput, TouchableOpacity, View } from "react-native";
import { supabase } from "../supabase"; // Importing the configured Supabase client

// Interfaces for Item, Unit, Version
interface ItemData {
  id?: number;
  name: string;
  code: string;
  descriptionEN: string;
  descriptionTA: string;
  active: string;
  price?: string;     // kept as string for TextInput binding
  quantity?: string;  // kept as string for TextInput binding
}
interface UnitData {
  id?: number;
  unitCode: string;
  unitName: string;
  descriptionEN: string;
  descriptionTA: string;
  active: string;
  unitType: string;
  unitWeight: string;
  unitDimensions: string;
  createdDate: string;
  modifiedDate: string;
  itemId: number;
}
interface VersionData {
  id?: number;
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
  unitId: number;
}

export default function item() {
  const { width, height } = Dimensions.get("screen");
  const [fontsLoaded] = useFonts({ "Poppins-ExtraBold": require("../assets/fonts/Poppins-ExtraBold.ttf") });

  // Modals, forms, filters, etc. state declarations here...
  const [isAddModalVisible, setIsAddModalVisible] = useState(false);
  const [filterModalVisible, setFilterModalVisible] = useState(false);
  const [viewModalVisible, setViewModalVisible] = useState(false);
  const [isUnitModalVisible, setIsUnitModalVisible] = useState(false);
  const [isVersionModalVisible, setIsVersionModalVisible] = useState(false);

  const [formData, setFormData] = useState<ItemData>({
    name: "",
    code: "",
    descriptionEN: "",
    descriptionTA: "",
    active: "Active",
    price: "",
    quantity: "",
  });
  const [unitFormData, setUnitFormData] = useState<UnitData>({
    unitCode: "",
    unitName: "",
    descriptionEN: "",
    descriptionTA: "",
    active: "Active",
    unitType: "",
    unitWeight: "",
    unitDimensions: "",
    createdDate: "",
    modifiedDate: "",
    itemId: 0,
  });
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
    unitId: 0,
  });
  const [filterData, setFilterData] = useState<ItemData>({
    name: "",
    code: "",
    descriptionEN: "",
    descriptionTA: "",
    active: "",
    price: "",
    quantity: "",
  });

  const [items, setItems] = useState<ItemData[]>([]);
  const [units, setUnits] = useState<UnitData[]>([]);
  const [versions, setVersions] = useState<VersionData[]>([]);
  const [visibleCount, setVisibleCount] = useState(5);
  const [selectedItemIndex, setSelectedItemIndex] = useState<number | null>(null);
  const [selectedUnitIndex, setSelectedUnitIndex] = useState<number | null>(null);
  const [selectedVersionIndex, setSelectedVersionIndex] = useState<number | null>(null);
  const [activeTab, setActiveTab] = useState<"Item" | "Item Unit" | "Item Unit Version">("Item");
  const [editIndex, setEditIndex] = useState<number | null>(null);
  const [actionIndex, setActionIndex] = useState<number | null>(null);

  const handleInputChange = (field: keyof ItemData, value: string) => { setFormData({ ...formData, [field]: value }); };
  const handleUnitInputChange = (field: keyof UnitData, value: string) => { setUnitFormData({ ...unitFormData, [field]: value }); };
  const handleVersionInputChange = (field: keyof VersionData, value: string) => { setVersionFormData({ ...versionFormData, [field]: value }); };
  const handleFilterChange = (field: keyof ItemData, value: string) => { setFilterData({ ...filterData, [field]: value }); };

  // Fetch Items from Supabase
  const fetchItems = async () => {
    let { data, error } = await supabase.from("items").select("*").order("id", { ascending: true });
    if (error) {
      console.error("Error fetching items:", error.message);
    } else {
      // Convert numeric fields to strings for UI bindings
      const mapped = (data || []).map((r: any) => ({
        ...r,
        price: r.price != null ? String(r.price) : "",
        quantity: r.quantity != null ? String(r.quantity) : "",
      }));
      setItems(mapped as ItemData[]);
    }
  };

  // Fetch Units from Supabase
  const fetchUnits = async () => {
    let { data, error } = await supabase.from("units").select("*").order("id", { ascending: true });
    if (error) {
      console.error("Error fetching units:", error.message);
    } else {
      setUnits(data as UnitData[]);
    }
  };

  // Fetch Versions from Supabase
  const fetchVersions = async () => {
    let { data, error } = await supabase.from("versions").select("*").order("id", { ascending: true });
    if (error) {
      console.error("Error fetching versions:", error.message);
    } else {
      setVersions(data as VersionData[]);
    }
  };

  useEffect(() => {
    fetchItems();
    fetchUnits();
    fetchVersions();
  }, []);

  // Add or update Item in Supabase
  const handleSubmit = async () => {
    if (formData.name && formData.code && formData.descriptionEN && formData.descriptionTA && formData.price !== undefined && formData.quantity !== undefined) {
      // convert price and quantity
      const priceNum = formData.price === "" ? 0 : Number(formData.price);
      const qtyNum = formData.quantity === "" ? 0 : parseInt(formData.quantity, 10);

      const payload = {
        name: formData.name,
        code: formData.code,
        descriptionEN: formData.descriptionEN,
        descriptionTA: formData.descriptionTA,
        active: formData.active,
        price: priceNum,
        quantity: qtyNum,
      };

      if (editIndex !== null && items[editIndex]?.id) {
        // Update existing item
        const itemId = items[editIndex].id;
        const { error } = await supabase.from("items").update(payload).eq("id", itemId);
        if (error) console.error("Error updating item:", error.message);
      } else {
        // Insert new item
        const { error } = await supabase.from("items").insert([payload]);
        if (error) console.error("Error adding item:", error.message);
      }
      await fetchItems();
      setFormData({ name: "", code: "", descriptionEN: "", descriptionTA: "", active: "Active", price: "", quantity: "" });
      setEditIndex(null);
      setIsAddModalVisible(false);
      setViewModalVisible(true);
      // set selected to newly added item index if needed - we leave existing approach
    } else {
      alert("Please fill all text fields (including price & quantity)");
    }
  };

  // Add or update Unit in Supabase
  const handleUnitSubmit = async () => {
    if (unitFormData.unitCode && unitFormData.unitName && unitFormData.descriptionEN && unitFormData.descriptionTA && unitFormData.unitType && unitFormData.unitWeight && unitFormData.unitDimensions && unitFormData.createdDate && unitFormData.modifiedDate) {
      if (selectedItemIndex === null) {
        alert("Please select an item first");
        return;
      }
      unitFormData.itemId = items[selectedItemIndex].id!;
      const { error } = await supabase.from("units").insert([unitFormData]);
      if (error) {
        console.error("Error adding unit:", error.message);
      } else {
        fetchUnits();
        setUnitFormData({
          unitCode: "",
          unitName: "",
          descriptionEN: "",
          descriptionTA: "",
          active: "Active",
          unitType: "",
          unitWeight: "",
          unitDimensions: "",
          createdDate: "",
          modifiedDate: "",
          itemId: 0,
        });
        setIsUnitModalVisible(false);
      }
    } else {
      alert("Please fill all text fields");
    }
  };

  // Add or update Version in Supabase
  const handleVersionSubmit = async () => {
    if (versionFormData.versionCode && versionFormData.versionName && versionFormData.quantity && versionFormData.descriptionEN && versionFormData.descriptionTA && versionFormData.versionStatus && versionFormData.releaseDate && versionFormData.expirationDate && versionFormData.batchNumber) {
      if (selectedUnitIndex === null) {
        alert("Please select a unit first");
        return;
      }
      versionFormData.unitId = units[selectedUnitIndex].id!;
      const { error } = await supabase.from("versions").insert([versionFormData]);
      if (error) {
        console.error("Error adding version:", error.message);
      } else {
        fetchVersions();
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
          unitId: 0,
        });
        setIsVersionModalVisible(false);
      }
    } else {
      alert("Please fill all text fields");
    }
  };

  const handleCancel = () => { setFormData({ name: "", code: "", descriptionEN: "", descriptionTA: "", active: "Active", price: "", quantity: "" }); setEditIndex(null); setIsAddModalVisible(false); };
  const handleUnitCancel = () => {
    setUnitFormData({
      unitCode: "",
      unitName: "",
      descriptionEN: "",
      descriptionTA: "",
      active: "Active",
      unitType: "",
      unitWeight: "",
      unitDimensions: "",
      createdDate: "",
      modifiedDate: "",
      itemId: 0,
    });
    setIsUnitModalVisible(false);
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
      unitId: 0,
    });
    setIsVersionModalVisible(false);
  };
  const handleApplyFilter = () => { setFilterModalVisible(false); };
  const handleClearFilter = () => { setFilterData({ name: "", code: "", descriptionEN: "", descriptionTA: "", active: "", price: "", quantity: "" }); setFilterModalVisible(false); };
  const handleShowMore = () => { setVisibleCount(visibleCount + 5); };

  const handleDelete = async (index: number) => {
    // Delete by id from Supabase
    const item = items[index];
    if (!item?.id) return;
    const { error } = await supabase.from("items").delete().eq("id", item.id);
    if (error) console.error("Error deleting item:", error.message);
    else {
      // update local list
      const newList = items.filter((_, i) => i !== index);
      setItems(newList);
      setActionIndex(null);
      setViewModalVisible(false);
    }
  };

  const filteredItems = items.filter(item => (
    (!filterData.name || item.name.toLowerCase().includes(filterData.name.toLowerCase())) &&
    (!filterData.code || item.code.toLowerCase().includes(filterData.code.toLowerCase())) &&
    (!filterData.descriptionEN || item.descriptionEN.toLowerCase().includes(filterData.descriptionEN.toLowerCase())) &&
    (!filterData.descriptionTA || item.descriptionTA.toLowerCase().includes(filterData.descriptionTA.toLowerCase())) &&
    (!filterData.active || item.active === filterData.active) &&
    (!filterData.price || (item.price && item.price.includes(filterData.price))) &&
    (!filterData.quantity || (item.quantity && item.quantity.includes(filterData.quantity)))
  ));

  if (!fontsLoaded) { return null; }
  return (
    <>
      <View style={{ backgroundColor: "#D6F4C3", paddingVertical: 10 }}>
        <Text style={{ fontFamily: "Poppins-ExtraBold", color: "black", textAlign: "center", fontSize: 20 }}>Items</Text>
      </View>
      <View style={{ flex: 1, padding: 10 }}>
        <TouchableOpacity style={{ alignItems: "center", backgroundColor: "#198754", width: width * 0.6, height: height * 0.045, padding: 10, alignSelf: "center", borderRadius: 30, flexDirection: "row", justifyContent: "center" }} onPress={() => setFilterModalVisible(true)}>
          <Text style={{ color: "white", fontFamily: "Poppins-ExtraBold", marginRight: 5 }}>Filter</Text>
          <Ionicons name="filter" size={15} color="white" />
        </TouchableOpacity>
        <ScrollView style={{ marginTop: 20 }}>
          {filteredItems.slice(0, visibleCount).map((item, index) => (
            <View key={index} style={{ backgroundColor: "#D6F4C3", padding: 15, marginVertical: 10, marginHorizontal: 20, borderRadius: 10, shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 5, elevation: 3, position: "relative" }}>
              {/* Three-dot action unchanged */}
              <TouchableOpacity style={{ position: "absolute", top: 0, right: 0, padding: 10, width: 40, height: 40, justifyContent: "center", alignItems: "center" }} onPress={() => { setActionIndex(index); setSelectedItemIndex(index); setViewModalVisible(true); }}>
                <Ionicons name="ellipsis-vertical" size={20} color="#198754" />
              </TouchableOpacity>

              {/* Card main content (kept same, plus price & quantity) */}
              <Text style={{ fontFamily: "Poppins-ExtraBold", fontSize: 14, color: "black", marginBottom: 5 }}>Name: <Text style={{ color: "#198754" }}>{item.name}</Text></Text>
              <Text style={{ fontFamily: "Poppins-ExtraBold", fontSize: 14, color: "black", marginBottom: 5 }}>Code: <Text style={{ color: "#198754" }}>{item.code}</Text></Text>
              <Text style={{ fontFamily: "Poppins-ExtraBold", fontSize: 14, color: "black", marginBottom: 5 }}>Price: <Text style={{ color: "#198754" }}>{item.price ?? "-"}</Text></Text>
              <Text style={{ fontFamily: "Poppins-ExtraBold", fontSize: 14, color: "black", marginBottom: 5 }}>Status: <Text style={{ color: "#198754" }}>{item.active}</Text></Text>
            </View>
          ))}
          {filteredItems.length > 5 && visibleCount < filteredItems.length && (
            <TouchableOpacity style={{ backgroundColor: "#198754", padding: 10, borderRadius: 15, marginVertical: 10, width: width * 0.6, alignSelf: "center", alignItems: "center" }} onPress={handleShowMore}>
              <Text style={{ color: "white", fontFamily: "Poppins-ExtraBold", fontSize: 16 }}>Show More</Text>
            </TouchableOpacity>
          )}
        </ScrollView>

        {/* Floating add button (unchanged) */}
        <TouchableOpacity style={{ position: "absolute", bottom: height * 0.1, left: width * 0.8, backgroundColor: "#198754", width: 60, height: 60, borderRadius: 50, justifyContent: "center", alignItems: "center" }} onPress={() => { setFormData({ name: "", code: "", descriptionEN: "", descriptionTA: "", active: "Active", price: "", quantity: "" }); setEditIndex(null); setIsAddModalVisible(true); }}>
          <Ionicons name="add" size={40} color="white" />
        </TouchableOpacity>

        {/* ------------------ Add/Edit Item Modal (with price & quantity) ------------------ */}
        <Modal visible={isAddModalVisible} animationType="slide" transparent={true} onRequestClose={handleCancel}>
          <View style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "rgba(0,0,0,0.5)" }}>
            <View style={{ backgroundColor: "white", padding: 20, borderRadius: 10, width: "80%" }}>
              <Text style={{ fontFamily: "Poppins-ExtraBold", fontSize: 18, textAlign: "center", marginBottom: 10 }}>{editIndex !== null ? "Edit Item" : "Add New Item"}</Text>

              <TextInput style={{ borderWidth: 1, borderColor: "#ccc", borderRadius: 5, padding: 10, marginVertical: 5, fontFamily: "Poppins-ExtraBold" }} placeholder="Name" value={formData.name} onChangeText={(text: string) => handleInputChange("name", text)} />
              <TextInput style={{ borderWidth: 1, borderColor: "#ccc", borderRadius: 5, padding: 10, marginVertical: 5, fontFamily: "Poppins-ExtraBold" }} placeholder="Code" value={formData.code} onChangeText={(text: string) => handleInputChange("code", text)} />
              <TextInput style={{ borderWidth: 1, borderColor: "#ccc", borderRadius: 5, padding: 10, marginVertical: 5, fontFamily: "Poppins-ExtraBold" }} placeholder="Description EN" value={formData.descriptionEN} onChangeText={(text: string) => handleInputChange("descriptionEN", text)} />
              <TextInput style={{ borderWidth: 1, borderColor: "#ccc", borderRadius: 5, padding: 10, marginVertical: 5, fontFamily: "Poppins-ExtraBold" }} placeholder="Description TA" value={formData.descriptionTA} onChangeText={(text: string) => handleInputChange("descriptionTA", text)} />

              {/* Price & Quantity inputs (new) */}
              <TextInput
                keyboardType="numeric"
                style={{ borderWidth: 1, borderColor: "#ccc", borderRadius: 5, padding: 10, marginVertical: 5, fontFamily: "Poppins-ExtraBold" }}
                placeholder="Price (e.g. 199.99)"
                value={formData.price}
                onChangeText={(text: string) => handleInputChange("price", text)}
              />
              <TextInput
                keyboardType="numeric"
                style={{ borderWidth: 1, borderColor: "#ccc", borderRadius: 5, padding: 10, marginVertical: 5, fontFamily: "Poppins-ExtraBold" }}
                placeholder="Quantity (e.g. 10)"
                value={formData.quantity}
                onChangeText={(text: string) => handleInputChange("quantity", text)}
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

        {/* ------------------ Filter Modal (unchanged, added price/quantity filter fields) ------------------ */}
        <Modal visible={filterModalVisible} animationType="slide" transparent={true} onRequestClose={() => setFilterModalVisible(false)}>
          <View style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "rgba(0,0,0,0.5)" }}>
            <View style={{ backgroundColor: "white", padding: 20, borderRadius: 10, width: "80%" }}>
              <Text style={{ fontFamily: "Poppins-ExtraBold", fontSize: 18, textAlign: "center", marginBottom: 10 }}>Filter Items</Text>
              <TextInput style={{ borderWidth: 1, borderColor: "#ccc", borderRadius: 5, padding: 10, marginVertical: 5, fontFamily: "Poppins-ExtraBold" }} placeholder="Name" value={filterData.name} onChangeText={(text: string) => handleFilterChange("name", text)} />
              <TextInput style={{ borderWidth: 1, borderColor: "#ccc", borderRadius: 5, padding: 10, marginVertical: 5, fontFamily: "Poppins-ExtraBold" }} placeholder="Code" value={filterData.code} onChangeText={(text: string) => handleFilterChange("code", text)} />
              <TextInput style={{ borderWidth: 1, borderColor: "#ccc", borderRadius: 5, padding: 10, marginVertical: 5, fontFamily: "Poppins-ExtraBold" }} placeholder="Description EN" value={filterData.descriptionEN} onChangeText={(text: string) => handleFilterChange("descriptionEN", text)} />
              <TextInput style={{ borderWidth: 1, borderColor: "#ccc", borderRadius: 5, padding: 10, marginVertical: 5, fontFamily: "Poppins-ExtraBold" }} placeholder="Description TA" value={filterData.descriptionTA} onChangeText={(text: string) => handleFilterChange("descriptionTA", text)} />
              {/* price and quantity filters */}
              <TextInput keyboardType="numeric" style={{ borderWidth: 1, borderColor: "#ccc", borderRadius: 5, padding: 10, marginVertical: 5, fontFamily: "Poppins-ExtraBold" }} placeholder="Price (exact or partial)" value={filterData.price} onChangeText={(text: string) => handleFilterChange("price", text)} />
              <TextInput keyboardType="numeric" style={{ borderWidth: 1, borderColor: "#ccc", borderRadius: 5, padding: 10, marginVertical: 5, fontFamily: "Poppins-ExtraBold" }} placeholder="Quantity (exact or partial)" value={filterData.quantity} onChangeText={(text: string) => handleFilterChange("quantity", text)} />
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

        {/* ------------------ View Modal (card style inside modal; tabs preserved) ------------------ */}
        <Modal visible={viewModalVisible} animationType="slide" transparent={true} onRequestClose={() => { setViewModalVisible(false); setActionIndex(null); }}>
          <View style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "rgba(0,0,0,0.5)" }}>
            <View style={{ backgroundColor: "white", padding: 20, borderRadius: 10, width: "90%", maxHeight: "80%" }}>
              <View style={{ flexDirection: "row", justifyContent: "space-around", marginBottom: 10 }}>
                {["Item", "Item Unit", "Item Unit Version"].map(tab => (
                  <TouchableOpacity key={tab} style={{ padding: 10, backgroundColor: activeTab === tab ? "#198754" : "#ccc" }} onPress={() => setActiveTab(tab as any)}>
                    <Text style={{ color: activeTab === tab ? "white" : "black", fontFamily: "Poppins-ExtraBold" }}>{tab}</Text>
                  </TouchableOpacity>
                ))}
              </View>

              {/* ITEM TAB: show a better card with details + edit button */}
              {activeTab === "Item" && selectedItemIndex !== null && (
                <>
                  <Text style={{ fontFamily: "Poppins-ExtraBold", fontSize: 16, marginBottom: 10 }}>Item Details</Text>

                  {/* Card - slightly more detailed layout but using your visual theme */}
                  <View style={{ backgroundColor: "#F7FFF7", padding: 15, borderRadius: 12, borderWidth: 1, borderColor: "#e6f4e8", marginBottom: 10 }}>
                    <Text style={{ fontFamily: "Poppins-ExtraBold", fontSize: 15 }}>Name</Text>
                    <Text style={{ color: "#198754", marginBottom: 8 }}>{items[selectedItemIndex].name}</Text>

                    <Text style={{ fontFamily: "Poppins-ExtraBold", fontSize: 15 }}>Code</Text>
                    <Text style={{ color: "#198754", marginBottom: 8 }}>{items[selectedItemIndex].code}</Text>

                    <Text style={{ fontFamily: "Poppins-ExtraBold", fontSize: 15 }}>Description (EN)</Text>
                    <Text style={{ color: "#198754", marginBottom: 8 }}>{items[selectedItemIndex].descriptionEN}</Text>

                    <Text style={{ fontFamily: "Poppins-ExtraBold", fontSize: 15 }}>Description (TA)</Text>
                    <Text style={{ color: "#198754", marginBottom: 8 }}>{items[selectedItemIndex].descriptionTA}</Text>

                    <Text style={{ fontFamily: "Poppins-ExtraBold", fontSize: 15 }}>Price</Text>
                    <Text style={{ color: "#198754", marginBottom: 8 }}>{items[selectedItemIndex].price ?? "0"}</Text>

                    <Text style={{ fontFamily: "Poppins-ExtraBold", fontSize: 15 }}>Quantity</Text>
                    <Text style={{ color: "#198754", marginBottom: 8 }}>{items[selectedItemIndex].quantity ?? "0"}</Text>

                    <Text style={{ fontFamily: "Poppins-ExtraBold", fontSize: 15 }}>Status</Text>
                    <Text style={{ color: "#198754", marginBottom: 8 }}>{items[selectedItemIndex].active}</Text>

                    <View style={{ flexDirection: "row", justifyContent: "space-between", marginTop: 10 }}>
                      <TouchableOpacity style={{ padding: 10, borderRadius: 6, alignItems: "center", backgroundColor: "#198754", flex: 1, marginRight: 8 }} onPress={() => { setEditIndex(selectedItemIndex); setIsAddModalVisible(true); setViewModalVisible(false); }}>
                        <Text style={{ color: "white", fontFamily: "Poppins-ExtraBold" }}>Edit</Text>
                      </TouchableOpacity>
                      <TouchableOpacity style={{ padding: 10, borderRadius: 6, alignItems: "center", backgroundColor: "#dc3545", flex: 1 }} onPress={() => handleDelete(selectedItemIndex)}>
                        <Text style={{ color: "white", fontFamily: "Poppins-ExtraBold" }}>Delete</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </>
              )}

              {/* ITEM UNIT TAB - unchanged except kept styling consistent */}
              {activeTab === "Item Unit" && (
                <>
                  {units.filter(u => u.itemId === selectedItemIndex).map((unit, index) => (
                    <View key={index} style={{ backgroundColor: "#D6F4C3", padding: 10, marginVertical: 5, borderRadius: 5, position: "relative" }}>
                      <Text style={{ fontFamily: "Poppins-ExtraBold", fontSize: 14, color: "black" }}>Unit Code: {unit.unitCode}</Text>
                      <Text style={{ fontFamily: "Poppins-ExtraBold", fontSize: 14, color: "black" }}>Unit Name: {unit.unitName}</Text>
                      <Text style={{ fontFamily: "Poppins-ExtraBold", fontSize: 14, color: "black" }}>Description EN: {unit.descriptionEN}</Text>
                      <Text style={{ fontFamily: "Poppins-ExtraBold", fontSize: 14, color: "black" }}>Description TA: {unit.descriptionTA}</Text>
                      <Text style={{ fontFamily: "Poppins-ExtraBold", fontSize: 14, color: "black" }}>Unit Type: {unit.unitType}</Text>
                      <Text style={{ fontFamily: "Poppins-ExtraBold", fontSize: 14, color: "black" }}>Unit Weight: {unit.unitWeight}</Text>
                      <Text style={{ fontFamily: "Poppins-ExtraBold", fontSize: 14, color: "black" }}>Unit Dimensions: {unit.unitDimensions}</Text>
                      <Text style={{ fontFamily: "Poppins-ExtraBold", fontSize: 14, color: "black" }}>Created Date: {unit.createdDate}</Text>
                      <Text style={{ fontFamily: "Poppins-ExtraBold", fontSize: 14, color: "black" }}>Modified Date: {unit.modifiedDate}</Text>
                      <Text style={{ fontFamily: "Poppins-ExtraBold", fontSize: 14, color: "black" }}>Status: {unit.active}</Text>
                      <TouchableOpacity style={{ position: "absolute", top: 0, right: 0, padding: 5 }} onPress={() => { setSelectedUnitIndex(index); setIsUnitModalVisible(true); }}>
                        <Text style={{ color: "#198754", fontFamily: "Poppins-ExtraBold" }}>Edit</Text>
                      </TouchableOpacity>
                      <TouchableOpacity style={{ position: "absolute", top: 0, right: 40, padding: 5 }} onPress={() => setUnits(units.filter((_, i) => i !== index))}>
                        <Text style={{ color: "#dc3545", fontFamily: "Poppins-ExtraBold" }}>Delete</Text>
                      </TouchableOpacity>
                    </View>
                  ))}
                  <TouchableOpacity style={{ padding: 10, borderRadius: 5, marginTop: 10, alignItems: "center", backgroundColor: "#198754" }} onPress={() => { setUnitFormData({ ...unitFormData, itemId: selectedItemIndex || 0 }); setIsUnitModalVisible(true); }}>
                    <Text style={{ color: "white", fontFamily: "Poppins-ExtraBold" }}>Add New Unit</Text>
                  </TouchableOpacity>
                </>
              )}

              {/* ITEM UNIT VERSION TAB - unchanged */}
              {activeTab === "Item Unit Version" && (
                <>
                  {versions.filter(v => v.unitId === selectedUnitIndex).map((version, index) => (
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
                      <TouchableOpacity style={{ position: "absolute", top: 0, right: 0, padding: 5 }} onPress={() => { setSelectedVersionIndex(index); setIsVersionModalVisible(true); }}>
                        <Text style={{ color: "#198754", fontFamily: "Poppins-ExtraBold" }}>Edit</Text>
                      </TouchableOpacity>
                      <TouchableOpacity style={{ position: "absolute", top: 0, right: 40, padding: 5 }} onPress={() => setVersions(versions.filter((_, i) => i !== index))}>
                        <Text style={{ color: "#dc3545", fontFamily: "Poppins-ExtraBold" }}>Delete</Text>
                      </TouchableOpacity>
                    </View>
                  ))}
                  <TouchableOpacity style={{ padding: 10, borderRadius: 5, marginTop: 10, alignItems: "center", backgroundColor: "#198754" }} onPress={() => { setVersionFormData({ ...versionFormData, unitId: selectedUnitIndex || 0 }); setIsVersionModalVisible(true); }}>
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

        {/* ------------------ Unit Modal (unchanged) ------------------ */}
        <Modal visible={isUnitModalVisible} animationType="slide" transparent={true} onRequestClose={handleUnitCancel}>
          <View style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "rgba(0,0,0,0.5)" }}>
            <View style={{ backgroundColor: "white", padding: 20, borderRadius: 10, width: "80%" }}>
              <Text style={{ fontFamily: "Poppins-ExtraBold", fontSize: 18, textAlign: "center", marginBottom: 10 }}>Add New Unit</Text>
              <TextInput style={{ borderWidth: 1, borderColor: "#ccc", borderRadius: 5, padding: 10, marginVertical: 5, fontFamily: "Poppins-ExtraBold" }} placeholder="Unit Code" value={unitFormData.unitCode} onChangeText={(text: string) => handleUnitInputChange("unitCode", text)} />
              <TextInput style={{ borderWidth: 1, borderColor: "#ccc", borderRadius: 5, padding: 10, marginVertical: 5, fontFamily: "Poppins-ExtraBold" }} placeholder="Unit Name" value={unitFormData.unitName} onChangeText={(text: string) => handleUnitInputChange("unitName", text)} />
              <TextInput style={{ borderWidth: 1, borderColor: "#ccc", borderRadius: 5, padding: 10, marginVertical: 5, fontFamily: "Poppins-ExtraBold" }} placeholder="Description EN" value={unitFormData.descriptionEN} onChangeText={(text: string) => handleUnitInputChange("descriptionEN", text)} />
              <TextInput style={{ borderWidth: 1, borderColor: "#ccc", borderRadius: 5, padding: 10, marginVertical: 5, fontFamily: "Poppins-ExtraBold" }} placeholder="Description TA" value={unitFormData.descriptionTA} onChangeText={(text: string) => handleUnitInputChange("descriptionTA", text)} />
              <TextInput style={{ borderWidth: 1, borderColor: "#ccc", borderRadius: 5, padding: 10, marginVertical: 5, fontFamily: "Poppins-ExtraBold" }} placeholder="Unit Type" value={unitFormData.unitType} onChangeText={(text: string) => handleUnitInputChange("unitType", text)} />
              <TextInput style={{ borderWidth: 1, borderColor: "#ccc", borderRadius: 5, padding: 10, marginVertical: 5, fontFamily: "Poppins-ExtraBold" }} placeholder="Unit Weight" value={unitFormData.unitWeight} onChangeText={(text: string) => handleUnitInputChange("unitWeight", text)} />
              <TextInput style={{ borderWidth: 1, borderColor: "#ccc", borderRadius: 5, padding: 10, marginVertical: 5, fontFamily: "Poppins-ExtraBold" }} placeholder="Unit Dimensions" value={unitFormData.unitDimensions} onChangeText={(text: string) => handleUnitInputChange("unitDimensions", text)} />
              <TextInput style={{ borderWidth: 1, borderColor: "#ccc", borderRadius: 5, padding: 10, marginVertical: 5, fontFamily: "Poppins-ExtraBold" }} placeholder="Created Date" value={unitFormData.createdDate} onChangeText={(text: string) => handleUnitInputChange("createdDate", text)} />
              <TextInput style={{ borderWidth: 1, borderColor: "#ccc", borderRadius: 5, padding: 10, marginVertical: 5, fontFamily: "Poppins-ExtraBold" }} placeholder="Modified Date" value={unitFormData.modifiedDate} onChangeText={(text: string) => handleUnitInputChange("modifiedDate", text)} />
              <View style={{ marginVertical: 10 }}>
                <Text style={{ fontFamily: "Poppins-ExtraBold", fontSize: 14, marginBottom: 5 }}>Status:</Text>
                <TouchableOpacity style={{ flexDirection: "row", alignItems: "center", marginVertical: 5 }} onPress={() => handleUnitInputChange("active", "Active")}>
                  <View style={unitFormData.active === "Active" ? { width: 20, height: 20, borderRadius: 10, backgroundColor: "#198754", marginRight: 10 } : { width: 20, height: 20, borderRadius: 10, borderWidth: 1, borderColor: "#ccc", marginRight: 10 }} />
                  <Text style={{ fontFamily: "Poppins-ExtraBold", fontSize: 14 }}>Active</Text>
                </TouchableOpacity>
                <TouchableOpacity style={{ flexDirection: "row", alignItems: "center", marginVertical: 5 }} onPress={() => handleUnitInputChange("active", "Inactive")}>
                  <View style={unitFormData.active === "Inactive" ? { width: 20, height: 20, borderRadius: 10, backgroundColor: "#198754", marginRight: 10 } : { width: 20, height: 20, borderRadius: 10, borderWidth: 1, borderColor: "#ccc", marginRight: 10 }} />
                  <Text style={{ fontFamily: "Poppins-ExtraBold", fontSize: 14 }}>Inactive</Text>
                </TouchableOpacity>
              </View>
              <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                <TouchableOpacity style={{ padding: 10, borderRadius: 5, marginTop: 10, width: "45%", alignItems: "center", backgroundColor: "#198754" }} onPress={handleUnitSubmit}>
                  <Text style={{ color: "white", fontFamily: "Poppins-ExtraBold" }}>Submit</Text>
                </TouchableOpacity>
                <TouchableOpacity style={{ padding: 10, borderRadius: 5, marginTop: 10, width: "45%", alignItems: "center", backgroundColor: "#dc3545" }} onPress={handleUnitCancel}>
                  <Text style={{ color: "white", fontFamily: "Poppins-ExtraBold" }}>Cancel</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>

        {/* ------------------ Version Modal (unchanged) ------------------ */}
        <Modal visible={isVersionModalVisible} animationType="slide" transparent={true} onRequestClose={handleVersionCancel}>
          <View style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "rgba(0,0,0,0.5)" }}>
            <View style={{ backgroundColor: "white", padding: 20, borderRadius: 10, width: "80%" }}>
              <Text style={{ fontFamily: "Poppins-ExtraBold", fontSize: 18, textAlign: "center", marginBottom: 10 }}>Add New Version</Text>
              <TextInput style={{ borderWidth: 1, borderColor: "#ccc", borderRadius: 5, padding: 10, marginVertical: 5, fontFamily: "Poppins-ExtraBold" }} placeholder="Version Code" value={versionFormData.versionCode} onChangeText={(text: string) => handleVersionInputChange("versionCode", text)} />
              <TextInput style={{ borderWidth: 1, borderColor: "#ccc", borderRadius: 5, padding: 10, marginVertical: 5, fontFamily: "Poppins-ExtraBold" }} placeholder="Version Name" value={versionFormData.versionName} onChangeText={(text: string) => handleVersionInputChange("versionName", text)} />
              <TextInput style={{ borderWidth: 1, borderColor: "#ccc", borderRadius: 5, padding: 10, marginVertical: 5, fontFamily: "Poppins-ExtraBold" }} placeholder="Quantity" value={versionFormData.quantity} onChangeText={(text: string) => handleVersionInputChange("quantity", text)} />
              <TextInput style={{ borderWidth: 1, borderColor: "#ccc", borderRadius: 5, padding: 10, marginVertical: 5, fontFamily: "Poppins-ExtraBold" }} placeholder="Description EN" value={versionFormData.descriptionEN} onChangeText={(text: string) => handleVersionInputChange("descriptionEN", text)} />
              <TextInput style={{ borderWidth: 1, borderColor: "#ccc", borderRadius: 5, padding: 10, marginVertical: 5, fontFamily: "Poppins-ExtraBold" }} placeholder="Description TA" value={versionFormData.descriptionTA} onChangeText={(text: string) => handleVersionInputChange("descriptionTA", text)} />
              <TextInput style={{ borderWidth: 1, borderColor: "#ccc", borderRadius: 5, padding: 10, marginVertical: 5, fontFamily: "Poppins-ExtraBold" }} placeholder="Version Status" value={versionFormData.versionStatus} onChangeText={(text: string) => handleVersionInputChange("versionStatus", text)} />
              <TextInput style={{ borderWidth: 1, borderColor: "#ccc", borderRadius: 5, padding: 10, marginVertical: 5, fontFamily: "Poppins-ExtraBold" }} placeholder="Release Date" value={versionFormData.releaseDate} onChangeText={(text: string) => handleVersionInputChange("releaseDate", text)} />
              <TextInput style={{ borderWidth: 1, borderColor: "#ccc", borderRadius: 5, padding: 10, marginVertical: 5, fontFamily: "Poppins-ExtraBold" }} placeholder="Expiration Date" value={versionFormData.expirationDate} onChangeText={(text: string) => handleVersionInputChange("expirationDate", text)} />
              <TextInput style={{ borderWidth: 1, borderColor: "#ccc", borderRadius: 5, padding: 10, marginVertical: 5, fontFamily: "Poppins-ExtraBold" }} placeholder="Batch Number" value={versionFormData.batchNumber} onChangeText={(text: string) => handleVersionInputChange("batchNumber", text)} />
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
