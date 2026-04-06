import { useState } from "react";

function Login({ onLogin, onRegister }) {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "custom_email") {
      setFormData((prev) => ({ ...prev, email: value }));
    }

    if (name === "custom_password") {
      setFormData((prev) => ({ ...prev, password: value }));
    }
  };

  const handleLogin = async () => {
    console.log("LOGIN CLICKED ✅");

    if (!formData.email || !formData.password) {
      alert("Enter email & password ❌");
      return;
    }

    try {
      const response = await fetch("http://localhost:8080/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
        }),
      });

      const token = await response.text();

      if (!response.ok) {
        alert(token || "Login failed ❌");
        return;
      }

      // ✅ Store token
      localStorage.setItem("token", token.trim());

      alert("Login Successful ✅");

      // 🔥 NAVIGATE
      onLogin();

    } catch (error) {
      console.error(error);
      alert("Server error ❌");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-indigo-500 via-purple-500 to-pink-500">

      <div className="bg-white/90 backdrop-blur-md shadow-2xl rounded-2xl p-10 w-96">

        <h2 className="text-3xl font-extrabold text-center text-indigo-600 mb-8">
          Welcome Back 👋
        </h2>

        {/* 🔥 FORM FIX */}
        <form
          autoComplete="off"
          onSubmit={(e) => {
            e.preventDefault();
            handleLogin();
          }}
          className="flex flex-col gap-5"
        >

          <input
            name="custom_email"
            type="text"
            placeholder="Enter your email"
            value={formData.email}
            onChange={handleChange}
            autoComplete="off"
            className="px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-400 transition"
          />

          <input
            name="custom_password"
            type="password"
            placeholder="Enter your password"
            value={formData.password}
            onChange={handleChange}
            autoComplete="new-password"
            className="px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-400 transition"
          />

          {/* 🔥 BUTTON FIX */}
          <button
            type="submit"
            className="bg-indigo-500 text-white py-3 rounded-xl font-semibold hover:bg-indigo-600 transition duration-300 shadow-md"
          >
            Login
          </button>

          <button
            type="button"
            onClick={onRegister}
            className="border border-indigo-500 text-indigo-600 py-3 rounded-xl font-semibold hover:bg-indigo-50 transition duration-300"
          >
            Create Account
          </button>

        </form>
      </div>
    </div>
  );
}

export default Login;