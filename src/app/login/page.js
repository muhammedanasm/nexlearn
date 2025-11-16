"use client";
import { useState } from "react";
import Button from "@/components/button/Button";
import useApi from "@/hooks/useApi";
import Swal from "sweetalert2";
import "./login.css";

export default function Login() {
  const [value, setValue] = useState("");
  const [country, setCountry] = useState("IN");
  const [showOtp, setShowOtp] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [otp, setOtp] = useState("");
  const [profileImage, setProfileImage] = useState(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [qualification, setQualification] = useState("");

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfileImage(URL.createObjectURL(file));
    }
  };

  const { response, loading, error, refetch } = useApi(
    "POST",
    "/auth/send-otp",
    null,
    null
  );
  const { loading: verifyLoading, refetch: verifyOtpRequest } = useApi(
    "POST",
    "/auth/verify-otp"
  );

  const { loading: profileLoading, refetch: createProfile } = useApi(
    "POST",
    "/auth/create-profile"
  );

  const countries = {
    IN: { code: "+91", flag: "🇮🇳" },
    US: { code: "+1", flag: "🇺🇸" },
    UK: { code: "+44", flag: "🇬🇧" },
  };

  // send otp
  const handleSendOtp = async () => {
    if (!value.trim()) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Phone number cannot be empty",
        timer: 3000,
        showConfirmButton: false,
        timerProgressBar: false,
      });
      return;
    }
    if (value.trim().length !== 10) {
      Swal.fire({
        icon: "warning",
        title: "Invalid",
        text: "Enter valid 10-digit mobile number",
        timer: 3000,
        showConfirmButton: false,
        timerProgressBar: false,
      });
      return;
    }

    const fullMobile = `${countries[country].code}${value}`;
    // Example: +91 + 9645016304 → +919645016304

    const formData = new FormData();
    formData.append("mobile", fullMobile);

    const res = await refetch(formData);
    console.log("res", res);

    if (res?.success && res?.message === "OTP sent successfully") {
      setShowOtp(true);
    }
  };

  // verify otp

  const handleVerifyOtp = async () => {
    if (!otp.trim()) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "OTP cannot be empty",
        timer: 3000,
        showConfirmButton: false,
        timerProgressBar: true,
      });
      return;
    }

    if (otp.length !== 6) {
      Swal.fire({
        icon: "warning",
        title: "Invalid OTP",
        text: "Enter valid 6-digit OTP",
        timer: 3000,
        showConfirmButton: false,
        timerProgressBar: true,
      });
      return;
    }

    const fullMobile = `${countries[country].code}${value}`;
    const formData = new FormData();
    formData.append("mobile", fullMobile);
    formData.append("otp", otp);

    const res = await verifyOtpRequest(formData);
    console.log("verify-res", res);

    // SUCCESS HANDLING

    if (res?.success) {
      // store tokens in localStorage
      if (res.access_token) {
        localStorage.setItem("access_token", res.access_token);
      }
      if (res.refresh_token) {
        localStorage.setItem("refresh_token", res.refresh_token);
      }

      Swal.fire({
        icon: "success",
        title: "OTP Verified",
        text: res.message,
        timer: 2000,
        showConfirmButton: false,
      });

      // new user show details section
      if (
        res.message ===
        "OTP verified successfully. User not found, continue with registration."
      ) {
        setShowDetails(true);
        return;
      }

      // existing user  redirect to instructions page
      if (res.message === "OTP verified. User logged in.") {
        window.location.href = "/instructions";
        return;
      }
    }

    // invalid otp

    if (res?.success === false && res?.message === "Invalid OTP.") {
      Swal.fire({
        icon: "error",
        title: "Invalid OTP",
        text: "Please enter the correct OTP.",
        timer: 3000,
        showConfirmButton: false,
        timerProgressBar: false,
      });
    }
  };

  // profile creation
  const handleCreateProfile = async () => {
    if (
      !name.trim() ||
      !email.trim() ||
      !qualification.trim() ||
      !profileImage
    ) {
      Swal.fire({
        icon: "error",
        title: "All Fields Required",
        text: "Please fill all details and upload your profile image.",
        timer: 3000,
        showConfirmButton: false,
      });
      return;
    }

    const fullMobile = `${countries[country].code}${value}`;

    const formData = new FormData();
    formData.append("mobile", fullMobile);
    formData.append("name", name);
    formData.append("email", email);
    formData.append("qualification", qualification);
    formData.append(
      "profile_image",
      document.querySelector("#profileImage").files[0]
    );

    const res = await createProfile(formData);

    if (res?.success) {
      Swal.fire({
        icon: "success",
        title: "Profile Created!",
        text: "Redirecting to instruction page...",
        timer: 2000,
        showConfirmButton: false,
      });

      setTimeout(() => {
        window.location.href = "/instructions";
      }, 2000);
    }
  };

  const handleMobileChange = (e) => {
    const v = e.target.value;

    // Allow only numbers
    if (/^\d*$/.test(v)) {
      setValue(v);
    }
  };

  return (
    <div className="login__page">
      <div className="login__form flex items-center justify-center h-full">
        <div className="form__card">
          <div className="form_banner">
            <div className="logo">
              <img src="/images/logo.png" alt="logo" />
            </div>
            <div className="logo_banner">
              <img src="/images/login.png" alt="" />
            </div>
          </div>
          <div className="form_card flex justify-between">
            <div className="form__card_deatil">
              {!showOtp && !showDetails && (
                <>
                  <h3>Enter your phone number</h3>
                  <p className="desc_phone">
                    We use your mobile number to identify your account
                  </p>
                  <div className="phone__number">
                    <div className={`phone-input-box ${value ? "filled" : ""}`}>
                      <label className="phone-label">Phone number</label>

                      <div className="phone-container">
                        <select
                          value={country}
                          onChange={(e) => setCountry(e.target.value)}
                          className="country-select"
                        >
                          {Object.keys(countries).map((key) => (
                            <option key={key} value={key}>
                              {countries[key].flag}
                            </option>
                          ))}
                        </select>

                        <span className="country-code">
                          {countries[country].code}
                        </span>

                        <input
                          type="tel"
                          value={value}
                          onChange={handleMobileChange}
                          className="phone-input"
                          maxLength={10}
                        />
                      </div>
                    </div>
                  </div>
                  <p className="phone_terms">
                    By tapping Get started, you agree to the Terms & Conditions
                  </p>
                </>
              )}

              {/* If OTP SCREEN */}
              {showOtp && !showDetails && (
                <>
                  <h3>Enter the code we texted you</h3>
                  <p className="desc_phone">We’ve sent an SMS to {value}</p>

                  <div className="phone__number">
                    <div className={`phone-input-box ${otp ? "filled" : ""}`}>
                      <label className="phone-label phone-label-sms">
                        SMS Code
                      </label>

                      <div className="phone-container">
                        <input
                          type="text"
                          value={otp}
                          onChange={(e) => {
                            if (e.target.value.length <= 6)
                              setOtp(e.target.value);
                          }}
                          className="phone-input"
                          maxLength={6}
                        />
                      </div>
                    </div>
                  </div>

                  <p className="phone_terms">
                    Your 6 digit code is on its way. This can sometimes take a{" "}
                    <br /> few moments to arrive.
                  </p>

                  <p className="resend-otp">Resend OTP</p>
                </>
              )}

              {showDetails && (
                <>
                  <h3>Add Your Details</h3>
                  {/* image upload  */}

                  <div className="upload_box">
                    <label htmlFor="profileImage" className="upload_area">
                      {profileImage ? (
                        <img
                          src={profileImage}
                          alt="Profile"
                          className="uploaded_image"
                        />
                      ) : (
                        <>
                          <div className="upload_icon">
                            {" "}
                            <img src="./images/pic.png" alt="" />
                          </div>
                          <p>Add Your Profile picture</p>
                        </>
                      )}
                    </label>

                    <input
                      type="file"
                      id="profileImage"
                      className="upload_input"
                      accept="image/*"
                      onChange={handleImageChange}
                    />
                  </div>

                  {/* name input */}
                  <div className="phone__number">
                    <div className="phone-input-box filled">
                      <label className="phone-label">Full Name</label>
                      <div className="phone-container">
                        <input
                          type="text"
                          className="phone-input"
                          placeholder=""
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                        />
                      </div>
                    </div>
                  </div>

                  {/* email input */}
                  <div className="phone__number">
                    <div className="phone-input-box filled">
                      <label className="phone-label">Email</label>
                      <div className="phone-container">
                        <input
                          type="email"
                          className="phone-input"
                          placeholder=""
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                        />
                      </div>
                    </div>
                  </div>
                  {/* qualification input */}
                  <div className="phone__number">
                    <div className="phone-input-box filled">
                      <label className="phone-label">Qualification</label>
                      <div className="phone-container">
                        <input
                          type="text"
                          className="phone-input"
                          placeholder=""
                          value={qualification}
                          onChange={(e) => setQualification(e.target.value)}
                        />
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>

            <div className="form_submit">
              {!showOtp && !showDetails ? (
                <Button
                  text={loading ? "Sending..." : "Get Started"}
                  className="my-custome-btn"
                  onClick={handleSendOtp}
                />
              ) : showOtp && !showDetails ? (
                <Button
                  text={verifyLoading ? "Verifying..." : "Get Started"}
                  className="my-custome-btn"
                  onClick={handleVerifyOtp}
                />
              ) : (
                <Button
                  text={profileLoading ? "Submitting..." : "Submit Details"}
                  className="my-custome-btn"
                  onClick={handleCreateProfile}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
