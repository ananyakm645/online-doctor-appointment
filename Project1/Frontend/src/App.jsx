import { useState, useEffect } from "react";
import Login from "./components/Login";
import Register from "./components/Register";
import BookAppointment from "./components/BookAppointment";
import DoctorsList from "./components/DoctorsList";
import PatientHistory from "./components/PatientHistory";
import DoctorDashboard from "./components/DoctorDashboard";

function App() {
  const [page, setPage] = useState("login");
  const [user, setUser] = useState(null);

  const fetchUser = async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      setPage("login");
      return;
    }

    try {
      const res = await fetch("http://localhost:8080/api/users/me", {
        headers: {
          Authorization: "Bearer " + token,
        },
      });

      if (!res.ok) throw new Error();

      const data = await res.json();

      setUser(data);

      // 🔥 ROLE BASED REDIRECT
      if (data.role === "DOCTOR") {
        setPage("doctor");
      } else {
        setPage("dashboard");
      }

    } catch (err) {
      localStorage.removeItem("token");
      setPage("login");
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  return (
    <div>

      {/* LOGIN */}
      {page === "login" && (
        <Login
          onLogin={fetchUser}
          onRegister={() => setPage("register")}
        />
      )}

      {/* REGISTER */}
      {page === "register" && (
        <Register onLogin={() => setPage("login")} />
      )}

      {/* MAIN */}
      {page !== "login" && page !== "register" && user && (
        <div className="flex min-h-screen bg-gray-100">

          {/* SIDEBAR */}
          <div className="w-64 bg-indigo-600 text-white p-6 flex flex-col">
            <h2 className="text-2xl font-bold mb-8">🏥 MedApp</h2>

            {/* PATIENT MENU */}
            {user?.role === "PATIENT" && (
              <>
                <button onClick={() => setPage("dashboard")} className="mb-3 text-left hover:bg-indigo-500 p-2 rounded">
                  🏠 Dashboard
                </button>

                <button onClick={() => setPage("book")} className="mb-3 text-left hover:bg-indigo-500 p-2 rounded">
                  📅 Book Appointment
                </button>

                <button onClick={() => setPage("history")} className="mb-3 text-left hover:bg-indigo-500 p-2 rounded">
                  📋 My History
                </button>

                <button onClick={() => setPage("doctors")} className="mb-3 text-left hover:bg-indigo-500 p-2 rounded">
                  👨‍⚕️ Doctors
                </button>
              </>
            )}

            {/* DOCTOR MENU */}
            {user?.role === "DOCTOR" && (
              <>
                <button onClick={() => setPage("doctor")} className="mb-3 text-left hover:bg-indigo-500 p-2 rounded">
                  🩺 Dashboard
                </button>
              </>
            )}

            <div className="mt-auto">
              <button
                onClick={() => {
                  localStorage.removeItem("token");
                  setUser(null);
                  setPage("login");
                }}
                className="w-full bg-red-500 py-2 rounded hover:bg-red-600"
              >
                Logout
              </button>
            </div>
          </div>

          {/* MAIN */}
          <div className="flex-1">

            {/* NAVBAR */}
            <div className="bg-white shadow p-4 flex justify-between items-center">
              <h1 className="text-xl font-semibold capitalize">{page}</h1>
              <span className="text-gray-600">
                👋 {user?.name || "User"}
              </span>
            </div>

            {/* CONTENT */}
            <div className="p-6">

              {page === "dashboard" && (
                <div className="text-center text-gray-600">
                  Welcome to your dashboard 🚀
                </div>
              )}

              {page === "book" && (
                <BookAppointment onLogout={() => setPage("dashboard")} />
              )}

              {page === "doctors" && (
                <DoctorsList onBack={() => setPage("dashboard")} />
              )}

              {page === "history" && (
                <PatientHistory onBack={() => setPage("dashboard")} />
              )}

              {/* ✅ FIXED BACK BUTTON HERE */}
              {page === "doctor" && (
                <DoctorDashboard onBack={() => setPage("dashboard")} />
              )}

            </div>
          </div>
        </div>
      )}

    </div>
  );
}

export default App;