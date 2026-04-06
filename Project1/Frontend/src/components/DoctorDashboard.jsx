import { useEffect, useState } from "react";

function DoctorDashboard({ onBack }) {
  const [appointments, setAppointments] = useState([]);
  const [patients, setPatients] = useState([]);
  const [doctor, setDoctor] = useState(null);

  useEffect(() => {
    fetchDoctor();
    fetchPatients();
  }, []);

  const fetchDoctor = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await fetch("http://localhost:8080/api/users/me", {
        headers: {
          Authorization: "Bearer " + token,
        },
      });

      const data = await res.json();
      setDoctor(data);

      if (data?.id) {
        fetchAppointments(data.id);
      }
    } catch (err) {
      console.error("Doctor fetch error:", err);
    }
  };

  const fetchAppointments = async (doctorId) => {
    try {
      const token = localStorage.getItem("token");

      const res = await fetch(
        `http://localhost:8080/api/appointments/doctor/${doctorId}`,
        {
          headers: {
            Authorization: "Bearer " + token,
          },
        }
      );

      const data = await res.json();
      setAppointments(data);
    } catch (err) {
      console.error("Appointments error:", err);
    }
  };

  const fetchPatients = async () => {
    try {
      const res = await fetch("http://localhost:8080/api/users");
      const data = await res.json();
      setPatients(data.filter((u) => u.role === "PATIENT"));
    } catch (err) {
      console.error("Patients error:", err);
    }
  };

  const getPatientName = (id) => {
    const p = patients.find((u) => u.id === id);
    return p ? p.name : "Loading...";
  };

  const approveAppointment = async (id) => {
    const token = localStorage.getItem("token");

    const res = await fetch(
      `http://localhost:8080/api/appointments/${id}/status?status=APPROVED`,
      {
        method: "PUT",
        headers: {
          Authorization: "Bearer " + token,
        },
      }
    );

    if (res.ok) {
      fetchAppointments(doctor.id);
    } else {
      alert("Approve failed ❌");
    }
  };

  const rejectAppointment = async (id) => {
    const token = localStorage.getItem("token");

    const res = await fetch(
      `http://localhost:8080/api/appointments/${id}/status?status=REJECTED`,
      {
        method: "PUT",
        headers: {
          Authorization: "Bearer " + token,
        },
      }
    );

    if (res.ok) {
      fetchAppointments(doctor.id);
    } else {
      alert("Reject failed ❌");
    }
  };

  return (
    <div className="p-6 animate-fadeIn">
      <h2 className="text-2xl font-bold mb-6 text-gray-700 animate-slideDown">
        👨‍⚕️ Doctor Dashboard
      </h2>

      {appointments.length === 0 ? (
        <p className="text-gray-500 text-center mt-10 animate-pulse">
          No appointments yet 🚫
        </p>
      ) : (
        <div className="overflow-x-auto animate-fadeIn">
          <table className="w-full bg-white shadow-xl rounded-xl overflow-hidden transform transition duration-300 hover:shadow-2xl">
            
            <thead className="bg-indigo-600 text-white">
              <tr>
                <th className="p-3">Patient</th>
                <th className="p-3">Date</th>
                <th className="p-3">Time</th>
                <th className="p-3">Disease</th>
                <th className="p-3">Status</th>
                <th className="p-3">Action</th>
              </tr>
            </thead>

            <tbody>
              {appointments.map((a, index) => (
                <tr
                  key={a.id}
                  className="text-center border-b hover:bg-gray-50 transition duration-300 transform hover:scale-[1.01] animate-fadeUp"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <td className="p-3">{getPatientName(a.patientId)}</td>
                  <td>{a.date}</td>
                  <td>{a.time}</td>
                  <td>{a.disease}</td>

                  <td
                    className={`font-semibold transition ${
                      a.status === "APPROVED"
                        ? "text-green-600"
                        : a.status === "REJECTED"
                        ? "text-red-500"
                        : "text-orange-500 animate-pulse"
                    }`}
                  >
                    {a.status}
                  </td>

                  <td className="p-3 space-x-2">
                    {a.status === "PENDING" ? (
                      <>
                        <button
                          onClick={() => approveAppointment(a.id)}
                          className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded transition transform hover:scale-110 active:scale-95"
                        >
                          Approve
                        </button>

                        <button
                          onClick={() => rejectAppointment(a.id)}
                          className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded transition transform hover:scale-110 active:scale-95"
                        >
                          Reject
                        </button>
                      </>
                    ) : (
                      <span className="text-gray-500">✔ Done</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>

          </table>
        </div>
      )}

      <div className="mt-6 animate-fadeIn">
        <button
          onClick={onBack}
          className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded transition transform hover:scale-105 active:scale-95"
        >
          ⬅ Back
        </button>
      </div>

      {/* 🔥 CUSTOM ANIMATIONS */}
      <style>
        {`
        .animate-fadeIn {
          animation: fadeIn 0.6s ease-in-out;
        }

        .animate-slideDown {
          animation: slideDown 0.5s ease;
        }

        .animate-fadeUp {
          animation: fadeUp 0.5s ease forwards;
          opacity: 0;
        }

        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        @keyframes slideDown {
          from { transform: translateY(-20px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }

        @keyframes fadeUp {
          from { transform: translateY(10px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
        `}
      </style>
    </div>
  );
}

export default DoctorDashboard;