import { useEffect, useState } from "react";

function PatientHistory({ onBack }) {
  const [appointments, setAppointments] = useState([]);
  const [doctors, setDoctors] = useState([]);

  useEffect(() => {
    fetchAppointments();
    fetchDoctors();
  }, []);

  const fetchAppointments = async () => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        alert("User not logged in ❌");
        return;
      }

      const res = await fetch(
        "http://localhost:8080/api/appointments/my",
        {
          headers: {
            Authorization: "Bearer " + token,
          },
        }
      );

      if (!res.ok) {
        alert("Failed to fetch appointments ❌");
        return;
      }

      const data = await res.json();

      setAppointments(data);
    } catch (err) {
      console.error("Error fetching appointments:", err);
    }
  };

  const fetchDoctors = async () => {
    try {
      const res = await fetch("http://localhost:8080/api/users");

      const data = await res.json();

      const doctorList = data.filter((u) => u.role === "DOCTOR");

      setDoctors(doctorList);
    } catch (err) {
      console.error("Error fetching doctors:", err);
    }
  };

  const getDoctorName = (doctorId) => {
    const doc = doctors.find((d) => d.id === doctorId);
    return doc ? doc.name : "Loading...";
  };

  const cancelAppointment = async (id) => {
    try {
      await fetch(
        `http://localhost:8080/api/appointments/${id}/status?status=CANCELLED`,
        { method: "PUT" }
      );

      alert("Appointment Cancelled ❌");

      fetchAppointments();
    } catch (err) {
      console.error("Cancel error:", err);
      alert("Error cancelling appointment ❌");
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-blue-400 via-cyan-400 to-teal-400 flex items-center justify-center p-6 animate-fadeIn">

      <div className="bg-white/90 backdrop-blur-lg shadow-2xl rounded-2xl p-8 w-full max-w-5xl animate-scaleIn">

        <h2 className="text-3xl font-bold text-center text-blue-600 mb-6 animate-slideDown">
          My Appointments 📋
        </h2>

        <div className="flex justify-center mb-6">
          <button
            onClick={() => {
              if (onBack) onBack();
              else console.log("onBack not passed ❌");
            }}
            className="px-6 py-2 border border-blue-500 text-blue-600 rounded-xl hover:bg-blue-50 transition duration-300 hover:scale-105 active:scale-95"
          >
            Back
          </button>
        </div>

        {appointments.length === 0 ? (
          <p className="text-center text-gray-500 animate-pulse">
            No appointments found
          </p>
        ) : (
          <div className="overflow-x-auto animate-fadeIn">

            <table className="w-full border-collapse">

              <thead>
                <tr className="bg-blue-500 text-white">
                  <th className="p-3">Doctor</th>
                  <th className="p-3">Date</th>
                  <th className="p-3">Time</th>
                  <th className="p-3">Disease</th>
                  <th className="p-3">Treatment</th>
                  <th className="p-3">Status</th>
                  <th className="p-3">Action</th>
                </tr>
              </thead>

              <tbody>
                {appointments.map((a, index) => (
                  <tr
                    key={a.id}
                    className={`text-center ${
                      index % 2 === 0 ? "bg-gray-50" : "bg-white"
                    } hover:bg-blue-50 transition duration-300 animate-rowFade`}
                    style={{ animationDelay: `${index * 0.08}s` }}
                  >
                    <td className="p-3 font-medium">
                      Dr. {getDoctorName(a.doctorId)}
                    </td>

                    <td className="p-3">{a.date}</td>
                    <td className="p-3">{a.time}</td>
                    <td className="p-3">{a.disease}</td>
                    <td className="p-3">{a.treatment}</td>

                    <td className="p-3">
                      <span
                        className={`px-3 py-1 rounded-full text-sm font-semibold transition-all duration-300 ${
                          a.status === "APPROVED"
                            ? "bg-green-100 text-green-600"
                            : a.status === "REJECTED"
                            ? "bg-red-100 text-red-600"
                            : a.status === "CANCELLED"
                            ? "bg-gray-200 text-gray-600"
                            : "bg-yellow-100 text-yellow-600"
                        }`}
                      >
                        {a.status}
                      </span>
                    </td>

                    <td className="p-3">
                      {a.status === "PENDING" && (
                        <button
                          onClick={() => cancelAppointment(a.id)}
                          className="bg-red-500 text-white px-4 py-1 rounded-lg hover:bg-red-600 transition duration-300 hover:scale-105 active:scale-95"
                        >
                          Cancel
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>

            </table>
          </div>
        )}
      </div>

      {/* 🔥 ANIMATION STYLES */}
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

          .animate-rowFade {
            animation: rowFade 0.4s ease forwards;
            opacity: 0;
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

          @keyframes rowFade {
            from { opacity: 0; transform: translateY(10px); }
            to { opacity: 1; transform: translateY(0); }
          }
        `}
      </style>

    </div>
  );
}

export default PatientHistory;