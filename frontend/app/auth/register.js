import { View, Text, TextInput, TouchableOpacity, Alert } from "react-native";
import { useState } from "react";
import { useRouter } from "expo-router";
import { requestPhoneCode, verifyPhoneCode, registerUser } from "../../src/api/auth";

export default function Register() {
  const r = useRouter();
  const [step, setStep] = useState(1);
  const [mobile, setMobile] = useState("");
  const [otp, setOtp] = useState("");
  const [sid, setSid] = useState("");
  const [u, setU] = useState("");
  const [p, setP] = useState("");

  const sendOtp = async () => {
    const res = await requestPhoneCode(mobile);
    setSid(res.session_id);
    setStep(2);
  };

  const verifyOtp = async () => {
    await verifyPhoneCode(sid, otp);
    setStep(3);
  };

  const register = async () => {
    await registerUser({
      username: u,
      password: p,
      mobile_no: mobile,
      verification_session_id: sid,
    });
    Alert.alert("Success", "Account created", [
      { text: "OK", onPress: () => r.replace("/auth/welcome") },
    ]);
  };

  return (
    <View style={{ padding: 24 }}>
      {step === 1 && (
        <>
          <Text>Mobile Number</Text>
          <TextInput value={mobile} onChangeText={setMobile}
            style={{ borderWidth: 1, padding: 10 }} />
          <TouchableOpacity onPress={sendOtp}><Text>Send OTP</Text></TouchableOpacity>
        </>
      )}

      {step === 2 && (
        <>
          <Text>OTP</Text>
          <TextInput value={otp} onChangeText={setOtp}
            style={{ borderWidth: 1, padding: 10 }} />
          <TouchableOpacity onPress={verifyOtp}><Text>Verify OTP</Text></TouchableOpacity>
        </>
      )}

      {step === 3 && (
        <>
          <TextInput placeholder="Username" value={u} onChangeText={setU}
            style={{ borderWidth: 1, padding: 10 }} />
          <TextInput placeholder="Password" secureTextEntry value={p} onChangeText={setP}
            style={{ borderWidth: 1, padding: 10 }} />
          <TouchableOpacity onPress={register}><Text>Create Account</Text></TouchableOpacity>
        </>
      )}
    </View>
  );
}
