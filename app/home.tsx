import { Ionicons } from "@expo/vector-icons";
import { useFonts } from "expo-font";
import * as Print from "expo-print";
import React, { useEffect, useState } from "react";
import { Dimensions, FlatList, KeyboardAvoidingView, Platform, ScrollView, Text, TextInput, TouchableOpacity, View } from "react-native";
import { supabase } from "../supabase"; // Supabase client

interface Item {
  id: number;
  name: string;
  code: string;
  descriptionEN: string;
  unit: string;
  price: number;
}

interface BillItem {
  id: number;
  code: string;
  name: string;
  uom: string;
  price: number;
  qty: number;
  total: number;
}

export default function home() {
  const { width, height } = Dimensions.get("screen");
  const [fontsLoaded] = useFonts({ "Poppins-ExtraBold": require("../assets/fonts/Poppins-ExtraBold.ttf") });
  const [focusedField, setFocusedField] = useState<"search" | "footer" | null>(null);

  const [billNo, setBillNo] = useState(Date.now().toString().slice(-6));
  const [cashier, setCashier] = useState("Cashier");
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [items, setItems] = useState<Item[]>([]);
  const [search, setSearch] = useState("");
  const [filteredItems, setFilteredItems] = useState<Item[]>([]);
  const [billItems, setBillItems] = useState<BillItem[]>([]);
  const [cash, setCash] = useState("");
  const [discount, setDiscount] = useState(0);

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
let { data, error } = await supabase
  .from("items")
  .select("id, name, code, \"descriptionEN\", price");
    if (!error && data) {
      const mapped = data.map((i: any) => ({
        id: i.id,
        name: i.name,
        code: i.code,
        descriptionEN: i.descriptionEN,
        unit: "UOM", // you can map actual unit
        price: i.price,
      }));
      setItems(mapped);
    }
  };

  const handleSearch = (text: string) => {
    setSearch(text);
    if (text.length >= 2) {
      const res = items.filter(
        (i) => i.name.toLowerCase().includes(text.toLowerCase()) || i.code.toLowerCase().includes(text.toLowerCase())
      );
      setFilteredItems(res);
    } else {
      setFilteredItems([]);
    }
  };

  const addToBill = (item: Item) => {
    const existing = billItems.find((bi) => bi.id === item.id);
    if (existing) {
      setBillItems(
        billItems.map((bi) =>
          bi.id === item.id ? { ...bi, qty: bi.qty + 1, total: (bi.qty + 1) * bi.price } : bi
        )
      );
    } else {
      setBillItems([
        ...billItems,
        { id: item.id, code: item.code, name: item.name, uom: item.unit, price: item.price, qty: 1, total: item.price },
      ]);
    }
    setSearch("");
    setFilteredItems([]);
  };

  const updateQty = (id: number, qty: number) => {
    setBillItems(
      billItems.map((bi) =>
        bi.id === id ? { ...bi, qty, total: qty * bi.price } : bi
      )
    );
  };

  const removeItem = (id: number) => {
    setBillItems(billItems.filter((bi) => bi.id !== id));
  };

  const totalAmount = billItems.reduce((sum, i) => sum + i.total, 0);
  const netTotal = totalAmount - discount;
  const balance = parseFloat(cash || "0") - netTotal;

  const printBill = async () => {
    const html = `
      <h2 style="text-align:center">KRSS Mart</h2>
      <p>Bill No: ${billNo} | Date: ${new Date().toLocaleString()}</p>
      <p>Cashier: ${cashier}</p>
      <p>Customer: ${customerName} (${customerPhone})</p>
      <table border="1" style="width:100%;border-collapse:collapse">
        <tr><th>Code</th><th>Name</th><th>Qty</th><th>Price</th><th>Total</th></tr>
        ${billItems
          .map(
            (i) =>
              `<tr><td>${i.code}</td><td>${i.name}</td><td>${i.qty}</td><td>${i.price}</td><td>${i.total}</td></tr>`
          )
          .join("")}
      </table>
      <p>Total: ₹${totalAmount.toFixed(2)}</p>
      <p>Discount: ₹${discount}</p>
      <p>Net Total: ₹${netTotal.toFixed(2)}</p>
      <p>Cash: ₹${cash}</p>
      <p>Balance: ₹${balance.toFixed(2)}</p>
    `;
    await Print.printAsync({ html });
  };

  if (!fontsLoaded) return null;

  return (
    <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={focusedField === "footer" ? (Platform.OS === "ios" ? "padding" : "height") : undefined}
          keyboardVerticalOffset={80}
      >
    <View style={{ flex: 1, backgroundColor: "#D6F4C3", padding: 10 }}>
      <Text style={{ fontFamily: "Poppins-ExtraBold", fontSize: 20, textAlign: "center" }}>POS Billing</Text>
      <Text style={{ marginTop: 5 }}>Bill No: {billNo}</Text>
      <Text>Cashier: {cashier}</Text>

      {/* Customer Info */}
      <View style={{ flexDirection: "row", marginVertical: 10 }}>
        <TextInput
          placeholder="Customer Name"
          value={customerName}
          onChangeText={setCustomerName}
          style={{ flex: 1, borderWidth: 1, borderColor: "#198754", borderRadius: 8, marginRight: 5, padding: 8 }}
        />
        <TextInput
          placeholder="Customer Phone"
          value={customerPhone}
          onChangeText={setCustomerPhone}
          style={{ flex: 1, borderWidth: 1, borderColor: "#198754", borderRadius: 8, padding: 8 }}
        />
      </View>

      {/* Search */}
      <TextInput
        placeholder="Enter item code or name"
        value={search}
        onChangeText={handleSearch}
        style={{ borderWidth: 1, borderColor: "#198754", borderRadius: 8, padding: 8 }}
      />
      {filteredItems.length > 0 && (
        <FlatList
          data={filteredItems}
          keyExtractor={(i) => i.id.toString()}
          renderItem={({ item }) => (
            <TouchableOpacity onPress={() => addToBill(item)} style={{ padding: 10, backgroundColor: "white" }}>
              <Text>{item.code} - {item.name} (₹{item.price})</Text>
            </TouchableOpacity>
          )}
        />
      )}

      {/* Bill Items */}
      
      <ScrollView style={{ flex: 1, marginVertical: 10 }}>
        {billItems.map((bi, idx) => (
          <View key={bi.id} style={{ flexDirection: "row", backgroundColor: "white", marginBottom: 5, borderRadius: 8, padding: 8 }}>
            <Text style={{ flex: 1 }}>{idx + 1}. {bi.code}</Text>
            <Text style={{ flex: 2 }}>{bi.name}</Text>
            <TextInput
              value={bi.qty.toString()}
              keyboardType="numeric"
              onChangeText={(val) => updateQty(bi.id, parseInt(val || "0"))}
              style={{ borderWidth: 1, borderColor: "#198754", width: 50, textAlign: "center", marginRight: 5 }}
            />
            <Text style={{ flex: 1 }}>₹{bi.total.toFixed(2)}</Text>
            <TouchableOpacity onPress={() => removeItem(bi.id)}>
              <Ionicons name="trash" size={20} color="red" />
            </TouchableOpacity>
          </View>
        ))}
      </ScrollView>

      {/* Totals */}
      <View style={{ backgroundColor: "#fff", padding: 10, borderRadius: 8 }} >
        <Text>Total: ₹{totalAmount.toFixed(2)}</Text>
        <TextInput
          placeholder="Discount"
          value={discount === 0 ? "" : discount.toString()}
          keyboardType="numeric"
          onChangeText={(v) => setDiscount(parseFloat(v) || 0)}
          onFocus={() => setFocusedField("footer")}
          style={{ borderWidth: 1, borderColor: "#198754", borderRadius: 8, padding: 5, marginVertical: 5 }}
        />
        <Text>Net Total: ₹{netTotal.toFixed(2)}</Text>
        <TextInput
          placeholder="Cash"
          value={cash}
          keyboardType="numeric"
          onChangeText={setCash}
          onFocus={() => setFocusedField("footer")}
          style={{ borderWidth: 1, borderColor: "#198754", borderRadius: 8, padding: 5, marginVertical: 5 }}
        />
        <Text>Balance: ₹{balance.toFixed(2)}</Text>

        <TouchableOpacity
          style={{ backgroundColor: "#198754", padding: 12, borderRadius: 8, marginTop: 10 }}
          onPress={printBill}
        >
          <Text style={{ color: "white", fontFamily: "Poppins-ExtraBold", textAlign: "center" }}>Save & Print Bill</Text>
        </TouchableOpacity>
      </View>
        </View>

    </KeyboardAvoidingView>

  );
}
