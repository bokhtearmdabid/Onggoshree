import React, { useState } from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Linking } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Feather } from "@expo/vector-icons";
import { colors, fonts } from "../constants/theme";

const FAQS = [
  {
    q: "আমি কীভাবে আমার অর্ডার ট্র্যাক করব?",
    a: "প্রোফাইল → My orders-এ যান, সেখানে আপনার দেওয়া প্রতিটি অর্ডারের অবস্থা দেখতে পাবেন—পেন্ডিং থেকে ডেলিভারড পর্যন্ত।",
  },
  {
    q: "Skin AI কীভাবে কাজ করে?",
    a: "Skin AI আপনার ক্যামেরা ব্যবহার করে আপনার মুখ স্ক্যান করে এবং আপনার ত্বকের প্রয়োজন অনুযায়ী একটি ব্যক্তিগত রুটিন তৈরি করে দেয়। এটি এখন আর্লি অ্যাক্সেসে আছে—ফলাফলগুলো নির্দেশনার জন্য এবং সময়ের সাথে আরও উন্নত হয়।",
  },
  {
    q: "আমি কীভাবে Glow পয়েন্ট অর্জন ও ব্যবহার করব?",
    a: "প্রতি ৳১০ খরচে আপনি ১টি Glow পয়েন্ট পাবেন। যথেষ্ট পয়েন্ট জমা হলে Club ট্যাব থেকে একটি রিওয়ার্ড রিডিম করুন—এটি আপনার পরবর্তী চেকআউটে স্বয়ংক্রিয়ভাবে প্রয়োগ হবে।",
  },
  {
    q: "আপনাদের ডেলিভারি সময় কত?",
    a: "ঢাকার ভেতরের অর্ডার সাধারণত ২–৪ কর্মদিবসের মধ্যে ডেলিভারি হয়। ডেলিভারি স্ট্যাটাস আপডেট My orders-এ দেখতে পাবেন।",
  },
  {
    q: "আমি কি কোনো পণ্য ফেরত দিতে পারি?",
    a: "হ্যাঁ—না খোলা পণ্য ডেলিভারির ৭ দিনের মধ্যে ফেরত দেওয়া যায়। রিটার্ন শুরু করতে আপনার অর্ডার আইডি সহ নিচে আমাদের সাথে যোগাযোগ করুন।",
  },
  {
    q: "Onggoshree কি cruelty-free?",
    a: "হ্যাঁ, প্রতিটি Onggoshree পণ্য পশুর ওপর কোনো পরীক্ষা ছাড়াই তৈরি ও সম্পন্ন করা হয়।",
  },
];

function FAQItem({ item, isOpen, onToggle }) {
  return (
    <TouchableOpacity style={styles.faqItem} activeOpacity={0.7} onPress={onToggle}>
      <View style={styles.faqRow}>
        <Text style={styles.faqQ}>{item.q}</Text>
        <Feather name={isOpen ? "chevron-up" : "chevron-down"} size={16} color={colors.muted} />
      </View>
      {isOpen && <Text style={styles.faqA}>{item.a}</Text>}
    </TouchableOpacity>
  );
}

export default function HelpScreen({ navigation }) {
  const [openIndex, setOpenIndex] = useState(null);

  const handleEmail = () => {
    Linking.openURL("mailto:support@onggoshree.com?subject=Help%20with%20my%20order");
  };

  const handleWhatsApp = () => {
    Linking.openURL("https://wa.me/8801628759989");
  };

  const handleCall = () => {
    Linking.openURL("tel:+8801628759989");
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.topTitle}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Feather name="arrow-left" size={18} color={colors.forest} />
        </TouchableOpacity>
        <Text style={styles.title}>Help & support</Text>
        <View style={{ width: 18 }} />
      </View>

      <ScrollView contentContainerStyle={{ paddingBottom: 30 }}>
        <View style={styles.body}>
          <Text style={styles.lbl}>Contact us</Text>
          <View style={styles.contactRow}>
            <TouchableOpacity style={styles.contactCard} onPress={handleWhatsApp}>
              <Feather name="message-circle" size={18} color={colors.leaf} />
              <Text style={styles.contactLabel}>WhatsApp</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.contactCard} onPress={handleCall}>
              <Feather name="phone" size={18} color={colors.leaf} />
              <Text style={styles.contactLabel}>Call us</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.contactCard} onPress={handleEmail}>
              <Feather name="mail" size={18} color={colors.leaf} />
              <Text style={styles.contactLabel}>Email</Text>
            </TouchableOpacity>
          </View>

          <Text style={styles.lbl}>Frequently asked questions</Text>
          <View style={styles.faqList}>
            {FAQS.map((item, index) => (
              <FAQItem
                key={item.q}
                item={item}
                isOpen={openIndex === index}
                onToggle={() => setOpenIndex(openIndex === index ? null : index)}
              />
            ))}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: colors.canvas },
  topTitle: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 18,
    paddingTop: 8,
    paddingBottom: 14,
  },
  title: { fontFamily: fonts.serif, fontSize: 20, color: colors.forest },

  body: { paddingHorizontal: 18 },
  lbl: {
    fontFamily: fonts.sansBold,
    fontSize: 11,
    letterSpacing: 1,
    textTransform: "uppercase",
    color: colors.forest,
    marginBottom: 12,
    marginTop: 10,
  },

  contactRow: { flexDirection: "row", gap: 10, marginBottom: 8 },
  contactCard: {
    flex: 1,
    backgroundColor: colors.milk,
    borderWidth: 1,
    borderColor: colors.line,
    borderRadius: 16,
    paddingVertical: 16,
    alignItems: "center",
    gap: 6,
  },
  contactLabel: { fontFamily: fonts.sansBold, fontSize: 11, color: colors.forest },

  faqList: { gap: 8 },
  faqItem: {
    backgroundColor: colors.milk,
    borderWidth: 1,
    borderColor: colors.line,
    borderRadius: 14,
    padding: 15,
  },
  faqRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", gap: 12 },
  faqQ: { flex: 1, fontFamily: fonts.sans, fontSize: 13, fontWeight: "600", color: colors.forest },
  faqA: { fontFamily: fonts.sans, fontSize: 12.5, color: colors.muted, lineHeight: 19, marginTop: 10 },
});