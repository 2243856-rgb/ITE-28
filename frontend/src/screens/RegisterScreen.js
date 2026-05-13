import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
  ActivityIndicator
} from "react-native";
import InputField from "../components/InputField";
import CustomButton from "../components/CustomButton";
import { AuthService } from "../services/auth.service";

export default function RegisterScreen({ navigation }) {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    const name = fullName.trim();
    const em = email.trim();
    if (!name) {
      Alert.alert("Validation", "Please enter a display name.");
      return;
    }
    if (!em) {
      Alert.alert("Validation", "Please enter an email.");
      return;
    }
    if (password.length < 8) {
      Alert.alert("Validation", "Password must be at least 8 characters.");
      return;
    }
    if (password !== confirmPassword) {
      Alert.alert("Validation", "Passwords do not match.");
      return;
    }

    setLoading(true);
    try {
      await AuthService.registerOwner({
        fullName: name,
        email: em,
        phoneNumber: phoneNumber.trim() || undefined,
        password
      });
      Alert.alert("Success", "Account created. You can sign in now.", [
        { text: "OK", onPress: () => navigation.navigate("Login") }
      ]);
    } catch (err) {
      Alert.alert("Registration failed", AuthService.pickMessage(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView contentContainerStyle={styles.scroll}>
        <View style={styles.headerContainer}>
          <Text style={styles.header}>/// NEW SAVE FILE ///</Text>
          <Text style={styles.subtitle}>INITIALIZE PLAYER DATA</Text>
        </View>

        <View style={styles.formContainer}>
          <InputField
            label="DISPLAY NAME"
            placeholder="YOUR NAME..."
            value={fullName}
            onChangeText={setFullName}
          />
          <InputField
            label="NEW PLAYER ID (EMAIL)"
            placeholder="ENTER EMAIL..."
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />
          <InputField
            label="PHONE (OPTIONAL)"
            placeholder="PHONE NUMBER..."
            value={phoneNumber}
            onChangeText={setPhoneNumber}
            keyboardType="phone-pad"
          />
          <InputField
            label="SECRET KEY (PASS)"
            placeholder="CREATE PASSWORD..."
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />
          <InputField
            label="VERIFY KEY"
            placeholder="CONFIRM PASSWORD..."
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            secureTextEntry
          />

          <View style={{ marginTop: 30 }}>
            {loading ? (
              <ActivityIndicator color="#FF007F" />
            ) : (
              <CustomButton title="CREATE CHARACTER" onPress={handleRegister} color="#FF007F" />
            )}
            <CustomButton
              title="< BACK TO TITLE"
              onPress={() => navigation.navigate("Login")}
              color="#555555"
            />
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000000"
  },
  scroll: {
    padding: 20,
    justifyContent: "center",
    flexGrow: 1
  },
  headerContainer: {
    alignItems: "center",
    marginBottom: 40
  },
  header: {
    fontFamily: "monospace",
    fontSize: 24,
    color: "#00FFFF",
    fontWeight: "bold"
  },
  subtitle: {
    fontFamily: "monospace",
    fontSize: 14,
    color: "#FFFFFF",
    marginTop: 10
  },
  formContainer: {
    width: "100%"
  }
});
