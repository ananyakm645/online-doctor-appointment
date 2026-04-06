import { useState, useEffect } from "react";

function Register({ onLogin }) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: ""
  });

  // ✅ Clear autofill on load
  useEffect(() => {
    setFormData({
      name: "",
      email: "",
      password: ""
    });
  }, []);

  // ✅ Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData({
      ...formData,
      [name]: value
    });
  };

  // ✅ Register function
  const handleRegister = async () => {
    if (!formData.name || !formData.email || !formData.password) {
      alert("Fill all fields ❌");
      return;
    }

    try {
      const response = await fetch("http://localhost:8080/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          ...formData,
          role: "PATIENT"
        })
      });

      if (!response.ok) {
        alert("Registration failed ❌");
        return;
      }

      const data = await response.json();
      console.log("Registered:", data);

      alert("Registered Successfully ✅");

      setFormData({
        name: "",
        email: "",
        password: ""
      });

      onLogin();

    } catch (error) {
      console.error("Error:", error);
      alert("Server error ❌");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-green-400 via-teal-400 to-cyan-400">

      <div className="bg-white/90 backdrop-blur-md shadow-2xl rounded-2xl p-10 w-96">

        <h2 className="text-3xl font-extrabold text-center text-teal-600 mb-8">
          Create Account 🌿
        </h2>

        <form autoComplete="off" className="flex flex-col gap-5">

          {/* 🚫 Autofill blockers */}
          <input type="text" name="fakeuser" className="hidden" />
          <input type="password" name="fakepass" className="hidden" />

          {/* 👤 Name */}
          <input
            name="name"
            placeholder="Enter your name"
            value={formData.name}
            onChange={handleChange}
            autoComplete="off"
            className="px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-400 transition"
          />

          {/* 📧 Email */}
          <input
            name="email"
            placeholder="Enter your email"
            value={formData.email}
            onChange={handleChange}
            autoComplete="off"
            className="px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-400 transition"
          />

          {/* 🔐 Password */}
          <input
            name="password"
            type="password"
            placeholder="Enter your password"
            value={formData.password}
            onChange={handleChange}
            autoComplete="new-password"
            className="px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-400 transition"
          />

          {/* Register Button */}
          <button
            type="button"
            onClick={handleRegister}
            className="bg-teal-500 text-white py-3 rounded-xl font-semibold hover:bg-teal-600 transition duration-300 shadow-md"
          >
            Register
          </button>

          {/* Back Button */}
          <button
            type="button"
            onClick={onLogin}
            className="border border-teal-500 text-teal-600 py-3 rounded-xl font-semibold hover:bg-teal-50 transition duration-300"
          >
            Back to Login
          </button>

        </form>
      </div>
    </div>
  );
}

export default Register;