import { useState, useEffect } from "react";

function BookAppointment({ onLogout }) {
  const [formData, setFormData] = useState({
    doctorId: "",
    date: "",
    time: "",
    disease: "",
    treatment: ""
  });

  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const token = localStorage.getItem("token");

        const res = await fetch("http://localhost:8080/api/users", {
          headers: {
            Authorization: "Bearer " + token
          }
        });

        if (!res.ok) throw new Error("API failed");

        const data = await res.json();
        const doctorList = data.filter(user => user.role === "DOCTOR");

        if (doctorList.length === 0) throw new Error("No doctors");

        setDoctors(doctorList);

      } catch (err) {
        setDoctors([
          { id: 1, name: "Raj" },
          { id: 2, name: "Varun" },
          { id: 3, name: "Bhuvi" }
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchDoctors();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = async () => {
    const token = localStorage.getItem("token");

    try {
      const userRes = await fetch("http://localhost:8080/api/users/me", {
        headers: {
          Authorization: "Bearer " + token
        }
      });

      const user = await userRes.json();

      if (!user) {
        alert("User not found ❌");
        return;
      }

      if (!formData.doctorId) {
        alert("Select doctor ❌");
        return;
      }

      if (!formData.date || !formData.time) {
        alert("Select date & time ❌");
        return;
      }

      if (!formData.disease) {
        alert("Enter disease ❌");
        return;
      }

      const requestData = {
        doctorId: Number(formData.doctorId),
        patientId: Number(user.id),
        date: formData.date,
        time: formData.time,
        disease: formData.disease,
        treatment: formData.treatment || ""
      };

      const response = await fetch("http://localhost:8080/api/appointments", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token
        },
        body: JSON.stringify(requestData)
      });

      if (!response.ok) {
        alert("Booking failed ❌");
        return;
      }

      alert("Appointment Booked ✅");

      setFormData({
        doctorId: "",
        date: "",
        time: "",
        disease: "",
        treatment: ""
      });

    } catch (error) {
      alert("Server error ❌");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-blue-400 via-cyan-400 to-teal-400 animate-fadeIn">

      <div className="bg-white/90 backdrop-blur-lg shadow-2xl rounded-2xl p-10 w-96 animate-scaleIn">

        <h2 className="text-3xl font-bold text-center text-blue-600 mb-8 animate-slideDown">
          Book Appointment 🏥
        </h2>

        <div className="flex flex-col gap-5">

          <select
            name="doctorId"
            onChange={handleChange}
            value={formData.doctorId}
            className="p-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all duration-300 focus:scale-105"
          >
            <option value="" disabled>
              {loading ? "Loading doctors..." : "Select Doctor"}
            </option>

            {doctors.map((doc) => (
              <option key={doc.id} value={doc.id}>
                Dr. {doc.name}
              </option>
            ))}
          </select>

          <input
            type="date"
            name="date"
            onChange={handleChange}
            value={formData.date}
            className="p-3 border rounded-xl focus:ring-2 focus:ring-blue-400 transition-all duration-300 focus:scale-105"
          />

          <input
            type="time"
            name="time"
            onChange={handleChange}
            value={formData.time}
            className="p-3 border rounded-xl focus:ring-2 focus:ring-blue-400 transition-all duration-300 focus:scale-105"
          />

          <input
            name="disease"
            placeholder="Enter Disease"
            onChange={handleChange}
            value={formData.disease}
            className="p-3 border rounded-xl focus:ring-2 focus:ring-blue-400 transition-all duration-300 focus:scale-105"
          />

          <input
            name="treatment"
            placeholder="Treatment (optional)"
            onChange={handleChange}
            value={formData.treatment}
            className="p-3 border rounded-xl focus:ring-2 focus:ring-blue-400 transition-all duration-300 focus:scale-105"
          />

          <div className="flex gap-4 mt-4">

            <button
              onClick={handleSubmit}
              className="flex-1 bg-blue-500 text-white py-3 rounded-xl font-semibold hover:bg-blue-600 transition duration-300 hover:scale-105 active:scale-95"
            >
              Book
            </button>

            <button
              onClick={onLogout}
              className="flex-1 border border-blue-500 text-blue-600 py-3 rounded-xl font-semibold hover:bg-blue-50 transition duration-300 hover:scale-105 active:scale-95"
            >
              Back
            </button>

          </div>

        </div>
      </div>

      {/* 🔥 Animations */}
      <style>
        {`
          .animate-fadeIn {
            animation: fadeIn 0.5s ease-in-out;
          }

          .animate-scaleIn {
            animation: scaleIn 0.4s ease;
          }

          .animate-slideDown {
            animation: slideDown 0.5s ease;
          }

          @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
          }

          @keyframes scaleIn {
            from { transform: scale(0.9); opacity: 0; }
            to { transform: scale(1); opacity: 1; }
          }

          @keyframes slideDown {
            from { transform: translateY(-20px); opacity: 0; }
            to { transform: translateY(0); opacity: 1; }
          }
        `}
      </style>

    </div>
  );
}

export default BookAppointment;