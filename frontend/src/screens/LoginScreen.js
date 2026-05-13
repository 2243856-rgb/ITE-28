import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Alert,
  ActivityIndicator
} from "react-native";
import InputField from "../components/InputField";
import CustomButton from "../components/CustomButton";
import { AuthService } from "../services/auth.service";

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    const em = email.trim();
    if (!em || !password) {
      Alert.alert("Validation", "Enter email and password.");
      return;
    }
    setLoading(true);
    try {
      await AuthService.login(em, password);
      navigation.reset({ index: 0, routes: [{ name: "MainApp" }] });
    } catch (err) {
      Alert.alert("Login failed", AuthService.pickMessage(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <View style={styles.titleContainer}>
        <Text style={styles.title}>NESTVET</Text>
        <Text style={styles.subtitle}>PRESS START TO BEGIN</Text>
      </View>

      <View style={styles.formContainer}>
        <InputField
          label="PLAYER ID (EMAIL)"
          placeholder="ENTER EMAIL..."
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />
        <InputField
          label="SECRET KEY (PASS)"
          placeholder="ENTER PASSWORD..."
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />

        <View style={{ marginTop: 20 }}>
          {loading ? (
            <ActivityIndicator color="#39FF14" />
          ) : (
            <CustomButton title="START GAME" onPress={handleLogin} color="#39FF14" />
          )}
          <CustomButton
            title="CREATE SAVE FILE"
            onPress={() => navigation.navigate("Register")}
            color="#00FFFF"
          />
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000000",
    padding: 20,
    justifyContent: "center"
  },
  titleContainer: {
    alignItems: "center",
    marginBottom: 50
  },
  title: {
    fontFamily: "monospace",
    fontSize: 48,
    color: "#FF007F",
    fontWeight: "bold",
    textShadowColor: "#FFFFFF",
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 1
  },
  subtitle: {
    fontFamily: "monospace",
    fontSize: 16,
    color: "#FFFF00",
    marginTop: 10
  },
  formContainer: {
    width: "100%"
  }
});
